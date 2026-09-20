import Image from "next/image";
import Link from "next/link";

import { ArrowRight, Pill } from "@/components/ui/kit";
import { gallery } from "@/lib/site";

export function Gallery() {
  const [lead, ...rest] = gallery;

  return (
    <section
      id="realisations"
      className="py-16 lg:py-24"
      aria-labelledby="realisations-title"
    >
      <div className="container-x">
        <div className="grid gap-8 border-t border-line pt-9 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-16">
          <h2
            id="realisations-title"
            className="text-[clamp(2.2rem,5vw,3.6rem)] leading-[0.98] font-medium tracking-[-0.03em]"
          >
            <span className="mask reveal-mask">
              <span className="block">Nos</span>
            </span>
            <span className="mask reveal-mask">
              <span className="display-italic block text-[1.08em] leading-[1]">
                réalisations
              </span>
            </span>
          </h2>

          <div className="flex flex-col items-start gap-7 lg:pb-2">
            <p className="reveal max-w-md text-[0.92rem] leading-relaxed text-muted">
              Appartements haussmanniens, cuisines sur-mesure, douches à
              l’italienne : des chantiers livrés en Île-de-France, finition par
              finition.
            </p>

            <div className="reveal">
              <Pill href="/realisations-renovation">
                Toutes nos réalisations
              </Pill>
            </div>
          </div>
        </div>

        {/* --- Visuel principal --- */}
        <figure className="reveal reveal-zoom relative mt-12 aspect-4/3 overflow-hidden rounded-[clamp(18px,2.4vw,28px)] sm:aspect-16/9">
          <Image
            src={lead.src}
            alt={lead.alt}
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
          <figcaption className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-6 text-paper sm:p-8">
            <div>
              <p className="dot-label text-[0.76rem] text-paper/70">
                {lead.tag}
              </p>
              <p className="mt-2 max-w-md text-[clamp(1.2rem,2.2vw,1.8rem)] leading-tight font-medium">
                {lead.alt}
              </p>
            </div>
            <Link
              href="/realisations-renovation"
              className="group inline-flex items-center gap-2.5 rounded-full bg-paper/15 px-5 py-2.5 text-[0.84rem] font-medium backdrop-blur-sm transition-colors duration-500 hover:bg-paper hover:text-ink"
            >
              Voir le chantier
              <span className="pill-arrow">
                <ArrowRight className="size-3" />
              </span>
            </Link>
          </figcaption>
        </figure>

        {/* --- Grille --- */}
        <ul className="reveal-stagger mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((g, i) => (
            <li key={g.src} style={{ "--i": i % 3 } as React.CSSProperties}>
              <Link href="/realisations-renovation" className="group block">
                <figure className="relative aspect-4/3 overflow-hidden rounded-[clamp(16px,2vw,24px)]">
                  <Image
                    src={g.src}
                    alt={g.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-[1300ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-107"
                  />
                </figure>
                <p className="dot-label mt-3.5 text-[0.76rem] text-muted">
                  {g.tag}
                </p>
                <p className="mt-1.5 text-[1.05rem] leading-snug font-medium transition-colors duration-400 group-hover:text-terra">
                  {g.alt}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
