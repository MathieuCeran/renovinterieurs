import Image from "next/image";
import Link from "next/link";

import { ArrowRight } from "@/components/ui/kit";
import { parseInline, type Block } from "@/lib/content";

export type Tone = "light" | "dark";

/* ------------------------------------------------------------------ */
/*  Texte avec liens inline [texte](/url)                              */
/* ------------------------------------------------------------------ */

export function Inline({ v, tone = "light" }: { v: string; tone?: Tone }) {
  const cls =
    tone === "dark"
      ? "font-medium text-paper underline decoration-gold-light/60 decoration-[1.5px] underline-offset-[3px] transition-colors hover:text-gold-light"
      : "font-medium text-ink underline decoration-terra/50 decoration-[1.5px] underline-offset-[3px] transition-colors hover:text-terra hover:decoration-terra";
  return (
    <>
      {parseInline(v).map((seg, i) =>
        seg.href ? (
          seg.href.startsWith("/") || seg.href.startsWith("#") ? (
            <Link key={i} href={seg.href} className={cls}>
              {seg.text}
            </Link>
          ) : (
            <a
              key={i}
              href={seg.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cls}
            >
              {seg.text}
            </a>
          )
        ) : (
          <span key={i}>{seg.text}</span>
        ),
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Blocs texte                                                        */
/* ------------------------------------------------------------------ */

export function Paragraph({ v, tone = "light" }: { v: string; tone?: Tone }) {
  return (
    <p
      className={`mt-4 max-w-3xl text-[0.98rem] leading-[1.75] first:mt-0 ${
        tone === "dark" ? "text-paper/70" : "text-muted"
      }`}
    >
      <Inline v={v} tone={tone} />
    </p>
  );
}

function Check({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className={className}>
      <circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.14" />
      <path
        d="M4.8 8.3l2.1 2.1 4.3-4.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Liste → grille de points. « Libellé : détail » met le libellé en avant. */
function List({ items, tone = "light" }: { items: string[]; tone?: Tone }) {
  const dark = tone === "dark";
  const cols =
    items.length <= 2
      ? "sm:grid-cols-2"
      : items.length === 4
        ? "sm:grid-cols-2 xl:grid-cols-4"
        : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <ul className={`reveal-stagger grid gap-3 ${cols}`}>
      {items.map((it, j) => {
        const m = it.match(/^([^:]{2,40})\s:\s(.+)$/);
        return (
          <li
            key={j}
            style={{ "--i": j } as React.CSSProperties}
            className={`flex gap-4 rounded-[clamp(16px,2vw,22px)] p-5 ${
              dark ? "bg-paper/6" : "bg-paper"
            }`}
          >
            <Check className="mt-0.5 size-5 shrink-0 text-terra" />
            <span
              className={`text-[0.92rem] leading-relaxed ${
                dark ? "text-paper/70" : "text-muted"
              }`}
            >
              {m ? (
                <>
                  <span
                    className={`font-medium ${dark ? "text-paper" : "text-ink"}`}
                  >
                    {m[1]}
                  </span>
                  <span className="block mt-1">
                    <Inline v={m[2]} tone={tone} />
                  </span>
                </>
              ) : (
                <Inline v={it} tone={tone} />
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/** Suite de paragraphes → deux colonnes de lecture. */
function TextRun({ items, tone = "light" }: { items: string[]; tone?: Tone }) {
  const many = items.join(" ").length > 420;
  return (
    <div
      className={`reveal ${many ? "lg:columns-2 lg:gap-12" : "max-w-3xl"}`}
    >
      {items.map((v, i) => (
        <p
          key={i}
          className={`mb-4 break-inside-avoid text-[0.98rem] leading-[1.75] last:mb-0 ${
            tone === "dark" ? "text-paper/70" : "text-muted"
          }`}
        >
          <Inline v={v} tone={tone} />
        </p>
      ))}
    </div>
  );
}

/** Sous-titres → cartes : chaque h3 emporte les blocs qui le suivent. */
function TopicCards({
  groups,
  tone = "light",
}: {
  groups: { title: string; blocks: Block[] }[];
  tone?: Tone;
}) {
  const dark = tone === "dark";
  const cols =
    groups.length <= 2 || groups.length === 4
      ? "md:grid-cols-2"
      : "md:grid-cols-2 xl:grid-cols-3";
  return (
    <ul className={`reveal-stagger grid gap-4 ${cols}`}>
      {groups.map((g, i) => (
        <li
          key={g.title}
          style={{ "--i": i } as React.CSSProperties}
          className={`flex h-full flex-col rounded-[clamp(18px,2.4vw,28px)] p-7 ${
            dark ? "bg-paper/6" : "bg-paper"
          }`}
        >
          <span className="display-italic text-[1.6rem] leading-none text-terra">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3
            className={`mt-5 text-[1.12rem] leading-tight font-medium ${
              dark ? "text-paper" : "text-ink"
            }`}
          >
            {g.title}
          </h3>
          <div className="mt-3">
            {g.blocks.map((b, j) =>
              b.t === "p" ? (
                <p
                  key={j}
                  className={`mt-3 text-[0.9rem] leading-relaxed first:mt-0 ${
                    dark ? "text-paper/65" : "text-muted"
                  }`}
                >
                  <Inline v={b.v} tone={tone} />
                </p>
              ) : b.t === "ul" ? (
                <ul key={j} className="mt-3 space-y-2">
                  {b.items.map((it, k) => (
                    <li
                      key={k}
                      className={`flex gap-2.5 text-[0.88rem] leading-relaxed ${
                        dark ? "text-paper/65" : "text-muted"
                      }`}
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-terra" />
                      <span>
                        <Inline v={it} tone={tone} />
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null,
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/*  Chiffres clés : quatre tuiles, pensées pour le bandeau sombre      */
/* ------------------------------------------------------------------ */

function Stats({
  items,
  tone = "light",
}: {
  items: { value: string; label: string }[];
  tone?: Tone;
}) {
  const dark = tone === "dark";
  return (
    <dl
      className={`reveal-stagger grid gap-px overflow-hidden rounded-[clamp(18px,2.4vw,28px)] sm:grid-cols-2 lg:grid-cols-4 ${
        dark ? "bg-paper/12" : "bg-line"
      }`}
    >
      {items.map((s, i) => (
        <div
          key={s.label}
          style={{ "--i": i } as React.CSSProperties}
          className={`px-7 py-9 ${dark ? "bg-ink" : "bg-paper"}`}
        >
          <dd
            className={`display-italic text-[clamp(2.4rem,4vw,3.4rem)] leading-none ${
              dark ? "text-gold-light" : "text-terra"
            }`}
          >
            {s.value}
          </dd>
          <dt
            className={`mt-5 max-w-[16ch] text-[0.9rem] leading-snug ${
              dark ? "text-paper/65" : "text-muted"
            }`}
          >
            {s.label}
          </dt>
        </div>
      ))}
    </dl>
  );
}

/* ------------------------------------------------------------------ */
/*  Cartes : prestations, communes, facteurs                           */
/* ------------------------------------------------------------------ */

function Cards({
  items,
  tone = "light",
}: {
  items: { title: string; text: string; href?: string }[];
  tone?: Tone;
}) {
  const dark = tone === "dark";
  const cols =
    items.length === 4
      ? "sm:grid-cols-2 xl:grid-cols-4"
      : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <ul className={`reveal-stagger grid gap-4 ${cols}`}>
      {items.map((c, i) => {
        const inner = (
          <>
            <span
              className={`dot-label text-[0.72rem] ${dark ? "text-paper/50" : "text-muted"}`}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3
              className={`mt-5 text-[1.12rem] leading-tight font-medium ${
                dark ? "text-paper" : "text-ink"
              }`}
            >
              {c.title}
            </h3>
            <p
              className={`mt-3 flex-1 text-[0.9rem] leading-relaxed ${
                dark ? "text-paper/65" : "text-muted"
              }`}
            >
              <Inline v={c.text} tone={tone} />
            </p>
            {c.href && (
              <span className="pill-arrow mt-6 inline-flex items-center gap-2 text-[0.84rem] font-medium text-terra">
                Découvrir <ArrowRight className="size-3" />
              </span>
            )}
          </>
        );
        const cls = `flex h-full flex-col rounded-[clamp(18px,2.4vw,28px)] p-7 transition-[transform,background-color,color] duration-600 ease-[cubic-bezier(.16,1,.3,1)] ${
          dark
            ? "bg-paper/6 hover:bg-paper/10"
            : "bg-paper hover:-translate-y-1.5"
        }`;
        return (
          <li key={c.title} style={{ "--i": i } as React.CSSProperties}>
            {c.href ? (
              <Link href={c.href} className={`group ${cls}`}>
                {inner}
              </Link>
            ) : (
              <div className={cls}>{inner}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/*  Tableau : prix, comparatifs                                        */
/* ------------------------------------------------------------------ */

function Table({
  head,
  rows,
  note,
}: {
  head: string[];
  rows: string[][];
  note?: string;
}) {
  return (
    <figure className="reveal">
      <div className="overflow-x-auto rounded-[clamp(18px,2.4vw,28px)] bg-paper">
        <table className="w-full min-w-[560px] border-collapse text-[0.95rem]">
          <thead>
            <tr>
              {head.map((h, i) => (
                <th
                  key={i}
                  scope="col"
                  className={`border-b border-line px-6 py-5 text-left text-[0.72rem] font-semibold tracking-[0.12em] text-muted uppercase ${
                    i > 0 ? "whitespace-nowrap" : ""
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={i}
                className="border-b border-line transition-colors last:border-0 hover:bg-shell/60"
              >
                {r.map((c, j) => (
                  <td
                    key={j}
                    className={`px-6 py-5 align-top leading-snug ${
                      j === 0
                        ? "font-medium text-ink"
                        : j === 1
                          ? "display-italic text-[1.15rem] whitespace-nowrap text-terra"
                          : "text-muted"
                    }`}
                  >
                    <Inline v={c} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note && (
        <figcaption className="mt-3 flex max-w-3xl items-start gap-3 text-[0.82rem] leading-relaxed text-muted">
          <svg
            viewBox="0 0 16 16"
            aria-hidden
            className="mt-0.5 size-4 shrink-0 text-terra"
          >
            <circle
              cx="8"
              cy="8"
              r="6.6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
            />
            <path
              d="M8 7v4.5M8 4.8v.4"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
          <span>
            <Inline v={note} />
          </span>
        </figcaption>
      )}
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/*  Encadrés : seul (pleine largeur) ou en grille (signatures)         */
/* ------------------------------------------------------------------ */

type CalloutData = { title?: string; v: string; href?: string; label?: string };

function CalloutCard({
  c,
  index,
  tone = "light",
}: {
  c: CalloutData;
  index?: number;
  tone?: Tone;
}) {
  const dark = tone === "dark";
  return (
    <div
      className={`flex h-full flex-col rounded-[clamp(18px,2.4vw,28px)] p-7 lg:p-8 ${
        dark ? "bg-paper/6" : "border border-line bg-paper"
      }`}
    >
      {index !== undefined && (
        <span className="display-italic text-[1.9rem] leading-none text-terra">
          {String(index + 1).padStart(2, "0")}
        </span>
      )}
      {c.title && (
        <p
          className={`text-[1.15rem] leading-snug font-medium ${
            index !== undefined ? "mt-6" : ""
          } ${dark ? "text-paper" : "text-ink"}`}
        >
          {c.title}
        </p>
      )}
      <p
        className={`mt-3 flex-1 text-[0.92rem] leading-relaxed ${
          dark ? "text-paper/65" : "text-muted"
        }`}
      >
        <Inline v={c.v} tone={tone} />
      </p>
      {c.href && (
        <Link
          href={c.href}
          className="group mt-6 inline-flex items-center gap-2 text-[0.86rem] font-medium text-terra"
        >
          {c.label ?? "En savoir plus"}
          <span className="pill-arrow">
            <ArrowRight className="size-3" />
          </span>
        </Link>
      )}
    </div>
  );
}

function Callout({ c, tone = "light" }: { c: CalloutData; tone?: Tone }) {
  const dark = tone === "dark";
  return (
    <aside
      className={`reveal grid gap-6 rounded-[clamp(18px,2.4vw,28px)] p-7 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-10 lg:p-9 ${
        dark ? "bg-paper/6" : "bg-clay text-paper"
      }`}
    >
      <span
        aria-hidden
        className="hidden h-px w-14 bg-gold-light lg:block"
      />
      <div>
        {c.title && (
          <p className="text-[1.25rem] leading-snug font-medium text-paper">
            {c.title}
          </p>
        )}
        <p
          className={`text-[0.95rem] leading-relaxed text-paper/75 ${c.title ? "mt-2" : ""}`}
        >
          <Inline v={c.v} tone="dark" />
        </p>
      </div>
      {c.href && (
        <Link
          href={c.href}
          className="group inline-flex w-fit items-center gap-3 rounded-full bg-paper py-1.5 pr-1.5 pl-6 text-[0.88rem] font-medium text-ink transition-colors duration-500 hover:bg-terra hover:text-paper"
        >
          {c.label ?? "En savoir plus"}
          <span className="pill-arrow flex size-9 items-center justify-center rounded-full bg-terra text-paper transition-colors duration-500 group-hover:bg-paper group-hover:text-terra">
            <ArrowRight />
          </span>
        </Link>
      )}
    </aside>
  );
}

export function CalloutGrid({
  items,
  tone = "light",
}: {
  items: CalloutData[];
  tone?: Tone;
}) {
  const cols =
    items.length === 2 ? "md:grid-cols-2" : "md:grid-cols-2 xl:grid-cols-3";
  return (
    <ul className={`reveal-stagger grid gap-4 ${cols}`}>
      {items.map((c, i) => (
        <li key={c.title ?? i} style={{ "--i": i } as React.CSSProperties}>
          <CalloutCard c={c} index={i} tone={tone} />
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/*  Étapes                                                             */
/* ------------------------------------------------------------------ */

function Steps({ items }: { items: { title: string; text: string }[] }) {
  const cols =
    items.length >= 5
      ? "md:grid-cols-3 lg:grid-cols-5"
      : items.length === 4
        ? "md:grid-cols-2 lg:grid-cols-4"
        : "md:grid-cols-3";
  return (
    <ol
      className={`reveal-stagger grid gap-px overflow-hidden rounded-[clamp(18px,2.4vw,28px)] bg-line ${cols}`}
    >
      {items.map((s, i) => (
        <li
          key={s.title}
          style={{ "--i": i } as React.CSSProperties}
          className="group flex flex-col bg-paper p-7 transition-colors duration-500 hover:bg-ink hover:text-paper"
        >
          <span className="display-italic text-[1.9rem] leading-none text-terra">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-6 text-[1.08rem] leading-tight font-medium">
            {s.title}
          </h3>
          <p className="mt-3 text-[0.86rem] leading-relaxed text-muted transition-colors duration-500 group-hover:text-paper/65">
            <Inline v={s.text} />
          </p>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/*  FAQ : accordéon natif                                              */
/* ------------------------------------------------------------------ */

function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="reveal divide-y divide-line border-y border-line">
      {items.map((f, i) => (
        <details key={f.q} className="group" open={i === 0}>
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-[clamp(1.02rem,1.7vw,1.22rem)] leading-snug font-medium text-ink transition-colors hover:text-terra group-open:text-terra [&::-webkit-details-marker]:hidden">
            {f.q}
            <span className="relative mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-line text-ink transition-colors group-open:border-terra group-open:bg-terra group-open:text-paper">
              <span className="absolute h-px w-3 bg-current" />
              <span className="absolute h-px w-3 rotate-90 bg-current transition-transform group-open:rotate-0" />
            </span>
          </summary>
          <p className="max-w-3xl pb-7 text-[0.95rem] leading-relaxed text-muted">
            <Inline v={f.a} />
          </p>
        </details>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Galerie : trois réalisations légendées                             */
/* ------------------------------------------------------------------ */

function Gallery({
  items,
}: {
  items: { src: string; alt: string; caption: string }[];
}) {
  return (
    <ul className="reveal-stagger grid gap-4 sm:grid-cols-3">
      {items.map((g, i) => (
        <li key={g.src + g.caption} style={{ "--i": i } as React.CSSProperties}>
          <figure className="group">
            <div className="relative aspect-4/5 overflow-hidden rounded-[clamp(18px,2.4vw,28px)]">
              <Image
                src={g.src}
                alt={g.alt}
                fill
                sizes="(min-width: 1024px) 420px, (min-width: 640px) 33vw, 100vw"
                className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
              />
            </div>
            <figcaption className="mt-4 flex gap-3 text-[0.88rem] leading-snug text-muted">
              <span className="display-italic shrink-0 text-terra">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{g.caption}</span>
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/*  Liens de maillage : cartes « pour aller plus loin »                */
/* ------------------------------------------------------------------ */

export function Links({
  items,
}: {
  items: { label: string; href: string; desc?: string }[];
}) {
  const cols =
    items.length <= 2
      ? "md:grid-cols-2"
      : items.length === 4
        ? "md:grid-cols-2 xl:grid-cols-4"
        : "md:grid-cols-2 xl:grid-cols-3";
  return (
    <ul className={`reveal-stagger grid gap-4 ${cols}`}>
      {items.map((l, i) => (
        <li key={l.href + l.label} style={{ "--i": i } as React.CSSProperties}>
          <Link
            href={l.href}
            className="group flex h-full items-start justify-between gap-5 rounded-[clamp(18px,2.4vw,28px)] border border-line bg-paper p-6 transition-colors duration-500 hover:border-ink hover:bg-ink hover:text-paper"
          >
            <span>
              <span className="block text-[1.02rem] leading-snug font-medium">
                {l.label}
              </span>
              {l.desc && (
                <span className="mt-2 block text-[0.86rem] leading-relaxed text-muted transition-colors duration-500 group-hover:text-paper/65">
                  {l.desc}
                </span>
              )}
            </span>
            <span className="pill-arrow flex size-9 shrink-0 items-center justify-center rounded-full bg-terra text-paper">
              <ArrowRight className="size-3.5" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/*  Composition : les blocs bruts deviennent des scènes                */
/* ------------------------------------------------------------------ */

type Group =
  | { k: "text"; items: string[] }
  | { k: "list"; items: string[] }
  | { k: "topics"; groups: { title: string; blocks: Block[] }[] }
  | { k: "callouts"; items: CalloutData[] }
  | { k: "block"; block: Block };

function compose(blocks: Block[]): Group[] {
  const out: Group[] = [];
  let i = 0;
  while (i < blocks.length) {
    const b = blocks[i];
    if (b.t === "h3") {
      const groups: { title: string; blocks: Block[] }[] = [];
      while (i < blocks.length && blocks[i].t === "h3") {
        const title = (blocks[i] as { v: string }).v;
        i++;
        const inner: Block[] = [];
        while (i < blocks.length && (blocks[i].t === "p" || blocks[i].t === "ul")) {
          inner.push(blocks[i]);
          i++;
        }
        groups.push({ title, blocks: inner });
      }
      out.push({ k: "topics", groups });
      continue;
    }
    if (b.t === "p") {
      const items: string[] = [];
      while (i < blocks.length && blocks[i].t === "p") {
        items.push((blocks[i] as { v: string }).v);
        i++;
      }
      out.push({ k: "text", items });
      continue;
    }
    if (b.t === "callout") {
      const items: CalloutData[] = [];
      while (i < blocks.length && blocks[i].t === "callout") {
        items.push(blocks[i] as CalloutData);
        i++;
      }
      out.push({ k: "callouts", items });
      continue;
    }
    if (b.t === "ul") {
      out.push({ k: "list", items: b.items });
      i++;
      continue;
    }
    out.push({ k: "block", block: b });
    i++;
  }
  return out;
}

export function Blocks({
  blocks,
  tone = "light",
}: {
  blocks: Block[];
  tone?: Tone;
}) {
  return (
    <div className="space-y-8 lg:space-y-10">
      {compose(blocks).map((g, i) => {
        switch (g.k) {
          case "text":
            return <TextRun key={i} items={g.items} tone={tone} />;
          case "list":
            return <List key={i} items={g.items} tone={tone} />;
          case "topics":
            return <TopicCards key={i} groups={g.groups} tone={tone} />;
          case "callouts":
            return g.items.length >= 2 ? (
              <CalloutGrid key={i} items={g.items} tone={tone} />
            ) : (
              <Callout key={i} c={g.items[0]} tone={tone} />
            );
          default: {
            const b = g.block;
            switch (b.t) {
              case "stats":
                return <Stats key={i} items={b.items} tone={tone} />;
              case "cards":
                return <Cards key={i} items={b.items} tone={tone} />;
              case "table":
                return (
                  <Table key={i} head={b.head} rows={b.rows} note={b.note} />
                );
              case "steps":
                return <Steps key={i} items={b.items} />;
              case "faq":
                return <Faq key={i} items={b.items} />;
              case "gallery":
                return <Gallery key={i} items={b.items} />;
              case "links":
                return <Links key={i} items={b.items} />;
              default:
                return null;
            }
          }
        }
      })}
    </div>
  );
}
