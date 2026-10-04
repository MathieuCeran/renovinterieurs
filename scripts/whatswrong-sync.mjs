#!/usr/bin/env node
/* ============================================================
   Synchronisation WhatsWrong (Léa) → blog RenovIntérieurs

   WhatsWrong ne pousse rien : c'est le site qui tire les articles et en
   garde une copie (texte + images) dans le dépôt. Si WhatsWrong tombe ou
   si l'abonnement s'arrête, les articles restent en ligne.

   Cycle complet, exécuté toutes les heures par GitHub Actions :
     1. GET /api/v1/lea/blog-articles?states=DRAFT     (articles terminés)
        GET /api/v1/lea/blog-articles?states=PUBLISHED (déjà en ligne : repris
        une seule fois, sans PATCH — migration depuis l'ancienne lecture API)
     2. pour chaque article inconnu : couverture et images du corps copiées
        dans public/uploads/whatswrong/<slug>/, écriture dans
        src/content/whatswrong/articles.json
     3. commit + push sur main → Vercel déploie
     4. attente de la mise en ligne réelle de la page
     5. PATCH { state: PUBLISHED, url } — jamais avant l'étape 4.
        C'est ce PATCH qui lance le suivi SEO chez WhatsWrong.
     6. article retiré à la main d'articles.json : PATCH { state: DRAFT }.

   Idempotence : src/content/whatswrong/_state.json garde l'id WhatsWrong
   de tout article importé. Un id connu n'est jamais réimporté ; un id
   importé mais non confirmé est repris à l'étape 4 au run suivant.

   Le HTML est assaini à l'affichage (sanitize-html, src/lib/whatswrong.ts).

   Limite API : 60 appels/min. Sur HTTP 429, le run s'arrête proprement
   et le suivant reprend là où celui-ci s'est arrêté.

   Aucune dépendance npm : Node 20+ uniquement.
   Usage : node scripts/whatswrong-sync.mjs [--dry-run] [--no-push]
   ============================================================ */

import { readFile, writeFile, mkdir, readdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { fileURLToPath } from "node:url";

const exec = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/* ---------- Configuration ---------- */

const API_BASE = process.env.WW_API_BASE || "https://www.whatswrong.io";
const API_KEY = process.env.WW_API_KEY || process.env.WHATSWRONG_API_KEY;
const SITE_ORIGIN = (process.env.SITE_ORIGIN || "https://www.renovinterieurs.fr").replace(/\/$/, "");

const BLOG_PREFIX = "/conseils";
const STORE_DIR = path.join(ROOT, "src/content/whatswrong");
const ARTICLES_FILE = path.join(STORE_DIR, "articles.json");
const STATE_FILE = path.join(STORE_DIR, "_state.json");
const PAGES_DIR = path.join(ROOT, "src/content/pages");
const UPLOAD_DIR = path.join(ROOT, "public/uploads/whatswrong");
const UPLOAD_PUBLIC = "/uploads/whatswrong";

const DEPLOY_TIMEOUT_MS = 15 * 60_000;
const DEPLOY_POLL_MS = 20_000;
const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
const HTTP_TIMEOUT_MS = 45_000;

const DRY_RUN = process.argv.includes("--dry-run");
const NO_PUSH = process.argv.includes("--no-push") || DRY_RUN;

/* ---------- Journalisation ---------- */

const errors = [];
const stamp = () => new Date().toISOString().slice(11, 19);
const log = (...a) => console.log(`[${stamp()}]`, ...a);
const warn = (msg) => console.log(`::warning::${msg}`);
const fail = (msg) => { errors.push(msg); console.log(`::error::${msg}`); };

/* ---------- HTTP ---------- */

class RateLimited extends Error {}

async function whatswrong(method, pathname, body) {
  const res = await fetch(API_BASE + pathname, {
    method,
    signal: AbortSignal.timeout(HTTP_TIMEOUT_MS),
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      Accept: "application/json",
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (res.status === 429) {
    throw new RateLimited(`limite d'appels atteinte, réessayer dans ${res.headers.get("Retry-After") ?? "?"} s`);
  }
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { /* réponse non JSON */ }
  if (!res.ok) {
    throw new Error(`WhatsWrong ${res.status} (${method} ${pathname}) : ${data?.message ?? text.slice(0, 300)}`);
  }
  return data;
}

/** Tous les articles d'un état, page par page. */
async function listArticles(state) {
  const out = [];
  for (let offset = 0; offset < 500; offset += 20) {
    const { contents = [] } = await whatswrong(
      "GET",
      `/api/v1/lea/blog-articles?states=${state}&limit=20&offset=${offset}`,
    );
    out.push(...contents);
    if (contents.length < 20) break;
  }
  return out;
}

/* ---------- Utilitaires ---------- */

/** Même règle que wwSlug() dans src/lib/whatswrong.ts : les URL déjà en ligne ne bougent pas. */
function wwSlug(raw) {
  const last = String(raw ?? "").split("/").filter(Boolean).pop() ?? "";
  return last
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function readJson(file, fallback) {
  try { return JSON.parse(await readFile(file, "utf8")); } catch { return fallback; }
}

async function writeJson(file, data) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(data, null, 2) + "\n", "utf8");
}

/** Slugs /conseils/<slug> déjà occupés par les articles éditoriaux (src/content/pages). */
async function editorialSlugs() {
  const files = await readdir(PAGES_DIR).catch(() => []);
  return new Set(
    files
      .filter((f) => f.startsWith("conseils__") && f.endsWith(".json"))
      .map((f) => f.slice("conseils__".length, -".json".length)),
  );
}

/* ---------- Téléchargement des images ---------- */

const EXT_BY_TYPE = {
  "image/jpeg": ".jpg", "image/jpg": ".jpg", "image/png": ".png", "image/webp": ".webp",
  "image/avif": ".avif", "image/gif": ".gif",
};

async function downloadImage(url, slug, basename) {
  const res = await fetch(url, { signal: AbortSignal.timeout(HTTP_TIMEOUT_MS), redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const type = (res.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  if (type && !type.startsWith("image/")) throw new Error(`type inattendu : ${type}`);
  if (type === "image/svg+xml") throw new Error("SVG refusé");
  const buf = Buffer.from(await res.arrayBuffer());
  if (!buf.length) throw new Error("fichier vide");
  if (buf.length > MAX_IMAGE_BYTES) throw new Error(`trop lourd (${Math.round(buf.length / 1024)} Ko)`);

  const urlExt = path.extname(new URL(url).pathname).toLowerCase();
  const ext = EXT_BY_TYPE[type] ?? (/^\.(jpe?g|png|webp|avif|gif)$/.test(urlExt) ? urlExt : ".jpg");
  const dir = path.join(UPLOAD_DIR, slug);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, basename + ext), buf);
  return `${UPLOAD_PUBLIC}/${slug}/${basename}${ext}`;
}

/** Remplace toutes les <img src> distantes par leur copie locale. */
async function internalizeBodyImages(html, slug) {
  const srcs = [...String(html).matchAll(/<img\b[^>]*?\bsrc\s*=\s*["']([^"']+)["']/gi)].map((m) => m[1]);
  const unique = [...new Set(srcs)].filter((s) => /^https?:\/\//i.test(s));
  let out = String(html);
  let i = 0;
  for (const src of unique) {
    i += 1;
    try {
      const local = await downloadImage(src, slug, `img-${String(i).padStart(2, "0")}`);
      out = out.split(src).join(local);
      log(`    image ${i}/${unique.length} → ${local}`);
    } catch (e) {
      warn(`[${slug}] image non téléchargée (${src}) : ${e.message} — URL d'origine conservée`);
    }
  }
  // Les liens vers whatswrong.io n'ont rien à faire sur le blog : on garde le texte.
  return out.replace(/<a\b[^>]*href\s*=\s*["'][^"']*whatswrong\.io[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi, "$1");
}

/** Liens internes : une redirection est remplacée par l'URL finale, un lien
    mort est retiré (le texte reste). Évite les sauts inutiles et les 404. */
async function fixInternalLinks(html) {
  const host = new URL(SITE_ORIGIN).host.replace(/^www\./, "");
  const internal = (href) => {
    if (href.startsWith("/") && !href.startsWith("//")) return href;
    try {
      const u = new URL(href);
      return u.host.replace(/^www\./, "") === host ? u.pathname + u.search + u.hash : null;
    } catch { return null; }
  };
  const hrefs = [...String(html).matchAll(/<a\b[^>]*?\bhref\s*=\s*"([^"]+)"/gi)].map((m) => m[1]);
  let out = String(html);
  for (const href of new Set(hrefs)) {
    const p = internal(href);
    if (!p) continue;
    const [pathname, hash = ""] = p.split("#");
    try {
      const res = await fetch(SITE_ORIGIN + pathname, { redirect: "follow", signal: AbortSignal.timeout(HTTP_TIMEOUT_MS) });
      const final = new URL(res.url);
      if (res.status === 404) {
        const re = new RegExp(`<a\\b[^>]*href\\s*=\\s*"${href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*>([\\s\\S]*?)<\\/a>`, "gi");
        out = out.replace(re, "$1");
        warn(`lien interne mort retiré : ${href}`);
      } else if (res.ok && final.pathname !== pathname) {
        const to = final.pathname + (hash ? `#${hash}` : "");
        out = out.split(`href="${href}"`).join(`href="${to}"`);
        log(`    lien ${href} → ${to}`);
      }
    } catch (e) {
      warn(`lien interne non vérifié (${href}) : ${e.message}`);
    }
  }
  return out;
}

/* ---------- Git ---------- */

async function git(...args) {
  const { stdout } = await exec("git", args, { cwd: ROOT, maxBuffer: 10 * 1024 * 1024 });
  return stdout.trim();
}

async function commitAndPush(message) {
  if (NO_PUSH) { log(`(push désactivé) commit prévu : ${message}`); return false; }
  await git("config", "user.name", "whatswrong-sync[bot]");
  await git("config", "user.email", "whatswrong-sync@users.noreply.github.com");
  await git("add", "src/content/whatswrong", "public/uploads/whatswrong");
  const staged = await git("diff", "--cached", "--name-only");
  if (!staged) { log("rien à commiter"); return false; }
  await git("commit", "-m", message);
  // main a pu avancer pendant le run (attente du déploiement) : on se replace dessus.
  await git("pull", "--rebase", "origin", "main");
  await git("push", "origin", "HEAD:main");
  log(`poussé : ${message}`);
  return true;
}

/* ---------- Vérification de mise en ligne ---------- */

async function waitOnline(url, title, deadline) {
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(20_000), redirect: "follow", headers: { "Cache-Control": "no-cache" } });
      if (res.ok) {
        // Un 200 ne suffit pas (domaine suspendu, page parking…) : on exige
        // la marque et le titre de l'article dans la page.
        const html = (await res.text())
          .replace(/&#x27;|&#39;/g, "'")
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, "&");
        if (/RenovInt/i.test(html) && html.includes(title.slice(0, 30))) return true;
      }
    } catch { /* déploiement en cours */ }
    await new Promise((r) => setTimeout(r, DEPLOY_POLL_MS));
  }
  return false;
}

/* ---------- Import d'un article ---------- */

async function importArticle({ id, data: d }, taken) {
  if (!d?.title || !d?.body) throw new Error("titre ou corps manquant");
  const base = wwSlug(d.slug || d.title);
  if (!base) throw new Error("slug impossible à construire");
  let slug = base;
  let n = 2;
  while (taken.has(slug)) slug = `${base}-${n++}`;

  log(`→ import « ${d.title} » (${id}) → ${BLOG_PREFIX}/${slug}`);
  let cover = null;
  if (d.cover?.url) {
    try {
      cover = { url: await downloadImage(d.cover.url, slug, "cover"), alt: String(d.cover.alt ?? d.title).trim() };
      log(`    couverture → ${cover.url}`);
    } catch (e) {
      warn(`[${slug}] couverture non téléchargée (${e.message}) — article publié sans couverture`);
    }
  }

  const now = new Date().toISOString();
  return {
    id,
    slug,
    title: String(d.title).trim(),
    description: String(d.description ?? "").trim(),
    mainKeyword: d.mainKeyword ? String(d.mainKeyword).trim() : null,
    cover,
    body: await fixInternalLinks(await internalizeBodyImages(d.body, slug)),
    faq: d.faq?.items?.length ? d.faq : null,
    createdAt: d.createdAt ?? now,
    lastModifiedAt: d.lastModifiedAt ?? now,
  };
}

/* ---------- Programme principal ---------- */

async function main() {
  if (!API_KEY) {
    console.log("::error::WW_API_KEY absente de l'environnement — arrêt.");
    process.exit(1);
  }
  log(`Synchronisation WhatsWrong — site ${SITE_ORIGIN}${DRY_RUN ? " (essai à blanc)" : ""}`);

  const state = await readJson(STATE_FILE, { version: 1, articles: {} });
  const articles = await readJson(ARTICLES_FILE, []);
  const editorial = await editorialSlugs();
  const taken = new Set([...editorial, ...articles.map((a) => a.slug)]);

  const drafts = await listArticles("DRAFT");
  // Articles déjà publiés du temps de la lecture directe de l'API : repris tels quels.
  const published = (await listArticles("PUBLISHED")).filter((a) => !state.articles[a.id]);
  log(`${drafts.length} article(s) DRAFT, ${published.length} article(s) PUBLISHED à reprendre`);

  if (DRY_RUN) {
    for (const c of [...drafts, ...published]) {
      log(`· ${c.id} — « ${c.data?.title ?? "sans titre"} » → ${BLOG_PREFIX}/${wwSlug(c.data?.slug || c.data?.title)}`);
    }
    return;
  }

  /* --- Phase 1 : import --- */
  const nouveaux = [];
  const queue = [
    ...published.map((a) => ({ article: a, alreadyLive: true })),
    ...drafts.map((a) => ({ article: a, alreadyLive: false })),
  ];
  for (const { article, alreadyLive } of queue) {
    const { id } = article;
    try {
      if (!id) throw new Error("identifiant absent de la réponse API");
      if (state.articles[id]) { log(`· ${id} déjà importé — ignoré`); continue; }
      const wanted = wwSlug(article.data?.slug || article.data?.title);
      if (alreadyLive && editorial.has(wanted)) {
        warn(`${id} : ${BLOG_PREFIX}/${wanted} est une page éditoriale du site — non repris`);
        continue;
      }
      const record = await importArticle(article, taken);
      articles.push(record);
      taken.add(record.slug);
      const now = new Date().toISOString();
      state.articles[id] = {
        slug: record.slug,
        url: `${SITE_ORIGIN}${BLOG_PREFIX}/${record.slug}`,
        importedAt: now,
        // Déjà PUBLISHED chez WhatsWrong : rien à confirmer, l'URL est inchangée.
        confirmedAt: alreadyLive ? now : null,
      };
      nouveaux.push(id);
    } catch (e) {
      if (e instanceof RateLimited) throw e;
      fail(`article ignoré (${id || "id inconnu"} — « ${article.data?.title ?? "sans titre"} ») : ${e.message}`);
    }
  }

  if (nouveaux.length) {
    articles.sort((x, y) => y.createdAt.localeCompare(x.createdAt));
    await writeJson(ARTICLES_FILE, articles);
    await writeJson(STATE_FILE, state);
    await cleanOrphanUploads(articles);
    await commitAndPush(`content: ${nouveaux.length} article(s) WhatsWrong publié(s)`);
  } else {
    log("aucun nouvel article à importer");
  }

  let stateChanged = false;
  const live = new Map(articles.map((a) => [a.slug, a]));

  /* --- Phase 2 : confirmation PUBLISHED (nouveaux + reliquats des runs précédents) --- */
  // Sans push, rien n'est mis en ligne : la confirmation attendra un vrai run.
  const aConfirmer = NO_PUSH ? [] : Object.entries(state.articles).filter(
    ([, v]) => !v.confirmedAt && !v.unpublishedAt && live.has(v.slug),
  );
  const deadline = Date.now() + DEPLOY_TIMEOUT_MS;
  for (const [id, entry] of aConfirmer) {
    try {
      log(`· vérification de la mise en ligne : ${entry.url}`);
      if (!(await waitOnline(entry.url, live.get(entry.slug).title, deadline))) {
        fail(`page non accessible dans le délai imparti (${entry.url}) — PATCH non envoyé, reprise au prochain run`);
        continue;
      }
      await whatswrong("PATCH", `/api/v1/lea/blog-articles/${encodeURIComponent(id)}`, { state: "PUBLISHED", url: entry.url });
      entry.confirmedAt = new Date().toISOString();
      stateChanged = true;
      log("  ✓ confirmé PUBLISHED auprès de WhatsWrong");
    } catch (e) {
      if (e instanceof RateLimited) throw e;
      fail(`PATCH en échec pour ${id} (${entry.url}) : ${e.message} — reprise au prochain run`);
    }
  }

  /* --- Phase 3 : article retiré du blog après publication → retour en DRAFT --- */
  for (const [id, entry] of Object.entries(state.articles)) {
    if (!entry.confirmedAt || entry.unpublishedAt || live.has(entry.slug)) continue;
    try {
      await whatswrong("PATCH", `/api/v1/lea/blog-articles/${encodeURIComponent(id)}`, { state: "DRAFT" });
      entry.unpublishedAt = new Date().toISOString();
      stateChanged = true;
      log(`  ↩ ${entry.slug} retiré du blog — repassé en DRAFT chez WhatsWrong`);
    } catch (e) {
      if (e instanceof RateLimited) throw e;
      fail(`retour en DRAFT en échec pour ${id} (${entry.slug}) : ${e.message}`);
    }
  }

  if (stateChanged) {
    await writeJson(STATE_FILE, state);
    // [skip ci] : ce commit ne change aucun contenu affiché, inutile de redéployer.
    await commitAndPush("chore: état WhatsWrong mis à jour [skip ci]");
  }
  finish();
}

/** Supprime les dossiers d'images d'articles qui ne sont plus référencés. */
async function cleanOrphanUploads(articles) {
  if (!existsSync(UPLOAD_DIR)) return;
  const valides = new Set(articles.map((a) => a.slug));
  for (const dir of await readdir(UPLOAD_DIR, { withFileTypes: true })) {
    if (dir.isDirectory() && !valides.has(dir.name)) {
      await rm(path.join(UPLOAD_DIR, dir.name), { recursive: true, force: true });
      warn(`dossier d'images orphelin supprimé : ${dir.name}`);
    }
  }
}

function finish() {
  if (errors.length) {
    log(`terminé avec ${errors.length} erreur(s) :`);
    errors.forEach((e) => log(`  – ${e}`));
    process.exitCode = 1;
  } else {
    log("terminé sans erreur");
  }
}

main().catch((e) => {
  if (e instanceof RateLimited) {
    // Pas une panne : le prochain run horaire reprendra où celui-ci s'arrête.
    warn(`arrêt anticipé — ${e.message}`);
    return;
  }
  console.log(`::error::échec global de la synchronisation : ${e.stack ?? e.message}`);
  process.exit(1);
});
