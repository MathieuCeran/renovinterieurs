import raw from "@/content/pages.json";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type Block =
  { t: "p"; v: string } | { t: "h3"; v: string } | { t: "ul"; items: string[] };

export type Section = {
  title: string;
  blocks: Block[];
  imgs?: string[];
};

export type Page = {
  title: string;
  description: string;
  h1: string;
  intro: string[];
  sections: Section[];
};

const pages = raw as unknown as Record<string, Page>;

/* ------------------------------------------------------------------ */
/*  Accès                                                              */
/* ------------------------------------------------------------------ */

/**
 * Pages dotées d’un gabarit dédié : elles ne passent pas par la route
 * attrape-tout (contenu éditorial générique) mais par leur propre route.
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

/** Pages créées de toutes pièces (absentes du site actuel). */
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

/* ------------------------------------------------------------------ */
/*  Visuels — on pioche dans la photothèque locale selon le sujet      */
/* ------------------------------------------------------------------ */

const POOL = {
  salon: "/images/sejour-haussmannien.jpg",
  salonBis: "/images/salon-canape-courbe.jpg",
  haussmannien: "/images/salon-haussmannien-moulures.jpg",
  cuisine: "/images/paris-cuisine-sur-mesure.jpg",
  sdb: "/images/paris-sdb.jpg",
  sdbSombre: "/images/sdb-douche-italienne.webp",
  sdbDetail: "/images/service-sdb.jpg",
  betonCire: "/images/loft-cuisine-cheminee.jpg",
  loft: "/images/loft-beton-cire.jpg",
  chantier: "/images/paris-chantier.jpg",
  parquet: "/images/paris-parquet.jpg",
  pose: "/images/paris-renovation-appartement.jpg",
  equipe: "/images/paris-pourquoi-specialiste.jpg",
  artisan: "/images/savoir-faire-1.jpg",
  detail: "/images/why-2.jpg",
  isolation: "/images/dpe-1.jpg",
  depannage: "/images/nos-services-depannage.jpg",
  menuiserie: "/images/service-renovation.jpg",
  biblio: "/images/bibliotheque-sur-mesure.webp",
  dressing: "/images/dressing-sur-mesure.webp",
  parisToits: "/images/paris-zones.jpg",
  balcon: "/images/balcon-haussmannien-paris.jpg",
  ville: "/images/ville-hero.jpg",
  accueil: "/images/nos-services-hero.jpg",
} as const;

type Visuals = { hero: string; band: string[] };

/** Choix déterministe des visuels d'une page à partir de son URL. */
export function visualsFor(slug: string): Visuals {
  const s = slug.toLowerCase();
  const pick = (hero: string, ...band: string[]) => ({ hero, band });

  if (s.includes("beton-cire"))
    return pick(POOL.loft, POOL.betonCire, POOL.parquet, POOL.detail);
  if (s.includes("cuisine"))
    return pick(POOL.cuisine, POOL.biblio, POOL.parquet, POOL.artisan);
  if (s.includes("joints-epoxy"))
    return pick(POOL.sdb, POOL.sdbSombre, POOL.sdbDetail, POOL.detail);
  if (s.includes("isolation") || s.includes("energetique"))
    return pick(POOL.isolation, POOL.haussmannien, POOL.chantier, POOL.artisan);
  if (s.includes("depannage"))
    return pick(POOL.depannage, POOL.chantier, POOL.artisan, POOL.detail);
  if (s.includes("debarras"))
    return pick(POOL.chantier, POOL.pose, POOL.artisan, POOL.detail);
  if (s.includes("gros-oeuvre") || s.includes("surelevation"))
    return pick(POOL.loft, POOL.chantier, POOL.haussmannien, POOL.pose);
  if (s.includes("realisations"))
    return pick(POOL.salon, POOL.cuisine, POOL.sdb, POOL.parquet);
  if (s.includes("nos-services"))
    return pick(POOL.accueil, POOL.cuisine, POOL.sdb, POOL.loft);
  if (s.includes("a-propos"))
    return pick(POOL.equipe, POOL.artisan, POOL.pose, POOL.detail);
  if (s.includes("contact") || s.includes("guide"))
    return pick(POOL.salonBis, POOL.haussmannien, POOL.parquet, POOL.cuisine);
  if (s.includes("faq"))
    return pick(POOL.haussmannien, POOL.salon, POOL.parquet, POOL.artisan);
  if (s.includes("conseils"))
    return pick(POOL.salonBis, POOL.menuiserie, POOL.dressing, POOL.biblio);
  if (s.includes("paris-75") || s === "/renovation-appartement-paris")
    return pick(POOL.haussmannien, POOL.parisToits, POOL.parquet, POOL.cuisine);
  if (s.includes("hauts-de-seine") || s.includes("val-de-marne"))
    return pick(POOL.salonBis, POOL.balcon, POOL.pose, POOL.cuisine);
  if (s.includes("yvelines"))
    return pick(POOL.salon, POOL.ville, POOL.parquet, POOL.artisan);
  if (s.startsWith("/renovation-appartement-"))
    return pick(POOL.salonBis, POOL.parquet, POOL.cuisine, POOL.pose);

  return pick(POOL.accueil, POOL.salon, POOL.parquet, POOL.cuisine);
}

/* ------------------------------------------------------------------ */
/*  Fil d'Ariane                                                       */
/* ------------------------------------------------------------------ */

export function breadcrumbLabel(slug: string): string {
  const s = slug.toLowerCase();
  if (s.startsWith("/conseils/")) return "Conseils";
  if (
    s.startsWith("/renovation-appartement-") &&
    s !== "/renovation-appartement-paris"
  )
    return "Zones d’intervention";
  if (
    s.includes("renovation-paris-75") ||
    s.includes("-92") ||
    s.includes("-78") ||
    s.includes("-94")
  )
    return "Zones d’intervention";
  if (s === "/renovation-appartement-paris") return "Zones d’intervention";
  return "Nos services";
}

export function breadcrumbHref(slug: string): string {
  const label = breadcrumbLabel(slug);
  if (label === "Conseils") return "/conseils";
  if (label === "Zones d’intervention") return "/nos-services";
  return "/nos-services";
}

/**
 * Coupe un H1 « Sujet : précision » pour mettre la seconde moitié
 * en serif italique — la signature typographique du site.
 */
export function splitHeading(h1: string): [string, string | null] {
  const m = h1.match(/^(.*?)\s*[:—–]\s*(.+)$/);
  if (m && m[1].length > 6 && m[2].length > 4) return [m[1], m[2]];
  return [h1, null];
}

/**
 * Retire le(s) suffixe(s) de marque du <title> du site actuel — certains
 * le contiennent deux fois — puisque le layout le rajoute via le template.
 */
export function cleanTitle(title: string): string {
  const BRAND = /\s*[|\u2013\u2014\u2012-]\s*RenovInt[e\u00e9]rieurs?\s*$/iu;
  let t = title.trim();
  while (BRAND.test(t)) t = t.replace(BRAND, "").trim();
  return t;
}
