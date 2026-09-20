"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { ArrowRight } from "@/components/ui/kit";
import { heroSlides, trustPoints } from "@/lib/site";

const DELAY = 7000;

export function Hero() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setI((v) => (v + 1) % heroSlides.length), DELAY);
    return () => clearTimeout(t);
  }, [i, paused]);

  const s = heroSlides[i];

  return (
    <section
      data-hero
      aria-label="Présentation"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink">
        {/* ---------- Visuels ---------- */}
        {heroSlides.map((slide, idx) => (
          <div
            key={slide.image}
            className={`absolute inset-0 -z-10 transition-opacity duration-[1400ms] ease-[cubic-bezier(.16,1,.3,1)] ${
              idx === i ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority={idx === 0}
              sizes="100vw"
              className={`object-cover object-center ${idx === i ? "anim-zoom" : ""}`}
            />
          </div>
        ))}

        {/* ---------- Voiles ---------- */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(10,8,6,0.82)_0%,rgba(10,8,6,0.5)_28%,rgba(10,8,6,0.18)_60%,rgba(10,8,6,0.52)_100%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(94deg,rgba(10,8,6,0.66)_0%,rgba(10,8,6,0.24)_46%,rgba(10,8,6,0.05)_75%)]"
        />

        {/* ---------- Bloc central ---------- */}
        <div className="container-x relative flex flex-1 items-center pt-28 pb-6 sm:pt-32">
          <div className="grid w-full gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-end lg:gap-16">
            {/* Colonne principale */}
            <div key={`title-${i}`}>
              <p
                className="dot-label anim-rise-sm text-paper/85"
                style={{ "--d": "0.05s" } as React.CSSProperties}
              >
                {s.eyebrow}
              </p>

              <h1 className="mt-5 max-w-[16ch] text-[clamp(1.95rem,5.4vw,4.3rem)] leading-[0.96] font-medium tracking-[-0.03em] text-balance text-paper sm:mt-6">
                <span
                  className="mask anim-unmask"
                  style={{ "--d": "0.12s" } as React.CSSProperties}
                >
                  <span className="block">{s.titleTop}</span>
                </span>
                <span
                  className="mask anim-unmask mt-1 block"
                  style={{ "--d": "0.24s" } as React.CSSProperties}
                >
                  <span className="display-italic block text-[0.98em] leading-[1.02] text-shell">
                    {s.titleBottom}
                  </span>
                </span>
              </h1>

              <div
                className="anim-rise mt-7 flex flex-wrap items-center gap-2.5 sm:mt-9 sm:gap-3"
                style={{ "--d": "0.46s" } as React.CSSProperties}
              >
                <Link
                  href={s.primary.href}
                  className="group inline-flex items-center gap-3 rounded-full bg-paper py-1.5 pr-1.5 pl-6 text-[0.9rem] font-medium text-ink shadow-[0_14px_40px_-16px_rgba(0,0,0,0.8)] transition-colors duration-500 hover:bg-terra hover:text-paper"
                >
                  {s.primary.label}
                  <span className="pill-arrow flex size-9 items-center justify-center rounded-full bg-terra text-paper transition-colors duration-500 group-hover:bg-paper group-hover:text-terra">
                    <ArrowRight />
                  </span>
                </Link>
                <Link
                  href={s.secondary.href}
                  className="group inline-flex items-center gap-2.5 rounded-full border border-paper/45 px-6 py-3 text-[0.9rem] font-medium text-paper backdrop-blur-[2px] transition-colors duration-500 hover:bg-paper hover:text-ink"
                >
                  {s.secondary.label}
                  <span className="pill-arrow">
                    <ArrowRight className="size-3" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Colonne d’appui — texte + compteur de diapositive */}
            <div
              key={`aside-${i}`}
              className="anim-rise border-paper/20 lg:border-l lg:pb-2 lg:pl-8"
              style={{ "--d": "0.36s" } as React.CSSProperties}
            >
              <p className="max-w-sm text-[0.88rem] leading-relaxed text-paper/85 [text-shadow:0_1px_14px_rgba(0,0,0,0.6)] sm:text-[0.94rem]">
                {s.text}
              </p>

              <div className="mt-7 flex items-center gap-5">
                <span className="display-italic text-[1.35rem] leading-none text-paper">
                  {String(i + 1).padStart(2, "0")}
                  <span className="text-paper/45">
                    {" "}
                    / {String(heroSlides.length).padStart(2, "0")}
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  {heroSlides.map((slide, idx) => (
                    <button
                      key={slide.eyebrow}
                      type="button"
                      onClick={() => setI(idx)}
                      aria-label={`Diapositive ${idx + 1} : ${slide.eyebrow}`}
                      aria-current={idx === i}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        idx === i
                          ? "w-8 bg-paper"
                          : "w-1.5 bg-paper/45 hover:bg-paper/80"
                      }`}
                    />
                  ))}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- Bandeau de réassurance ---------- */}
        <div
          className="container-x anim-fade relative pb-7 sm:pb-9"
          style={{ "--d": "0.72s" } as React.CSSProperties}
        >
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-paper/20 pt-4 sm:gap-x-7 sm:pt-5">
            {trustPoints.map((p) => (
              <li
                key={p}
                className="flex items-center gap-1.5 text-[0.73rem] text-paper/80 sm:text-[0.8rem]"
              >
                <svg
                  viewBox="0 0 14 14"
                  aria-hidden
                  className="size-3 text-terra"
                >
                  <path
                    d="M2 7.5l3.2 3.2L12 3.6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
