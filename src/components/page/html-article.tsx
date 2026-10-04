import { Blocks } from "@/components/page/blocks";
import { SectionHeading } from "@/components/page/article";
import { ArticleToc } from "@/components/page/article-toc";
import { ArrowRight, PhoneIcon } from "@/components/ui/kit";
import { site } from "@/lib/site";
import type { TocEntry } from "@/lib/whatswrong";

/* ------------------------------------------------------------------ */
/*  Article au format HTML (WhatsWrong)                                */
/*                                                                     */
/*  Trois colonnes sur grand écran : sommaire collant, texte à largeur */
/*  de lecture, encart devis collant. Une colonne sur mobile, sommaire */
/*  repliable en tête. Styles du corps : .ww-prose (globals.css).      */
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
        <div className="grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[15rem_minmax(0,1fr)_17rem] xl:gap-14">
          {/* Sommaire */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 max-h-[calc(100svh-8rem)] overflow-y-auto pr-2">
              <ArticleToc toc={toc} variant="sidebar" />
            </div>
          </aside>

          {/* Texte */}
          <div className="min-w-0">
            <div className="mx-auto max-w-[46rem]">
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

          {/* Encart devis */}
          <aside className="hidden xl:block">
            <div className="sticky top-28 rounded-[var(--radius-card)] bg-ink p-7 text-paper">
              <p className="dot-label text-paper/60">Votre projet</p>
              <p className="mt-4 text-[1.35rem] leading-tight font-medium tracking-[-0.02em]">
                Un devis détaillé{" "}
                <span className="display-italic text-gold-light">sous 48 h</span>
              </p>
              <p className="mt-3 text-[0.86rem] leading-relaxed text-paper/65">
                Visite technique sous 5 jours à Paris et en Île-de-France, un
                seul interlocuteur du diagnostic à la livraison.
              </p>
              <a
                href="#devis"
                className="group mt-6 flex items-center justify-between rounded-full bg-terra py-2 pr-2 pl-5 text-[0.9rem] font-medium text-paper transition-colors hover:bg-terra-deep"
              >
                Obtenir un devis
                <span className="flex size-8 items-center justify-center rounded-full bg-paper text-ink">
                  <ArrowRight className="size-3.5" />
                </span>
              </a>
              <a
                href={site.phoneHref}
                className="mt-3 flex items-center justify-center gap-2 rounded-full border border-paper/20 py-2.5 text-[0.86rem] text-paper/85 transition-colors hover:border-paper/50"
              >
                <PhoneIcon className="size-3.5" />
                {site.phoneDisplay}
              </a>
            </div>
          </aside>
        </div>
      </section>

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
