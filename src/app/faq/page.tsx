import type { Metadata } from "next";
import Link from "next/link";

import { FaqGroups, type FaqGroup } from "@/components/page/faq-groups";
import { PageHero } from "@/components/page/page-hero";
import { Commitments } from "@/components/sections/commitments";
import { Cta } from "@/components/sections/cta";
import rawGroups from "@/content/faq.json";
import { visualsFor } from "@/lib/content";
import { faq as homeFaq, site } from "@/lib/site";

const path = "/faq";

const title = "Questions fréquentes sur la rénovation";
const description =
  "Prix au m², délais, garanties, copropriété, joints époxy, DPE, surélévation : toutes les réponses de nos conducteurs de travaux, Paris & Île-de-France.";

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

/** L'essentiel (accueil) + les FAQ thématiques des pages services. */
const groups: FaqGroup[] = [
  {
    theme: "L’essentiel",
    items: homeFaq.map((f) => ({ q: f.q, a: f.a })),
  },
  ...(rawGroups as FaqGroup[]),
];

export default function FaqPage() {
  const { hero } = visualsFor(path);
  const total = groups.reduce((n, g) => n + g.items.length, 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: groups.flatMap((g) =>
      g.items.map((i) => ({
        "@type": "Question",
        name: i.q,
        acceptedAnswer: { "@type": "Answer", text: i.a },
      })),
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow="Centre d’aide"
        line1="Questions"
        line2="fréquentes"
        intro={description}
        image={hero}
        primary={{ label: "Obtenir un devis", href: "#devis" }}
        secondary={{ label: "Poser une question", href: "/contact-devis" }}
        footer={
          <p className="text-[0.82rem] text-paper/70">
            <span className="display-italic text-[1.05rem] text-paper">
              {total}
            </span>{" "}
            réponses réparties en {groups.length} thèmes — rédigées par nos
            conducteurs de travaux.
          </p>
        }
      />

      {/* Sommaire des thèmes */}
      <nav aria-label="Thèmes" className="container-x py-12 lg:py-16">
        <div className="border-t border-line pt-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="dot-label text-muted">Thèmes</p>
            <span className="display-italic text-[0.95rem] text-muted">
              {total} questions
            </span>
          </div>
          <ul className="reveal-sm mt-5 flex flex-wrap gap-2">
            {groups.map((g, i) => (
              <li key={g.theme}>
                <a
                  href={`#theme-${i + 1}`}
                  className="inline-block rounded-full border border-line px-4 py-2 text-[0.84rem] text-ink/75 transition-colors duration-400 hover:border-terra hover:bg-terra hover:text-paper"
                >
                  {g.theme}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <FaqGroups groups={groups} />

      <section
        className="container-x py-10 lg:py-14"
        aria-label="Une autre question"
      >
        <div className="rounded-[clamp(18px,2.4vw,28px)] border border-line bg-paper p-8 sm:p-10">
          <p className="dot-label text-terra">Votre question n’est pas là ?</p>
          <p className="mt-4 max-w-2xl text-[clamp(1.05rem,1.9vw,1.3rem)] leading-[1.5] font-medium text-balance">
            Un conducteur de travaux vous répond directement — par téléphone,
            WhatsApp ou e-mail, sous 24 h ouvrées.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/contact-devis"
              className="inline-flex items-center rounded-full bg-ink px-6 py-3 text-[0.86rem] font-medium text-paper transition-colors duration-400 hover:bg-terra"
            >
              Poser ma question
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
