import type { Metadata } from "next";

import { BudgetEstimator } from "@/components/tools/budget-estimator";
import { ToolPage } from "@/components/tools/tool-page";
import { site } from "@/lib/site";
import { getTool } from "@/lib/tools";

const tool = getTool("estimateur-budget-renovation")!;

export const metadata: Metadata = {
  title: tool.title,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: tool.href },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: `${site.url}${tool.href}`,
    siteName: site.name,
    title: tool.title,
    description: tool.description,
    images: [{ url: tool.image }],
  },
};

export default function Page() {
  return (
    <ToolPage
      tool={tool}
      sections={[
        {
          title: "Comment lire une estimation au m²",
          body: (
            <>
              <p>
                Le prix au m² reste la manière la plus fiable de comparer deux
                projets de rénovation. Il intègre la main-d’œuvre, les matériaux
                courants et la coordination des corps d’état, mais{" "}
                <strong>pas</strong> le mobilier, l’électroménager ni les
                honoraires d’architecte.
              </p>
              <p>
                Quatre niveaux structurent le marché francilien :
                rafraîchissement (250-450 €/m²), rénovation partielle (600-900
                €/m²), rénovation complète (1 000-1 500 €/m²) et haut de gamme
                (1 500-2 500 €/m²). Au-delà, on entre dans le prestige et le
                sur-mesure d’architecte.
              </p>
              <p>
                Une estimation honnête est toujours une fourchette. Un chiffre
                unique avant visite technique est un signal d’alerte : personne
                ne peut connaître l’état des réseaux, la planéité des sols ou
                les contraintes de copropriété sans être venu sur place.
              </p>
            </>
          ),
        },
        {
          title: "Ce qui fait varier le budget",
          body: (
            <>
              <p>
                Cinq facteurs expliquent l’essentiel des écarts entre deux devis
                portant sur la même surface :
              </p>
              <ul>
                <li>
                  <strong>L’état du bien</strong> — un appartement jamais rénové
                  demande une dépose complète des réseaux, ce qu’un bien des
                  années 2000 n’exige pas.
                </li>
                <li>
                  <strong>La surface</strong> — les coûts fixes (protection,
                  benne, installation de chantier) pèsent proportionnellement
                  plus lourd sur les petites surfaces.
                </li>
                <li>
                  <strong>Le niveau de finition</strong> — entre un carrelage
                  standard et une pierre naturelle posée en calepinage, le poste
                  peut tripler.
                </li>
                <li>
                  <strong>Le type d’immeuble</strong> — haussmannien,
                  copropriété avec règlement strict, étage élevé sans ascenseur
                  : autant de contraintes logistiques facturées.
                </li>
                <li>
                  <strong>Les choix techniques</strong> — ouverture de mur
                  porteur, VMC double flux, plancher chauffant : chacun engage
                  des études et des intervenants spécialisés.
                </li>
              </ul>
            </>
          ),
        },
        {
          title: "TVA réduite : 10 % ou 5,5 %",
          body: (
            <>
              <p>
                La TVA à <strong>10 %</strong> s’applique aux travaux
                d’amélioration, transformation, aménagement et entretien d’un
                logement achevé depuis plus de deux ans. C’est le cas le plus
                courant en rénovation d’appartement.
              </p>
              <p>
                La TVA à <strong>5,5 %</strong> concerne les travaux
                d’amélioration de la performance énergétique éligibles —
                isolation, menuiseries, VMC, système de chauffage — ainsi que
                les travaux indissociablement liés.
              </p>
              <p>
                Un même devis peut donc mélanger deux taux. Nous les distinguons
                ligne par ligne : c’est une garantie de transparence, et cela
                facilite le montage des dossiers d’aide.
              </p>
            </>
          ),
        },
      ]}
      faq={[
        {
          q: "Cette estimation vaut-elle devis ?",
          a: "Non. Elle donne un ordre de grandeur fondé sur les fourchettes observées en Île-de-France. Seule une visite technique permet un chiffrage engageant — nous la réalisons sous 5 jours, et le devis détaillé suit sous 48 h.",
        },
        {
          q: "Les prix affichés sont-ils HT ou TTC ?",
          a: "Les fourchettes sont exprimées hors taxes. Selon votre situation, la TVA applicable est de 10 % (logement de plus de 2 ans) ou 5,5 % (travaux d’amélioration énergétique éligibles).",
        },
        {
          q: "Le mobilier et l’électroménager sont-ils compris ?",
          a: "Non. L’estimation couvre les travaux : dépose, réseaux, plâtrerie, revêtements, menuiserie, pose de la cuisine et de la salle de bain. Le mobilier libre, l’électroménager et la décoration restent à votre charge.",
        },
        {
          q: "Pourquoi une majoration pour immeuble haussmannien ?",
          a: "Moulures à conserver ou restituer, parquets anciens à traiter, hauteurs sous plafond importantes, accès souvent contraint : le temps passé et le niveau de finition attendu sont supérieurs à ceux d’un immeuble récent.",
        },
      ]}
      related={[
        {
          label: "Prix de rénovation au m²",
          href: "/renovation-appartement-paris",
        },
        { label: "Rénovation à Paris (75)", href: "/renovation-paris-75" },
        {
          label: "Combien coûte une rénovation à Paris ?",
          href: "/conseils/combien-coute-renovation-appartement-paris",
        },
        {
          label: "Guide rénovation 2026 (PDF)",
          href: "/guide-renovation-2026",
        },
        { label: "Demander un devis", href: "/contact-devis" },
      ]}
    >
      <BudgetEstimator />
    </ToolPage>
  );
}
