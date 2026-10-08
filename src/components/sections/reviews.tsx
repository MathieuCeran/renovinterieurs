/**
 * Avis Google — extraits repris mot pour mot de la fiche Google
 * « renov interieurs » (relevé du 8 octobre 2026 : 5,0/5, 21 avis).
 * Coupes signalées par « … ». Mettre à jour note et total à chaque relevé.
 */

const googleProfile = "https://www.google.com/search?kgmid=/g/11zyt05nwr";

const rating = { value: "5,0", count: 21 };

const reviews = [
  {
    name: "Eitan E.",
    project: "Appartement 95 m² · Enghien-les-Bains",
    text: "Avant de nous décider, nous avions fait plusieurs chiffrages. À prestations comparables, renov intérieurs était environ 6 000 € moins cher que certains devis que nous avions reçus. […] Très bonne expérience, beaucoup de disponibilité pendant toute la rénovation et surtout un appartement qui correspond vraiment à ce que nous avions imaginé.",
  },
  {
    name: "Anne B.",
    project: "Appartement 95 m² · Boulogne-Billancourt",
    text: "Tout a été repris : électricité encastrée, parquet massif à lames larges, fenêtres, cuisine sur mesure, dressing et menuiseries sur mesure. On a beaucoup apprécié de pouvoir acheter directement une partie des matériaux et équipements. C’était clair, pratique et on gardait la main sur nos choix.",
  },
  {
    name: "Minh-hoa T.",
    project: "Chantier orienté finitions",
    text: "J’ai fait appel à Renov Intérieurs pour un chantier complexe, très orienté finition et détail : grilles de ventilation invisibles, joints epoxy, parquet en pointe de Hongrie vernis Blanchon… Le travail réalisé est remarquable.",
  },
  {
    name: "Charles B.",
    project: "Appartement · Neuilly-sur-Seine",
    text: "Le projet était conséquent : repenser l’agencement, ouvrir un mur porteur et préserver le charme de l’ancien. […] Le suivi du chantier était régulier et nous savions où en étaient les travaux.",
  },
  {
    name: "Elliott M.",
    project: "Rénovation complète · passoire énergétique",
    text: "Ils ont repris l’isolation, installé une VMC et réalisé les carottages nécessaires. […] On a apprécié le suivi, la disponibilité et surtout les explications tout au long du chantier.",
  },
  {
    name: "Aurélien T.",
    project: "Salle de bain et salon · Paris 7ᵉ",
    text: "Le gros point fort est que j’ai été mis en contact directement avec les fournisseurs pour acheter les matériaux nécessaires et donc réaliser des économies non négligeables par rapport à des concurrents.",
  },
];

function Stars({ className = "size-3.5" }: { className?: string }) {
  return (
    <span className="flex gap-0.5 text-gold" aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" className={className}>
          <path
            fill="currentColor"
            d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z"
          />
        </svg>
      ))}
    </span>
  );
}

export function Reviews() {
  return (
    <section className="py-16 lg:py-24" aria-labelledby="avis-title">
      <div className="container-x">
        <div className="grid gap-8 border-t border-line pt-9 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-16">
          <h2
            id="avis-title"
            className="text-[clamp(2rem,4.6vw,3.3rem)] leading-[1] font-medium tracking-[-0.03em]"
          >
            <span className="mask reveal-mask">
              <span className="block">Ce que disent</span>
            </span>
            <span className="mask reveal-mask">
              <span className="display-italic block text-[1.08em] leading-[1.05]">
                nos clients
              </span>
            </span>
          </h2>

          <div className="reveal flex flex-wrap items-center gap-x-6 gap-y-4 lg:justify-end lg:pb-2">
            <div className="flex items-center gap-4">
              <span className="display-italic text-[clamp(2.4rem,4vw,3.2rem)] leading-none">
                {rating.value}
              </span>
              <div>
                <Stars className="size-4" />
                <p className="mt-1.5 text-[0.8rem] text-muted">
                  {rating.count} avis Google
                </p>
              </div>
            </div>
            <a
              href={googleProfile}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-line px-4 py-2 text-[0.82rem] text-muted transition-colors duration-400 hover:border-terra hover:bg-terra hover:text-paper"
            >
              Lire tous les avis sur Google
            </a>
          </div>
        </div>

        <ul className="reveal-stagger -mx-[clamp(1.15rem,4vw,3.5rem)] mt-12 flex snap-x gap-4 overflow-x-auto px-[clamp(1.15rem,4vw,3.5rem)] pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
          {reviews.map((r, i) => (
            <li
              key={r.name}
              style={{ "--i": i } as React.CSSProperties}
              className="flex w-[82vw] max-w-sm shrink-0 snap-start flex-col rounded-[clamp(16px,2vw,24px)] bg-paper p-6 md:w-auto md:max-w-none lg:p-7"
            >
              <Stars />
              <blockquote className="mt-5 flex-1 text-[0.92rem] leading-relaxed text-ink">
                « {r.text} »
              </blockquote>
              <footer className="mt-6 border-t border-line pt-4">
                <p className="text-[0.9rem] font-medium">{r.name}</p>
                <p className="mt-0.5 text-[0.78rem] text-muted">{r.project}</p>
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
