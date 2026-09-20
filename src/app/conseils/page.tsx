import type { Metadata } from "next";
import Link from "next/link";

import { ArticleIndex, type Article } from "@/components/page/article-index";
import { PageHero } from "@/components/page/page-hero";
import { Commitments } from "@/components/sections/commitments";
import { Cta } from "@/components/sections/cta";
import { ArrowRight } from "@/components/ui/kit";
import { allPaths, cleanTitle, getPage, visualsFor } from "@/lib/content";
import { site } from "@/lib/site";

const path = "/conseils";

const title = "Conseils : tout savoir sur la rénovation à Paris";
const description =
  "Prix au m², délais, isolation, cuisine, salle de bain, menuiseries : nos guides pratiques pour préparer et réussir votre projet de rénovation en Île-de-France.";

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

/** Un visuel par thème, pour éviter la répétition dans l'index. */
const CAT_IMAGE: Record<string, string> = {
  "Prix & budget": "/images/paris-renovation-appartement.jpg",
  "Isolation & énergie": "/images/dpe-1.jpg",
  "Salle de bain": "/images/paris-sdb.jpg",
  Cuisine: "/images/paris-cuisine-sur-mesure.jpg",
  Menuiseries: "/images/salon-haussmannien-moulures.jpg",
  "Rangements sur-mesure": "/images/bibliotheque-sur-mesure.webp",
  "Méthode & étapes": "/images/paris-chantier.jpg",
};

/** Variantes secondaires, alternées pour casser la monotonie. */
const CAT_IMAGE_ALT: Record<string, string> = {
  "Prix & budget": "/images/savoir-faire-1.jpg",
  "Isolation & énergie": "/images/why-2.jpg",
  "Salle de bain": "/images/sdb-douche-italienne.webp",
  Cuisine: "/images/loft-cuisine-cheminee.jpg",
  Menuiseries: "/images/balcon-haussmannien-paris.jpg",
  "Rangements sur-mesure": "/images/dressing-sur-mesure.webp",
  "Méthode & étapes": "/images/paris-pourquoi-specialiste.jpg",
};

/** Classement thématique des guides à partir de leur URL. */
function categorize(slug: string): string {
  const s = slug;
  if (/(combien-coute|cout-|prix)/.test(s)) return "Prix & budget";
  if (/(isolation|passoire|thermique)/.test(s)) return "Isolation & énergie";
  if (/(salle-de-bain|carrelage|resine-beton)/.test(s)) return "Salle de bain";
  if (/(cuisine|cuisiniste)/.test(s)) return "Cuisine";
  if (/(fenetre|menuiserie|menuiseries)/.test(s)) return "Menuiseries";
  if (/(placard|dressing|bibliotheque|rangement|amenagement|meuble)/.test(s))
    return "Rangements sur-mesure";
  return "Méthode & étapes";
}

let catCount: Record<string, number> = {};

const articles: Article[] = allPaths()
  .filter((p) => p.startsWith("/conseils/"))
  .map((p) => {
    const page = getPage(p);
    if (!page) return null;
    const slug = p.replace("/conseils/", "");
    return {
      href: p,
      title: page.h1 || cleanTitle(page.title),
      excerpt: page.description || page.intro[0] || "",
      cat: categorize(slug),
      readMin: Math.max(
        3,
        Math.round(
          page.sections.reduce(
            (n, s) =>
              n +
              s.blocks.reduce(
                (m, b) =>
                  m + ("v" in b ? b.v.length : b.items.join(" ").length),
                0,
              ),
            0,
          ) / 1100,
        ),
      ),
      image: "",
    };
  })
  .filter((a): a is Article => a !== null)
  .sort((a, b) => a.title.localeCompare(b.title, "fr"))
  .map((a) => {
    const n = (catCount[a.cat] = (catCount[a.cat] ?? 0) + 1);
    const table = n % 2 === 0 ? CAT_IMAGE_ALT : CAT_IMAGE;
    return { ...a, image: table[a.cat] ?? "/images/salon-canape-courbe.jpg" };
  });

catCount = {};

export default function ConseilsPage() {
  const { hero } = visualsFor(path);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: title,
    description,
    url: `${site.url}${path}`,
    publisher: { "@id": `${site.url}#entreprise` },
    blogPost: articles.map((a) => ({
      "@type": "BlogPosting",
      headline: a.title,
      description: a.excerpt,
      url: `${site.url}${a.href}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow="Conseils & guides"
        line1="Tout savoir sur"
        line2="la rénovation à Paris"
        intro="Articles, guides et repères de prix pour comprendre les budgets, anticiper les délais et réussir votre projet en Île-de-France."
        image={hero}
        primary={{ label: "Obtenir un devis", href: "#devis" }}
        secondary={{ label: "Nos services", href: "/nos-services" }}
        footer={
          <p className="text-[0.82rem] text-paper/70">
            <span className="display-italic text-[1.05rem] text-paper">
              {articles.length}
            </span>{" "}
            guides pratiques, mis à jour pour 2026.
          </p>
        }
      />

      <div className="py-12 lg:py-16">
        <ArticleIndex articles={articles} />
      </div>

      {/* Guide PDF */}
      <section className="container-x py-10 lg:py-14" aria-label="Guide PDF">
        <div className="grid gap-8 overflow-hidden rounded-[clamp(18px,2.4vw,28px)] bg-clay p-8 text-paper sm:p-11 lg:grid-cols-[1.1fr_auto] lg:items-center lg:gap-14">
          <div>
            <p className="dot-label text-paper/60">Le condensé, en PDF</p>
            <h2 className="mt-4 max-w-xl text-[clamp(1.5rem,3vw,2.3rem)] leading-[1.06] font-medium tracking-[-0.02em]">
              Rénover son appartement à Paris
              <span className="display-italic block text-[1.08em]">
                le guide 2026
              </span>
            </h2>
            <p className="mt-4 max-w-lg text-[0.93rem] leading-relaxed text-paper/70">
              10 pages : prix au m², étapes clés, aides financières, 10 pièges à
              éviter et les spécificités du marché parisien.
            </p>
          </div>
          <Link
            href="/guide-renovation-2026"
            className="group inline-flex shrink-0 items-center gap-3 self-start rounded-full bg-paper py-1.5 pr-1.5 pl-6 text-[0.88rem] font-medium text-ink transition-colors duration-500 hover:bg-terra hover:text-paper lg:self-auto"
          >
            Recevoir le guide
            <span className="pill-arrow flex size-9 items-center justify-center rounded-full bg-terra text-paper transition-colors duration-500 group-hover:bg-paper group-hover:text-terra">
              <ArrowRight />
            </span>
          </Link>
        </div>
      </section>

      <Commitments />
      <Cta />
    </>
  );
}
