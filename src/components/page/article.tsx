import Image from "next/image";

import { anchorId } from "@/components/page/inner-hero";
import type { Section } from "@/lib/content";

/* ------------------------------------------------------------------ */
/*  Sommaire — utile à la lecture et au maillage interne               */
/* ------------------------------------------------------------------ */

export function Toc({ sections }: { sections: Section[] }) {
  if (sections.length < 3) return null;

  return (
    <nav
      aria-labelledby="sommaire-title"
      className="container-x py-12 lg:py-16"
    >
      <div className="border-t border-line pt-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="sommaire-title" className="dot-label text-muted">
            Sommaire
          </h2>
          <span className="display-italic text-[0.95rem] text-muted">
            {sections.length} sections
          </span>
        </div>

        <ol className="reveal-sm mt-5 columns-1 gap-x-10 sm:columns-2 lg:columns-3">
          {sections.map((s, i) => (
            <li key={anchorId(s.title, i)} className="break-inside-avoid">
              <a
                href={`#${anchorId(s.title, i)}`}
                className="group flex items-baseline gap-3 border-b border-line py-2.5 transition-colors hover:border-ink/30"
              >
                <span className="display-italic w-6 shrink-0 text-[0.8rem] text-terra">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-[0.88rem] leading-snug text-ink/75 transition-colors group-hover:text-terra">
                  {s.title}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  Corps de page                                                      */
/* ------------------------------------------------------------------ */

function Blocks({ blocks }: { blocks: Section["blocks"] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.t === "h3")
          return (
            <h3
              key={i}
              className="mt-9 mb-3 text-[1.12rem] leading-snug font-medium text-ink first:mt-0"
            >
              {b.v}
            </h3>
          );
        if (b.t === "ul")
          return (
            <ul key={i} className="my-5 space-y-2.5">
              {b.items.map((it, j) => (
                <li
                  key={j}
                  className="flex gap-3 text-[0.95rem] leading-relaxed text-muted"
                >
                  <span
                    aria-hidden
                    className="mt-[0.62em] size-1.5 shrink-0 rounded-full bg-terra"
                  />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          );
        return (
          <p
            key={i}
            className="mt-4 text-[0.98rem] leading-[1.75] text-muted first:mt-0"
          >
            {b.v}
          </p>
        );
      })}
    </>
  );
}

export function Article({
  sections,
  images,
  alt,
}: {
  sections: Section[];
  images: string[];
  alt: string;
}) {
  /** Une bande visuelle toutes les 4 sections. */
  const bandAfter = new Set([1, 5, 9, 13].slice(0, images.length));

  return (
    <div className="pb-8">
      {sections.map((s, i) => {
        const id = anchorId(s.title, i);
        const bandIndex = [1, 5, 9, 13].indexOf(i);

        return (
          <div key={id}>
            <section
              id={id}
              aria-labelledby={`${id}-title`}
              className="container-x scroll-mt-28 py-10 lg:py-14"
            >
              <div className="grid gap-6 border-t border-line pt-9 lg:grid-cols-[minmax(0,240px)_1fr] lg:gap-16">
                <div className="reveal-sm lg:sticky lg:top-28 lg:self-start">
                  <span className="display-italic text-[1.5rem] leading-none text-terra">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2
                    id={`${id}-title`}
                    className="mt-4 text-[1.28rem] leading-tight font-medium tracking-[-0.01em] text-balance"
                  >
                    {s.title}
                  </h2>
                </div>

                <div className="reveal max-w-3xl">
                  <Blocks blocks={s.blocks} />
                </div>
              </div>
            </section>

            {bandAfter.has(i) && images[bandIndex] && (
              <figure className="reveal reveal-zoom container-x">
                <div className="relative aspect-4/3 overflow-hidden rounded-[clamp(18px,2.4vw,28px)] sm:aspect-21/9">
                  <Image
                    src={images[bandIndex]}
                    alt={alt}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
              </figure>
            )}
          </div>
        );
      })}
    </div>
  );
}
