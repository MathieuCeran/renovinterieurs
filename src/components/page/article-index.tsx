"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { ArrowRight } from "@/components/ui/kit";

export type Article = {
  href: string;
  title: string;
  excerpt: string;
  cat: string;
  readMin: number;
  /** Date de publication ISO (AAAA-MM-JJ…), pour le tri et l'affichage. */
  date: string;
  /** null : article WhatsWrong livré sans image, aucun visuel inventé. */
  image: string | null;
};

const PAGE = 9;

const fmt = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Paris",
});

function Meta({ a, tone = "muted" }: { a: Article; tone?: "muted" | "dark" }) {
  return (
    <p
      className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.76rem] ${
        tone === "dark" ? "text-paper/65" : "text-muted"
      }`}
    >
      <span className="font-medium text-terra">{a.cat}</span>
      <span aria-hidden>·</span>
      <time dateTime={a.date.slice(0, 10)}>{fmt.format(new Date(a.date))}</time>
      <span aria-hidden>·</span>
      <span>{a.readMin} min</span>
    </p>
  );
}

/** Visuel d'une carte ; sans image fournie, un aplat au nom du thème. */
function Visual({
  a,
  sizes,
  className,
}: {
  a: Article;
  sizes: string;
  className: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-ink ${className}`}>
      {a.image ? (
        <Image
          src={a.image}
          alt=""
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-[1300ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105"
        />
      ) : (
        <span className="display-italic absolute inset-0 flex items-center justify-center bg-[radial-gradient(80%_100%_at_80%_0%,rgba(230,86,43,0.25),transparent_60%)] px-6 text-center text-[1.3rem] text-paper/80">
          {a.cat}
        </span>
      )}
    </div>
  );
}

function Card({ a }: { a: Article }) {
  return (
    <Link href={a.href} className="group flex h-full flex-col">
      <Visual
        a={a}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="aspect-16/10 rounded-[clamp(16px,2vw,22px)]"
      />
      <div className="mt-4 flex flex-1 flex-col">
        <Meta a={a} />
        <h3 className="mt-2 line-clamp-3 text-[1.08rem] leading-snug font-medium text-balance transition-colors duration-300 group-hover:text-terra">
          {a.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-[0.88rem] leading-relaxed text-muted">
          {a.excerpt}
        </p>
        <span className="mt-auto inline-flex items-center gap-2 pt-4 text-[0.84rem] font-medium">
          Lire l’article
          <ArrowRight className="size-3 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

/** Index du blog : à la une (3 derniers), puis tous les articles filtrables. */
export function ArticleIndex({ articles }: { articles: Article[] }) {
  const sorted = useMemo(
    () => [...articles].sort((x, y) => y.date.localeCompare(x.date)),
    [articles],
  );
  const counts = useMemo(() => {
    const c = new Map<string, number>();
    for (const a of sorted) c.set(a.cat, (c.get(a.cat) ?? 0) + 1);
    return [...c.entries()].sort((x, y) => y[1] - x[1]);
  }, [sorted]);

  const [active, setActive] = useState("Tout");
  const [limit, setLimit] = useState(PAGE);

  const all = active === "Tout";
  const [lead, ...side] = sorted.slice(0, 3);
  // « À la une » n'apparaît que sans filtre ; la grille reprend la suite.
  const pool = all ? sorted.slice(3) : sorted.filter((a) => a.cat === active);
  const shown = pool.slice(0, limit);

  const pick = (c: string) => {
    setActive(c);
    setLimit(PAGE);
  };

  return (
    <div className="container-x">
      {/* À la une */}
      {all && lead && (
        <section aria-labelledby="une-title">
          <h2 id="une-title" className="dot-label text-muted">
            Derniers articles
          </h2>
          <div className="mt-5 grid gap-5 lg:grid-cols-[1.55fr_1fr]">
            <Link
              href={lead.href}
              className="group flex flex-col overflow-hidden rounded-[clamp(18px,2.4vw,28px)] bg-ink text-paper"
            >
              <Visual
                a={lead}
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="aspect-16/9"
              />
              <div className="flex flex-1 flex-col p-7 lg:p-9">
                <Meta a={lead} tone="dark" />
                <p className="mt-3 text-[clamp(1.4rem,2.6vw,2rem)] leading-[1.12] font-medium tracking-[-0.02em] text-balance">
                  {lead.title}
                </p>
                <p className="mt-3 line-clamp-2 max-w-2xl text-[0.93rem] leading-relaxed text-paper/65">
                  {lead.excerpt}
                </p>
                <span className="mt-6 inline-flex items-center gap-3 self-start rounded-full bg-terra py-1.5 pr-1.5 pl-5 text-[0.86rem] font-medium transition-colors group-hover:bg-terra-deep">
                  Lire l’article
                  <span className="flex size-7 items-center justify-center rounded-full bg-paper text-ink">
                    <ArrowRight className="size-3" />
                  </span>
                </span>
              </div>
            </Link>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-2">
              {side.map((a) => (
                <Link
                  key={a.href}
                  href={a.href}
                  className="group flex flex-col overflow-hidden rounded-[clamp(16px,2vw,22px)] border border-line bg-paper"
                >
                  <Visual
                    a={a}
                    sizes="(max-width: 1024px) 50vw, 35vw"
                    className="aspect-16/9 lg:aspect-auto lg:min-h-36 lg:flex-1"
                  />
                  <div className="p-5">
                    <Meta a={a} />
                    <p className="mt-2 line-clamp-2 text-[1.02rem] leading-snug font-medium transition-colors duration-300 group-hover:text-terra">
                      {a.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tous les articles */}
      <section aria-labelledby="tous-title" className={all ? "mt-16 lg:mt-20" : ""}>
        <div className="flex flex-wrap items-end justify-between gap-4 border-t border-line pt-7">
          <h2
            id="tous-title"
            className="text-[clamp(1.5rem,2.6vw,2rem)] leading-tight font-medium tracking-[-0.02em]"
          >
            {all ? "Plus d’articles" : active}
          </h2>
          <span className="display-italic text-[0.95rem] text-muted">
            {pool.length} article{pool.length > 1 ? "s" : ""}
          </span>
        </div>

        <div className="-mx-4 mt-5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          <ul className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
            {[["Tout", sorted.length] as const, ...counts].map(([c, n]) => (
              <li key={c}>
                <button
                  type="button"
                  onClick={() => pick(c)}
                  aria-pressed={active === c}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[0.84rem] whitespace-nowrap transition-colors duration-300 ${
                    active === c
                      ? "border-ink bg-ink text-paper"
                      : "border-line bg-paper text-ink/75 hover:border-ink/40"
                  }`}
                >
                  {c}
                  <span
                    className={`text-[0.74rem] ${active === c ? "text-paper/60" : "text-muted"}`}
                  >
                    {n}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <ul className="mt-9 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((a) => (
            <li key={a.href}>
              <Card a={a} />
            </li>
          ))}
        </ul>

        {pool.length > limit && (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => setLimit((l) => l + PAGE)}
              className="rounded-full border border-ink px-6 py-3 text-[0.88rem] font-medium transition-colors hover:bg-ink hover:text-paper"
            >
              Voir plus d’articles ({pool.length - limit})
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
