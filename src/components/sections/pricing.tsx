import { Pill } from "@/components/ui/kit";
import { pricing, pricingNote } from "@/lib/site";

export function Pricing() {
  return (
    <section id="prix" className="py-16 lg:py-24" aria-labelledby="prix-title">
      <div className="container-x">
        <div className="grid gap-8 border-t border-line pt-9 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-16">
          <h2
            id="prix-title"
            className="text-[clamp(2.2rem,5vw,3.6rem)] leading-[0.98] font-medium tracking-[-0.03em]"
          >
            <span className="mask reveal-mask">
              <span className="block">Prix au m²</span>
            </span>
            <span className="mask reveal-mask">
              <span className="display-italic block text-[1.08em] leading-[1]">
                en Île-de-France
              </span>
            </span>
          </h2>

          <div className="flex flex-col items-start gap-7 lg:pb-2">
            <p className="reveal max-w-md text-[0.92rem] leading-relaxed text-muted">
              Fourchettes indicatives observées en 2026. Le devis détaillé après
              visite technique reste la seule référence fiable.
            </p>

            <div className="reveal">
              <Pill href="#devis" tone="terra">
                Chiffrer mon projet
              </Pill>
            </div>
          </div>
        </div>

        <ul className="reveal-stagger mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {pricing.map((p, i) => {
            const featured = "featured" in p && p.featured;
            return (
              <li
                key={p.label}
                style={{ "--i": i } as React.CSSProperties}
                className={`group relative flex flex-col rounded-[clamp(18px,2.4vw,28px)] p-7 transition-transform duration-600 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1.5 ${
                  featured ? "bg-ink text-paper" : "bg-paper"
                }`}
              >
                {featured && (
                  <span className="absolute top-6 right-6 rounded-full bg-terra px-3 py-1 text-[0.64rem] font-medium tracking-wide text-paper uppercase">
                    Le plus demandé
                  </span>
                )}

                <p
                  className={`dot-label text-[0.74rem] ${featured ? "text-paper/55" : "text-muted"}`}
                >
                  {String(i + 1).padStart(2, "0")}
                </p>

                <h3 className="mt-4 text-[1.2rem] leading-tight font-medium">
                  {p.label}
                </h3>

                <p className="mt-7 text-[clamp(1.5rem,2.4vw,1.95rem)] leading-none whitespace-nowrap">
                  <span className="display-italic">
                    {p.from.toLocaleString("fr-FR")}
                  </span>
                  <span className={featured ? "text-paper/40" : "text-muted"}>
                    {" "}
                    —{" "}
                  </span>
                  <span className="display-italic">
                    {p.to.toLocaleString("fr-FR")}
                  </span>
                  <span
                    className={`ml-1.5 align-middle text-[0.78rem] ${
                      featured ? "text-paper/55" : "text-muted"
                    }`}
                  >
                    € /m²
                  </span>
                </p>

                <span
                  aria-hidden
                  className={`mt-6 block h-px w-full ${featured ? "bg-paper/15" : "bg-line"}`}
                />

                <p
                  className={`mt-5 text-[0.86rem] leading-relaxed ${
                    featured ? "text-paper/65" : "text-muted"
                  }`}
                >
                  {p.text}
                </p>
              </li>
            );
          })}
        </ul>

        <p className="reveal mt-7 flex max-w-3xl items-start gap-3 text-[0.82rem] leading-relaxed text-muted">
          <svg
            viewBox="0 0 16 16"
            aria-hidden
            className="mt-0.5 size-4 shrink-0 text-terra"
          >
            <circle
              cx="8"
              cy="8"
              r="6.6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
            />
            <path
              d="M8 7.2v4M8 4.9v.9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          {pricingNote}
        </p>
      </div>
    </section>
  );
}
