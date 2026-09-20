import Link from "next/link";

import { LeadForm } from "@/components/sections/lead-form";
import { PhoneIcon } from "@/components/ui/kit";
import { site } from "@/lib/site";

export function Cta() {
  return (
    <section
      id="devis"
      className="px-[clamp(0.6rem,2vw,1.5rem)] pb-[clamp(0.6rem,2vw,1.5rem)]"
    >
      <div className="overflow-hidden rounded-[clamp(20px,3vw,40px)] bg-clay text-paper">
        <div className="container-x py-16 lg:py-24">
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
            {/* --- Argumentaire --- */}
            <div className="lg:sticky lg:top-28">
              <p className="dot-label reveal-sm text-paper/60">
                Un projet de rénovation ?
              </p>

              <h2 className="mt-6 text-[clamp(2.4rem,5.6vw,4.4rem)] leading-[0.95] font-medium tracking-[-0.03em]">
                <span className="mask reveal-mask">
                  <span className="display-italic block text-[1.05em]">
                    Parlons-en.
                  </span>
                </span>
              </h2>

              <p className="reveal mt-6 max-w-md text-[0.98rem] leading-relaxed text-paper/70">
                Décrivez votre projet, votre commune et votre budget. Visite
                technique sous 5 jours, devis détaillé sous 48 h.
              </p>

              <div className="reveal mt-9 space-y-2.5">
                <a
                  href={site.phoneHref}
                  className="group flex items-center gap-4 rounded-2xl border border-paper/15 p-4 transition-colors duration-500 hover:border-paper/50 hover:bg-paper/5"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-terra text-paper">
                    <PhoneIcon className="size-4.5" />
                  </span>
                  <span>
                    <span className="block text-[0.72rem] text-paper/50">
                      Appeler
                    </span>
                    <span className="block text-[1.15rem] font-medium">
                      {site.phoneDisplay}
                    </span>
                  </span>
                </a>

                <a
                  href={`mailto:${site.email}`}
                  className="group flex items-center gap-4 rounded-2xl border border-paper/15 p-4 transition-colors duration-500 hover:border-paper/50 hover:bg-paper/5"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-paper/12 text-paper">
                    <svg viewBox="0 0 24 24" aria-hidden className="size-4.5">
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
                  </span>
                  <span>
                    <span className="block text-[0.72rem] text-paper/50">
                      Écrire
                    </span>
                    <span className="block text-[0.98rem] font-medium">
                      {site.email}
                    </span>
                  </span>
                </a>
              </div>

              <p className="reveal mt-8 border-t border-paper/15 pt-6 text-[0.86rem] leading-relaxed text-paper/60">
                Pas encore prêt ? Téléchargez notre guide gratuit :{" "}
                <Link
                  href="/guide-renovation-2026"
                  className="font-medium text-paper underline decoration-paper/40 underline-offset-4 hover:decoration-paper"
                >
                  rénover son appartement à Paris en 2026 (PDF)
                </Link>
              </p>
            </div>

            {/* --- Formulaire --- */}
            <div className="reveal">
              <LeadForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
