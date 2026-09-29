#!/usr/bin/env node
/**
 * Contrôle du contenu éditorial avant build.
 *
 *  - tout lien interne pointe vers une URL existante
 *  - aucun terme banni (identité de marque)
 *  - title ≤ 60, description ≤ 155, titres de section ≤ 60
 *  - aucun paragraphe identique sur deux pages
 *  - chaque page service ou zone a une galerie, une FAQ et des liens
 *
 * Usage : node scripts/check-content.mjs [--warn]
 * Sans --warn, la moindre erreur fait échouer le script (code 1).
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PAGES_DIR = path.join(ROOT, "src", "content", "pages");
const WARN_ONLY = process.argv.includes("--warn");

const BANNED = [
  /coordination/i,
  /coordonn/i,
  /ma[iî]tr(e|ise) d[’'']?[oœ]uvre/i,
  /contractant g[ée]n[ée]ral/i,
  /\bAMO\b/,
];

const STATIC_ROUTES = [
  "/",
  "/contact-devis",
  "/faq",
  "/realisations-renovation",
  "/conseils",
  "/guide-renovation-2026",
  "/mentions-legales",
  "/politique-de-confidentialite",
  "/outils",
  "/outils/estimateur-budget-renovation",
  "/outils/planning-travaux-renovation",
  "/outils/simulateur-dpe-passoire-energetique",
];

const slugFromFile = (f) => {
  const base = f.replace(/\.json$/, "");
  return base === "index" ? "/" : `/${base.replace(/__/g, "/")}`;
};

const pages = {};
for (const f of fs.readdirSync(PAGES_DIR)) {
  if (!f.endsWith(".json")) continue;
  try {
    pages[slugFromFile(f)] = JSON.parse(
      fs.readFileSync(path.join(PAGES_DIR, f), "utf8"),
    );
  } catch (e) {
    console.error(`✖ ${f} : JSON invalide (${e.message})`);
    process.exit(1);
  }
}

const known = new Set([...Object.keys(pages), ...STATIC_ROUTES]);
const errors = [];
const err = (slug, msg) => errors.push(`${slug}  ${msg}`);

const LINK_RE = /\[([^\]]+)\]\(([^)\s]+)\)/g;

/** Tous les textes d'une page, avec leur origine. */
function* texts(page) {
  yield ["title", page.title ?? ""];
  yield ["description", page.description ?? ""];
  yield ["h1", page.h1 ?? ""];
  for (const p of page.intro ?? []) yield ["intro", p];
  for (const s of page.sections ?? []) {
    yield ["section.title", s.title];
    for (const b of s.blocks ?? []) {
      switch (b.t) {
        case "p":
        case "h3":
          yield [b.t, b.v];
          break;
        case "ul":
          for (const it of b.items) yield ["ul", it];
          break;
        case "stats":
          for (const it of b.items) yield ["stats", `${it.value} ${it.label}`];
          break;
        case "cards":
          for (const it of b.items) yield ["cards", `${it.title} ${it.text}`];
          break;
        case "table":
          yield ["table", [...b.head, ...b.rows.flat(), b.note ?? ""].join(" ")];
          break;
        case "callout":
          yield ["callout", `${b.title ?? ""} ${b.v} ${b.label ?? ""}`];
          break;
        case "steps":
          for (const it of b.items) yield ["steps", `${it.title} ${it.text}`];
          break;
        case "faq":
          for (const it of b.items) yield ["faq", `${it.q} ${it.a}`];
          break;
        case "gallery":
          for (const it of b.items) yield ["gallery", `${it.alt} ${it.caption}`];
          break;
        case "links":
          for (const it of b.items) yield ["links", `${it.label} ${it.desc ?? ""}`];
          break;
        default:
          err("?", `type de bloc inconnu : ${b.t}`);
      }
    }
  }
  for (const r of page.related ?? []) yield ["related", `${r.label} ${r.desc ?? ""}`];
}

/** Tous les liens d'une page (inline + hrefs structurés). */
function* links(page) {
  for (const [, v] of texts(page))
    for (const m of v.matchAll(LINK_RE)) yield m[2];
  for (const s of page.sections ?? [])
    for (const b of s.blocks ?? []) {
      if (b.t === "cards" || b.t === "links")
        for (const it of b.items) if (it.href) yield it.href;
      if (b.t === "callout" && b.href) yield b.href;
    }
  for (const r of page.related ?? []) yield r.href;
}

const seenParagraphs = new Map();

for (const [slug, page] of Object.entries(pages)) {
  const kind = page.kind;
  if (!["service", "zone", "article", "hub", "info"].includes(kind))
    err(slug, `kind invalide : ${kind}`);
  if (!["/", "/nos-services", "/zones", "/conseils"].includes(page.parent))
    err(slug, `parent invalide : ${page.parent}`);

  const title = (page.title ?? "").replace(/\s*[|—–-]\s*RenovInt[eé]rieurs?\s*$/i, "");
  if (title.length > 60) err(slug, `title trop long (${title.length} > 60)`);
  if ((page.description ?? "").length > 155)
    err(slug, `description trop longue (${page.description.length} > 155)`);
  if (!page.description) err(slug, "description manquante");

  for (const [where, v] of texts(page)) {
    for (const re of BANNED)
      if (re.test(v)) err(slug, `terme banni dans ${where} : « ${v.match(re)[0]} »`);
    if (where === "section.title" && v.length > 60)
      err(slug, `titre de section trop long (${v.length} > 60) : « ${v.slice(0, 40)}… »`);
    if (where === "p" && v.split(/\s+/).length > 90)
      err(slug, `paragraphe trop long (${v.split(/\s+/).length} mots) : « ${v.slice(0, 40)}… »`);
    if ((where === "p" || where === "intro") && v.length > 120) {
      const key = v.trim();
      if (seenParagraphs.has(key) && seenParagraphs.get(key) !== slug)
        err(slug, `paragraphe identique à ${seenParagraphs.get(key)} : « ${v.slice(0, 40)}… »`);
      seenParagraphs.set(key, slug);
    }
  }

  for (const href of links(page)) {
    if (/^(https?:|mailto:|tel:)/.test(href)) continue;
    const clean = href.replace(/#.*$/, "");
    if (clean && !known.has(clean)) err(slug, `lien cassé : ${href}`);
  }

  if (kind === "service" || kind === "zone") {
    const types = new Set(
      (page.sections ?? []).flatMap((s) => (s.blocks ?? []).map((b) => b.t)),
    );
    for (const need of ["gallery", "faq"])
      if (!types.has(need)) err(slug, `bloc « ${need} » manquant`);
    if (!types.has("links") && !(page.related?.length > 0))
      err(slug, "aucun lien de maillage (bloc links ou related)");
  }
}

if (errors.length) {
  console.error(`\n${errors.length} problème(s) de contenu :\n`);
  for (const e of errors) console.error("  ✖ " + e);
  console.error("");
  if (!WARN_ONLY) process.exit(1);
} else {
  console.log(`✔ contenu valide (${Object.keys(pages).length} pages)`);
}
