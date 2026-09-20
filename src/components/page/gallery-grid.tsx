"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

export type Work = {
  src: string;
  alt: string;
  cat: string;
};

export function GalleryGrid({ works }: { works: Work[] }) {
  const cats = useMemo(
    () => ["Tout", ...Array.from(new Set(works.map((w) => w.cat)))],
    [works],
  );
  const [active, setActive] = useState("Tout");

  const shown =
    active === "Tout" ? works : works.filter((w) => w.cat === active);

  return (
    <div className="container-x">
      {/* Filtres */}
      <div className="border-t border-line pt-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="dot-label text-muted">Filtrer</p>
          <span className="display-italic text-[0.95rem] text-muted">
            {shown.length} réalisation{shown.length > 1 ? "s" : ""}
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

      {/* Grille */}
      <ul className="reveal-stagger mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((w, i) => (
          <li key={w.src} style={{ "--i": i % 3 } as React.CSSProperties}>
            <figure className="group">
              <div className="relative aspect-4/3 overflow-hidden rounded-[clamp(16px,2vw,24px)]">
                <Image
                  src={w.src}
                  alt={w.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[1300ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-107"
                />
              </div>
              <figcaption>
                <p className="dot-label mt-3.5 text-[0.76rem] text-muted">
                  {w.cat}
                </p>
                <p className="mt-1.5 text-[1rem] leading-snug font-medium">
                  {w.alt}
                </p>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}
