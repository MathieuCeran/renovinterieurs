import fs from "node:fs";
import path from "node:path";

import { plainText, prepareArticle, type TocEntry } from "@/lib/whatswrong";
import type { WwChanges } from "@/lib/whatswrong-changes";

/* ------------------------------------------------------------------ */
/*  WhatsWrong : pages du site réécrites par Eli                       */
/*                                                                     */
/*  Quand une page est publiée depuis WhatsWrong (« Publier sur mon    */
/*  site »), la synchronisation horaire la copie dans                  */
/*  src/content/whatswrong/pages.json (scripts/whatswrong-sync.mjs).   */
/*  La page garde son en-tête, ses visuels, ses formulaires et ses     */
/*  appels à l'action ; son titre, sa description et son texte         */
/*  viennent de WhatsWrong. Sans version publiée, rien ne change.      */
/* ------------------------------------------------------------------ */

export type WwPageVersion = {
  id: string;
  path: string;
  title: string;
  description: string;
  html: string;
  /** Texte par texte, posé dans les composants du site ; null : `html`. */
  changes?: WwChanges | null;
  publishedAt: string;
};

const PAGES_FILE = path.join(
  process.cwd(),
  "src",
  "content",
  "whatswrong",
  "pages.json",
);

/* Les blocs communs à toutes les pages (Commitments, Cta) : la page les
 * affiche déjà, leur texte repris dans la version WhatsWrong ferait
 * doublon. */
const SITE_SECTIONS = [/^nos engagements/i, /^parlons-en/i, /^un projet de r/i];

const WORDS_PER_MINUTE = 200;

function bare(p: string): string {
  return p.replace(/\/+$/, "") || "/";
}

/** La version publiée d'une page du site, sinon null. */
export function publishedPageVersion(p: string): WwPageVersion | null {
  try {
    const pages = JSON.parse(
      fs.readFileSync(PAGES_FILE, "utf8"),
    ) as WwPageVersion[];
    return pages.find((page) => bare(page.path) === bare(p)) ?? null;
  } catch {
    return null;
  }
}

/** Le texte prêt à afficher : sans les blocs communs, assaini, avec son
 *  sommaire et son temps de lecture. */
export function preparePageVersion(version: WwPageVersion): {
  html: string;
  toc: TocEntry[];
  readMin: number;
} {
  const [intro, ...sections] = version.html.split(/(?=<h2\b)/i);
  const kept = sections.filter((section) => {
    const heading = /<h2\b[^>]*>([\s\S]*?)<\/h2>/i.exec(section)?.[1] ?? "";
    const title = plainText(heading).trim();
    return !SITE_SECTIONS.some((pattern) => pattern.test(title));
  });
  const { html, toc } = prepareArticle([intro, ...kept].join(""));
  const words = plainText(html).split(/\s+/).filter(Boolean).length;
  return {
    html,
    toc,
    readMin: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
  };
}
