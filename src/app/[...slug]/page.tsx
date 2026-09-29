import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Article, SectionHeading, Toc } from "@/components/page/article";
import { Inline, Links } from "@/components/page/blocks";
import { InnerHero, anchorId } from "@/components/page/inner-hero";
import { PhoneIcon, Pill } from "@/components/ui/kit";
import { Commitments } from "@/components/sections/commitments";
import { Cta } from "@/components/sections/cta";
import {
  allSlugs,
  breadcrumbFor,
  clamp,
  cleanTitle,
  getPage,
  stripInline,
  visualsFor,
} from "@/lib/content";
import { site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return allSlugs().map((s) => ({ slug: s.replace(/^\//, "").split("/") }));
}

function slugOf(parts: string[]) {
  return `/${parts.join("/")}`;
}

export async function generateMetadata({
  params,
}: PageProps<"/[...slug]">): Promise<Metadata> {
  const { slug } = await params;
  const path = slugOf(slug);
  const page = getPage(path);
  if (!page) return {};

  const hero = page.hero ?? visualsFor(path).hero;
  const title = clamp(cleanTitle(page.title), 60);
  const description = clamp(
    page.description || stripInline(page.intro[0] ?? ""),
    155,
  );

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: page.kind === "article" ? "article" : "website",
      locale: "fr_FR",
      url: `${site.url}${path}`,
      siteName: site.name,
      title,
      description,
      images: [{ url: hero, alt: page.h1 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [hero],
    },
  };
}

export default async function InnerPage({ params }: PageProps<"/[...slug]">) {
  const { slug } = await params;
  const path = slugOf(slug);
  const page = getPage(path);
  if (!page) notFound();

  const visuals = visualsFor(path);
  const hero = page.hero ?? visuals.hero;
  const crumbs = breadcrumbFor(path);
  const parentCrumb = crumbs[crumbs.length - 1];
  const url = `${site.url}${path}`;

  const faqItems = page.sections.flatMap((s) =>
    s.blocks.flatMap((b) => (b.t === "faq" ? b.items : [])),
  );

  const mainType =
    page.kind === "service"
      ? "Service"
      : page.kind === "article"
        ? "Article"
        : "WebPage";

  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        ...crumbs.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.label,
          item: `${site.url}${c.href === "/" ? "" : c.href}`,
        })),
        {
          "@type": "ListItem",
          position: crumbs.length + 1,
          name: page.h1,
          item: url,
        },
      ],
    },
    mainType === "Service"
      ? {
          "@context": "https://schema.org",
          "@type": "Service",
          name: page.h1,
          description: page.description,
          url,
          image: `${site.url}${hero}`,
          provider: { "@id": `${site.url}#entreprise` },
          areaServed: { "@type": "AdministrativeArea", name: "Île-de-France" },
        }
      : {
          "@context": "https://schema.org",
          "@type": mainType,
          headline: page.h1,
          name: page.h1,
          description: page.description,
          image: `${site.url}${hero}`,
          inLanguage: "fr-FR",
          isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
          publisher: { "@id": `${site.url}#entreprise` },
          mainEntityOfPage: url,
        },
  ];

  if (faqItems.length > 0) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: stripInline(f.a) },
      })),
    });
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <InnerHero
        h1={page.h1}
        intro={page.description || stripInline(page.intro[0] ?? "")}
        image={hero}
        crumbLabel={parentCrumb.label}
        crumbHref={parentCrumb.href}
      />

      {/* Chapeau : accroche + actions à gauche, carte « ce que nous pilotons » à droite */}
      {page.intro.length > 0 && (
        <section
          className="container-x pt-12 pb-4 lg:pt-16 lg:pb-6"
          aria-label="Introduction"
        >
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
            <div className="flex flex-col">
              <p className="dot-label reveal-sm text-muted">
                {page.eyebrow ?? parentCrumb.label}
              </p>
              <p className="reveal mt-4 max-w-[46ch] text-[clamp(1.02rem,1.35vw,1.22rem)] leading-[1.55] font-medium tracking-[-0.01em] text-pretty text-ink">
                <Inline v={page.intro[0]} />
              </p>
              <div className="reveal mt-auto flex flex-wrap items-center gap-3 pt-6">
                <Pill href="#devis" tone="terra">
                  Obtenir un devis
                </Pill>
                <a
                  href={site.phoneHref}
                  className="group inline-flex items-center gap-2.5 rounded-full border border-ink/20 px-5 py-3 text-[0.88rem] font-medium text-ink transition-colors duration-500 hover:border-ink hover:bg-ink hover:text-paper"
                >
                  <PhoneIcon className="size-4 text-terra transition-colors group-hover:text-paper" />
                  {site.phoneDisplay}
                </a>
              </div>
            </div>

            <aside className="reveal flex flex-col rounded-[clamp(18px,2.4vw,28px)] bg-paper p-7 lg:p-8">
              <p className="dot-label text-[0.74rem] text-terra">
                Ce que nous pilotons
              </p>
              {page.intro.length > 1 ? (
                page.intro.slice(1).map((p, i) => (
                  <p
                    key={i}
                    className="mt-4 mb-6 text-[0.95rem] leading-[1.7] text-muted"
                  >
                    <Inline v={p} />
                  </p>
                ))
              ) : (
                <p className="mt-4 mb-6 text-[0.95rem] leading-[1.7] text-muted">
                  Un interlocuteur unique du diagnostic à la réception, un
                  devis détaillé sous 48 h, un compte-rendu chaque semaine.
                </p>
              )}
              <ul className="mt-auto grid gap-2.5 border-t border-line pt-5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {[
                  "Devis détaillé sous 48 h",
                  "Visite technique sous 5 jours",
                  "SAV 12 mois après livraison",
                ].map((t) => (
                  <li
                    key={t}
                    className="flex items-center gap-2.5 text-[0.84rem] font-medium text-ink"
                  >
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-terra/12 text-terra">
                      <svg viewBox="0 0 16 16" aria-hidden className="size-3">
                        <path
                          d="M4.5 8.3l2.2 2.2 4.8-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>
      )}

      {page.kind === "article" && <Toc sections={page.sections} />}
      <Article
        sections={page.sections}
        images={visuals.band}
        alt={page.h1}
        kind={page.kind}
      />

      {page.related && page.related.length > 0 && (
        <section
          className="container-x py-10 lg:py-14"
          aria-labelledby="related-title"
        >
          <div className="grid gap-5 border-t border-line pt-7 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-16">
            <SectionHeading id="related-title" title="Pour aller plus loin" />
            <p className="reveal max-w-md text-[0.95rem] leading-relaxed text-muted lg:pb-2">
              Les pages qui complètent celle-ci : méthode, prix, zones et
              réalisations.
            </p>
          </div>
          <div className="mt-8 lg:mt-10">
            <Links items={page.related} />
          </div>
        </section>
      )}

      <Commitments />
      <Cta />
    </>
  );
}

export { anchorId };
