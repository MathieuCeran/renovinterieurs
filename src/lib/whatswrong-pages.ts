import { permanentRedirect } from "next/navigation";
import { cache } from "react";
import { plainText, prepareArticle, type TocEntry } from "@/lib/whatswrong";
import type { WwChanges } from "@/lib/whatswrong-changes";

/* ------------------------------------------------------------------ */
/*  WhatsWrong : pages du site réécrites par Eli                       */
/*                                                                     */
/*  Quand une page est publiée depuis WhatsWrong (« Publier sur mon    */
/*  site »), le site la lit en direct sur l'API au rendu : elle est    */
/*  en ligne au plus une minute après, sans synchro ni redéploiement.  */
/*  Si l'API ne répond pas, la page garde son propre texte.            */
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

// Une page publiée s'affiche au plus une minute après : une lecture
// partagée par toutes les pages (cache de données de Next).
const REVALIDATE_SECONDS = 60;
// Au-delà, le site n'attend pas : il affiche son propre texte.
const TIMEOUT_MS = 2000;

/* Les blocs communs à toutes les pages (Commitments, Cta) : la page les
 * affiche déjà, leur texte repris dans la version WhatsWrong ferait
 * doublon. */
const SITE_SECTIONS = [/^nos engagements/i, /^parlons-en/i, /^un projet de r/i];

const WORDS_PER_MINUTE = 200;

function bare(p: string): string {
  return p.replace(/\/+$/, "") || "/";
}

/* Les pages publiées depuis WhatsWrong, lues sur l'API ; rien si la clé
 * manque ou si l'API ne répond pas. */
type Published = {
  pages: WwPageVersion[];
  redirects: { from: string; to: string }[];
};

const NONE: Published = { pages: [], redirects: [] };

async function publishedPagesUncached(): Promise<Published> {
  const key = process.env.WW_API_KEY || process.env.WHATSWRONG_API_KEY;
  if (!key) return NONE;
  try {
    const res = await fetch(`${process.env.WW_API_BASE || "https://www.whatswrong.io"}/api/v1/eli/pages`, {
      headers: { Authorization: `Bearer ${key}` },
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) return NONE;
    const data = (await res.json()) as Partial<Published>;
    return {
      pages: Array.isArray(data.pages) ? data.pages : [],
      redirects: Array.isArray(data.redirects) ? data.redirects : [],
    };
  } catch {
    return NONE;
  }
}

/* Une lecture par rendu : les métadonnées et la page voient la même
 * réponse (sinon titre et contenu peuvent diverger si l'une expire). */
const publishedPages = cache(publishedPagesUncached);

/** La version publiée d'une page du site, sinon null. Une page fusionnée
 *  dans une autre depuis WhatsWrong redirige (301) vers elle. */
export async function publishedPageVersion(
  p: string,
): Promise<WwPageVersion | null> {
  const { pages, redirects } = await publishedPages();
  const merged = redirects.find((r) => bare(r.from) === bare(p));
  if (merged) permanentRedirect(merged.to);
  return pages.find((page) => bare(page.path) === bare(p)) ?? null;
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
