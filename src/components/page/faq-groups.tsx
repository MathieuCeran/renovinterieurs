"use client";

import { useState } from "react";

export type FaqGroup = { theme: string; items: { q: string; a: string }[] };

/** Accordéons groupés par thème, un seul panneau ouvert à la fois. */
export function FaqGroups({ groups }: { groups: FaqGroup[] }) {
  const [open, setOpen] = useState<string | null>("0-0");

  return (
    <div className="container-x">
      {groups.map((g, gi) => (
        <section
          key={g.theme}
          id={`theme-${gi + 1}`}
          aria-labelledby={`theme-${gi + 1}-title`}
          className="scroll-mt-28 py-10 lg:py-14"
        >
          <div className="grid gap-6 border-t border-line pt-9 lg:grid-cols-[minmax(0,240px)_1fr] lg:gap-16">
            <div className="reveal-sm lg:sticky lg:top-28 lg:self-start">
              <span className="display-italic text-[1.5rem] leading-none text-terra">
                {String(gi + 1).padStart(2, "0")}
              </span>
              <h2
                id={`theme-${gi + 1}-title`}
                className="mt-4 text-[1.28rem] leading-tight font-medium tracking-[-0.01em] text-balance"
              >
                {g.theme}
              </h2>
              <p className="mt-2 text-[0.82rem] text-muted">
                {g.items.length} question{g.items.length > 1 ? "s" : ""}
              </p>
            </div>

            <div className="reveal max-w-3xl">
              {g.items.map((item, i) => {
                const key = `${gi}-${i}`;
                const isOpen = open === key;
                return (
                  <div
                    key={key}
                    className="border-b border-line first:border-t"
                  >
                    <h3>
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? null : key)}
                        aria-expanded={isOpen}
                        aria-controls={`panel-${key}`}
                        className="group flex w-full items-start justify-between gap-6 py-5 text-left"
                      >
                        <span
                          className={`text-[clamp(1rem,1.6vw,1.15rem)] leading-snug font-medium transition-colors duration-400 ${
                            isOpen ? "text-terra" : "group-hover:text-terra"
                          }`}
                        >
                          {item.q}
                        </span>
                        <span
                          className={`relative mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-400 ${
                            isOpen
                              ? "border-terra bg-terra text-paper"
                              : "border-line text-ink group-hover:border-ink"
                          }`}
                        >
                          <span className="absolute h-px w-3 bg-current" />
                          <span
                            className={`absolute h-px w-3 bg-current transition-all duration-400 ${
                              isOpen
                                ? "rotate-0 opacity-0"
                                : "rotate-90 opacity-100"
                            }`}
                          />
                        </span>
                      </button>
                    </h3>

                    <div
                      id={`panel-${key}`}
                      className="collapsible"
                      data-open={isOpen}
                    >
                      <div>
                        <p className="pr-10 pb-6 text-[0.94rem] leading-relaxed text-muted">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
