import { Blocks } from "@/components/page/blocks";
import { SectionHeading } from "@/components/page/article";

/* ------------------------------------------------------------------ */
/*  Article au format HTML (WhatsWrong) : corps déjà nettoyé           */
/* ------------------------------------------------------------------ */

const PROSE = [
  "max-w-[72ch] text-[1.02rem] leading-[1.75] text-ink/85",
  "[&_h2]:mt-14 [&_h2]:mb-5 [&_h2]:text-[clamp(1.5rem,2.6vw,2.1rem)] [&_h2]:leading-[1.1] [&_h2]:font-medium [&_h2]:tracking-[-0.025em] [&_h2]:text-ink [&_h2]:text-balance",
  "[&_h3]:mt-10 [&_h3]:mb-3 [&_h3]:text-[1.25rem] [&_h3]:font-medium [&_h3]:tracking-[-0.015em] [&_h3]:text-ink",
  "[&_h4]:mt-8 [&_h4]:mb-2 [&_h4]:font-medium [&_h4]:text-ink",
  "[&_p]:my-5 [&_strong]:font-semibold [&_strong]:text-ink",
  "[&_a]:text-terra [&_a]:underline [&_a]:decoration-terra/40 [&_a]:underline-offset-4 [&_a:hover]:decoration-terra",
  "[&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1.5 [&_li]:marker:text-terra",
  "[&_blockquote]:my-8 [&_blockquote]:border-l-2 [&_blockquote]:border-terra [&_blockquote]:pl-5 [&_blockquote]:font-serif [&_blockquote]:text-[1.1rem] [&_blockquote]:italic",
  "[&_img]:my-8 [&_img]:h-auto [&_img]:w-full [&_img]:rounded-[clamp(14px,2vw,22px)]",
  "[&_figcaption]:-mt-5 [&_figcaption]:text-[0.84rem] [&_figcaption]:text-muted",
  "[&_hr]:my-10 [&_hr]:border-line",
  "[&_table]:my-8 [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto [&_table]:text-[0.92rem]",
  "[&_th]:border-b [&_th]:border-line [&_th]:px-3 [&_th]:py-2.5 [&_th]:text-left [&_th]:font-medium [&_th]:text-ink",
  "[&_td]:border-b [&_td]:border-line [&_td]:px-3 [&_td]:py-2.5 [&_td]:align-top",
].join(" ");

export function HtmlArticle({
  html,
  cover,
  faq,
}: {
  html: string;
  cover: { url: string; alt: string } | null;
  faq: { title: string; items: { q: string; a: string }[] } | null;
}) {
  return (
    <>
      <section className="container-x py-12 lg:py-16" aria-label="Article">
        <div className="mx-auto max-w-[72ch]">
          {cover && (
            // eslint-disable-next-line @next/next/no-img-element -- image hébergée par WhatsWrong
            <img
              src={cover.url}
              alt={cover.alt}
              className="mb-10 aspect-[16/9] w-full rounded-[clamp(18px,2.4vw,28px)] object-cover"
            />
          )}
          <div className={PROSE} dangerouslySetInnerHTML={{ __html: html }} />
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
