import type { Metadata } from "next";

import { LegalSection, ToFill } from "@/components/page/legal";
import { PageHero } from "@/components/page/page-hero";
import { site } from "@/lib/site";

const path = "/politique-de-confidentialite";
const title = "Politique de confidentialité";
const description =
  "Quelles données RenovIntérieur collecte via ses formulaires, pourquoi, combien de temps elles sont conservées et comment exercer vos droits.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  robots: { index: true, follow: true },
};

export default function Confidentialite() {
  return (
    <>
      <PageHero
        eyebrow="Vos données"
        line1="Politique de"
        line2="confidentialité"
        image="/images/salon-canape-courbe.jpg"
        height="44svh"
      />

      <div className="container-x py-12 lg:py-16">
        <p className="max-w-3xl rounded-2xl border border-terra/25 bg-terra/6 p-5 text-[0.88rem] leading-relaxed text-ink/80">
          <strong className="font-medium">
            À compléter avant mise en ligne.
          </strong>{" "}
          Le contenu ci-dessous décrit fidèlement ce que fait le site. Les
          mentions surlignées (identité du responsable de traitement,
          sous-traitants réellement utilisés, durées retenues) doivent être
          validées par le client.
        </p>
      </div>

      <div className="container-x pb-8">
        <LegalSection n={1} title="Responsable de traitement">
          <p>
            Le responsable du traitement des données collectées sur ce site est{" "}
            <ToFill>[Raison sociale]</ToFill>, exerçant sous la marque{" "}
            {site.name}, dont le siège social est situé{" "}
            <ToFill>[adresse complète]</ToFill>.
          </p>
          <p>
            Contact : {site.email} — {site.phoneDisplay}
          </p>
        </LegalSection>

        <LegalSection n={2} title="Données collectées">
          <p>
            Le site ne collecte que les données que vous saisissez
            volontairement dans ses formulaires. Aucune création de compte n’est
            possible.
          </p>
          <p>
            <strong className="font-medium text-ink">
              Formulaire de devis
            </strong>{" "}
            : type de projet, commune ou arrondissement, surface, budget estimé,
            échéance, nom et prénom, e-mail, téléphone, message libre.
          </p>
          <p>
            <strong className="font-medium text-ink">
              Formulaire guide PDF
            </strong>{" "}
            : prénom et adresse e-mail.
          </p>
          <p>
            Les champs marqués d’un astérisque sont obligatoires : sans eux,
            nous ne pouvons pas vous recontacter ni établir de devis.
          </p>
        </LegalSection>

        <LegalSection n={3} title="Finalités et bases légales">
          <ul>
            <li>
              Répondre à votre demande, organiser la visite technique et établir
              votre devis — base légale : mesures précontractuelles prises à
              votre demande.
            </li>
            <li>
              Vous envoyer le guide PDF demandé et, le cas échéant, nos conseils
              par e-mail — base légale : votre consentement, retirable à tout
              moment.
            </li>
            <li>
              Assurer le suivi de la relation commerciale et le SAV — base
              légale : exécution du contrat et intérêt légitime.
            </li>
          </ul>
        </LegalSection>

        <LegalSection n={4} title="Destinataires et sous-traitants">
          <p>
            Vos données sont destinées aux seules équipes de {site.name} en
            charge du chiffrage et du suivi de chantier. Elles ne sont ni
            vendues, ni louées, ni cédées à des tiers à des fins commerciales.
          </p>
          <p>
            Elles peuvent être traitées par les prestataires techniques suivants
            : <ToFill>[hébergeur]</ToFill>,{" "}
            <ToFill>[outil de gestion des demandes / CRM]</ToFill>,{" "}
            <ToFill>[service d’envoi d’e-mails]</ToFill>. Tous sont situés dans
            l’Union européenne ou présentent des garanties équivalentes.
          </p>
        </LegalSection>

        <LegalSection n={5} title="Durée de conservation">
          <ul>
            <li>
              Demande sans suite : <ToFill>[3 ans]</ToFill> à compter du dernier
              contact.
            </li>
            <li>
              Client : durée de la relation contractuelle, puis conservation des
              pièces comptables et des garanties pendant la durée légale
              (jusqu’à 10 ans pour la décennale).
            </li>
            <li>
              Inscription au guide : jusqu’au retrait de votre consentement.
            </li>
          </ul>
        </LegalSection>

        <LegalSection n={6} title="Cookies et traceurs">
          <p>
            Ce site n’utilise aucun cookie publicitaire ni traceur tiers de
            mesure d’audience.
          </p>
          <p>
            Il utilise uniquement le stockage de session de votre navigateur
            pour ne pas rejouer l’animation d’ouverture à chaque page. Cette
            information reste sur votre appareil, n’est jamais transmise et
            disparaît à la fermeture de l’onglet.
          </p>
          <p>
            Si un outil de mesure d’audience est ajouté par la suite, un bandeau
            de consentement sera mis en place et cette section mise à jour.
          </p>
        </LegalSection>

        <LegalSection n={7} title="Sécurité">
          <p>
            Les échanges entre votre navigateur et le site sont chiffrés
            (HTTPS). L’accès aux demandes reçues est limité aux personnes
            habilitées.
          </p>
        </LegalSection>

        <LegalSection n={8} title="Vos droits">
          <p>
            Vous disposez d’un droit d’accès, de rectification, d’effacement, de
            limitation, d’opposition et de portabilité sur vos données, ainsi
            que du droit de retirer votre consentement à tout moment.
          </p>
          <p>
            Pour les exercer, écrivez à {site.email} en précisant votre demande.
            Une réponse vous sera apportée dans un délai d’un mois.
          </p>
          <p>
            Si la réponse ne vous satisfait pas, vous pouvez introduire une
            réclamation auprès de la CNIL (
            <a href="https://www.cnil.fr">www.cnil.fr</a>), 3 place de Fontenoy,
            TSA 80715, 75334 Paris Cedex 07.
          </p>
        </LegalSection>
      </div>
    </>
  );
}
