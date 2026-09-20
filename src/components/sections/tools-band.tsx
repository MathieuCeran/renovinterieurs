import Link from "next/link";

import { ArrowRight, Pill } from "@/components/ui/kit";
import { tools } from "@/lib/tools";

/** Passerelle vers les outils depuis l'accueil — maillage interne fort. */
export function ToolsBand() {
  return (
    <section className="py-16 lg:py-24" aria-labelledby="outils-title">
      <div className="container-x">
        <div className="grid gap-8 border-t border-line pt-9 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-16">
          <h2
            id="outils-title"
            className="text-[clamp(2.2rem,5vw,3.6rem)] leading-[0.98] font-medium tracking-[-0.03em]"
          >
            <span className="mask reveal-mask">
              <span className="block">Estimez votre projet</span>
            </span>
            <span className="mask reveal-mask">
              <span className="display-italic block text-[1.08em] leading-[1]">
                avant de nous appeler
              </span>
            </span>
          </h2>

          <div className="flex flex-col items-start gap-7 lg:pb-2">
            <p className="reveal max-w-md text-[0.92rem] leading-relaxed text-muted">
              Trois outils gratuits, sans inscription, fondés sur nos
              fourchettes de prix et nos durées de chantier réelles. De quoi
              cadrer un budget en trois minutes.
            </p>
            <div className="reveal">
              <Pill href="/outils">Tous nos outils</Pill>
            </div>
          </div>
        </div>

        <ul className="reveal-stagger mt-12 grid gap-4 lg:grid-cols-3">
          {tools.map((t, i) => (
            <li key={t.slug} style={{ "--i": i } as React.CSSProperties}>
              <Link
                href={t.href}
                className="group flex h-full flex-col rounded-[clamp(18px,2.4vw,28px)] border border-line bg-paper p-7 transition-colors duration-400 hover:border-ink/25 sm:p-8"
              >
                <span className="display-italic text-[1.6rem] leading-none text-terra">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-6 text-[1.2rem] leading-tight font-medium transition-colors duration-400 group-hover:text-terra">
                  {t.name}
                </h3>
                <p className="mt-2.5 flex-1 text-[0.88rem] leading-relaxed text-muted">
                  {t.short}
                </p>
                <span className="mt-6 inline-flex items-center gap-2.5 text-[0.84rem] font-medium">
                  Ouvrir
                  <span className="pill-arrow">
                    <ArrowRight className="size-3" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
