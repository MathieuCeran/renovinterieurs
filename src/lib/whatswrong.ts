import { cache } from "react";
import fs from "node:fs";
import path from "node:path";

import sanitizeHtml from "sanitize-html";

import { wwContent } from "@/lib/whatswrong-content";

/* ------------------------------------------------------------------ */
/*  WhatsWrong : articles SEO rédigés par Léa                          */
/*                                                                     */
/*  Le site lit ses articles dans whatswrong-content, écrit par        */
/*  l'Action : ils sont en ligne au déploiement qui suit, et WhatsWrong */
/*  confirme lui-même leur publication. Les copies relues               */
/*  (src/content/whatswrong/articles.json) gardent la priorité tant     */
/*  que l'article n'a pas changé depuis.                                */
/* ------------------------------------------------------------------ */

export type WwArticle = {
  id: string;
  slug: string;
  title: string;
  description: string;
  body: string;
  mainKeyword: string | null;
  /** Copie locale (/uploads/whatswrong/<slug>/cover.*). */
  cover: { url: string; alt: string } | null;
  faq: {
    title: string;
    items: { question: string; answer: string }[];
  } | null;
  createdAt: string;
  lastModifiedAt: string;
  /** Date de la relecture juridique de la copie du dépôt : ce qui a été publié avant ne la remplace pas. */
  reviewedAt?: string;
};

const ARTICLES_FILE = path.join(
  process.cwd(),
  "src",
  "content",
  "whatswrong",
  "articles.json",
);

export function wwPath(a: WwArticle): string {
  return `/conseils/${a.slug}`;
}

/** Les copies relues gardées dans le dépôt. */
function storedArticles(): WwArticle[] {
  try {
    return JSON.parse(fs.readFileSync(ARTICLES_FILE, "utf8")) as WwArticle[];
  } catch {
    return [];
  }
}

type LiveArticle = {
  id: string;
  slug: string;
  title: string;
  description: string;
  html: string;
  mainKeyword: string | null;
  faq: WwArticle["faq"];
  publishedAt: string;
  lastModifiedAt: string;
};

/* Les articles enregistrés dans le dépôt par l'Action. WhatsWrong vérifie
 * lui-même qu'un nouvel article est en ligne et lance son suivi. */
const liveArticles = cache(
  async (): Promise<LiveArticle[]> => wwContent.articles as LiveArticle[],
);

/** Tous les articles en ligne (avec la couverture de leur copie, s'il y en a une). */
export async function publishedArticles(): Promise<WwArticle[]> {
  const stored = storedArticles();
  const live = await liveArticles();
  const byId = new Map(stored.map((a) => [a.id, a]));
  return live.map((a) => {
    const copy = byId.get(a.id);
    // Copie relue (« nous pilotons, les entreprises partenaires réalisent ») : elle prime
    // tant que l'article n'a pas été modifié dans WhatsWrong depuis.
    const reviewed = copy?.reviewedAt !== undefined && a.lastModifiedAt <= copy.reviewedAt;
    return {
      id: a.id,
      slug: copy?.slug ?? a.slug,
      title: reviewed ? copy.title : a.title,
      description: reviewed ? copy.description : a.description,
      body: reviewed ? copy.body : a.html,
      mainKeyword: a.mainKeyword,
      cover: copy?.cover ?? null,
      faq: reviewed ? copy.faq : a.faq,
      createdAt: a.publishedAt,
      lastModifiedAt: a.lastModifiedAt,
      ...(reviewed ? { reviewedAt: copy.reviewedAt } : {}),
    };
  });
}

export async function publishedArticle(slug: string): Promise<WwArticle | null> {
  return (await publishedArticles()).find((a) => a.slug === slug) ?? null;
}

/* ------------------------------------------------------------------ */
/*  Nettoyage du HTML avant affichage                                  */
/* ------------------------------------------------------------------ */

/** Corps d'article nettoyé : balises éditoriales seulement, aucun script. */
function cleanBody(html: string): string {
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
      // Ancres du sommaire.
      h2: ["id"],
      h3: ["id"],
      h4: ["id"],
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

export type TocEntry = { id: string; title: string };

function anchor(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Corps prêt à afficher : nettoyé, sommaire extrait des H2 (le sommaire
 * livré dans le corps est retiré, la page affiche le sien), encadré
 * « L’essentiel » mis en valeur, tableaux défilables sur mobile.
 */
export function prepareArticle(raw: string): { html: string; toc: TocEntry[] } {
  const withoutToc = raw.replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, "");
  let html = cleanBody(withoutToc);

  const toc: TocEntry[] = [];
  const seen = new Set<string>();
  html = html.replace(/<h2(?:\s+id="([^"]*)")?>([\s\S]*?)<\/h2>/g, (_, id, inner) => {
    const title = plainText(inner);
    let slug = id || anchor(title) || `partie-${toc.length + 1}`;
    while (seen.has(slug)) slug += "-2";
    seen.add(slug);
    toc.push({ id: slug, title });
    return `<h2 id="${slug}">${inner}</h2>`;
  });

  html = html
    .replace(
      /<p><strong>L[’']essentiel<\/strong><\/p>\s*(<ul>[\s\S]*?<\/ul>)/i,
      '<aside class="ww-key"><p class="ww-key-title">L’essentiel</p>$1</aside>',
    )
    .replace(/<table>/g, '<div class="ww-table"><table>')
    .replace(/<\/table>/g, "</table></div>");

  return { html, toc };
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
