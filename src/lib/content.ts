import fs from "node:fs";
import path from "node:path";

import { photos } from "@/lib/photos";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type Block =
  | { t: "p"; v: string }
  | { t: "h3"; v: string }
  | { t: "ul"; items: string[] }
  | { t: "stats"; items: { value: string; label: string }[] }
  | { t: "cards"; items: { title: string; text: string; href?: string }[] }
  | { t: "table"; head: string[]; rows: string[][]; note?: string }
  | { t: "callout"; title?: string; v: string; href?: string; label?: string }
  | { t: "steps"; items: { title: string; text: string }[] }
  | { t: "faq"; items: { q: string; a: string }[] }
  | { t: "gallery"; items: { src: string; alt: string; caption: string }[] }
  | { t: "links"; items: { label: string; href: string; desc?: string }[] };

export type Section = {
  title: string;
  blocks: Block[];
  id?: string;
};

export type PageKind = "service" | "zone" | "article" | "hub" | "info";
export type Parent = "/" | "/nos-services" | "/zones" | "/conseils";

export type Page = {
  title: string;
  description: string;
  h1: string;
  kind: PageKind;
  parent: Parent;
  eyebrow?: string;
  hero?: string;
  intro: string[];
  sections: Section[];
  related?: { label: string; href: string; desc?: string }[];
};

/* ------------------------------------------------------------------ */
/*  Chargement : un fichier JSON par page dans src/content/pages       */
/* ------------------------------------------------------------------ */

const PAGES_DIR = path.join(process.cwd(), "src", "content", "pages");

/** `index.json` → `/`, `conseils__slug.json` → `/conseils/slug`. */
function slugFromFile(file: string): string {
  const base = file.replace(/\.json$/, "");
  if (base === "index") return "/";
  return `/${base.replace(/__/g, "/")}`;
}

function loadPages(): Record<string, Page> {
  const out: Record<string, Page> = {};
  for (const file of fs.readdirSync(PAGES_DIR)) {
    if (!file.endsWith(".json")) continue;
    const raw = fs.readFileSync(path.join(PAGES_DIR, file), "utf8");
    out[slugFromFile(file)] = JSON.parse(raw) as Page;
  }
  return out;
}

const pages: Record<string, Page> = loadPages();

/* ------------------------------------------------------------------ */
/*  Accès                                                              */
/* ------------------------------------------------------------------ */

/**
 * Pages dotées d'un gabarit dédié : elles ne passent pas par la route
 * attrape-tout mais par leur propre route.
 */
const CUSTOM_ROUTES = new Set([
  "/",
  "/contact-devis",
  "/faq",
  "/realisations-renovation",
  "/conseils",
  "/guide-renovation-2026",
]);

/** Toutes les URL rendues par le gabarit éditorial générique. */
export function allSlugs(): string[] {
  return Object.keys(pages).filter((s) => !CUSTOM_ROUTES.has(s));
}

/** Pages sans fichier de contenu (gabarit entièrement en code). */
const EXTRA_PATHS = ["/mentions-legales", "/politique-de-confidentialite"];

/** Toutes les URL du site, gabarits dédiés compris (sitemap). */
export function allPaths(): string[] {
  return [...Object.keys(pages), ...EXTRA_PATHS];
}

export function getPage(slug: string): Page | null {
  const p = pages[slug.startsWith("/") ? slug : `/${slug}`];
  if (!p || !p.h1) return null;
  return p;
}

export function pagesOfKind(kind: PageKind): [string, Page][] {
  return Object.entries(pages).filter(([, p]) => p.kind === kind);
}

/* ------------------------------------------------------------------ */
/*  Liens inline : [texte](/url) dans les paragraphes et les listes     */
/* ------------------------------------------------------------------ */

export type Inline = { text: string; href?: string };

const LINK_RE = /\[([^\]]+)\]\(([^)\s]+)\)/g;

/** Découpe une chaîne en segments texte / lien. */
export function parseInline(v: string): Inline[] {
  const out: Inline[] = [];
  let last = 0;
  for (const m of v.matchAll(LINK_RE)) {
    const i = m.index ?? 0;
    if (i > last) out.push({ text: v.slice(last, i) });
    out.push({ text: m[1], href: m[2] });
    last = i + m[0].length;
  }
  if (last < v.length) out.push({ text: v.slice(last) });
  return out;
}

/** Texte brut sans la syntaxe des liens (métadonnées, JSON-LD). */
export function stripInline(v: string): string {
  return v.replace(LINK_RE, "$1");
}

/* ------------------------------------------------------------------ */
/*  Visuels : photothèque locale, choisie selon le sujet               */
/* ------------------------------------------------------------------ */

/** Photos de chantiers réels : toutes les pages hors blog. */
const POOL = Object.fromEntries(
  Object.entries(photos).map(([k, p]) => [k, p.src]),
) as { [K in keyof typeof photos]: string };

/** Visuels d'illustration, réservés aux articles du blog. */
const BLOG = {
  salonBis: "/images/salon-canape-courbe.jpg",
  menuiserie: "/images/service-renovation.jpg",
  dressing: "/images/dressing-sur-mesure.webp",
  biblio: "/images/bibliotheque-sur-mesure.webp",
} as const;

type Visuals = { hero: string; band: string[] };

/** Choix déterministe des visuels d'une page à partir de son URL. */
export function visualsFor(slug: string): Visuals {
  const s = slug.toLowerCase();
  const pick = (hero: string, ...band: string[]) => ({ hero, band });

  if (s.startsWith("/conseils"))
    return pick(BLOG.salonBis, BLOG.menuiserie, BLOG.dressing, BLOG.biblio);
  if (s.includes("beton-cire"))
    return pick(POOL.sdbTravertin, POOL.wc, POOL.sdbNiches, POOL.comptoir);
  if (s.includes("cuisine"))
    return pick(POOL.cuisineNoireIlot, POOL.cuisineNoyer, POOL.cuisineSauge, POOL.cuisineBleue);
  if (s.includes("salle-de-bain") || s.includes("joints-epoxy"))
    return pick(POOL.sdbTravertin, POOL.sdbNiches, POOL.sdbDoubleVasque, POOL.wc);
  if (s.includes("isolation") || s.includes("energetique"))
    return pick(POOL.isolationExterieure, POOL.doublage, POOL.cloisons, POOL.fauxPlafond);
  if (s.includes("depannage"))
    return pick(POOL.sdbDoubleVasque, POOL.wc, POOL.placoHydro, POOL.sdbVerriere);
  if (s.includes("debarras"))
    return pick(POOL.cloisons, POOL.doublage, POOL.boiseriesPose, POOL.dressing);
  if (s.includes("gros-oeuvre") || s.includes("surelevation"))
    return pick(POOL.extensionCharpente, POOL.charpenteLucarnes, POOL.cloisons, POOL.ossatureBois);
  if (s.includes("realisations"))
    return pick(POOL.salonBibliotheques, POOL.cuisineNoireIlot, POOL.sdbTravertin, POOL.bibliothequeArche);
  if (s.includes("nos-services"))
    return pick(POOL.salonBibliotheques, POOL.cuisineNoireIlot, POOL.sdbTravertin, POOL.fauxPlafond);
  if (s.includes("prix"))
    return pick(POOL.cuisineNoireIlot, POOL.sdbDoubleVasque, POOL.dressing, POOL.teteDeLit);
  if (s.includes("methode"))
    return pick(POOL.fauxPlafondPose, POOL.cloisons, POOL.menuiserieChene, POOL.cacheRadiateur);
  if (s.includes("a-propos"))
    return pick(POOL.fauxPlafondPose, POOL.menuiserieChene, POOL.bibliothequeArche, POOL.cacheRadiateur);
  if (s.includes("contact") || s.includes("guide"))
    return pick(POOL.teteDeLit, POOL.niches, POOL.dressing, POOL.cuisineNoyer);
  if (s.includes("faq"))
    return pick(POOL.niches, POOL.salonBibliotheques, POOL.dressing, POOL.menuiserieChene);
  if (s === "/renovation-appartement-paris")
    return pick(POOL.salonBibliotheques, POOL.bibliothequeArche, POOL.dressing, POOL.cuisineNoireIlot);
  if (s.includes("hauts-de-seine") || s.includes("val-de-marne"))
    return pick(POOL.teteDeLit, POOL.facadeToiture, POOL.cuisineBoisFonce, POOL.sdbVerriere);
  if (s.includes("yvelines"))
    return pick(POOL.facadeImmeuble, POOL.bibliothequeTv, POOL.chambreEnfant, POOL.sdbCarreauxCiment);
  if (s === "/zones")
    return pick(POOL.facadeImmeuble, POOL.facadeToiture, POOL.facadeEchafaudage, POOL.salonBibliotheques);

  return pick(POOL.salonBibliotheques, POOL.cuisineNoireIlot, POOL.dressing, POOL.sdbTravertin);
}

/* ------------------------------------------------------------------ */
/*  Fil d'Ariane, dérivé du parent déclaré par la page                 */
/* ------------------------------------------------------------------ */

const PARENT_LABEL: Record<Parent, string> = {
  "/": "Accueil",
  "/nos-services": "Nos services",
  "/zones": "Zones d’intervention",
  "/conseils": "Conseils",
};

export function breadcrumbFor(
  slug: string,
): { label: string; href: string }[] {
  const page = getPage(slug);
  const crumbs = [{ label: "Accueil", href: "/" }];
  if (page && page.parent !== "/")
    crumbs.push({ label: PARENT_LABEL[page.parent], href: page.parent });
  return crumbs;
}

/**
 * Coupe un H1 « Sujet : précision » pour mettre la seconde moitié
 * en serif italique, la signature typographique du site.
 */
export function splitHeading(h1: string): [string, string | null] {
  const m = h1.match(/^(.*?)\s*[:—–]\s*(.+)$/);
  if (m && m[1].length > 6 && m[2].length > 4) return [m[1], m[2]];
  return [h1, null];
}

/**
 * Retire le(s) suffixe(s) de marque d'un <title>, puisque le layout
 * le rajoute via le template.
 */
export function cleanTitle(title: string): string {
  const BRAND = /\s*[|–—‒-]\s*RenovInt[eé]rieurs?\s*$/iu;
  let t = title.trim();
  while (BRAND.test(t)) t = t.replace(BRAND, "").trim();
  return t;
}

/** Tronque proprement sur un mot, avec une ellipse. */
export function clamp(text: string, max: number): string {
  const t = text.trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), 20))}…`;
}
