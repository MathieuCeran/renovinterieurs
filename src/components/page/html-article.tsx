import { Blocks } from "@/components/page/blocks";
import { SectionHeading } from "@/components/page/article";
import { ArticleToc } from "@/components/page/article-toc";
import { ArticleCtaBar } from "@/components/page/article-cta-bar";
import type { TocEntry } from "@/lib/whatswrong";

/* ------------------------------------------------------------------ */
/*  Article au format HTML (WhatsWrong)                                */
/*                                                                     */
/*  Grand écran : sommaire collant + texte large, barre devis fixée en */
/*  bas. Mobile : une colonne, sommaire repliable en tête. Styles du   */
/*  corps : .ww-prose (globals.css).                                   */
/* ------------------------------------------------------------------ */

export function HtmlArticle({
  html,
  toc,
  cover,
  faq,
  readMin,
  updatedAt,
}: {
  html: string;
  toc: TocEntry[];
  cover: { url: string; alt: string } | null;
  faq: { title: string; items: { q: string; a: string }[] } | null;
  readMin: number;
  updatedAt: string | null;
}) {
  const updated = updatedAt
    ? new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Europe/Paris",
      }).format(new Date(updatedAt))
    : null;

  return (
    <>
      <section className="container-x py-10 lg:py-16" aria-label="Article">
        <div className="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14 xl:gap-20">
          {/* Sommaire */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 max-h-[calc(100svh-8rem)] overflow-y-auto pr-2">
              <ArticleToc toc={toc} variant="sidebar" />
            </div>
          </aside>

          {/* Texte */}
          <div className="min-w-0">
            <div className="max-w-[50rem]">
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.82rem] text-muted">
                <span>{readMin} min de lecture</span>
                {updated && (
                  <>
                    <span aria-hidden className="size-1 rounded-full bg-line" />
                    <span>Mis à jour le {updated}</span>
                  </>
                )}
              </p>

              <div className="mt-6 lg:hidden">
                <ArticleToc toc={toc} variant="inline" />
              </div>

              {cover && (
                // eslint-disable-next-line @next/next/no-img-element -- copie locale de la couverture WhatsWrong
                <img
                  src={cover.url}
                  alt={cover.alt}
                  className="mt-8 aspect-[16/9] w-full rounded-[clamp(18px,2.4vw,28px)] object-cover"
                />
              )}

              <div
                className="ww-prose mt-8"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          </div>
        </div>
      </section>

      <ArticleCtaBar />

      {faq && faq.items.length > 0 && (
        <section
          className="container-x py-10 lg:py-14"
          aria-labelledby="faq-title"
        >
          <div className="border-t border-line pt-7">
            <SectionHeading id="faq-title" title={faq.title || "Questions fréquentes"} />
          </div>
          <div className="mt-8 lg:mt-10">
            <Blocks blocks={[{ t: "faq", items: faq.items }]} />
          </div>
        </section>
      )}
    </>
  );
}
