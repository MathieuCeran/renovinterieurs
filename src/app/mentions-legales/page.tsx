import type { Metadata } from "next";

import { pageTitle } from "@/lib/content";
import Link from "next/link";

import { LegalSection } from "@/components/page/legal";
import { PageHero } from "@/components/page/page-hero";
import { site } from "@/lib/site";

const path = "/mentions-legales";
const title = "Mentions légales";
const description =
  "Mentions légales du site RenovIntérieurs : éditeur, hébergeur, propriété intellectuelle, responsabilité, médiation et données personnelles.";

export const metadata: Metadata = {
  title: pageTitle(title),
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
        image="/images/chantiers/niches-arches-sur-mesure.jpg"
        height="44svh"
      />

      <div className="container-x pt-12 pb-8 lg:pt-16">
        <LegalSection n={1} title="Éditeur du site">
          <p>
            Le site {site.name} est édité par IA RENOV, société par actions
            simplifiée unipersonnelle (SASU) au capital de 1 000 €, immatriculée
            au registre du commerce et des sociétés de Nanterre depuis le 14
            octobre 2020. {site.name} est une marque d’IA RENOV.
          </p>
          <ul>
            <li>
              Siège social : 8 rue Gabriel Péri, 92250 La Garenne-Colombes
            </li>
            <li>
              RCS Nanterre 889 976 387 — SIRET : 889 976 387 00023
            </li>
            <li>TVA intracommunautaire : FR02889976387</li>
            <li>
              Directeur de la publication : Ilann Atlan, en qualité de président
              d’IA RENOV
            </li>
            <li>
              Téléphone : {site.phoneDisplay} — E-mail : {site.email}
            </li>
          </ul>
        </LegalSection>

        <LegalSection n={2} title="Hébergement">
          <p>
            Le site est hébergé par Vercel Inc., 440 N Barranca Avenue #4133,
            Covina, CA 91723, États-Unis —{" "}
            <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">
              vercel.com
            </a>
            .
          </p>
        </LegalSection>

        <LegalSection n={3} title="Conception et réalisation du site">
          <p>
            AJD Studio (entreprise individuelle) – SIREN 532 735 990, RCS
            Bourg-en-Bresse —{" "}
            <a href="https://ajdstudio.fr/" target="_blank" rel="noopener noreferrer">
              ajdstudio.fr
            </a>
            .
          </p>
        </LegalSection>

        <LegalSection n={4} title="Assurances">
          <p>
            IA RENOV pilote les projets de rénovation ; les travaux sont
            réalisés par des entreprises partenaires indépendantes, contractées
            directement par le client, qui portent leurs propres assurances
            (garantie décennale et responsabilité civile professionnelle). Leurs
            attestations en cours de validité sont vérifiées par IA RENOV et
            remises au client avant le démarrage de tout chantier.
          </p>
        </LegalSection>

        <LegalSection n={5} title="Propriété intellectuelle">
          <p>
            L’ensemble des contenus du site — textes, photographies de
            chantiers, logo, identité visuelle, code source — est protégé par le
            droit de la propriété intellectuelle. Toute reproduction ou
            représentation, totale ou partielle, sans autorisation écrite
            préalable est interdite.
          </p>
          <p>
            Les photographies présentées illustrent des projets pilotés par IA
            RENOV et des matériaux mis en œuvre par les entreprises
            partenaires.
          </p>
        </LegalSection>

        <LegalSection n={6} title="Responsabilité">
          <p>
            Les informations diffusées sur ce site, notamment les fourchettes de
            prix au m² et les durées de chantier, sont fournies à titre
            indicatif. Elles ne constituent ni un devis, ni un engagement
            contractuel. Seuls les devis détaillés des entreprises partenaires, remis
            après visite technique, engagent celles-ci.
          </p>
          <p>
            Les dispositifs d’aide financière mentionnés (TVA réduite,
            MaPrimeRénov’, CEE, éco-PTZ) évoluent régulièrement : leur
            éligibilité est vérifiée au cas par cas lors de l’étude du projet.
          </p>
        </LegalSection>

        <LegalSection n={7} title="Liens et médiation">
          <p>
            Le site peut contenir des liens vers des sites tiers dont le contenu
            n’engage pas la responsabilité de l’éditeur.
          </p>
          <p>
            Conformément à l’article L612-1 du Code de la consommation, tout
            consommateur a le droit de recourir gratuitement à un médiateur de
            la consommation en vue de la résolution amiable d’un litige. Avant
            de le saisir, le consommateur adresse une réclamation écrite au
            professionnel concerné : pour le pilotage de votre projet, IA RENOV,
            8 rue Gabriel Péri, 92250 La Garenne-Colombes, ou {site.email}. Les
            coordonnées du médiateur de la consommation sont communiquées sur
            simple demande à cette adresse.
          </p>
          <p>
            Pour les litiges relatifs aux travaux, le professionnel cocontractant
            est l’entreprise partenaire qui a signé le devis ; son médiateur de
            la consommation est indiqué dans ses documents contractuels.
          </p>
        </LegalSection>

        <LegalSection n={8} title="Données personnelles">
          <p>
            Le responsable du traitement des données collectées sur ce site est
            IA RENOV, 8 rue Gabriel Péri, 92250 La Garenne-Colombes. Vos
            données servent à répondre à votre demande et à préparer votre
            projet ; elles ne sont ni vendues ni cédées à des fins commerciales.
          </p>
          <p>
            Elles sont destinées à IA RENOV et, dans la stricte mesure
            nécessaire à votre projet, aux entreprises partenaires qui
            établissent les devis et réalisent les travaux. Elles peuvent être
            traitées par les prestataires techniques suivants : Vercel Inc.
            (hébergement du site) et OVHcloud (messagerie qui reçoit les
            demandes envoyées depuis les formulaires). Une copie de chaque
            demande est adressée au prestataire technique du site, pour
            s’assurer de sa bonne réception. Les transferts hors de l’Union
            européenne sont encadrés par les garanties prévues par le règlement
            général sur la protection des données.
          </p>
          <p>
            Demande sans suite : conservation 3 ans à compter du dernier
            contact. Client : durée de la relation, puis archivage pendant les
            durées imposées par la loi.
          </p>
          <p>
            Vous disposez d’un droit d’accès, de rectification, d’effacement, de
            limitation du traitement, d’opposition et de portabilité de vos
            données, du droit de retirer votre consentement à tout moment et de
            définir des directives sur le sort de vos données après votre
            décès. Pour les exercer : {site.email}. Vous pouvez adresser une
            réclamation à la CNIL, sur{" "}
            <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
              cnil.fr
            </a>
            .
          </p>
          <p>
            Les cookies de mesure d’audience et publicitaires de Google ne sont
            déposés qu’avec votre accord ; votre choix est conservé six mois et
            reste modifiable à tout moment avec le lien « Gérer les cookies » en
            bas de chaque page. Le détail figure dans notre{" "}
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
