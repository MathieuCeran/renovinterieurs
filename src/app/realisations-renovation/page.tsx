import type { Metadata } from "next";

import { GalleryGrid, type Work } from "@/components/page/gallery-grid";
import { PageHero } from "@/components/page/page-hero";
import { Commitments } from "@/components/sections/commitments";
import { Cta } from "@/components/sections/cta";
import { Pillars } from "@/components/sections/pillars";
import { cleanTitle, getPage, visualsFor } from "@/lib/content";
import { photos } from "@/lib/photos";
import { site } from "@/lib/site";

const path = "/realisations-renovation";
const page = getPage(path);

const title = page ? cleanTitle(page.title) : "Nos réalisations de rénovation";
const description =
  page?.description ??
  "Appartements haussmanniens, cuisines sur-mesure, salles de bain, béton ciré : nos chantiers livrés à Paris et en Île-de-France.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: `${site.url}${path}`,
    siteName: site.name,
    title,
    description,
    images: [{ url: "/og.jpg" }],
  },
};

const works: Work[] = [
  { ...photos.cuisineNoireIlot, cat: "Cuisine" },
  { ...photos.sdbTravertin, cat: "Salle de bain" },
  { ...photos.salonBibliotheques, cat: "Séjour" },
  { ...photos.bibliothequeArche, cat: "Sur-mesure" },
  { ...photos.cuisineNoyer, cat: "Cuisine" },
  { ...photos.sdbNiches, cat: "Salle de bain" },
  { ...photos.teteDeLit, cat: "Chambre" },
  { ...photos.dressing, cat: "Sur-mesure" },
  { ...photos.cuisineSauge, cat: "Cuisine" },
  { ...photos.sdbDoubleVasque, cat: "Salle de bain" },
  { ...photos.niches, cat: "Séjour" },
  { ...photos.chambreEnfant, cat: "Chambre" },
  { ...photos.cuisineBleue, cat: "Cuisine" },
  { ...photos.comptoir, cat: "Séjour" },
  { ...photos.bibliothequeTv, cat: "Sur-mesure" },
  { ...photos.wc, cat: "Salle de bain" },
  { ...photos.chambreTasseaux, cat: "Chambre" },
  { ...photos.cuisineNoyerClaustra, cat: "Cuisine" },
  { ...photos.meubleEntree, cat: "Sur-mesure" },
  { ...photos.sdbVerriere, cat: "Salle de bain" },
  { ...photos.cacheRadiateur, cat: "Sur-mesure" },
  { ...photos.fauxPlafond, cat: "Second œuvre" },
  { ...photos.cuisineBlanche, cat: "Cuisine" },
  { ...photos.placardArches, cat: "Sur-mesure" },
  { ...photos.sdbCarreauxCiment, cat: "Salle de bain" },
  { ...photos.escalier, cat: "Second œuvre" },
  { ...photos.kitchenette, cat: "Cuisine" },
  { ...photos.cuisineCouloir, cat: "Cuisine" },
  { ...photos.charpenteLucarnes, cat: "Gros œuvre" },
  { ...photos.extensionCharpente, cat: "Gros œuvre" },
  { ...photos.isolationExterieure, cat: "Gros œuvre" },
];

export default function RealisationsPage() {
  const { hero } = visualsFor(path);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: `${site.url}${path}`,
    publisher: { "@id": `${site.url}#entreprise` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: works.length,
      itemListElement: works.map((w, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "ImageObject",
          contentUrl: `${site.url}${w.src}`,
          name: w.alt,
          description: `${w.cat} — ${w.alt}`,
        },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow="Nos réalisations"
        line1="Des projets concrets,"
        line2="des résultats visibles"
        intro="Cuisines, salles de bain, menuiserie sur mesure, gros œuvre : nos chantiers, en photos réelles."
        image={hero}
        primary={{ label: "Obtenir un devis", href: "#devis" }}
        secondary={{ label: "Nos services", href: "/nos-services" }}
      />

      <div className="py-12 lg:py-16">
        <GalleryGrid works={works} />
      </div>

      <Pillars />
      <Commitments />
      <Cta />
    </>
  );
}
