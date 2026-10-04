"use client";

import { useEffect, useMemo, useState } from "react";

import type { TocEntry } from "@/lib/whatswrong";

/** Partie en cours de lecture : le dernier H2 passé sous l'en-tête. */
function useActive(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(ids[0] ?? null);

  useEffect(() => {
    const onScroll = () => {
      let current = ids[0] ?? null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 160) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ids]);

  return active;
}

/**
 * Sommaire d'un article. `sidebar` : colonne collante sur grand écran ;
 * `inline` : bloc repliable avant le texte, sur mobile et tablette.
 */
export function ArticleToc({
  toc,
  variant,
}: {
  toc: TocEntry[];
  variant: "sidebar" | "inline";
}) {
  const ids = useMemo(() => toc.map((t) => t.id), [toc]);
  const active = useActive(ids);
  if (toc.length < 2) return null;

  const list = (
    <ol className="mt-3 space-y-0.5">
      {toc.map((t, i) => {
        const on = t.id === active;
        return (
          <li key={t.id}>
            <a
              href={`#${t.id}`}
              aria-current={on ? "location" : undefined}
              className={`group flex gap-3 border-l-2 py-2 pr-2 pl-3.5 text-[0.86rem] leading-snug transition-colors duration-300 ${
                on
                  ? "border-terra text-ink"
                  : "border-line text-ink/60 hover:border-ink/30 hover:text-ink"
              }`}
            >
              <span
                className={`display-italic w-5 shrink-0 text-[0.8rem] ${on ? "text-terra" : "text-muted"}`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1">{t.title}</span>
            </a>
          </li>
        );
      })}
    </ol>
  );

  if (variant === "inline")
    return (
      <details className="group rounded-2xl border border-line bg-paper px-5 py-4 lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
          <span className="dot-label text-muted">Sommaire</span>
          <span className="text-[0.8rem] text-muted">
            {toc.length} parties
            <span className="ml-2 inline-block transition-transform group-open:rotate-180">
              ▾
            </span>
          </span>
        </summary>
        {list}
      </details>
    );

  return (
    <nav aria-label="Sommaire">
      <p className="dot-label text-muted">Sommaire</p>
      {list}
    </nav>
  );
}
