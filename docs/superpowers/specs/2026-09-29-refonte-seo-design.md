# Refonte SEO et éditoriale — renovinterieurs.fr

Date : 2026-09-29. Auteur : ajd.studio. Référence : `docs/audit-seo-renovinterieurs-ajdstudio.pdf`.

## 1. Objectif

Passer de 83 pages qui se cannibalisent à environ 40 pages, une intention par page, 700 à 1 100 mots pour les pages qui vendent, un maillage éditorial réel, des blocs UI à la place des murs de texte, et un vocabulaire de pilotage et d'accompagnement.

## 2. Arborescence cible

| URL | Rôle | Statut |
|---|---|---|
| `/` | Accueil : marque, offre, preuve | Gabarit dédié, textes retouchés |
| `/nos-services` | Hub services : 8 cartes, 3 lignes chacune | Réécrit (court) |
| `/renovation-appartement-paris` | Page mère « rénovation d'appartement » et page zone Paris 75 | Réécrit. Absorbe `/renovation-paris-75` |
| `/cuisine-sur-mesure-paris` | Service cuisine | Réécrit |
| `/salle-de-bain-paris` | Service salle de bain étanche (joints époxy = section) | Nouveau. Absorbe `/joints-epoxy-paris` |
| `/beton-cire-paris` | Service béton ciré | Réécrit |
| `/isolation-amelioration-energetique` | Service isolation et DPE | Réécrit |
| `/renovation-gros-oeuvre-surelevation-extension-idf` | Service gros œuvre | Réécrit |
| `/depannage` | Service dépannage | Réécrit |
| `/debarras` | Service débarras | Réécrit |
| `/prix-renovation` | Page prix unique : grille au m², facteurs, exemples, aides, estimateur | Nouveau |
| `/methode` | « Comment ça se passe » : 5 étapes, garanties, SAV, pilotage | Nouveau |
| `/zones` | Hub zones : 4 cartes + liste des communes | Nouveau |
| `/renovation-hauts-de-seine-92` | Zone 92, 18 communes en blocs | Réécrit |
| `/renovation-yvelines-78` | Zone 78, 7 communes en blocs | Réécrit |
| `/renovation-val-de-marne-94` | Zone 94, 10 communes en blocs | Réécrit |
| `/realisations-renovation` | Galerie | Inchangé |
| `/conseils` + 10 articles | Blog | Index inchangé, 10 articles réécrits |
| `/outils` + 3 outils | Outils | Inchangés |
| `/a-propos`, `/faq`, `/contact-devis`, `/guide-renovation-2026`, légal | Institutionnel | `/a-propos` réécrit court, reste inchangé |

### Articles conseils conservés (10)

`combien-coute-renovation-appartement-paris`, `combien-coute-renovation-complete-maison`, `sortir-passoire-energetique-dpe-f-g`, `isolation-maison-ancienne-par-linterieur`, `renovation-cuisine-complete`, `renovation-salle-de-bain-complete`, `resine-beton-cire-salle-de-bain`, `carrelage-salle-de-bain-nettoyage`, `renovation-interieure-maison-etapes`, `renovation-complete-maison-ile-de-france`.

## 3. Redirections 301 (dans `next.config.ts`)

- 35 pages ville → page département (18 → 92, 7 → 78, 10 → 94).
- `/renovation-paris-75` → `/renovation-appartement-paris`.
- `/joints-epoxy-paris` → `/salle-de-bain-paris`.
- URL cassées du bloc engagements : `/renovation-appartement` → `/renovation-appartement-paris`, `/salle-de-bain` et `/joints-epoxy` → `/salle-de-bain-paris`, `/cuisine-sur-mesure` → `/cuisine-sur-mesure-paris`, `/beton-cire` → `/beton-cire-paris`, `/isolation-dpe` → `/isolation-amelioration-energetique`, `/gros-oeuvre` → `/renovation-gros-oeuvre-surelevation-extension-idf`.
- Conseils fusionnés : `cout-renovation-maison-100m2` et `cout-moyen-dune-renovation-interieure-de-maison` → `combien-coute-renovation-complete-maison` ; `isolation-combles-amenageables` et `isolation-cave-maison-ancienne` → `isolation-maison-ancienne-par-linterieur` ; `cuisine-sur-mesure` et `menuisier-cuisiniste` → `renovation-cuisine-complete`.
- Conseils supprimés (12) : `meuble-de-salle-de-bain-sur-mesure` → `renovation-salle-de-bain-complete` ; `isolation-thermique-fenetres-portes` → `isolation-maison-ancienne-par-linterieur` ; les 10 autres (dressing, placard, porte placard, bibliothèque, rangement chambre, aménagement sur mesure, menuiserie intérieure, fenêtre bois, fenêtre Paris, choisir ses menuiseries) → `/conseils`.

## 4. Modèle de contenu

Un fichier JSON par page dans `src/content/pages/`, chargé par `src/lib/content.ts`. L'ancien `pages.json` est supprimé une fois la migration faite.

```ts
type Page = {
  title: string;        // ≤ 60 caractères, sans suffixe de marque (ajouté par le layout)
  description: string;  // ≤ 155 caractères
  h1: string;           // « Sujet : précision » pour l'italique serif
  kind: "service" | "zone" | "article" | "hub" | "info";
  parent: "/nos-services" | "/zones" | "/conseils" | "/";
  eyebrow?: string;     // libellé court au-dessus du H1
  hero?: string;        // image, sinon choisie par visualsFor
  intro: string[];      // 1 à 2 paragraphes, le premier = problème → réponse
  sections: Section[];
  related?: { label: string; href: string; desc?: string }[]; // maillage sortant
};

type Section = { title: string; blocks: Block[]; id?: string };

type Block =
  | { t: "p"; v: string }                       // liens inline [texte](/url)
  | { t: "h3"; v: string }
  | { t: "ul"; items: string[] }                // liens inline autorisés
  | { t: "stats"; items: { value: string; label: string }[] }
  | { t: "cards"; items: { title: string; text: string; href?: string }[] }
  | { t: "table"; head: string[]; rows: string[][]; note?: string }
  | { t: "callout"; title?: string; v: string; href?: string; label?: string }
  | { t: "steps"; items: { title: string; text: string }[] }
  | { t: "faq"; items: { q: string; a: string }[] }
  | { t: "gallery"; items: { src: string; alt: string; caption: string }[] }
  | { t: "links"; items: { label: string; href: string; desc?: string }[] };
```

Règles de rendu :
- Les liens inline sont rendus en `<Link>` interne. Une URL absente du site fait échouer le build (contrôle dans `content.ts`).
- Le sommaire est cliquable (ancres), affiché seulement à partir de 5 sections.
- Le fil d'Ariane suit `parent` : Accueil › Nos services › Cuisine, Accueil › Zones › Hauts-de-Seine, Accueil › Conseils › Article.
- `title` et `description` sont tronqués proprement si un rédacteur dépasse.
- JSON-LD : `Service` pour `kind: service`, `Article` pour `article`, `WebPage` sinon, plus `BreadcrumbList` et `FAQPage` quand un bloc `faq` existe.

## 5. Gabarits

### Page service (option A, « la preuve d'abord »)

1. Hero : eyebrow, H1, promesse en une phrase, photo, bouton devis.
2. Chapeau : 1 paragraphe problème → réponse, 1 paragraphe ce qu'on pilote.
3. `stats` : 4 chiffres (devis 48 h, visite 5 j, garantie 10 ans, SAV 12 mois, ou spécifiques au service).
4. `gallery` : 3 réalisations légendées (lieu, surface, durée).
5. `cards` « Ce que vous obtenez » : 4 à 6 prestations, 1 ligne chacune.
6. `callout` × 2 ou 3 « Nos signatures techniques ».
7. `table` fourchette de prix : 3 lignes, note TVA, lien `/prix-renovation` et estimateur.
8. `faq` : 3 questions propres au service.
9. `links` « Pour aller plus loin » : méthode, prix, zone principale, 1 conseil.
10. CTA (composant global).

Cible : 700 à 1 000 mots, 6 à 7 sections.

### Page zone

Hero local, chapeau sur le bâti du territoire, `stats`, `cards` communes (une carte par commune : 2 lignes de spécificité + services phares), `gallery` locale, `table` prix, `faq` 3 questions locales, `links` vers 3 services et prix. 800 à 1 100 mots.

### Page prix

`table` au m² par niveau, `cards` facteurs de prix, `table` exemples chiffrés, `callout` estimateur, `cards` aides et TVA, `faq`, `links`. 900 à 1 200 mots.

### Page méthode

`steps` 5 étapes détaillées, `stats`, `cards` garanties, `callout` planning de chantier, `faq`, `links`. 700 à 900 mots.

### Article conseil

Chapeau, `callout` « à retenir » en tête, 5 à 7 sections, 1 `table` ou `stats`, lien vers le service mère dans les 200 premiers mots et en conclusion, `links`. 1 200 à 1 800 mots.

### Hub (services, zones)

Chapeau court, `cards` avec `href`, `links`, CTA. 250 à 400 mots.

## 6. Règles de rédaction

- Vocabulaire banni : coordination, coordonner, maître d'œuvre, maîtrise d'œuvre, contractant général, AMO. Utiliser pilotage, piloter, accompagnement, interlocuteur unique.
- Nom de marque : RenovIntérieurs.
- Un bloc, un endroit : pas de 5 étapes détaillées hors `/methode` et accueil, pas de grille complète hors `/prix-renovation`, pas de FAQ générique. Le bandeau guide est un composant, pas une section.
- Faits à conserver (source : ancien contenu) : devis sous 48 h, visite technique sous 5 jours, SAV 12 mois, décennale 10 ans, biennale 2 ans, parfait achèvement 1 an, TVA 10 % et 5,5 %, fourchettes 250-450 / 600-900 / 1 000-1 500 / 1 500-2 500 €/m², durées 3-6 semaines partielle, 8-14 semaines complète 50-80 m², joints époxy 15-20 ans, jusqu'à 15-20 % d'économie sur le gros œuvre, IKEA Metod depuis 2014, téléphone 06 12 24 55 27, contact@renovinterieurs.fr.
- Titres de section ≤ 60 caractères. Paragraphes ≤ 70 mots. Aucun paragraphe copié d'une autre page.
- Ancres de liens descriptives, jamais « cliquez ici ».

## 7. Maillage

- Chaque service : reçoit accueil + hub + 2 zones + 1 conseil ; émet prix, méthode, zone principale, réalisations.
- Chaque zone : émet 3 services, prix, réalisations ; reçoit accueil, hub zones, footer.
- Chaque conseil : émet son service mère (2 fois), 1 outil, 1 zone.
- Outils : cités depuis prix (estimateur), isolation (DPE), méthode (planning).
- Nav : Nos services (8 entrées), Zones (4), Prix, Réalisations, Conseils, Contact. Outils reste dans le footer et les pages qui les justifient.
- Footer : services, zones, outils, informations (méthode, prix, à propos, FAQ, contact).

## 8. Tests et contrôle

Script `scripts/check-content.mjs` exécuté avant le build :
- Tout lien inline ou `related` pointe vers une URL existante.
- Aucun terme banni.
- `title` ≤ 60, `description` ≤ 155, titres de section ≤ 60.
- Aucun paragraphe identique sur deux pages.
- Chaque page service et zone a au moins un `gallery`, un `faq` et un `links`.

Le build Next (`next build`) et `eslint` doivent passer. Vérification visuelle sur 4 pages (service, zone, prix, article) en desktop et mobile.

## 9. Hors périmètre

Refonte de l'accueil au-delà des textes, nouveaux visuels, réalisations réelles (la galerie utilise la photothèque existante avec légendes indicatives à valider par le client), outils, formulaires, tracking.
