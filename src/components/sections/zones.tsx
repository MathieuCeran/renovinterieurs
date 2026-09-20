import Image from "next/image";
import Link from "next/link";

import { ArrowRight } from "@/components/ui/kit";
import { zones } from "@/lib/site";

const thumbs = [
  "/images/paris-zones.jpg",
  "/images/balcon-haussmannien-paris.jpg",
  "/images/ville-hero.jpg",
  "/images/salon-haussmannien-moulures.jpg",
];

export function Zones() {
  return (
    <section
      id="zones"
      className="py-16 lg:py-24"
      aria-labelledby="zones-title"
    >
      <div className="container-x">
        <div className="grid gap-8 border-t border-line pt-9 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-16">
          <h2
            id="zones-title"
            className="text-[clamp(2.2rem,5vw,3.6rem)] leading-[0.98] font-medium tracking-[-0.03em]"
          >
            <span className="mask reveal-mask">
              <span className="block">Où nous</span>
            </span>
            <span className="mask reveal-mask">
              <span className="display-italic block text-[1.08em] leading-[1]">
                intervenons
              </span>
            </span>
          </h2>
          <p className="reveal max-w-md text-[0.92rem] leading-relaxed text-muted lg:pb-2">
            Nos équipes interviennent sur l’ensemble des 20 arrondissements de
            Paris et en priorité sur les Hauts-de-Seine, les Yvelines et le
            Val-de-Marne. Visite technique sous 5 jours, devis détaillé sous 48
            h.
          </p>
        </div>

        <ul className="reveal-stagger mt-11">
          {zones.map((z, i) => (
            <li key={z.dept} style={{ "--i": i } as React.CSSProperties}>
              <Link
                href={z.href}
                className="group grid grid-cols-[1fr_auto] items-center gap-4 border-b border-line py-6 transition-colors duration-500 hover:border-ink/25 md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)_auto] md:gap-8"
              >
                <span className="flex items-center gap-4">
                  <span className="relative hidden h-14 w-0 shrink-0 overflow-hidden rounded-xl transition-all duration-600 ease-[cubic-bezier(.16,1,.3,1)] group-hover:w-20 md:block">
                    <Image
                      src={thumbs[i % thumbs.length]}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </span>
                  <span className="text-[clamp(1.25rem,2.4vw,1.85rem)] leading-tight font-medium tracking-[-0.02em] transition-colors duration-400 group-hover:text-terra">
                    {z.dept}
                  </span>
                </span>

                <span className="col-span-2 text-[0.86rem] leading-relaxed text-muted md:col-span-1">
                  {z.text}
                </span>

                <span className="col-start-2 row-start-1 flex size-10 items-center justify-center rounded-full border border-line text-ink transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-rotate-45 group-hover:border-terra group-hover:bg-terra group-hover:text-paper md:col-start-auto md:row-start-auto">
                  <ArrowRight />
                  <span className="sr-only">Rénovation {z.dept}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
