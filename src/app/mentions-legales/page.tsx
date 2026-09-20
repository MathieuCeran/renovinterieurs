import type { Metadata } from "next";
import Link from "next/link";

import { LegalSection, ToFill } from "@/components/page/legal";
import { PageHero } from "@/components/page/page-hero";
import { site } from "@/lib/site";

const path = "/mentions-legales";
const title = "Mentions légales";
const description =
  "Mentions légales du site RenovIntérieur : éditeur, hébergeur, propriété intellectuelle et responsabilité.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  robots: { index: true, follow: true },
};

export default function MentionsLegales() {
  return (
    <>
      <PageHero
        eyebrow="Informations légales"
        line1="Mentions"
        line2="légales"
        image="/images/salon-haussmannien-moulures.jpg"
        height="44svh"
      />

      <div className="container-x py-12 lg:py-16">
        <p className="max-w-3xl rounded-2xl border border-terra/25 bg-terra/6 p-5 text-[0.88rem] leading-relaxed text-ink/80">
          <strong className="font-medium">
            À compléter avant mise en ligne.
          </strong>{" "}
          Les mentions surlignées doivent être renseignées avec les informations
          officielles de la société (extrait Kbis, contrat d’assurance, contrat
          d’hébergement). Elles ne peuvent pas être devinées.
        </p>
      </div>

      <div className="container-x pb-8">
        <LegalSection n={1} title="Éditeur du site">
          <p>
            Le présent site est édité par <ToFill>[Raison sociale]</ToFill>,
            exerçant sous la marque {site.name},{" "}
            <ToFill>[forme juridique]</ToFill> au capital de{" "}
            <ToFill>[montant] €</ToFill>.
          </p>
          <ul>
            <li>
              Siège social : <ToFill>[adresse complète]</ToFill>
            </li>
            <li>
              RCS : <ToFill>[ville et numéro]</ToFill> — SIRET :{" "}
              <ToFill>[numéro à 14 chiffres]</ToFill>
            </li>
            <li>
              TVA intracommunautaire : <ToFill>[FR + 11 caractères]</ToFill>
            </li>
            <li>
              Directeur de la publication :{" "}
              <ToFill>[nom du représentant légal]</ToFill>
            </li>
            <li>
              Téléphone : {site.phoneDisplay} — E-mail : {site.email}
            </li>
          </ul>
        </LegalSection>

        <LegalSection n={2} title="Hébergement">
          <p>
            Le site est hébergé par <ToFill>[nom de l’hébergeur]</ToFill>,{" "}
            <ToFill>[adresse]</ToFill>,{" "}
            <ToFill>[téléphone ou URL de contact]</ToFill>.
          </p>
        </LegalSection>

        <LegalSection n={3} title="Assurances professionnelles">
          <p>
            L’entreprise est couverte par une garantie décennale et une
            responsabilité civile professionnelle souscrites auprès de{" "}
            <ToFill>[nom de l’assureur]</ToFill>, police n°{" "}
            <ToFill>[numéro]</ToFill>, pour les activités de second œuvre
            exercées en {site.area}.
          </p>
          <p>
            Les attestations en cours de validité sont remises au client avant
            le démarrage de tout chantier.
          </p>
        </LegalSection>

        <LegalSection n={4} title="Propriété intellectuelle">
          <p>
            L’ensemble des contenus du site — textes, photographies de
            chantiers, logo, identité visuelle, code source — est protégé par le
            droit de la propriété intellectuelle. Toute reproduction ou
            représentation, totale ou partielle, sans autorisation écrite
            préalable est interdite.
          </p>
          <p>
            Les photographies présentées illustrent des réalisations et des
            matériaux mis en œuvre par l’entreprise ou ses partenaires.
          </p>
        </LegalSection>

        <LegalSection n={5} title="Responsabilité">
          <p>
            Les informations diffusées sur ce site, notamment les fourchettes de
            prix au m² et les durées de chantier, sont fournies à titre
            indicatif. Elles ne constituent ni un devis, ni un engagement
            contractuel. Seul le devis détaillé remis après visite technique
            engage l’entreprise.
          </p>
          <p>
            Les dispositifs d’aide financière mentionnés (TVA réduite,
            MaPrimeRénov’, CEE, éco-PTZ) évoluent régulièrement : leur
            éligibilité est vérifiée au cas par cas lors de l’étude du projet.
          </p>
        </LegalSection>

        <LegalSection n={6} title="Liens et médiation">
          <p>
            Le site peut contenir des liens vers des sites tiers dont le contenu
            n’engage pas la responsabilité de l’éditeur.
          </p>
          <p>
            Conformément au code de la consommation, le client consommateur peut
            recourir gratuitement à un médiateur de la consommation :{" "}
            <ToFill>[nom et coordonnées du médiateur]</ToFill>.
          </p>
        </LegalSection>

        <LegalSection n={7} title="Données personnelles">
          <p>
            Le traitement des données collectées via les formulaires du site est
            détaillé dans notre{" "}
            <Link href="/politique-de-confidentialite">
              politique de confidentialité
            </Link>
            .
          </p>
        </LegalSection>
      </div>
    </>
  );
}
