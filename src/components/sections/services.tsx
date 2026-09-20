import Image from "next/image";
import Link from "next/link";

import { ArrowRight, Pill } from "@/components/ui/kit";
import { grosOeuvre, services } from "@/lib/site";

export function Services() {
  return (
    <section
      id="expertise"
      className="py-16 lg:py-24"
      aria-labelledby="services-title"
    >
      <div className="container-x">
        {/* --- En-tête --- */}
        <div className="grid gap-8 border-t border-line pt-9 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-16">
          <h2
            id="services-title"
            className="text-[clamp(2.2rem,5vw,3.6rem)] leading-[0.98] font-medium tracking-[-0.03em]"
          >
            <span className="mask reveal-mask">
              <span className="block">Savoir-faire</span>
            </span>
            <span className="mask reveal-mask">
              <span className="display-italic block text-[1.08em] leading-[1]">
                &amp; expertise
              </span>
            </span>
          </h2>

          <div className="flex flex-col items-start gap-7 lg:pb-2">
            <p className="reveal max-w-md text-[0.92rem] leading-relaxed text-muted">
              Six métiers maîtrisés en interne, coordonnés par un seul
              interlocuteur. Chaque poste est traité avec le même niveau
              d’exigence — du diagnostic à la finition.
            </p>

            <div className="reveal">
              <Pill href="/nos-services">Tous nos services</Pill>
            </div>
          </div>
        </div>

        {/* --- Cartes --- */}
        <ul className="reveal-stagger mt-12 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <li key={s.href} style={{ "--i": i % 3 } as React.CSSProperties}>
              <Link href={s.href} className="group block">
                <div className="relative aspect-4/3 overflow-hidden rounded-[clamp(16px,2vw,24px)]">
                  <Image
                    src={s.image}
                    alt={`${s.title} — réalisation RenovIntérieur en Île-de-France`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-[1300ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-107"
                  />
                  <span className="absolute top-4 right-4 flex size-10 translate-y-2 items-center justify-center rounded-full bg-paper text-ink opacity-0 transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-y-0 group-hover:opacity-100">
                    <ArrowRight />
                  </span>
                </div>

                <p className="dot-label mt-4 text-[0.76rem] text-terra">
                  {s.index}
                </p>
                <h3 className="mt-2 text-[1.28rem] leading-tight font-medium tracking-[-0.01em] transition-colors duration-400 group-hover:text-terra">
                  {s.title}
                </h3>
                <p className="mt-2 max-w-xs text-[0.88rem] leading-relaxed text-muted">
                  {s.text}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        {/* --- Gros œuvre --- */}
        <div className="reveal mt-14">
          <Link
            href={grosOeuvre.href}
            className="group grid overflow-hidden rounded-[clamp(18px,2.4vw,28px)] bg-clay text-paper md:grid-cols-[1.05fr_0.95fr]"
          >
            <div className="p-8 sm:p-11 lg:p-14">
              <p className="dot-label text-paper/60">{grosOeuvre.eyebrow}</p>
              <h3 className="mt-5 max-w-lg text-[clamp(1.7rem,3.2vw,2.6rem)] leading-[1.03] font-medium tracking-[-0.02em]">
                Gros œuvre, surélévation
                <span className="display-italic block text-[1.08em]">
                  &amp; extension
                </span>
              </h3>
              <p className="mt-5 max-w-xl text-[0.93rem] leading-relaxed text-paper/70">
                {grosOeuvre.text}
              </p>
              <span className="mt-8 inline-flex items-center gap-3 rounded-full bg-paper/10 py-1.5 pr-1.5 pl-5 text-[0.86rem] font-medium transition-colors duration-500 group-hover:bg-paper group-hover:text-clay">
                Découvrir le gros œuvre
                <span className="pill-arrow flex size-9 items-center justify-center rounded-full bg-paper text-clay transition-colors duration-500 group-hover:bg-terra group-hover:text-paper">
                  <ArrowRight />
                </span>
              </span>
            </div>

            <div className="relative min-h-64 overflow-hidden md:min-h-full">
              <Image
                src={grosOeuvre.image}
                alt="Enfilade de pièces pendant les travaux de gros œuvre"
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-106"
              />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
