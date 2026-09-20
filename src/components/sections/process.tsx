import { process } from "@/lib/site";

export function Process() {
  return (
    <section className="py-16 lg:py-24" aria-labelledby="process-title">
      <div className="container-x">
        <div className="grid gap-8 border-t border-line pt-9 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-16">
          <h2
            id="process-title"
            className="text-[clamp(2.2rem,5vw,3.6rem)] leading-[0.98] font-medium tracking-[-0.03em]"
          >
            <span className="mask reveal-mask">
              <span className="block">Cinq étapes,</span>
            </span>
            <span className="mask reveal-mask">
              <span className="display-italic block text-[1.08em] leading-[1]">
                zéro mauvaise surprise
              </span>
            </span>
          </h2>
          <p className="reveal max-w-md text-[0.92rem] leading-relaxed text-muted lg:pb-2">
            Du premier appel à la remise des clés, chaque phase est cadrée,
            datée et documentée. Vous savez toujours où en est votre chantier.
          </p>
        </div>

        <ol className="reveal-stagger mt-12 grid gap-px overflow-hidden rounded-[clamp(18px,2.4vw,28px)] bg-line md:grid-cols-3 lg:grid-cols-5">
          {process.map((s, i) => (
            <li
              key={s.step}
              style={{ "--i": i } as React.CSSProperties}
              className="group flex flex-col bg-paper p-7 transition-colors duration-500 hover:bg-ink hover:text-paper"
            >
              <span className="display-italic text-[1.9rem] leading-none text-terra">
                {s.step}
              </span>
              <h3 className="mt-6 text-[1.08rem] leading-tight font-medium">
                {s.title}
              </h3>
              <p className="mt-3 text-[0.86rem] leading-relaxed text-muted transition-colors duration-500 group-hover:text-paper/65">
                {s.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
