"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { ArrowRight, PhoneIcon } from "@/components/ui/kit";
import { nav, site } from "@/lib/site";

/**
 * Deux états : au-dessus du visuel du héros (voile sombre, texte clair)
 * puis barre claire. Le basculement est observé par IntersectionObserver
 * (pas d’écoute de scroll) et porté par l’attribut `data-solid` ; toutes
 * les couleurs sont dans `globals.css`.
 *
 * Le logo reste dans une pastille blanche dans les deux états : il est
 * donc lisible même si le basculement n’a pas lieu.
 */
export function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [services, setServices] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("[data-hero]");
    if (!hero) return;
    const io = new IntersectionObserver(
      ([entry]) => setSolid(!entry.isIntersecting),
      { rootMargin: "-110px 0px 0px 0px", threshold: 0 },
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const megaItems = nav[0].children;

  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setServices(true);
  };
  const closeMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setServices(false), 140);
  };

  const linkClass =
    "hdr-link group relative py-1.5 text-[0.82rem] font-medium tracking-[0.02em]";

  return (
    <>
      <header
        className="site-header fixed inset-x-0 top-0 z-50"
        data-solid={solid}
      >
        {/* Dégradé sombre permanent, estompé vers le bas */}
        <div aria-hidden className="hdr-skin" />

        <div className="container-x relative flex h-full items-center justify-between gap-6">
          {/* --- Logo --- */}
          <Link
            href="/"
            aria-label="RenovIntérieur — accueil"
            className="hdr-logo flex shrink-0 items-center gap-2.5"
          >
            <Image
              src="/brand/monogram.png"
              alt=""
              width={300}
              height={300}
              priority
              className="size-8"
            />
            <span className="text-[0.9rem] leading-none font-semibold tracking-[0.16em] uppercase">
              Renov<span className="font-normal opacity-70">intérieur</span>
            </span>
          </Link>

          {/* --- Navigation --- */}
          <nav
            aria-label="Navigation principale"
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex"
          >
            <button
              type="button"
              onMouseEnter={openMega}
              onFocus={openMega}
              onClick={() => setServices((v) => !v)}
              aria-expanded={services}
              className={`${linkClass} flex items-center gap-1.5`}
            >
              {nav[0].label}
              <svg
                viewBox="0 0 10 6"
                aria-hidden
                className={`size-2 opacity-70 transition-transform duration-400 ${
                  services ? "rotate-180" : ""
                }`}
              >
                <path
                  d="M1 1l4 4 4-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-x-100" />
            </button>

            {nav.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={closeMega}
                className={linkClass}
              >
                {item.label}
                <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>

          {/* --- Actions --- */}
          <div className="flex shrink-0 items-center gap-4">
            <a
              href={site.phoneHref}
              className="hdr-link hidden items-center gap-2 text-[0.84rem] font-medium xl:flex"
            >
              <PhoneIcon className="size-3.5" />
              {site.phoneDisplay}
            </a>

            <Link
              href="#devis"
              className="hdr-cta group hidden items-center gap-2.5 rounded-full py-[7px] pr-[7px] pl-5 text-[0.82rem] font-medium sm:inline-flex"
            >
              Devis 48 h
              <span className="hdr-cta-badge pill-arrow flex size-7 items-center justify-center rounded-full">
                <ArrowRight className="size-3" />
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Ouvrir le menu"
              className="hdr-burger flex size-9 flex-col items-center justify-center gap-[5px] lg:hidden"
            >
              <span className="block h-px w-5 bg-current" />
              <span className="block h-px w-5 bg-current" />
            </button>
          </div>
        </div>

        {/* --- Méga-menu : panneau pleine largeur --- */}
        <div
          className={`collapsible absolute inset-x-0 top-full hidden border-line bg-shell/95 backdrop-blur-2xl lg:block ${
            services ? "border-b" : "pointer-events-none"
          }`}
          data-open={services}
          inert={!services}
          onMouseEnter={openMega}
          onMouseLeave={closeMega}
        >
          <div>
            <div className="container-x grid grid-cols-[1fr_260px] gap-10 py-9">
              <ul className="grid grid-cols-2 gap-x-10 gap-y-0.5 self-start">
                {megaItems.map((child) => (
                  <li key={child.href}>
                    <Link
                      href={child.href}
                      onClick={() => setServices(false)}
                      className="group flex items-baseline gap-3 border-b border-line/70 py-3 transition-colors last:border-0"
                    >
                      <span className="h-px w-3 shrink-0 translate-y-[-0.3em] bg-terra transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:w-6" />
                      <span className="flex-1">
                        <span className="block text-[0.98rem] font-medium text-ink transition-colors group-hover:text-terra">
                          {child.label}
                        </span>
                        <span className="mt-0.5 block text-[0.78rem] text-muted">
                          {child.desc}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <Link
                href="#devis"
                onClick={() => setServices(false)}
                className="group relative overflow-hidden rounded-2xl"
              >
                <Image
                  src="/images/paris-cuisine-sur-mesure.jpg"
                  alt="Cuisine sur-mesure réalisée à Paris"
                  width={640}
                  height={480}
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-paper">
                  <p className="dot-label text-[0.7rem] text-paper/70">
                    Devis sous 48 h
                  </p>
                  <p className="mt-1.5 text-[1.05rem] leading-tight font-medium">
                    Visite technique sous 5 jours
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* --- Menu mobile --- */}
      <div
        className={`fixed inset-0 z-60 bg-shell transition-transform duration-600 ease-[cubic-bezier(.16,1,.3,1)] lg:hidden ${
          open ? "translate-y-0" : "pointer-events-none -translate-y-full"
        }`}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="flex h-full flex-col">
          <div className="container-x flex h-[62px] shrink-0 items-center justify-between">
            <span className="text-[0.92rem] font-semibold tracking-[0.16em] uppercase">
              Renov<span className="font-normal opacity-60">intérieur</span>
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer le menu"
              className="flex size-9 items-center justify-center text-ink"
            >
              <svg viewBox="0 0 16 16" aria-hidden className="size-4">
                <path
                  d="M2 2l12 12M14 2L2 14"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
              </svg>
            </button>
          </div>

          <nav className="container-x flex-1 overflow-y-auto py-4">
            <ul>
              {[
                { label: "Accueil", href: "/" },
                ...megaItems.map((m) => ({ label: m.label, href: m.href })),
                ...nav.slice(1).map((n) => ({ label: n.label, href: n.href })),
              ].map((item, i) => (
                <li key={`${item.href}-${i}`}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline justify-between border-b border-line py-3.5"
                  >
                    <span className="text-[1.4rem] font-light tracking-[-0.01em]">
                      {item.label}
                    </span>
                    <span className="text-[0.68rem] text-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="container-x shrink-0 space-y-2.5 border-t border-line py-5">
            <Link
              href="#devis"
              onClick={() => setOpen(false)}
              className="block rounded-full bg-terra py-3.5 text-center text-[0.9rem] font-medium text-paper"
            >
              Obtenir un devis gratuit
            </Link>
            <a
              href={site.phoneHref}
              className="flex items-center justify-center gap-2 rounded-full border border-ink/20 py-3.5 text-[0.9rem] font-medium"
            >
              <PhoneIcon />
              {site.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
