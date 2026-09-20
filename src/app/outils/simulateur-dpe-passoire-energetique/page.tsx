import type { Metadata } from "next";

import { DpeSimulator } from "@/components/tools/dpe-simulator";
import { ToolPage } from "@/components/tools/tool-page";
import { site } from "@/lib/site";
import { getTool } from "@/lib/tools";

const tool = getTool("simulateur-dpe-passoire-energetique")!;

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
          title: "Passoire énergétique : ce que dit le DPE",
          body: (
            <>
              <p>
                Un logement classé <strong>F ou G</strong> au diagnostic de
                performance énergétique est qualifié de passoire énergétique. Le
                DPE évalue à la fois la consommation d’énergie primaire et les
                émissions de gaz à effet de serre : la classe retenue est la
                moins favorable des deux.
              </p>
              <p>
                En appartement ancien, l’essentiel des déperditions vient des
                parois opaques (murs, plancher haut), des menuiseries et du
                renouvellement d’air. C’est pourquoi un geste isolé fait
                rarement gagner plus d’une classe : c’est le bouquet de travaux
                qui change la donne.
              </p>
            </>
          ),
        },
        {
          title: "Dans quel ordre engager les travaux",
          body: (
            <>
              <p>
                L’ordre compte autant que le montant investi. La logique est
                toujours la même : traiter l’enveloppe avant les équipements.
              </p>
              <ul>
                <li>
                  <strong>1. L’enveloppe</strong> — isolation des murs par
                  l’intérieur, plancher haut ou combles. C’est le poste le plus
                  structurant.
                </li>
                <li>
                  <strong>2. Les menuiseries</strong> — double ou triple
                  vitrage, traitement des ponts thermiques au niveau des
                  tableaux et des appuis.
                </li>
                <li>
                  <strong>3. La ventilation</strong> — une VMC adaptée évite de
                  transformer un logement bien isolé en logement humide.
                </li>
                <li>
                  <strong>4. Le chauffage</strong> — dimensionné en dernier, une
                  fois les besoins réduits : on évite ainsi de surdimensionner
                  l’équipement.
                </li>
              </ul>
              <p>
                En copropriété, certains postes dépendent d’une décision
                collective. Nous vérifions systématiquement le règlement et les
                travaux votés avant de chiffrer.
              </p>
            </>
          ),
        },
        {
          title: "Les aides mobilisables",
          body: (
            <>
              <p>
                Plusieurs dispositifs peuvent se cumuler selon votre situation
                et la nature des travaux :
              </p>
              <ul>
                <li>
                  <strong>TVA à 5,5 %</strong> sur les travaux d’amélioration
                  énergétique éligibles et les travaux indissociablement liés.
                </li>
                <li>
                  <strong>MaPrimeRénov’</strong>, dans son parcours par geste ou
                  son parcours rénovation d’ampleur selon l’envergure du projet.
                </li>
                <li>
                  <strong>Certificats d’économie d’énergie (CEE)</strong>,
                  versés par les fournisseurs d’énergie.
                </li>
                <li>
                  <strong>Éco-prêt à taux zéro</strong>, pour financer le reste
                  à charge.
                </li>
              </ul>
              <p>
                Les montants et conditions évoluent régulièrement. Nous
                vérifions l’éligibilité au cas par cas lors de l’étude, et nous
                vous accompagnons dans le montage des dossiers.
              </p>
            </>
          ),
        },
      ]}
      faq={[
        {
          q: "Ce simulateur remplace-t-il un audit énergétique ?",
          a: "Non. Il donne un ordre de grandeur pédagogique du gain possible selon les postes traités. Un audit énergétique réalisé par un professionnel certifié reste indispensable pour un dossier d’aide et pour dimensionner précisément les travaux.",
        },
        {
          q: "Peut-on vraiment gagner 2 ou 3 classes ?",
          a: "Oui, c’est l’objectif que nous visons sur les logements classés F ou G, à condition de traiter l’enveloppe, les menuiseries, la ventilation et le chauffage. Un geste isolé fait généralement gagner une classe au mieux.",
        },
        {
          q: "Faut-il refaire un DPE après les travaux ?",
          a: "Oui. Le DPE post-travaux atteste du nouveau classement : c’est lui qui compte pour la mise en location, la vente et la clôture de certains dossiers d’aide.",
        },
        {
          q: "Et si je suis en copropriété ?",
          a: "L’isolation par l’intérieur, les menuiseries privatives et la VMC individuelle relèvent en général du lot privatif. L’isolation par l’extérieur et le chauffage collectif nécessitent un vote en assemblée générale. Nous faisons le point sur ce qui est faisable dès la visite technique.",
        },
      ]}
      related={[
        {
          label: "Isolation & amélioration énergétique",
          href: "/isolation-amelioration-energetique",
        },
        {
          label: "Sortir d’une passoire énergétique",
          href: "/conseils/sortir-passoire-energetique-dpe-f-g",
        },
        {
          label: "Isolation thermique fenêtres & portes",
          href: "/conseils/isolation-thermique-fenetres-portes",
        },
        {
          label: "Isolation d’une maison ancienne",
          href: "/conseils/isolation-maison-ancienne-par-linterieur",
        },
        { label: "Demander un devis", href: "/contact-devis" },
      ]}
    >
      <DpeSimulator />
    </ToolPage>
  );
}
