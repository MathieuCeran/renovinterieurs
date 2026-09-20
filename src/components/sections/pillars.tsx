import Image from "next/image";

import { pillars } from "@/lib/site";

export function Pillars() {
  return (
    <section className="py-16 lg:py-24" aria-labelledby="pillars-title">
      <div className="container-x">
        <div className="grid gap-8 border-t border-line pt-9 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-16">
          <h2
            id="pillars-title"
            className="text-[clamp(2.2rem,5vw,3.6rem)] leading-[0.98] font-medium tracking-[-0.03em]"
          >
            <span className="mask reveal-mask">
              <span className="block">Ce qui nous</span>
            </span>
            <span className="mask reveal-mask">
              <span className="display-italic block text-[1.08em] leading-[1]">
                distingue
              </span>
            </span>
          </h2>
          <p className="reveal max-w-md text-[0.92rem] leading-relaxed text-muted lg:pb-2">
            Un artisanat exigeant, un souci obsessionnel du détail et un
            accompagnement sans sous-traitance opaque : trois engagements tenus
            sur chaque chantier.
          </p>
        </div>

        <ul className="reveal-stagger mt-12 grid gap-10 md:grid-cols-3 md:gap-6">
          {pillars.map((p, i) => (
            <li
              key={p.title}
              style={{ "--i": i } as React.CSSProperties}
              className="group"
            >
              <figure className="relative aspect-4/3 overflow-hidden rounded-[clamp(16px,2vw,24px)]">
                <Image
                  src={p.image}
                  alt={p.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-106"
                />
                <span className="absolute top-4 left-4 flex size-10 items-center justify-center rounded-full bg-paper/92 text-[0.82rem] font-medium backdrop-blur-sm">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </figure>

              <h3 className="mt-5 text-[1.32rem] leading-tight font-medium tracking-[-0.01em]">
                {p.title}
              </h3>
              <span
                aria-hidden
                className="mt-4 block h-px w-10 origin-left bg-terra transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-x-[2.8]"
              />
              <p className="mt-4 text-[0.9rem] leading-relaxed text-muted">
                {p.text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
