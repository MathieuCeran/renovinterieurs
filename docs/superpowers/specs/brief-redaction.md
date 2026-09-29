# Brief de rédaction — pages JSON de renovinterieurs.fr

Ce brief accompagne `2026-09-29-refonte-seo-design.md`. Il s'adresse à qui rédige un fichier de page dans `src/content/pages/`.

## Fichiers

- Un fichier JSON par page : `src/content/pages/<slug>.json`. Le slug `/conseils/x` devient `conseils__x.json`. La page `/` est `index.json`.
- Encodage UTF-8, apostrophes typographiques (’) et guillemets français (« ») bienvenus, `&` en clair. Aucun HTML.
- Vérification : `node scripts/check-content.mjs --warn` liste les problèmes de toutes les pages. Corriger ceux de ses propres pages jusqu'à zéro.

## Schéma

```jsonc
{
  "title": "≤ 60 caractères, sans « | RenovIntérieurs » (ajouté automatiquement)",
  "description": "≤ 155 caractères, une promesse et un appel",
  "h1": "Sujet : précision (la partie après « : » passe en italique serif)",
  "kind": "service | zone | article | hub | info",
  "parent": "/ | /nos-services | /zones | /conseils",
  "eyebrow": "libellé court au-dessus du chapeau (optionnel)",
  "hero": "/images/… (optionnel, sinon choisi automatiquement)",
  "intro": ["paragraphe 1 : problème → réponse, 40 à 60 mots", "paragraphe 2 (optionnel)"],
  "sections": [
    { "title": "≤ 60 caractères", "blocks": [ /* voir ci-dessous */ ] }
  ],
  "related": [ { "label": "…", "href": "/…", "desc": "…" } ]
}
```

Blocs disponibles (`t`) :

| t | Champs | Usage |
|---|---|---|
| `p` | `v` | Paragraphe, ≤ 70 mots. Liens inline `[texte](/url)`. |
| `h3` | `v` | Sous-titre dans une section. |
| `ul` | `items[]` | Liste courte, liens inline autorisés. |
| `stats` | `items[{value,label}]` | 4 chiffres clés. `value` court (« 48 h », « 10 ans »), `label` ≤ 8 mots. |
| `cards` | `items[{title,text,href?}]` | 4 à 6 cartes (prestations, communes, facteurs). `text` 1 à 2 phrases. |
| `table` | `head[]`, `rows[][]`, `note?` | Tableau ≤ 4 colonnes, ≤ 6 lignes. |
| `callout` | `title?`, `v`, `href?`, `label?` | Encadré : signature technique, « à retenir », passerelle vers un outil. |
| `steps` | `items[{title,text}]` | Étapes numérotées (réservé à `/methode` et aux articles). |
| `faq` | `items[{q,a}]` | 3 questions propres à la page, réponses ≤ 60 mots. |
| `gallery` | `items[{src,alt,caption}]` | 3 photos de la photothèque. |
| `links` | `items[{label,href,desc?}]` | Maillage « pour aller plus loin ». |

## Photothèque (seules images autorisées)

| src | Ce qu'on voit |
|---|---|
| /images/sejour-haussmannien.jpg | Séjour haussmannien rénové, double exposition, moulures |
| /images/nos-services-hero.jpg | Séjour haussmannien, moulures et parquet clair |
| /images/salon-haussmannien-moulures.jpg | Salon haussmannien restauré, cheminée, parquet chevron |
| /images/salon-canape-courbe.jpg | Salon contemporain, canapé courbe |
| /images/paris-cuisine-sur-mesure.jpg | Cuisine sur mesure |
| /images/loft-cuisine-cheminee.jpg | Loft, cuisine ouverte, cheminée, sol béton ciré |
| /images/loft-beton-cire.jpg | Grand volume ouvert, escalier suspendu, béton ciré |
| /images/paris-sdb.jpg | Salle de bain claire |
| /images/sdb-douche-italienne.webp | Salle de bain sombre haut de gamme, douche à l’italienne, baignoire îlot |
| /images/service-sdb.jpg | Plan vasque en pierre naturelle, robinetterie laiton |
| /images/paris-parquet.jpg | Parquet chêne point de Hongrie |
| /images/why-2.jpg | Détail parquet chevron et tasseaux bois |
| /images/service-renovation.jpg | Habillage mural en tasseaux bois, placard intégré |
| /images/paris-renovation-appartement.jpg | Appartement en rénovation, pose |
| /images/paris-chantier.jpg | Chantier en cours |
| /images/paris-pourquoi-specialiste.jpg | Conducteur de travaux avec les artisans |
| /images/savoir-faire-1.jpg | Artisan aux finitions |
| /images/dpe-1.jpg | Isolation, énergie |
| /images/nos-services-depannage.jpg | Dépannage |
| /images/bibliotheque-sur-mesure.webp | Bibliothèque sur mesure bois massif |
| /images/dressing-sur-mesure.webp | Dressing sur mesure sous pente |
| /images/paris-zones.jpg | Toits de Paris |
| /images/balcon-haussmannien-paris.jpg | Balcon parisien, ferronnerie |
| /images/ville-hero.jpg | Façades de ville |

Les légendes décrivent ce qu'on voit et la prestation (« Séjour haussmannien : moulures restaurées, parquet point de Hongrie »). Ne jamais inventer de surface, de durée, d'adresse ni de nom de client. Le `alt` décrit l'image en une phrase.

## URL valides pour les liens

Services : `/nos-services`, `/renovation-appartement-paris`, `/cuisine-sur-mesure-paris`, `/salle-de-bain-paris`, `/beton-cire-paris`, `/isolation-amelioration-energetique`, `/renovation-gros-oeuvre-surelevation-extension-idf`, `/depannage`, `/debarras`.

Transverses : `/prix-renovation`, `/methode`, `/zones`, `/realisations-renovation`, `/a-propos`, `/faq`, `/contact-devis`, `/guide-renovation-2026`.

Zones : `/renovation-appartement-paris` (Paris), `/renovation-hauts-de-seine-92`, `/renovation-yvelines-78`, `/renovation-val-de-marne-94`.

Outils : `/outils/estimateur-budget-renovation`, `/outils/simulateur-dpe-passoire-energetique`, `/outils/planning-travaux-renovation`.

Conseils : `/conseils`, `/conseils/combien-coute-renovation-appartement-paris`, `/conseils/combien-coute-renovation-complete-maison`, `/conseils/sortir-passoire-energetique-dpe-f-g`, `/conseils/isolation-maison-ancienne-par-linterieur`, `/conseils/renovation-cuisine-complete`, `/conseils/renovation-salle-de-bain-complete`, `/conseils/resine-beton-cire-salle-de-bain`, `/conseils/carrelage-salle-de-bain-nettoyage`, `/conseils/renovation-interieure-maison-etapes`, `/conseils/renovation-complete-maison-ile-de-france`.

Ancre devis : `#devis` (formulaire en bas de chaque page).

## Faits autorisés

Source : ancien contenu du site (`src/content/pages.json`, `src/lib/site.ts`). Ne rien inventer d'autre.

- Devis détaillé sous 48 h. Visite technique sous 5 jours. Compte-rendu hebdomadaire. SAV 12 mois.
- Garanties : décennale 10 ans, biennale 2 ans, parfait achèvement 1 an, RC pro. Attestations fournies avant démarrage.
- TVA 10 % sur l’amélioration d’un logement de plus de 2 ans, 5,5 % sur les travaux énergétiques éligibles.
- Prix au m² (HT, indicatifs, 2026) : rafraîchissement 250-450, rénovation partielle 600-900, rénovation complète 1 000-1 500, haut de gamme 1 500-2 500.
- Durées : partielle 3-6 semaines, complète 50-80 m² 8-14 semaines, plus de 100 m² ou haut de gamme 4-6 mois.
- Signatures techniques : joints époxy bi-composants (15-20 ans, ne noircissent pas), nattes d’étanchéité, béton ciré (sols, murs, douches, plans de travail), parquet point de Hongrie.
- Cuisine : conception sur plan ou façades sur mesure sur caissons IKEA Metod (compatibles depuis 2014). Matériaux : chêne massif huilé, MDF laqué, stratifié haut de gamme, quartz, granit, inox.
- Isolation : audit DPE, isolation murs et combles, VMC double flux, pompe à chaleur, MaPrimeRénov’ et CEE. Objectif : gagner 2 à 3 classes DPE.
- Gros œuvre : ouverture de mur porteur, surélévation, extension, avec architectes DPLG, ingénieurs structure et entreprises sélectionnées, jusqu’à 15-20 % d’économie, démarches pilotées (permis, syndic). RenovIntérieurs met en relation et pilote, ne réalise pas elle-même le gros œuvre.
- Dépannage : plomberie, électricité, serrurerie, chauffage. Débarras : succession, fin de bail, après travaux, nettoyage fin de chantier.
- Zones : Paris 20 arrondissements ; Hauts-de-Seine (Boulogne-Billancourt, Neuilly-sur-Seine, Levallois-Perret, Issy-les-Moulineaux, Courbevoie, Puteaux, Suresnes, Saint-Cloud, Rueil-Malmaison, Asnières-sur-Seine, Clichy, Bois-Colombes, Colombes, Sèvres, Meudon, Vanves, Antony, Sceaux) ; Yvelines (Versailles, Saint-Germain-en-Laye, Le Vésinet, Maisons-Laffitte, Croissy-sur-Seine, Le Pecq, Chatou) ; Val-de-Marne (Vincennes, Saint-Mandé, Charenton-le-Pont, Saint-Maur-des-Fossés, Maisons-Alfort, Nogent-sur-Marne, Joinville-le-Pont, Champigny-sur-Marne, Cachan, Arcueil).
- Contact : 06 12 24 55 27, contact@renovinterieurs.fr, WhatsApp.
- Marque : RenovIntérieurs, marque de Archi Renov.

## Ton et vocabulaire

- Vouvoiement, phrases courtes, concret. Standing haut de gamme sans emphase : on montre, on ne clame pas.
- Posture : RenovIntérieurs **pilote** et **accompagne**. Un interlocuteur unique. « Vous savez toujours où en est votre chantier. »
- **Interdits absolus** : coordination, coordonner, coordonné, maître d’œuvre, maîtrise d’œuvre, contractant général, AMO.
- Pas de superlatifs creux (« meilleur », « n°1 », « incontournable »). Pas de « n’hésitez pas ». Pas de tirets cadratins dans les phrases.
- Ancres de liens descriptives (« voir nos tarifs au m² »), jamais « cliquez ici ».
- Un bloc, un endroit : les 5 étapes détaillées vivent sur `/methode`, la grille de prix complète sur `/prix-renovation`, la FAQ générale sur `/faq`. Ailleurs : une ligne et un lien. Le bandeau « guide PDF » est un composant, ne pas l'écrire dans le contenu.
- Aucun paragraphe copié d'une autre page, y compris entre pages écrites par la même personne.

## Gabarits

### Service (700 à 1 000 mots, 6 à 7 sections)

1. `intro[0]` : problème → réponse. `intro[1]` : ce que RenovIntérieurs pilote sur ce type de chantier.
2. Section « En bref » : `stats` 4 chiffres (48 h, 5 jours, 10 ans, 12 mois, ou chiffres propres au service : 15-20 ans pour les joints, 2 à 3 classes DPE…).
3. Section réalisations : `p` 1 phrase + `gallery` 3 photos.
4. Section « Ce que vous obtenez » : `cards` 4 à 6 prestations, `text` 1 à 2 phrases.
5. Section signatures techniques : 2 ou 3 `callout` (titre + 2 phrases), ou pour les services sans signature (dépannage, débarras) : `p` + `ul`.
6. Section prix : `p` 1 phrase + `table` 3 lignes (prestation / fourchette / délai) + `note` TVA + lien vers `/prix-renovation` et l'estimateur.
7. Section FAQ : `faq` 3 questions propres au service.
8. `related` : `/methode`, `/prix-renovation`, la zone principale, 1 conseil lié, `/realisations-renovation`.

### Zone (800 à 1 100 mots)

Chapeau sur le bâti du territoire. Sections : « En bref » (`stats`), « Le bâti et ses contraintes » (`p` ×2, `callout` copropriété / syndic / arrêtés), « Nos interventions par commune » (`cards`, une carte par commune : 1 phrase de spécificité du bâti ou de la demande + services phares, `href` vers le service le plus pertinent), réalisations (`gallery`), prix (`table` 3 lignes + lien prix), FAQ locale (3), `related` vers 3 services, `/prix-renovation`, `/methode`. Source des spécificités communales : les anciennes pages ville dans `src/content/pages.json` (clés `/renovation-appartement-<commune>`).

### Hub (250 à 400 mots)

Chapeau court, une section `cards` avec `href` (8 services ou 4 zones), une section `links` (prix, méthode, réalisations, conseils), pas de FAQ.

### Prix (900 à 1 200 mots)

Sections : grille au m² (`table` 4 lignes), ce qui fait varier le prix (`cards` 5 à 6 facteurs), exemples chiffrés (`table` : type de bien / surface / niveau / fourchette, calculés à partir de la grille, présentés comme indicatifs), estimateur (`callout` vers `/outils/estimateur-budget-renovation`), TVA et aides (`cards` 3 : TVA 10 %, TVA 5,5 %, MaPrimeRénov’ / CEE), durées (`table`), FAQ (3), `related`.

### Méthode (700 à 900 mots)

Sections : les 5 étapes (`steps` : premier échange, visite technique sous 5 jours, devis détaillé sous 48 h, travaux pilotés avec compte-rendu hebdomadaire, livraison et SAV 12 mois), « En bref » (`stats`), garanties (`cards` 4), planning (`callout` vers `/outils/planning-travaux-renovation`), pilotage au quotidien (`p` ×2 : interlocuteur unique, compte-rendu, gestion syndic), FAQ (3), `related`.

### Article conseil (1 200 à 1 800 mots, 5 à 7 sections)

`intro[0]` répond à la question du titre en 2 phrases. Première section : `callout` « À retenir » (3 phrases) avec `href` vers le service mère. Corps : sections courtes, au moins un `table` ou `stats`, au moins un `ul`. Un lien vers le service mère dans les 200 premiers mots et un autre dans la dernière section. Un lien vers un outil et vers une zone. `related` : service mère, outil, 1 autre conseil, `/prix-renovation`.

### Info (`/a-propos`)

400 à 600 mots : qui est RenovIntérieurs (marque de Archi Renov), posture de pilotage, équipe d'artisans, garanties, zones. `stats`, `cards` valeurs (3), `gallery`, `related`.
