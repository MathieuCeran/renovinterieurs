import type { NextConfig } from "next";

/* ------------------------------------------------------------------ */
/*  Redirections 301 (308) issues de la refonte de septembre 2026      */
/*  Voir docs/superpowers/specs/2026-09-29-refonte-seo-design.md        */
/* ------------------------------------------------------------------ */

const VILLES_92 = [
  "boulogne-billancourt",
  "neuilly-sur-seine",
  "levallois-perret",
  "issy-les-moulineaux",
  "courbevoie",
  "puteaux",
  "suresnes",
  "saint-cloud",
  "rueil-malmaison",
  "asnieres-sur-seine",
  "clichy",
  "bois-colombes",
  "colombes",
  "sevres",
  "meudon",
  "vanves",
  "antony",
  "sceaux",
];

const VILLES_78 = [
  "versailles",
  "saint-germain-en-laye",
  "le-vesinet",
  "maisons-laffitte",
  "croissy-sur-seine",
  "le-pecq",
  "chatou",
];

const VILLES_94 = [
  "vincennes",
  "saint-mande",
  "charenton-le-pont",
  "saint-maur-des-fosses",
  "maisons-alfort",
  "nogent-sur-marne",
  "joinville-le-pont",
  "champigny-sur-marne",
  "cachan",
  "arcueil",
];

const villes = (list: string[], dest: string) =>
  list.map((v) => ({
    source: `/renovation-appartement-${v}`,
    destination: dest,
    permanent: true,
  }));

const CONSEILS_MERGED: Record<string, string> = {
  "cout-renovation-maison-100m2": "combien-coute-renovation-complete-maison",
  "cout-moyen-dune-renovation-interieure-de-maison":
    "combien-coute-renovation-complete-maison",
  "isolation-combles-amenageables": "isolation-maison-ancienne-par-linterieur",
  "isolation-cave-maison-ancienne": "isolation-maison-ancienne-par-linterieur",
  "isolation-thermique-fenetres-portes":
    "isolation-maison-ancienne-par-linterieur",
  "cuisine-sur-mesure": "renovation-cuisine-complete",
  "menuisier-cuisiniste": "renovation-cuisine-complete",
  "meuble-de-salle-de-bain-sur-mesure": "renovation-salle-de-bain-complete",
};

const CONSEILS_REMOVED = [
  "amenagement-interieur-sur-mesure",
  "bibliotheque-sur-mesure",
  "dressing-sur-mesure-chambre",
  "placard-sur-mesure",
  "porte-placard-sur-mesure",
  "rangement-sur-mesure-chambre",
  "menuiserie-interieure-renovation",
  "fenetre-bois-sur-mesure",
  "fenetre-sur-mesure-paris",
  "comment-bien-choisir-ses-menuiseries",
];

const nextConfig: NextConfig = {
  // AVIF puis WebP : ~30 % de poids en moins sur les photos de chantier.
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [420, 640, 828, 1080, 1280, 1600, 1920],
    imageSizes: [64, 128, 256, 384],
    minimumCacheTTL: 31536000,
  },
  compress: true,
  poweredByHeader: false,
  async redirects() {
    return [
      // Pages ville repliées dans leur département
      ...villes(VILLES_92, "/renovation-hauts-de-seine-92"),
      ...villes(VILLES_78, "/renovation-yvelines-78"),
      ...villes(VILLES_94, "/renovation-val-de-marne-94"),

      // Fusions de pages service et zone
      {
        source: "/renovation-paris-75",
        destination: "/renovation-appartement-paris",
        permanent: true,
      },
      {
        source: "/joints-epoxy-paris",
        destination: "/salle-de-bain-paris",
        permanent: true,
      },

      // Anciennes URL courtes citées dans le site, jamais créées
      {
        source: "/renovation-appartement",
        destination: "/renovation-appartement-paris",
        permanent: true,
      },
      { source: "/salle-de-bain", destination: "/salle-de-bain-paris", permanent: true },
      { source: "/joints-epoxy", destination: "/salle-de-bain-paris", permanent: true },
      {
        source: "/cuisine-sur-mesure",
        destination: "/cuisine-sur-mesure-paris",
        permanent: true,
      },
      { source: "/beton-cire", destination: "/beton-cire-paris", permanent: true },
      {
        source: "/isolation-dpe",
        destination: "/isolation-amelioration-energetique",
        permanent: true,
      },
      {
        source: "/gros-oeuvre",
        destination: "/renovation-gros-oeuvre-surelevation-extension-idf",
        permanent: true,
      },

      // Conseils fusionnés
      ...Object.entries(CONSEILS_MERGED).map(([from, to]) => ({
        source: `/conseils/${from}`,
        destination: `/conseils/${to}`,
        permanent: true,
      })),

      // Conseils hors positionnement, retirés
      ...CONSEILS_REMOVED.map((from) => ({
        source: `/conseils/${from}`,
        destination: "/conseils",
        permanent: true,
      })),
    ];
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
