import { getPage } from "@/lib/content";

/* ------------------------------------------------------------------ */
/*  Liens ajoutés depuis WhatsWrong (« À lire aussi : … »)             */
/*                                                                     */
/*  Ils gardent le titre que la page cible avait le jour de leur       */
/*  rédaction. Un lien isolé (seul dans son paragraphe ou sa ligne,    */
/*  éventuellement après « À lire aussi : ») prend le titre actuel de  */
/*  la page : jamais d'ancien libellé (« entreprise de rénovation »,   */
/*  promesses retirées…). Un lien au fil d'une phrase reste tel quel.  */
/* ------------------------------------------------------------------ */

const SITE = /^https?:\/\/(www\.)?renovinterieurs\.fr/i;
const LEAD = /^\s*(?:(?:à lire aussi|lire aussi|voir aussi|pour aller plus loin)\s*:?)?\s*$/i;

/** Le titre actuel d'une page du site, sinon null (lien externe ou inconnu). */
function currentTitle(href: string): string | null {
  const local = href.replace(SITE, "");
  if (!local.startsWith("/")) return null;
  const path = local.split(/[?#]/)[0];
  const page = getPage(path.replace(/\/+$/, "") || "/");
  return page ? page.h1 : null;
}

const plain = (html: string) => html.replace(/<[^>]+>/g, "").replace(/&nbsp;|&#160;/g, " ").trim();
const escape = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Dans un bloc HTML (paragraphe, ligne de liste), le lien isolé reçoit le titre actuel de sa page. */
export function relabelLinks(html: string): string {
  return html.replace(/<(p|li)\b([^>]*)>([\s\S]*?)<\/\1>/gi, (block, tag: string, attrs: string, inner: string) => {
    const links = [...inner.matchAll(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi)];
    if (links.length !== 1) return block;
    const [anchor, href] = links[0];
    if (!LEAD.test(plain(inner.replace(anchor, "")))) return block;
    const title = currentTitle(href);
    if (!title) return block;
    return `<${tag}${attrs}>${inner.replace(anchor, anchor.replace(/>([\s\S]*?)<\/a>$/i, `>${escape(title)}</a>`))}</${tag}>`;
  });
}
