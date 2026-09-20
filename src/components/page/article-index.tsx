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
  image: string;
};

export function ArticleIndex({ articles }: { articles: Article[] }) {
  const cats = useMemo(
    () => ["Tout", ...Array.from(new Set(articles.map((a) => a.cat))).sort()],
    [articles],
  );
  const [active, setActive] = useState("Tout");

  const shown =
    active === "Tout" ? articles : articles.filter((a) => a.cat === active);
  const [lead, ...rest] = shown;

  return (
    <div className="container-x">
      {/* Filtres */}
      <div className="border-t border-line pt-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="dot-label text-muted">Thèmes</p>
          <span className="display-italic text-[0.95rem] text-muted">
            {shown.length} guide{shown.length > 1 ? "s" : ""}
          </span>
        </div>
        <ul className="mt-5 flex flex-wrap gap-2">
          {cats.map((c) => (
            <li key={c}>
              <button
                type="button"
                onClick={() => setActive(c)}
                aria-pressed={active === c}
                className={`rounded-full border px-4 py-2 text-[0.84rem] transition-colors duration-400 ${
                  active === c
                    ? "border-terra bg-terra text-paper"
                    : "border-line text-ink/75 hover:border-ink"
                }`}
              >
                {c}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Article mis en avant */}
      {lead && (
        <Link href={lead.href} className="group mt-10 block">
          <article className="grid gap-7 overflow-hidden rounded-[clamp(18px,2.4vw,28px)] border border-line bg-paper md:grid-cols-[1.1fr_1fr] md:gap-0">
            <div className="relative aspect-16/10 overflow-hidden md:aspect-auto md:min-h-72">
              <Image
                src={lead.image}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-[1300ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-106"
              />
            </div>
            <div className="flex flex-col justify-center p-7 pt-0 md:p-10">
              <p className="dot-label text-[0.76rem] text-terra">{lead.cat}</p>
              <h2 className="mt-3 text-[clamp(1.35rem,2.4vw,1.85rem)] leading-tight font-medium tracking-[-0.01em] text-balance transition-colors duration-400 group-hover:text-terra">
                {lead.title}
              </h2>
              <p className="mt-3 line-clamp-3 text-[0.92rem] leading-relaxed text-muted">
                {lead.excerpt}
              </p>
              <span className="mt-6 inline-flex items-center gap-2.5 text-[0.84rem] font-medium">
                Lire le guide
                <span className="pill-arrow">
                  <ArrowRight className="size-3" />
                </span>
                <span className="ml-2 text-muted">· {lead.readMin} min</span>
              </span>
            </div>
          </article>
        </Link>
      )}

      {/* Grille */}
      <ul className="reveal-stagger mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((a, i) => (
          <li key={a.href} style={{ "--i": i % 3 } as React.CSSProperties}>
            <Link href={a.href} className="group flex h-full flex-col">
              <div className="relative aspect-16/10 overflow-hidden rounded-[clamp(16px,2vw,24px)]">
                <Image
                  src={a.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[1300ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-107"
                />
              </div>
              <p className="dot-label mt-3.5 text-[0.74rem] text-muted">
                {a.cat} · {a.readMin} min
              </p>
              <h3 className="mt-1.5 text-[1.02rem] leading-snug font-medium text-balance transition-colors duration-400 group-hover:text-terra">
                {a.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-[0.86rem] leading-relaxed text-muted">
                {a.excerpt}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
