import type { Metadata } from "next";

import { GalleryGrid, type Work } from "@/components/page/gallery-grid";
import { PageHero } from "@/components/page/page-hero";
import { Commitments } from "@/components/sections/commitments";
import { Cta } from "@/components/sections/cta";
import { Pillars } from "@/components/sections/pillars";
import { cleanTitle, getPage, visualsFor } from "@/lib/content";
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
  {
    src: "/images/sejour-haussmannien.jpg",
    alt: "Séjour haussmannien rénové, double exposition et moulures restaurées",
    cat: "Séjour",
  },
  {
    src: "/images/paris-cuisine-sur-mesure.jpg",
    alt: "Cuisine sur-mesure, îlot en marbre et verrière atelier",
    cat: "Cuisine",
  },
  {
    src: "/images/paris-sdb.jpg",
    alt: "Salle de bain en pierre avec baignoire îlot et douche à l’italienne",
    cat: "Salle de bain",
  },
  {
    src: "/images/salon-canape-courbe.jpg",
    alt: "Salon parisien rénové, canapé courbe et parquet chevron",
    cat: "Séjour",
  },
  {
    src: "/images/bibliotheque-sur-mesure.webp",
    alt: "Bibliothèque sur-mesure en bois massif, niches et rangements fermés",
    cat: "Menuiserie",
  },
  {
    src: "/images/loft-beton-cire.jpg",
    alt: "Volume ouvert en béton ciré après dépose de mur porteur",
    cat: "Béton ciré",
  },
  {
    src: "/images/salon-haussmannien-moulures.jpg",
    alt: "Moulures et cheminée restaurées dans un salon haussmannien",
    cat: "Séjour",
  },
  {
    src: "/images/sdb-douche-italienne.webp",
    alt: "Salle de bain sombre haut de gamme, douche à l’italienne et baignoire",
    cat: "Salle de bain",
  },
  {
    src: "/images/dressing-sur-mesure.webp",
    alt: "Dressing sur-mesure intégré sous pente, penderie et tiroirs",
    cat: "Menuiserie",
  },
  {
    src: "/images/loft-cuisine-cheminee.jpg",
    alt: "Cuisine ouverte et mur en béton ciré avec cheminée linéaire",
    cat: "Béton ciré",
  },
  {
    src: "/images/paris-parquet.jpg",
    alt: "Parquet chêne posé en point de Hongrie",
    cat: "Sols & matières",
  },
  {
    src: "/images/why-2.jpg",
    alt: "Parquet chevron et habillage mural en tasseaux",
    cat: "Sols & matières",
  },
  {
    src: "/images/service-renovation.jpg",
    alt: "Habillage mural en tasseaux de bois et placard intégré",
    cat: "Menuiserie",
  },
  {
    src: "/images/service-sdb.jpg",
    alt: "Plan vasque en pierre naturelle et robinetterie laiton",
    cat: "Salle de bain",
  },
  {
    src: "/images/paris-renovation-appartement.jpg",
    alt: "Pose d’un parquet chevron dans un appartement haussmannien",
    cat: "Chantier",
  },
  {
    src: "/images/paris-chantier.jpg",
    alt: "Enfilade de pièces protégées pendant les travaux",
    cat: "Chantier",
  },
  {
    src: "/images/savoir-faire-1.jpg",
    alt: "Artisan réalisant les finitions d’un chantier de rénovation",
    cat: "Chantier",
  },
  {
    src: "/images/paris-pourquoi-specialiste.jpg",
    alt: "Conducteur de travaux échangeant avec les artisans sur le chantier",
    cat: "Chantier",
  },
  {
    src: "/images/dpe-1.jpg",
    alt: "Pose d’isolant intérieur dans un appartement ancien",
    cat: "Isolation",
  },
  {
    src: "/images/balcon-haussmannien-paris.jpg",
    alt: "Balcon parisien restauré, ferronnerie et garde-corps d’origine",
    cat: "Séjour",
  },
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
        intro="Appartements parisiens, cuisines sur-mesure, salles de bain, béton ciré : nos chantiers terminés, en images."
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
