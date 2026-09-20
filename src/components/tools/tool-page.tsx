import Link from "next/link";
import type { ReactNode } from "react";

import { PageHero } from "@/components/page/page-hero";
import { Commitments } from "@/components/sections/commitments";
import { Cta } from "@/components/sections/cta";
import { ArrowRight } from "@/components/ui/kit";
import { site } from "@/lib/site";
import { type Tool, tools } from "@/lib/tools";

export type ToolSection = { title: string; body: ReactNode };
export type ToolFaq = { q: string; a: string };

export function ToolPage({
  tool,
  children,
  sections,
  faq,
  related,
}: {
  tool: Tool;
  children: ReactNode;
  sections: ToolSection[];
  faq: ToolFaq[];
  related: { label: string; href: string }[];
}) {
  const others = tools.filter((t) => t.slug !== tool.slug);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: tool.name,
      url: `${site.url}${tool.href}`,
      description: tool.description,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Tout navigateur web",
      browserRequirements: "JavaScript activé",
      inLanguage: "fr-FR",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      provider: { "@id": `${site.url}#entreprise` },
      keywords: tool.keywords.join(", "),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: site.url },
        {
          "@type": "ListItem",
          position: 2,
          name: "Outils",
          item: `${site.url}/outils`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: tool.name,
          item: `${site.url}${tool.href}`,
        },
      ],
    },
    ...(faq.length
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]
      : []),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow={tool.eyebrow}
        line1={tool.line1}
        line2={tool.line2}
        intro={tool.description}
        image={tool.image}
        height="52svh"
        primary={{ label: "Utiliser l’outil", href: "#outil" }}
        secondary={{ label: "Tous nos outils", href: "/outils" }}
      />

      {/* L'outil */}
      <section
        id="outil"
        className="scroll-mt-24 py-12 lg:py-16"
        aria-label={tool.name}
      >
        <div className="container-x">{children}</div>
      </section>

      {/* Contenu éditorial */}
      {sections.map((s, i) => (
        <section
          key={s.title}
          aria-labelledby={`sec-${i}`}
          className="container-x py-10 lg:py-14"
        >
          <div className="grid gap-6 border-t border-line pt-9 lg:grid-cols-[minmax(0,240px)_1fr] lg:gap-16">
            <div className="reveal-sm lg:sticky lg:top-28 lg:self-start">
              <span className="display-italic text-[1.5rem] leading-none text-terra">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2
                id={`sec-${i}`}
                className="mt-4 text-[1.28rem] leading-tight font-medium tracking-[-0.01em] text-balance"
              >
                {s.title}
              </h2>
            </div>
            <div className="reveal max-w-3xl [&_li]:mb-2 [&_li]:text-[0.95rem] [&_li]:leading-relaxed [&_li]:text-muted [&_p]:mt-4 [&_p]:text-[0.98rem] [&_p]:leading-[1.75] [&_p]:text-muted [&_p:first-child]:mt-0 [&_strong]:font-medium [&_strong]:text-ink [&_ul]:mt-4 [&_ul]:space-y-2">
              {s.body}
            </div>
          </div>
        </section>
      ))}

      {/* FAQ de l'outil */}
      {faq.length > 0 && (
        <section
          className="container-x py-10 lg:py-14"
          aria-labelledby="faq-outil"
        >
          <div className="grid gap-6 border-t border-line pt-9 lg:grid-cols-[minmax(0,240px)_1fr] lg:gap-16">
            <h2
              id="faq-outil"
              className="reveal-sm text-[1.28rem] leading-tight font-medium tracking-[-0.01em] lg:sticky lg:top-28 lg:self-start"
            >
              Questions fréquentes
            </h2>
            <div className="reveal max-w-3xl">
              {faq.map((f) => (
                <details
                  key={f.q}
                  className="group border-b border-line first:border-t [&[open]_summary]:text-terra"
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-[1.02rem] leading-snug font-medium transition-colors hover:text-terra [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span className="relative mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-line transition-colors group-open:border-terra group-open:bg-terra group-open:text-paper">
                      <span className="absolute h-px w-3 bg-current" />
                      <span className="absolute h-px w-3 rotate-90 bg-current transition-transform duration-300 group-open:rotate-0 group-open:opacity-0" />
                    </span>
                  </summary>
                  <p className="pr-10 pb-6 text-[0.94rem] leading-relaxed text-muted">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Maillage : pages liées + autres outils */}
      <section
        className="container-x py-10 lg:py-14"
        aria-labelledby="liens-outil"
      >
        <div className="border-t border-line pt-8">
          <h2 id="liens-outil" className="dot-label text-muted">
            Pour aller plus loin
          </h2>

          <ul className="mt-5 flex flex-wrap gap-2">
            {related.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-block rounded-full border border-line px-4 py-2 text-[0.84rem] text-ink/75 transition-colors duration-400 hover:border-terra hover:bg-terra hover:text-paper"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {others.map((t) => (
              <li key={t.slug}>
                <Link
                  href={t.href}
                  className="group flex h-full items-start justify-between gap-5 rounded-[clamp(16px,2vw,24px)] border border-line bg-paper p-6 transition-colors duration-400 hover:border-ink/25"
                >
                  <span>
                    <span className="dot-label text-[0.72rem] text-terra">
                      Autre outil
                    </span>
                    <span className="mt-2.5 block text-[1.05rem] font-medium transition-colors group-hover:text-terra">
                      {t.name}
                    </span>
                    <span className="mt-1.5 block text-[0.86rem] leading-relaxed text-muted">
                      {t.short}
                    </span>
                  </span>
                  <span className="pill-arrow mt-1 shrink-0 text-muted">
                    <ArrowRight />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Commitments />
      <Cta />
    </>
  );
}
