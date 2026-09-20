import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Article, Toc } from "@/components/page/article";
import { InnerHero, anchorId } from "@/components/page/inner-hero";
import { Commitments } from "@/components/sections/commitments";
import { Cta } from "@/components/sections/cta";
import {
  allSlugs,
  cleanTitle,
  breadcrumbHref,
  breadcrumbLabel,
  getPage,
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

  const { hero } = visualsFor(path);

  return {
    title: cleanTitle(page.title),
    description: page.description || page.intro[0]?.slice(0, 160),
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      locale: "fr_FR",
      url: `${site.url}${path}`,
      siteName: site.name,
      title: page.title,
      description: page.description,
      images: [{ url: hero, alt: page.h1 }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [hero],
    },
  };
}

export default async function InnerPage({ params }: PageProps<"/[...slug]">) {
  const { slug } = await params;
  const path = slugOf(slug);
  const page = getPage(path);
  if (!page) notFound();

  const { hero, band } = visualsFor(path);
  const crumbLabel = breadcrumbLabel(path);
  const crumbHref = breadcrumbHref(path);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: site.url },
        {
          "@type": "ListItem",
          position: 2,
          name: crumbLabel,
          item: `${site.url}${crumbHref.replace(/#.*$/, "")}`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: page.h1,
          item: `${site.url}${path}`,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: page.h1,
      description: page.description,
      image: `${site.url}${hero}`,
      inLanguage: "fr-FR",
      isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
      publisher: { "@id": `${site.url}#entreprise` },
      about: page.sections
        .slice(0, 8)
        .map((s) => ({ "@type": "Thing", name: s.title })),
      mainEntityOfPage: `${site.url}${path}`,
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <InnerHero
        h1={page.h1}
        intro={page.description || page.intro[0]?.slice(0, 200)}
        image={hero}
        crumbLabel={crumbLabel}
        crumbHref={crumbHref}
      />

      {/* Chapeau : les paragraphes d'introduction hors sections */}
      {page.intro.length > 0 && (
        <section
          className="container-x py-14 lg:py-20"
          aria-label="Introduction"
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,240px)_1fr] lg:gap-16">
            <p className="dot-label reveal-sm h-fit text-muted lg:sticky lg:top-28">
              {crumbLabel}
            </p>
            <div className="reveal max-w-3xl">
              {page.intro.map((p, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? "text-[clamp(1.05rem,1.9vw,1.35rem)] leading-[1.6] font-medium text-balance text-ink"
                      : "mt-5 text-[0.98rem] leading-[1.75] text-muted"
                  }
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      <Toc sections={page.sections} />
      <Article sections={page.sections} images={band} alt={page.h1} />
      <Commitments />
      <Cta />
    </>
  );
}

export { anchorId };
