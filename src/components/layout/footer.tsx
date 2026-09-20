"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  footerInfo,
  footerServices,
  footerTools,
  site,
  zones,
} from "@/lib/site";

export function Footer() {
  const [openZones, setOpenZones] = useState(false);

  return (
    <footer className="border-t border-line pt-16 pb-16 lg:pb-0">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Marque */}
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/brand/monogram.png"
                alt=""
                width={300}
                height={300}
                className="size-10"
              />
              <span className="text-[1rem] leading-none font-semibold tracking-[0.14em] uppercase">
                Renov<span className="font-normal opacity-70">intérieur</span>
              </span>
            </Link>
            <p className="mt-6 max-w-sm text-[0.92rem] leading-relaxed text-muted">
              Spécialiste de la rénovation intérieure en Île-de-France. Second
              œuvre, isolation, dépannage et débarras — un seul interlocuteur
              pour tous vos travaux.
            </p>

            <div className="mt-7 space-y-2.5 text-[0.9rem]">
              <p className="flex items-center gap-3 text-muted">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden
                  className="size-4 shrink-0 text-terra"
                >
                  <path
                    d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="12"
                    cy="10"
                    r="2.4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
                {site.area}
              </p>
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-3 text-muted transition-colors hover:text-ink"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden
                  className="size-4 shrink-0 text-terra"
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M3.5 6.5L12 13l8.5-6.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
                {site.email}
              </a>
              <a
                href={site.phoneHref}
                className="flex items-center gap-3 text-muted transition-colors hover:text-ink"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden
                  className="size-4 shrink-0 text-terra"
                >
                  <path
                    d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5L17 13l4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 3 5.2 2 2 0 0 1 5 3h1.5Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
                {site.phoneDisplay}
              </a>
            </div>
          </div>

          {/* Informations */}
          <div>
            <p className="dot-label text-[0.76rem] text-muted">Informations</p>
            <ul className="mt-6 space-y-3">
              {footerInfo.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group inline-flex items-center gap-2 text-[0.92rem] text-ink/70 transition-colors hover:text-ink"
                  >
                    <span className="h-px w-0 bg-terra transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:w-4" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <p className="dot-label text-[0.76rem] text-muted">
              Services spécialisés
            </p>
            <ul className="mt-6 space-y-3">
              {footerServices.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group inline-flex items-center gap-2 text-[0.92rem] text-ink/70 transition-colors hover:text-ink"
                  >
                    <span className="h-px w-0 bg-terra transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:w-4" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Outils */}
          <div>
            <p className="dot-label text-[0.76rem] text-muted">
              Outils gratuits
            </p>
            <ul className="mt-6 space-y-3">
              {footerTools.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group inline-flex items-center gap-2 text-[0.92rem] text-ink/70 transition-colors hover:text-ink"
                  >
                    <span className="h-px w-0 bg-terra transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:w-4" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Zones */}
        <div className="mt-14 border-t border-line pt-5">
          <button
            type="button"
            onClick={() => setOpenZones((v) => !v)}
            aria-expanded={openZones}
            aria-controls="footer-zones"
            className="group flex w-full items-center justify-between gap-4 py-2 text-left"
          >
            <span className="dot-label text-[0.76rem] text-muted transition-colors group-hover:text-ink">
              Toutes nos zones d’intervention
            </span>
            <span
              className={`flex size-8 items-center justify-center rounded-full border border-line transition-all duration-500 ${
                openZones ? "rotate-45 border-terra bg-terra text-paper" : ""
              }`}
            >
              <svg viewBox="0 0 16 16" aria-hidden className="size-3.5">
                <path
                  d="M8 2v12M2 8h12"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </button>

          <div id="footer-zones" className="collapsible" data-open={openZones}>
            <div>
              <div className="grid gap-8 pt-6 pb-2 sm:grid-cols-2 lg:grid-cols-4">
                {zones.map((z) => (
                  <div key={z.dept}>
                    <Link
                      href={z.href}
                      className="text-[1.02rem] font-medium transition-colors hover:text-terra"
                    >
                      {z.dept}
                    </Link>
                    <ul className="mt-3 space-y-1.5">
                      {z.cities.map((c) => (
                        <li key={c} className="text-[0.82rem] text-muted">
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bas */}
        <div className="mt-8 flex flex-col-reverse items-center justify-between gap-4 border-t border-line py-7 sm:flex-row">
          <p className="text-[0.8rem] text-muted">
            © {new Date().getFullYear()} {site.name} — Tous droits réservés
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[0.8rem]">
            <Link
              href="/mentions-legales"
              className="text-muted transition-colors hover:text-ink"
            >
              Mentions légales
            </Link>
            <Link
              href="/politique-de-confidentialite"
              className="text-muted transition-colors hover:text-ink"
            >
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>

      {/* Filigrane */}
      <p
        aria-hidden
        className="pointer-events-none -mb-[0.24em] w-full overflow-hidden text-center whitespace-nowrap text-[clamp(1.7rem,11.5vw,13rem)] leading-none font-medium tracking-[-0.04em] text-ink/[0.055] select-none"
      >
        RenovIntérieur
      </p>
    </footer>
  );
}
