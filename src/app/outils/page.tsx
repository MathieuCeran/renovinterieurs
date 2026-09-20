import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PageHero } from "@/components/page/page-hero";
import { Commitments } from "@/components/sections/commitments";
import { Cta } from "@/components/sections/cta";
import { ArrowRight } from "@/components/ui/kit";
import { site } from "@/lib/site";
import { tools } from "@/lib/tools";

const path = "/outils";
const title = "Outils gratuits pour préparer votre rénovation";
const description =
  "Trois outils gratuits et sans inscription : estimez votre budget au m², simulez votre gain de classes DPE et générez le planning de votre chantier.";

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

export default function OutilsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: `${site.url}${path}`,
    publisher: { "@id": `${site.url}#entreprise` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: tools.length,
      itemListElement: tools.map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${site.url}${t.href}`,
        name: t.name,
        description: t.short,
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
        eyebrow="Outils gratuits"
        line1="Préparez votre projet"
        line2="avant même de nous appeler"
        intro="Budget au m², gain de classes DPE, planning de chantier : trois outils gratuits, sans inscription, fondés sur nos chiffres de terrain."
        image="/images/nos-services-hero.jpg"
        height="54svh"
        primary={{ label: "Estimer mon budget", href: tools[0].href }}
        secondary={{ label: "Demander un devis", href: "/contact-devis" }}
      />

      <section
        className="container-x py-12 lg:py-16"
        aria-labelledby="liste-outils"
      >
        <div className="border-t border-line pt-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="liste-outils" className="dot-label text-muted">
              Nos outils
            </h2>
            <span className="display-italic text-[0.95rem] text-muted">
              {tools.length} outils gratuits
            </span>
          </div>

          <ul className="reveal-stagger mt-8 grid gap-6 lg:grid-cols-3">
            {tools.map((t, i) => (
              <li key={t.slug} style={{ "--i": i } as React.CSSProperties}>
                <Link href={t.href} className="group flex h-full flex-col">
                  <div className="relative aspect-4/3 overflow-hidden rounded-[clamp(16px,2vw,24px)]">
                    <Image
                      src={t.image}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover transition-transform duration-[1300ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-107"
                    />
                    <span className="absolute top-4 left-4 rounded-full bg-paper/92 px-3 py-1 text-[0.72rem] font-medium backdrop-blur-sm">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mt-5 text-[1.25rem] leading-tight font-medium tracking-[-0.01em] transition-colors duration-400 group-hover:text-terra">
                    {t.name}
                  </h3>
                  <p className="mt-2.5 flex-1 text-[0.9rem] leading-relaxed text-muted">
                    {t.short}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2.5 text-[0.84rem] font-medium">
                    Ouvrir l’outil
                    <span className="pill-arrow">
                      <ArrowRight className="size-3" />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-10 max-w-3xl text-[0.9rem] leading-relaxed text-muted">
            Ces outils s’appuient sur nos fourchettes de prix et nos durées de
            chantier observées en Île-de-France. Ils donnent un ordre de
            grandeur fiable pour cadrer un projet — ils ne remplacent ni une
            visite technique, ni un devis, ni un audit énergétique.
          </p>
        </div>
      </section>

      <Commitments />
      <Cta />
    </>
  );
}
