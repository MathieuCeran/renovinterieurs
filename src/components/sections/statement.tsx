import Image from "next/image";

import { Pill } from "@/components/ui/kit";

const figures = [
  { value: "48 h", label: "Devis détaillé" },
  { value: "5 jours", label: "Visite technique" },
  { value: "10 ans", label: "Garantie décennale" },
  { value: "12 mois", label: "SAV après livraison" },
];

/** Les corps d’état coordonnés en interne — repris du texte du site. */
const metiers = [
  "Plomberie",
  "Électricité",
  "Plâtrerie",
  "Peinture",
  "Revêtements",
  "Menuiserie",
];

export function Statement() {
  return (
    <section
      id="equipe"
      className="py-16 lg:py-24"
      aria-labelledby="equipe-title"
    >
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,260px)_1fr] lg:gap-16">
          {/* ---- Colonne de gauche : index des corps d’état ---- */}
          <aside className="reveal-sm h-fit lg:sticky lg:top-28">
            <p className="dot-label text-muted">Notre équipe</p>

            <p className="mt-7 text-[0.82rem] leading-relaxed text-muted">
              Six corps d’état coordonnés en interne, sur un seul et même
              chantier.
            </p>

            <ul className="mt-5 border-t border-line">
              {metiers.map((m, i) => (
                <li
                  key={m}
                  className="group flex items-baseline justify-between gap-3 border-b border-line py-2.5"
                >
                  <span className="text-[0.95rem] font-medium text-ink">
                    {m}
                  </span>
                  <span className="display-italic text-[0.85rem] text-muted transition-colors duration-400 group-hover:text-terra">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-center gap-3">
              <Image
                src="/brand/monogram.png"
                alt=""
                width={300}
                height={300}
                className="size-9 shrink-0 opacity-70"
              />
              <p className="text-[0.76rem] leading-snug text-muted">
                Un seul interlocuteur
                <br />
                pour l’ensemble du chantier
              </p>
            </div>
          </aside>

          {/* ---- Déclaration ---- */}
          <div>
            <h2
              id="equipe-title"
              className="reveal-mask max-w-4xl text-[clamp(1.6rem,3.6vw,2.9rem)] leading-[1.18] font-medium tracking-[-0.02em]"
            >
              <span className="mask">
                <span className="block">Chaque chantier est suivi par un</span>
              </span>
              <span className="mask">
                <span className="display-italic block text-[1.12em] leading-[1.1]">
                  interlocuteur unique,
                </span>
              </span>
              <span className="mask">
                <span className="block">
                  du diagnostic à la réception des travaux.
                </span>
              </span>
            </h2>

            <div className="reveal mt-10 grid max-w-3xl gap-6 text-[0.98rem] leading-relaxed text-muted sm:grid-cols-2">
              <p>
                Chez RenovIntérieur, notre équipe coordonne l’ensemble des corps
                de métier pour vous garantir un résultat à la hauteur de vos
                attentes.
              </p>
              <p>
                Nous intervenons sur tous les postes du second œuvre :
                plomberie, électricité, plâtrerie, peinture, revêtements,
                menuiserie. Un seul contact, une vision d’ensemble, zéro
                mauvaise surprise.
              </p>
            </div>

            <div className="reveal mt-9">
              <Pill href="#devis">Parler de mon projet</Pill>
            </div>

            {/* ---- Visuel + chiffres ---- */}
            <div className="mt-14 space-y-4 lg:mt-16">
              <figure className="reveal reveal-zoom relative aspect-4/3 overflow-hidden rounded-[clamp(16px,2vw,24px)] sm:aspect-16/9">
                <Image
                  src="/images/paris-renovation-appartement.jpg"
                  alt="Nos équipes posant un parquet dans un appartement haussmannien"
                  fill
                  sizes="(max-width: 1024px) 100vw, 62vw"
                  className="object-cover"
                />
              </figure>

              <ul className="reveal-stagger grid grid-cols-2 gap-px overflow-hidden rounded-[clamp(16px,2vw,24px)] bg-line sm:grid-cols-4">
                {figures.map((f, i) => (
                  <li
                    key={f.label}
                    style={{ "--i": i } as React.CSSProperties}
                    className="bg-paper px-5 py-6"
                  >
                    <span className="display-italic block text-[clamp(1.5rem,2.4vw,2rem)] leading-none">
                      {f.value}
                    </span>
                    <span className="mt-2.5 block text-[0.8rem] text-muted">
                      {f.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
