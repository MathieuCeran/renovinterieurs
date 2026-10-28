import Link from "next/link";

import { Inline } from "@/components/page/blocks";
import { ArrowRight } from "@/components/ui/kit";

const commitments = [
  {
    n: "01",
    title: "Devis détaillé sous 48 h",
    text: "Visite technique sous 5 jours, chiffrage poste par poste et planning prévisionnel remis avec le devis.",
  },
  {
    n: "02",
    title: "Un interlocuteur unique",
    text: "Un seul contact du diagnostic à la remise des clés, compte-rendu hebdomadaire, aucune sous-traitance opaque.",
  },
  {
    n: "03",
    title: "Garanties légales des partenaires",
    text: "Décennale 10 ans, biennale 2 ans, parfait achèvement 1 an, portées par les entreprises partenaires. Attestations vérifiées avant le démarrage.",
  },
  {
    n: "04",
    title: "TVA réduite 10 % et 5,5 %",
    text: "10 % sur l’amélioration d’un logement de plus de 2 ans, 5,5 % sur les travaux énergétiques éligibles.",
  },
];

/** Maillage interne : les prestations les plus recherchées. */
const prestations = [
  {
    label: "Appartement",
    title: "Rénovation d’appartement",
    href: "/renovation-appartement-paris",
  },
  {
    label: "Zones 75 · 92 · 78 · 94",
    title: "Nos zones d’intervention en Île-de-France",
    href: "/zones",
  },
  {
    label: "Salle de bain",
    title: "Rénovation de salle de bain",
    href: "/salle-de-bain-paris",
  },
  {
    label: "Cuisine",
    title: "Cuisine sur-mesure",
    href: "/cuisine-sur-mesure-paris",
  },
  {
    label: "Béton ciré",
    title: "Béton ciré sols et murs",
    href: "/beton-cire-paris",
  },
  {
    label: "Isolation DPE",
    title: "Isolation et sortie de passoire énergétique",
    href: "/isolation-amelioration-energetique",
  },
  {
    label: "Gros œuvre",
    title: "Gros œuvre, surélévation et extension",
    href: "/renovation-gros-oeuvre-surelevation-extension-idf",
  },
  {
    label: "Dépannage",
    title: "Dépannage urgent tous corps d’état",
    href: "/depannage",
  },
  { label: "Débarras", title: "Débarras et évacuation", href: "/debarras" },
  {
    label: "Estimer mon budget",
    title: "Estimateur de budget rénovation au m²",
    href: "/outils/estimateur-budget-renovation",
  },
  {
    label: "Simulateur DPE",
    title: "Simulateur DPE : sortir d’une passoire énergétique",
    href: "/outils/simulateur-dpe-passoire-energetique",
  },
];

const HEADING = "Nos engagements, écrits noir sur blanc";
const LEAD =
  "Quatre repères simples pour comparer objectivement les devis de rénovation que vous recevez, qu’ils passent par RenovIntérieurs ou non.";

/** `ww` : les textes de la page vus par WhatsWrong (réécrits, ou null si
 *  retirés) ; sans lui, les textes du site. */
export function Commitments({
  ww = (t) => t,
}: {
  ww?: (text: string) => string | null;
}) {
  const heading = ww(HEADING);
  const lead = ww(LEAD);
  const items = commitments.flatMap((c) => {
    const title = ww(c.title);
    const text = ww(c.text);
    return title === null && text === null ? [] : [{ ...c, title, text }];
  });
  return (
    <section
      className="px-[clamp(0.6rem,2vw,1.5rem)] py-4 lg:py-6"
      aria-labelledby="engagements-title"
    >
      <div className="overflow-hidden rounded-[clamp(20px,3vw,36px)] bg-paper text-ink">
        <div className="container-x py-14 lg:py-18">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <h2
              id="engagements-title"
              className="text-[clamp(1.7rem,3.4vw,2.6rem)] leading-[1.05] font-medium tracking-[-0.02em]"
            >
              {heading === null ? null : heading === HEADING ? (
                <>
                  <span className="mask reveal-mask">
                    <span className="block">
                      Nos engagements,{" "}
                      <span className="display-italic text-[1.08em]">écrits noir sur blanc</span>
                    </span>
                  </span>
                </>
              ) : (
                <span className="mask reveal-mask">
                  <span className="block">{heading}</span>
                </span>
              )}
            </h2>
            {lead && (
              <p className="reveal max-w-sm text-[0.9rem] leading-relaxed text-muted">
                <Inline v={lead} />
              </p>
            )}
          </div>

          <ul className="reveal-stagger mt-12 grid gap-px overflow-hidden bg-line sm:grid-cols-2 lg:grid-cols-4">
            {items.map((c, i) => (
              <li
                key={c.n}
                style={{ "--i": i } as React.CSSProperties}
                className="bg-paper px-6 py-7 lg:px-7"
              >
                <span className="display-italic text-[1.6rem] leading-none text-terra">
                  {c.n}
                </span>
                {c.title && (
                  <h3 className="mt-5 text-[1.05rem] leading-snug font-medium">
                    {c.title}
                  </h3>
                )}
                {c.text && (
                  <p className="mt-3 text-[0.86rem] leading-relaxed text-muted">
                    <Inline v={c.text} />
                  </p>
                )}
              </li>
            ))}
          </ul>

          {/* Maillage interne */}
          <div className="reveal mt-12 border-t border-line pt-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="dot-label text-[0.74rem] text-muted">
                Nos prestations
              </p>
              <Link
                href="#devis"
                className="group inline-flex items-center gap-3 rounded-full bg-ink py-1.5 pr-1.5 pl-5 text-[0.84rem] font-medium text-paper transition-colors duration-500 hover:bg-terra hover:text-paper"
              >
                Comparer avec un chiffrage détaillé
                <span className="pill-arrow flex size-8 items-center justify-center rounded-full bg-terra text-paper transition-colors duration-500 group-hover:bg-paper group-hover:text-terra">
                  <ArrowRight className="size-3" />
                </span>
              </Link>
            </div>

            <ul className="-mx-[clamp(1.15rem,4vw,3.5rem)] mt-5 flex snap-x gap-2 overflow-x-auto px-[clamp(1.15rem,4vw,3.5rem)] pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {prestations.map((p) => (
                <li key={p.href} className="shrink-0 snap-start">
                  <Link
                    href={p.href}
                    title={p.title}
                    className="inline-block rounded-full border border-line px-4 py-2 text-[0.82rem] whitespace-nowrap text-muted transition-colors duration-400 hover:border-terra hover:bg-terra hover:text-paper"
                  >
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
