# RenovIntérieur — refonte Next.js

Refonte du site WordPress `renovinterieurs.fr` en Next.js 16 (App Router, Tailwind v4).
**Étape en cours : page d'accueil uniquement**, pour validation de la direction design.

## Lancer

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de production
```

## Direction design

Éditoriale et claire, inspirée des références architecture haut de gamme :

- **Fond** blanc cassé chaud `#EFEBE6`, cartes blanches, blocs contrastés en brun `#5E2A16`.
- **Accent** terracotta `#E6562B` (couleur de la charte existante) + or `#C9A227` du monogramme.
- **Typographie** : Inter (titres serrés, `tracking -0.03em`) × Fraunces italique pour le mot
  signature de chaque titre — le contraste sans/serif est la signature visuelle du site.
- **Formes** : coins arrondis 16→40 px, boutons « pill » avec pastille flèche, images en cartes.

## Ouverture cinématique

Au premier chargement de la session, un rideau plein écran affiche le monogramme
et l’accroche « L’art de faire renaître **un intérieur** », puis deux panneaux
s’écartent sur le héros (4 s, easing cinématique). Tout est en CSS
(`.intro` dans `globals.css`) ; un script inline de 150 octets pose
`data-intro-seen` sur `<html>` via `sessionStorage` pour ne pas le rejouer à
chaque navigation, et l’ouverture est supprimée en `prefers-reduced-motion`.

## Header

Le header porte un **dégradé sombre permanent** (`.hdr-skin` dans
`globals.css`) qui s'estompe vers le bas sur 190 % de sa hauteur : pas de
barre franche, un texte blanc lisible aussi bien au-dessus d'une photo
qu'au-dessus d'une section claire.

Contraste mesuré du texte de navigation sur une section claire :
**10,3:1** (fond effectif `rgb(67,64,61)`) — très au-delà du seuil AAA.

Ce dégradé ne dépend d'**aucun JavaScript** : il ne peut donc pas
« manquer » si l'hydratation tarde. React ne gère plus ici que
l'ouverture des menus et la réduction de hauteur au scroll.

## Animations

**Aucune librairie JS d'animation.** Tout est en CSS (`src/app/globals.css`) :

- révélations au scroll via `animation-timeline: view()`, encapsulées dans
  `@supports` → si le navigateur ne gère pas les timelines de scroll, **le contenu reste
  visible** (pas de page blanche, bon pour le SEO et les navigateurs anciens) ;
- animations d'arrivée du hero (`.anim-rise`, `.anim-unmask`, `.anim-zoom`) ;
- accordéons en `grid-template-rows: 0fr → 1fr` (FAQ, zones du footer) ;
- zooms d'images au survol, soulignés animés, pastilles flèches ;
- tout est neutralisé sous `prefers-reduced-motion: reduce`.

Seul `lenis` reste en JS, pour le défilement inertiel (se désactive tout seul en mode
animations réduites).

## Outils interactifs

Trois calculateurs gratuits, pensés pour le référencement longue traîne et pour
qualifier les leads avant même le premier appel :

| Outil | URL | Ce qu'il calcule |
| --- | --- | --- |
| Estimateur de budget | `/outils/estimateur-budget-renovation` | Fourchette €/m² selon surface, niveau et contraintes, répartition par poste, TVA applicable |
| Simulateur DPE | `/outils/simulateur-dpe-passoire-energetique` | Gain de classes selon le bouquet de travaux, sortie de passoire, aides mobilisables |
| Planning de chantier | `/outils/planning-travaux-renovation` | Durée estimée et diagramme des phases, semaine par semaine |

Toute la logique est dans `src/lib/tools.ts`, **alimentée par les chiffres publiés
par le client** (fourchettes 250-450 / 600-900 / 1 000-1 500 / 1 500-2 500 €/m²,
durées 3-6 semaines à 4-6 mois, objectif « 2-3 classes DPE »). Aucun montant d'aide
n'est inventé : seuls les dispositifs sont nommés. Chaque résultat porte une mention
« estimation indicative, ne vaut pas devis ».

Les sélecteurs sont des `input` radio/checkbox natifs stylés : ils fonctionnent
et restent lisibles même sans JavaScript.

**Maillage** : les outils sont dans le menu principal, le footer (colonne dédiée),
la rangée « Nos prestations » du bloc engagements, une bande dédiée sur l'accueil,
et chaque page outil renvoie vers les deux autres + 5 pages métier liées.

## SEO

- `h1` unique (héros), `h2` par section, `aria-labelledby` partout.
- JSON-LD `GeneralContractor` (layout) + `FAQPage` (accueil).
- `src/app/sitemap.ts` et `src/app/robots.ts` — le sitemap est **dérivé du store
  de contenu** : 83 URL, priorités par type de page.
- Par page : `title` + `description` du site actuel, canonical, Open Graph et
  Twitter Card, JSON-LD `BreadcrumbList` + `Article`.
- Accueil : `og.jpg` 1200×630, `max-image-preview:large`, JSON-LD
  `GeneralContractor` avec `hasOfferCatalog` (une `Service` par prestation).
- Bloc « Nos engagements » : maillage interne vers les 10 prestations
  principales (ancres optimisées via l'attribut `title`).
- Toutes les images portent un `alt` descriptif.
- `llms.txt` : résumé factuel du site (prix, méthode, engagements, FAQ, plan des
  URL) pour les assistants IA, généré depuis le store de contenu.
- `robots.txt` autorise explicitement les crawlers d'IA (GPTBot, ClaudeBot,
  PerplexityBot, Google-Extended…) : le contenu a vocation à être cité.
- JSON-LD par type de page : `GeneralContractor`, `Service`, `Article`,
  `BreadcrumbList`, `FAQPage`, `Blog`, `CollectionPage`, `ItemList`, `Book`,
  `WebApplication`, `ContactPage`.

## Performance

- `next.config.ts` : AVIF + WebP, tailles d'images calibrées sur la maquette,
  cache immuable d'un an sur `/images`, en-têtes `X-Content-Type-Options`,
  `Referrer-Policy` et `Permissions-Policy`.
- 97 pages prérendues en statique : aucun rendu serveur à la volée hors `/api/lead`.
- Zéro librairie d'animation, zéro police auto-hébergée hors `next/font`.

## Pages internes

Les 83 pages du site client ont été récupérées et leur contenu structuré dans
`src/content/pages.json` (titre, meta, H1, chapeau, sections H2 → paragraphes /
listes / H3). Le HTML du client duplique ses blocs : le contenu est dédupliqué
à l’import.

Une route attrape-tout `src/app/[...slug]/page.tsx` les rend toutes en statique
(`generateStaticParams`), avec le même langage visuel que l’accueil :
hero pleine largeur (H1 coupé sur le « : » pour la moitié en serif italique),
chapeau, sommaire ancré, sections numérotées en colonne collante, bandes
visuelles, bloc engagements et bloc devis.

**Les URL sont celles du site actuel** (`/beton-cire-paris`,
`/renovation-hauts-de-seine-92`, `/contact-devis`…) : aucune redirection
nécessaire, le référencement acquis est préservé.

### Gabarits dédiés

`/contact-devis` a son propre gabarit orienté conversion (pas de sommaire) :
hero court, promesses chiffrées (24 h / 5 jours / 48 h / 0 €), formulaire en
2 étapes, contact direct téléphone / WhatsApp / e-mail, zones, process.
Les pages qui sortent du gabarit générique sont listées dans `CUSTOM_ROUTES`
(`src/lib/content.ts`) : elles sont exclues de la route attrape-tout mais
restent dans le sitemap.

Six pages ont leur propre gabarit :

| Page | Traitement |
| --- | --- |
| `/contact-devis` | Conversion : promesses chiffrées, formulaire 2 étapes, contact direct, zones, process |
| `/faq` | 49 questions groupées en 6 thèmes, accordéons, JSON-LD `FAQPage` |
| `/realisations-renovation` | Galerie filtrable (20 visuels, 7 catégories), JSON-LD `ItemList` |
| `/conseils` | Index des 28 guides : filtres par thème, article mis en avant, temps de lecture, JSON-LD `Blog` |
| `/guide-renovation-2026` | Lead magnet : 7 chapitres + formulaire e-mail, JSON-LD `Book` |
| `/mentions-legales` et `/politique-de-confidentialite` | Créées de zéro (absentes du site actuel) |

**Le `/faq` du site actuel est cassé côté client** : il sert le contenu de la page
isolation. La nouvelle page est reconstruite à partir des vraies FAQ présentes sur
les pages services (`src/content/faq.json`, généré depuis le store de contenu) plus
les 6 questions de l’accueil.

> ⚠️ Les deux pages légales contiennent des mentions **surlignées à compléter**
> (raison sociale, SIRET, hébergeur, assureur, médiateur, sous-traitants).
> Ces informations ne peuvent pas être devinées : elles doivent venir du client.

## Structure

```
src/
  app/
    layout.tsx        header + footer + barre d'action + JSON-LD LocalBusiness
    page.tsx          composition de la home + JSON-LD FAQPage
    globals.css       design tokens + système d'animation
    api/lead/route.ts réception des demandes de devis
  lib/site.ts         TOUT le contenu éditorial (repris du site actuel)
  components/
    layout/           header, footer, barre d'action mobile
    sections/         hero, statement, commitments, services, gallery,
                      pillars, zones, pricing, process, faq, cta, lead-form
    ui/kit.tsx        boutons « pill » et icônes
```

Le contenu texte est centralisé dans `src/lib/site.ts` : les pages internes réutiliseront
les mêmes données.

## Formulaire de devis

Parcours en 2 étapes (projet → coordonnées), validation côté client puis `POST /api/lead`.

Par défaut le lead est **journalisé côté serveur**. Pour le router vers un CRM, un
webhook Make/Zapier ou un service d'e-mail, définir :

```bash
LEAD_WEBHOOK_URL=https://…
```

## À brancher avant mise en ligne

- `LEAD_WEBHOOK_URL` (destination des demandes de devis).
- Les pages internes (`/services`, `/realisations`, `/contact`, pages de zones…) ne sont
  pas encore créées : les liens existent déjà et pointeront dessus.

## Assets

Logo, monogramme et favicons dans `public/brand/`, photos dans `public/images/`.

Toutes les photos proviennent du site actuel du client. Les visuels qui étaient
des **montages** (avant/après, diptyques, triptyques, infographies) ont été
écartés ou **recadrés** en visuels simples (`loft-beton-cire`,
`loft-cuisine-cheminee`, `salon-haussmannien-moulures`,
`balcon-haussmannien-paris`).
