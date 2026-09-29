import Image from "next/image";

import { Blocks, Inline, type Tone } from "@/components/page/blocks";
import { anchorId } from "@/components/page/inner-hero";
import { splitHeading, type Block, type Section } from "@/lib/content";

/* ------------------------------------------------------------------ */
/*  Titre de section : deux lignes, la seconde en italique serif       */
/* ------------------------------------------------------------------ */

function headingLines(title: string): [string, string] {
  const [lead, tail] = splitHeading(title);
  if (tail) return [lead, tail];
  const words = title.split(" ");
  if (words.length <= 2) return [title, ""];
  let cut = words.length >= 6 ? 2 : 1;
  // Une chute trop courte (« m² », « 92 ») ne tient pas seule en italique.
  if (words.slice(-cut).join(" ").length < 5 && words.length > cut + 1) cut += 1;
  return [words.slice(0, -cut).join(" "), words.slice(-cut).join(" ")];
}

export function SectionHeading({
  id,
  title,
  tone = "light",
  size: sizeProp = "lg",
}: {
  id: string;
  title: string;
  tone?: Tone;
  size?: "lg" | "md";
}) {
  let size = sizeProp;
  const [a, b] = headingLines(title);
  // Un titre long garde deux lignes lisibles plutôt que trois lignes géantes.
  if (size === "lg" && title.length > 32) size = "md";
  const cls =
    size === "lg"
      ? "text-[clamp(2rem,4.4vw,3.3rem)] leading-[0.98]"
      : "text-[clamp(1.6rem,3vw,2.3rem)] leading-[1.02]";
  return (
    <h2
      id={id}
      className={`${cls} font-medium tracking-[-0.03em] text-balance ${
        tone === "dark" ? "text-paper" : "text-ink"
      }`}
    >
      <span className="mask reveal-mask">
        <span className="block">{a}</span>
      </span>
      {b && (
        <span className="mask reveal-mask">
          <span className="display-italic block text-[1.08em] leading-[1]">
            {b}
          </span>
        </span>
      )}
    </h2>
  );
}

/* ------------------------------------------------------------------ */
/*  Sommaire : réservé aux articles longs                              */
/* ------------------------------------------------------------------ */

export function Toc({ sections }: { sections: Section[] }) {
  if (sections.length < 5) return null;

  return (
    <nav aria-labelledby="sommaire-title" className="container-x pb-4">
      <div className="rounded-[clamp(18px,2.4vw,28px)] bg-paper px-6 py-6 lg:px-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="sommaire-title" className="dot-label text-muted">
            Dans cet article
          </h2>
          <span className="display-italic text-[0.95rem] text-muted">
            {sections.length} parties
          </span>
        </div>
        <ol className="reveal-sm mt-4 columns-1 gap-x-10 sm:columns-2 lg:columns-3">
          {sections.map((s, i) => {
            const id = s.id ?? anchorId(s.title, i);
            return (
              <li key={id} className="break-inside-avoid">
                <a
                  href={`#${id}`}
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
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  Analyse d'une section : bandeau sombre ou section claire            */
/* ------------------------------------------------------------------ */

function isDark(s: Section): boolean {
  const types = s.blocks.map((b) => b.t);
  return (
    types.includes("stats") &&
    types.every((t) => ["stats", "p", "ul", "callout"].includes(t))
  );
}

/** Sépare le premier paragraphe (chapeau) du reste des blocs. */
function splitLead(blocks: Block[]): [string | null, Block[]] {
  if (blocks[0]?.t === "p" && blocks.length > 1)
    return [blocks[0].v, blocks.slice(1)];
  return [null, blocks];
}

/** Un encadré qui reprend le titre de sa section perd son titre. */
function dedupeTitles(s: Section): Block[] {
  return s.blocks.map((b) =>
    b.t === "callout" &&
    b.title?.trim().toLowerCase() === s.title.trim().toLowerCase()
      ? { ...b, title: undefined }
      : b,
  );
}

/* ------------------------------------------------------------------ */
/*  Corps de page : une section = une scène pleine largeur             */
/* ------------------------------------------------------------------ */

export function Article({
  sections,
  images,
  alt,
  kind,
}: {
  sections: Section[];
  images: string[];
  alt: string;
  kind: string;
}) {
  const hasGallery = sections.some((s) =>
    s.blocks.some((b) => b.t === "gallery"),
  );
  /** Une photo pleine largeur après la 2e section, si la page n'a pas de galerie. */
  const bandAfter = hasGallery || images.length === 0 ? -1 : 1;
  const size = kind === "article" ? "md" : "lg";

  return (
    <div>
      {sections.map((s, i) => {
        const id = s.id ?? anchorId(s.title, i);
        const blocks = dedupeTitles(s);
        const [lead, rest] = splitLead(blocks);
        const dark = isDark(s);

        const header = (
          <div
            className={`grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-16 ${
              dark ? "" : "border-t border-line pt-7"
            }`}
          >
            <SectionHeading
              id={`${id}-title`}
              title={s.title}
              tone={dark ? "dark" : "light"}
              size={size}
            />
            {lead && (
              <p
                className={`reveal max-w-lg text-[0.98rem] leading-[1.7] lg:pb-1 ${
                  dark ? "text-paper/70" : "text-muted"
                }`}
              >
                <Inline v={lead} tone={dark ? "dark" : "light"} />
              </p>
            )}
          </div>
        );

        return (
          <div key={id}>
            {dark ? (
              <section
                id={id}
                aria-labelledby={`${id}-title`}
                className="scroll-mt-28 px-[clamp(0.6rem,2vw,1.5rem)] py-3"
              >
                <div className="overflow-hidden rounded-[clamp(20px,3vw,40px)] bg-ink text-paper">
                  <div className="container-x py-12 lg:py-14">
                    {header}
                    <div className="mt-8 lg:mt-10">
                      <Blocks blocks={rest} tone="dark" />
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              <section
                id={id}
                aria-labelledby={`${id}-title`}
                className="container-x scroll-mt-28 py-10 lg:py-14"
              >
                {header}
                <div className="mt-8 lg:mt-10">
                  <Blocks blocks={rest} />
                </div>
              </section>
            )}
            {i === bandAfter && <Band src={images[0]} alt={alt} />}
          </div>
        );
      })}
    </div>
  );
}

function Band({ src, alt }: { src: string; alt: string }) {
  return (
    <figure className="reveal reveal-zoom container-x py-2">
      <div className="relative aspect-4/3 overflow-hidden rounded-[clamp(18px,2.4vw,28px)] sm:aspect-21/9">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
    </figure>
  );
}
