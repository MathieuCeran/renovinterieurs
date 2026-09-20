import type { Metadata } from "next";
import Link from "next/link";

import { GuideForm } from "@/components/page/guide-form";
import { PageHero } from "@/components/page/page-hero";
import { Commitments } from "@/components/sections/commitments";
import { Cta } from "@/components/sections/cta";
import { cleanTitle, getPage, visualsFor } from "@/lib/content";
import { site } from "@/lib/site";

const path = "/guide-renovation-2026";
const page = getPage(path);

const title = page
  ? cleanTitle(page.title)
  : "Guide gratuit rénovation appartement Paris 2026";
const description =
  page?.description ??
  "Téléchargez le guide complet de la rénovation d’appartement à Paris en 2026 : prix au m², étapes, aides financières et 10 pièges à éviter.";

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

/** Les 7 chapitres, repris du site actuel. */
const chapitres = [
  {
    t: "Combien coûte une rénovation à Paris ?",
    d: "Les 4 fourchettes de prix au m² selon le niveau de finition, avec montants chiffrés sur 60 m².",
  },
  {
    t: "Les 5 facteurs qui font varier le prix",
    d: "État du bien, surface, finition, type d’appartement, choix techniques.",
  },
  {
    t: "Les 5 étapes clés du projet",
    d: "Du premier échange à la livraison + SAV, avec durées indicatives.",
  },
  {
    t: "Les aides financières 2026",
    d: "TVA 10 %, MaPrimeRénov’, CEE, éco-PTZ et aides locales. Avec un cas pratique chiffré.",
  },
  {
    t: "10 pièges à éviter",
    d: "Les erreurs concrètes vues sur les chantiers — et comment les éviter.",
  },
  {
    t: "Spécificités parisiennes",
    d: "Haussmannien, copropriété, Architecte des Bâtiments de France.",
  },
  {
    t: "Votre checklist finale",
    d: "Les 12 points à valider avant de signer un devis. Imprimable.",
  },
];

export default function GuidePage() {
  const { hero } = visualsFor(path);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: "Rénover son appartement à Paris en 2026",
    description,
    inLanguage: "fr-FR",
    numberOfPages: 10,
    bookFormat: "https://schema.org/EBook",
    author: { "@id": `${site.url}#entreprise` },
    publisher: { "@id": `${site.url}#entreprise` },
    url: `${site.url}${path}`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    hasPart: chapitres.map((c) => ({
      "@type": "Chapter",
      name: c.t,
      description: c.d,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow="Guide gratuit — PDF"
        line1="Rénover son appartement"
        line2="à Paris en 2026"
        intro="10 pages condensées : prix au m², étapes clés, aides financières, 10 pièges à éviter et les spécificités du marché parisien."
        image={hero}
        primary={{ label: "Recevoir le guide", href: "#guide" }}
        secondary={{ label: "Parler à un expert", href: "/contact-devis" }}
      />

      {/* Chapitres + formulaire */}
      <section
        id="guide"
        className="py-14 lg:py-20"
        aria-labelledby="chapitres-title"
      >
        <div className="container-x grid items-start gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <h2
              id="chapitres-title"
              className="text-[clamp(1.5rem,3vw,2.2rem)] leading-[1.06] font-medium tracking-[-0.02em]"
            >
              <span className="mask reveal-mask">
                <span className="block">7 chapitres pour</span>
              </span>
              <span className="mask reveal-mask">
                <span className="display-italic block text-[1.1em]">
                  décider sereinement
                </span>
              </span>
            </h2>

            <ol className="reveal-stagger mt-8 border-t border-line">
              {chapitres.map((c, i) => (
                <li
                  key={c.t}
                  style={{ "--i": Math.min(i, 6) } as React.CSSProperties}
                  className="flex gap-5 border-b border-line py-5"
                >
                  <span className="display-italic w-8 shrink-0 text-[1.1rem] leading-none text-terra">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block text-[1rem] leading-snug font-medium">
                      {c.t}
                    </span>
                    <span className="mt-1.5 block text-[0.88rem] leading-relaxed text-muted">
                      {c.d}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="reveal lg:sticky lg:top-28">
            <GuideForm />
          </div>
        </div>
      </section>

      {/* Passerelle devis */}
      <section
        className="container-x py-10 lg:py-14"
        aria-label="Projet déjà cadré"
      >
        <div className="rounded-[clamp(18px,2.4vw,28px)] border border-line bg-paper p-8 sm:p-10">
          <p className="dot-label text-terra">Projet déjà clair ?</p>
          <p className="mt-4 max-w-2xl text-[clamp(1.05rem,1.9vw,1.3rem)] leading-[1.5] font-medium text-balance">
            Le guide ne remplace pas un échange direct. Décrivez votre projet et
            recevez un devis détaillé sous 48 h.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/contact-devis"
              className="inline-flex items-center rounded-full bg-ink px-6 py-3 text-[0.86rem] font-medium text-paper transition-colors duration-400 hover:bg-terra"
            >
              Demander un devis
            </Link>
            <a
              href={site.phoneHref}
              className="inline-flex items-center rounded-full border border-line px-6 py-3 text-[0.86rem] font-medium transition-colors duration-400 hover:border-ink"
            >
              {site.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      <Commitments />
      <Cta />
    </>
  );
}
