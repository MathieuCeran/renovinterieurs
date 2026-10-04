import sanitizeHtml from "sanitize-html";

import { site } from "@/lib/site";

/* ------------------------------------------------------------------ */
/*  WhatsWrong : articles SEO rédigés par Léa                          */
/*                                                                     */
/*  WhatsWrong ne pousse rien. Le site lit les articles terminés       */
/*  (DRAFT), les publie sous /conseils/<slug>, puis renvoie l'URL      */
/*  publique (PATCH PUBLISHED). WhatsWrong reste la source du contenu : */
/*  les pages lisent les articles PUBLISHED, mis en cache une heure.    */
/* ------------------------------------------------------------------ */

const API = "https://www.whatswrong.io";

/** Tag de cache commun aux pages qui lisent les articles WhatsWrong. */
export const WW_TAG = "whatswrong";

export type WwArticle = {
  id: string;
  state: string;
  data: {
    title: string;
    description: string;
    body: string;
    slug: string;
    mainKeyword: string | null;
    cover: { url: string; alt: string } | null;
    faq: {
      title: string;
      items: { question: string; answer: string }[];
    } | null;
    createdAt?: string;
    lastModifiedAt?: string;
  } | null;
};

type WwList = { contents: WwArticle[]; pagination?: { total?: number } };

function apiKey(): string | undefined {
  return process.env.WW_API_KEY || process.env.WHATSWRONG_API_KEY;
}

async function whatswrong<T>(
  method: "GET" | "PATCH",
  path: string,
  body?: unknown,
  init?: RequestInit,
): Promise<T> {
  const key = apiKey();
  if (!key) throw new Error("WW_API_KEY manquante");

  const res = await fetch(API + path, {
    ...init,
    method,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (res.status === 429) {
    // Limite atteinte : on s'arrête, le prochain passage reprendra.
    throw new Error(
      `WhatsWrong : limite atteinte, réessayer dans ${res.headers.get("Retry-After")} s`,
    );
  }
  if (!res.ok) {
    const { message } = await res.json().catch(() => ({ message: "" }));
    throw new Error(`WhatsWrong ${res.status} : ${message}`);
  }
  return res.json() as Promise<T>;
}

/** Slug réduit à un seul segment d'URL propre. */
export function wwSlug(raw: string): string {
  const last = raw.split("/").filter(Boolean).pop() ?? "";
  return last
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function wwPath(a: WwArticle): string {
  return `/conseils/${wwSlug(a.data?.slug ?? "")}`;
}

/* ------------------------------------------------------------------ */
/*  Lecture : articles en ligne, mis en cache une heure                */
/* ------------------------------------------------------------------ */

/** Tous les articles publiés. Liste vide si l'API est indisponible. */
export async function publishedArticles(): Promise<WwArticle[]> {
  if (!apiKey()) return [];
  const out: WwArticle[] = [];
  try {
    for (let offset = 0; offset < 500; offset += 20) {
      const { contents } = await whatswrong<WwList>(
        "GET",
        `/api/v1/lea/blog-articles?states=PUBLISHED&limit=20&offset=${offset}`,
        undefined,
        { next: { revalidate: 3600, tags: [WW_TAG] } },
      );
      out.push(...contents.filter((a) => a.data && wwSlug(a.data.slug)));
      if (contents.length < 20) break;
    }
  } catch (err) {
    console.error("[whatswrong]", err);
  }
  return out;
}

export async function publishedArticle(
  slug: string,
): Promise<WwArticle | null> {
  const all = await publishedArticles();
  return all.find((a) => wwPath(a) === `/conseils/${slug}`) ?? null;
}

/* ------------------------------------------------------------------ */
/*  Synchronisation : appelée chaque heure par le cron Vercel          */
/* ------------------------------------------------------------------ */

export type SyncReport = {
  published: { id: string; url: string }[];
  skipped: { id: string; reason: string }[];
};

/**
 * Publie chaque article terminé (DRAFT) et renvoie son URL à WhatsWrong.
 * Idempotent : un article publié passe en PUBLISHED et ne revient plus
 * dans la liste des DRAFT. `taken` dit si une URL est déjà occupée par
 * une page du site.
 */
export async function syncWhatsWrong(
  taken: (path: string) => boolean,
): Promise<SyncReport> {
  const report: SyncReport = { published: [], skipped: [] };

  const { contents } = await whatswrong<WwList>(
    "GET",
    "/api/v1/lea/blog-articles?states=DRAFT&limit=20",
    undefined,
    { cache: "no-store" },
  );

  for (const article of contents) {
    if (!article.data || !wwSlug(article.data.slug)) {
      report.skipped.push({ id: article.id, reason: "slug manquant" });
      continue;
    }
    const path = wwPath(article);
    if (taken(path)) {
      report.skipped.push({
        id: article.id,
        reason: `${path} existe déjà sur le site`,
      });
      continue;
    }

    const url = `${site.url}${path}`;
    // Le suivi SEO démarre ici : WhatsWrong sait où vit l'article.
    await whatswrong("PATCH", `/api/v1/lea/blog-articles/${article.id}`, {
      state: "PUBLISHED",
      url,
    });
    report.published.push({ id: article.id, url });
  }

  return report;
}

/* ------------------------------------------------------------------ */
/*  Nettoyage du HTML avant affichage                                  */
/* ------------------------------------------------------------------ */

/** Corps d'article nettoyé : balises éditoriales seulement, aucun script. */
export function cleanBody(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "h2", "h3", "h4", "p", "br", "hr", "strong", "b", "em", "i", "u",
      "s", "blockquote", "ul", "ol", "li", "a", "img", "figure",
      "figcaption", "table", "thead", "tbody", "tfoot", "tr", "th", "td",
      "caption", "span", "sup", "sub",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "width", "height", "loading"],
      th: ["colspan", "rowspan", "scope"],
      td: ["colspan", "rowspan"],
    },
    allowedSchemes: ["https", "http", "mailto", "tel"],
    allowedSchemesByTag: { img: ["https"] },
    // Une image dont la source a été refusée disparaît.
    exclusiveFilter: (frame) => frame.tag === "img" && !frame.attribs.src,
    transformTags: {
      // Le H1 de la page est le titre : on décale les titres du corps.
      h1: "h2",
      h5: "h4",
      h6: "h4",
      a: (tagName, attribs) => {
        const external = /^https?:\/\//.test(attribs.href ?? "") &&
          !attribs.href.includes("renovinterieurs.fr");
        return {
          tagName,
          attribs: external
            ? { ...attribs, target: "_blank", rel: "noopener noreferrer" }
            : { href: attribs.href ?? "", ...(attribs.title ? { title: attribs.title } : {}) },
        };
      },
      img: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, loading: "lazy" },
      }),
    },
  });
}

/** Texte brut (FAQ, données structurées). */
export function plainText(html: string): string {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}
