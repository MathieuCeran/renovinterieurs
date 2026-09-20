"use client";

import Link from "next/link";
import { useState } from "react";

import { ArrowRight, PhoneIcon, PillGhost } from "@/components/ui/kit";
import { faq, site } from "@/lib/site";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-16 lg:py-24" aria-labelledby="faq-title">
      <div className="container-x">
        <div className="grid gap-10 border-t border-line pt-9 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2
              id="faq-title"
              className="text-[clamp(2.1rem,4.4vw,3.2rem)] leading-[1] font-medium tracking-[-0.03em]"
            >
              <span className="mask reveal-mask">
                <span className="block">Questions</span>
              </span>
              <span className="mask reveal-mask">
                <span className="display-italic block text-[1.08em] leading-[1]">
                  fréquentes
                </span>
              </span>
            </h2>
            <p className="reveal mt-6 max-w-sm text-[0.92rem] leading-relaxed text-muted">
              Une question qui n’est pas ici ? Écrivez-nous, nous répondons sous
              24 h ouvrées.
            </p>
            <div className="reveal mt-7">
              <PillGhost href="/contact-devis">Poser une question</PillGhost>
            </div>

            {/* Réponse immédiate — contact direct */}
            <div className="reveal mt-10 max-w-sm rounded-[clamp(16px,2vw,24px)] border border-line bg-paper p-6">
              <p className="dot-label text-[0.74rem] text-terra">
                Réponse immédiate
              </p>
              <p className="mt-3 text-[0.9rem] leading-relaxed text-muted">
                Un doute sur la faisabilité, le budget ou le planning ? Un
                conducteur de travaux vous répond directement.
              </p>
              <div className="mt-5 space-y-2">
                <a
                  href={site.phoneHref}
                  className="group flex items-center gap-3 rounded-full border border-line px-4 py-2.5 transition-colors duration-400 hover:border-ink"
                >
                  <PhoneIcon className="size-4 text-terra" />
                  <span className="text-[0.92rem] font-medium">
                    {site.phoneDisplay}
                  </span>
                  <span className="pill-arrow ml-auto text-muted">
                    <ArrowRight className="size-3" />
                  </span>
                </a>
                <a
                  href={site.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-full border border-line px-4 py-2.5 transition-colors duration-400 hover:border-ink"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden
                    className="size-4 fill-terra"
                  >
                    <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.17-1.35a9.93 9.93 0 0 0 4.87 1.24h.01c5.5 0 9.96-4.46 9.96-9.96 0-2.66-1.04-5.16-2.92-7.04A9.9 9.9 0 0 0 12.04 2Zm0 18.13h-.01a8.26 8.26 0 0 1-4.21-1.15l-.3-.18-3.07.8.82-2.99-.2-.31a8.24 8.24 0 0 1-1.26-4.39c0-4.56 3.71-8.27 8.28-8.27 2.21 0 4.29.86 5.85 2.43a8.22 8.22 0 0 1 2.42 5.85c0 4.57-3.71 8.28-8.32 8.28Z" />
                  </svg>
                  <span className="text-[0.92rem] font-medium">WhatsApp</span>
                  <span className="pill-arrow ml-auto text-muted">
                    <ArrowRight className="size-3" />
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div>
            {faq.map((item, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={item.q}
                  className="border-b border-line first:border-t"
                >
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      className="group flex w-full items-start justify-between gap-6 py-5 text-left"
                    >
                      <span
                        className={`text-[clamp(1.02rem,1.7vw,1.22rem)] leading-snug font-medium transition-colors duration-400 ${
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
                    id={`faq-panel-${i}`}
                    className="collapsible"
                    data-open={isOpen}
                  >
                    <div>
                      <div className="pr-10 pb-6">
                        <p className="text-[0.92rem] leading-relaxed text-muted">
                          {item.a}
                        </p>
                        {"link" in item && item.link && (
                          <Link
                            href={item.link.href}
                            className="group mt-3.5 inline-flex items-center gap-2 text-[0.84rem] font-medium text-terra"
                          >
                            {item.link.label}
                            <span className="pill-arrow">
                              <ArrowRight className="size-3" />
                            </span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
