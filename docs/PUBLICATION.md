# Publication WhatsWrong (articles et pages)

Depuis le 19/10/2026, le site **lit WhatsWrong en direct**, au rendu, avec un
cache d'une minute. Plus de synchronisation GitHub ni de redéploiement :

- **Articles de Léa** (`/conseils/<slug>`) : `src/lib/whatswrong.ts` lit
  `GET /api/v1/lea/blog?base=https://www.renovinterieurs.fr/conseils`. Un
  article prêt est en ligne au plus une minute après. WhatsWrong vérifie
  lui-même qu'il répond à son adresse et le passe « publié » (c'est ce qui
  démarre son suivi SEO) : le site n'a rien à renvoyer.
- **Pages réécrites par Eli** : `src/lib/whatswrong-pages.ts` lit
  `GET /api/v1/eli/pages` ; les changements sont posés texte par texte dans
  les données de la page (`src/lib/whatswrong-changes.ts`), le design ne
  bouge pas.

Si l'API ne répond pas en 2 secondes : les articles copiés avant le
19/10 (`src/content/whatswrong/articles.json`, `public/uploads/whatswrong/`)
restent affichés, et les pages gardent leur propre texte.

## Prérequis

- Variable d'environnement **`WW_API_KEY`** sur Vercel (production).
- Facultatif : `WW_API_BASE` pour viser un autre WhatsWrong (tests locaux).

## Points d'attention

- Un article dont le slug est déjà pris par un guide du site
  (`src/content/pages/conseils__<slug>.json`) reste masqué : le guide passe
  d'abord.
- Le HTML des articles est assaini à l'affichage (`cleanBody`).
- Les images des nouveaux articles sont servies par WhatsWrong, affichées
  telles quelles (sans optimisation d'images Vercel, facturée à l'image).
