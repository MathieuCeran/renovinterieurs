import type { Metadata } from "next";

import { PlanningSimulator } from "@/components/tools/planning-simulator";
import { ToolPage } from "@/components/tools/tool-page";
import { site } from "@/lib/site";
import { getTool } from "@/lib/tools";

const tool = getTool("planning-travaux-renovation")!;

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
          title: "Combien de temps durent des travaux ?",
          body: (
            <>
              <p>
                Une rénovation partielle s’étale sur{" "}
                <strong>3 à 6 semaines</strong>. Une rénovation complète d’un
                appartement parisien de 50 à 80 m² demande
                <strong> 8 à 14 semaines</strong>. Au-delà de 100 m², ou sur un
                projet haut de gamme, comptez <strong>4 à 6 mois</strong>.
              </p>
              <p>
                Ces durées couvrent le chantier lui-même. Elles n’incluent ni
                l’étude préalable, ni l’approvisionnement des pièces sur-mesure
                — une cuisine ou des menuiseries fabriquées sur mesure demandent
                souvent 6 à 10 semaines de fabrication, que nous lançons en
                parallèle du gros des travaux.
              </p>
            </>
          ),
        },
        {
          title: "L’ordre des corps d’état",
          body: (
            <>
              <p>
                Un chantier tenu, c’est d’abord un enchaînement respecté.
                Inverser deux lots fait perdre des semaines et abîme le travail
                déjà fait.
              </p>
              <ul>
                <li>
                  <strong>Protection et dépose</strong> — on protège les parties
                  conservées avant de démolir, jamais l’inverse.
                </li>
                <li>
                  <strong>Réseaux</strong> — plomberie et électricité passent
                  avant toute fermeture de cloison.
                </li>
                <li>
                  <strong>Plâtrerie</strong> — doublages, faux plafonds et
                  enduits referment les réseaux.
                </li>
                <li>
                  <strong>Sols et étanchéité</strong> — chapes, nattes
                  d’étanchéité en pièce humide, carrelage puis parquet.
                </li>
                <li>
                  <strong>Cuisine et salle de bain</strong> — pose des meubles,
                  plans et appareillages.
                </li>
                <li>
                  <strong>Finitions</strong> — peinture en dernier, pour
                  rattraper les inévitables retouches.
                </li>
              </ul>
            </>
          ),
        },
        {
          title: "Ce qui fait déraper un planning",
          body: (
            <>
              <p>
                Les retards viennent rarement des artisans. Dans l’ordre de
                fréquence :
              </p>
              <ul>
                <li>
                  <strong>Les décisions tardives</strong> — un choix de
                  carrelage validé trois semaines trop tard bloque toute la
                  suite.
                </li>
                <li>
                  <strong>Les délais d’approvisionnement</strong> — le
                  sur-mesure se commande dès la signature, pas au moment de la
                  pose.
                </li>
                <li>
                  <strong>Les surprises de chantier</strong> — canalisation en
                  plomb, plancher affaissé, amiante dans une colle de sol.
                </li>
                <li>
                  <strong>La copropriété</strong> — autorisation d’accès,
                  horaires de nuisances, réservation d’ascenseur ou de place de
                  stationnement.
                </li>
              </ul>
              <p>
                C’est précisément le rôle de l’interlocuteur unique : anticiper
                ces points avant qu’ils ne coûtent des semaines, et vous
                transmettre un compte-rendu hebdomadaire.
              </p>
            </>
          ),
        },
      ]}
      faq={[
        {
          q: "Peut-on habiter le logement pendant les travaux ?",
          a: "Sur un rafraîchissement ou une rénovation d’une seule pièce, souvent oui. Sur une rénovation complète avec reprise des réseaux, non : l’eau et l’électricité sont coupées par phases, et la poussière est difficilement compatible avec une occupation.",
        },
        {
          q: "Quand faut-il commander la cuisine sur-mesure ?",
          a: "Dès la validation des plans, soit au tout début du chantier. Les délais de fabrication (6 à 10 semaines) se déroulent alors en parallèle des lots techniques, sans allonger la durée totale.",
        },
        {
          q: "Le planning est-il contractuel ?",
          a: "Le planning prévisionnel est remis avec le devis détaillé, après visite technique. Il devient contractuel à la signature et fait l’objet d’un compte-rendu hebdomadaire tout au long du chantier.",
        },
        {
          q: "Que se passe-t-il à la réception ?",
          a: "Nous réalisons une visite de réception avec vous, consignons les éventuelles réserves et les levons. La garantie de parfait achèvement court un an, la biennale deux ans et la décennale dix ans. Nous assurons en plus un SAV de 12 mois.",
        },
      ]}
      related={[
        { label: "Notre méthode en 5 étapes", href: "/nos-services" },
        {
          label: "Étapes d’une rénovation intérieure",
          href: "/conseils/renovation-interieure-maison-etapes",
        },
        {
          label: "Rénovation complète de maison",
          href: "/conseils/renovation-complete-maison-ile-de-france",
        },
        { label: "Nos réalisations", href: "/realisations-renovation" },
        { label: "Demander un devis", href: "/contact-devis" },
      ]}
    >
      <PlanningSimulator />
    </ToolPage>
  );
}
