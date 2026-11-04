import { permanentRedirect } from "next/navigation";
import { cache } from "react";
import { plainText, prepareArticle, type TocEntry } from "@/lib/whatswrong";
import { wwContent } from "@/lib/whatswrong-content";
import type { WwChanges } from "@/lib/whatswrong-changes";

/* ------------------------------------------------------------------ */
/*  WhatsWrong : pages du site réécrites par Eli                       */
/*                                                                     */
/*  Une page publiée depuis WhatsWrong (« Publier sur mon site ») est   */
/*  enregistrée dans le dépôt par l'Action (whatswrong-content) : elle  */
/*  est en ligne au déploiement qui suit.                               */
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

/* Les blocs communs à toutes les pages (Commitments, Cta) : la page les
 * affiche déjà, leur texte repris dans la version WhatsWrong ferait
 * doublon. */
const SITE_SECTIONS = [/^nos engagements/i, /^parlons-en/i, /^un projet de r/i];

const WORDS_PER_MINUTE = 200;

function bare(p: string): string {
  return p.replace(/\/+$/, "") || "/";
}

/* Fusions enregistrées dans WhatsWrong par erreur : ces pages clés doivent
 * rester en ligne, chaque synchro les réimposerait sinon. */
const IGNORED_REDIRECTS = new Set([
  "/renovation-appartement-paris",
  "/prix-renovation",
  "/realisations-renovation",
]);

/* Les pages publiées depuis WhatsWrong, enregistrées dans le dépôt. */
type Published = {
  pages: WwPageVersion[];
  redirects: { from: string; to: string }[];
};

const publishedPages = cache(
  async (): Promise<Published> => ({
    pages: wwContent.pages as WwPageVersion[],
    redirects: wwContent.redirects.filter((r) => !IGNORED_REDIRECTS.has(bare(r.from))),
  }),
);

/** Adresses fusionnées dans une autre depuis WhatsWrong : elles redirigent, le plan du site les omet. */
export async function mergedPaths(): Promise<Set<string>> {
  const { redirects } = await publishedPages();
  return new Set(redirects.map((r) => bare(r.from)));
}

/* Les avis clients ne se réécrivent jamais : ni un avis, ni sa signature, ni
   leur section, même si une version publiée les change. */
const REVIEW_HEADING =
  /\bavis (?:clients?|google|v[ée]rifi[ée]s)\b|\b(?:nos|les|vos) avis\b|^avis\b|\bavis sur google\b|t[ée]moignages?|ils nous ont confi|ce que disent/i;
const REVIEW_TEXT = /^\s*[«“"]|·\s*(?:avis|[ée]valuation)\s+google/i;
const isReviewHeading = (text: string) => text.length <= 120 && REVIEW_HEADING.test(text);

function withoutReviewEdits<C extends { replace: { text: string }[]; remove: { text: string }[]; insert: { text: string; place: string }[] }>(changes: C): C {
  const touches = (change: { text: string }) => REVIEW_TEXT.test(change.text) || isReviewHeading(change.text);
  return {
    ...changes,
    replace: changes.replace.filter((change) => !touches(change)),
    remove: changes.remove.filter((change) => !touches(change)),
    insert: changes.insert.filter((insert) => !(insert.place === "end" && isReviewHeading(insert.text))),
  };
}

const withoutReviews = <V extends { changes?: unknown }>(version: V): V => {
  const changes = version.changes as Parameters<typeof withoutReviewEdits>[0] | null | undefined;
  return changes ? { ...version, changes: withoutReviewEdits(changes) } : version;
};

/** La version publiée d'une page du site, sinon null. Une page fusionnée
 *  dans une autre depuis WhatsWrong redirige (301) vers elle. */
export async function publishedPageVersion(
  p: string,
): Promise<WwPageVersion | null> {
  const { pages, redirects } = await publishedPages();
  const merged = redirects.find((r) => bare(r.from) === bare(p));
  if (merged) permanentRedirect(merged.to);
  const version = pages.find((page) => bare(page.path) === bare(p)) ?? null;
  return version && withoutReviews(version);
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
