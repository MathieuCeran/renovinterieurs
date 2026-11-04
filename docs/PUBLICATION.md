# Publication WhatsWrong (articles et pages)

Depuis le 04/11/2026, WhatsWrong ne sert qu'à **créer** le contenu : le site
l'enregistre et le sert lui-même, comme un CMS.

- L'Action `.github/workflows/whatswrong-sync.yml` (toutes les 3 h, ou Actions ›
  Run workflow) lance `scripts/whatswrong-sync.mjs`, qui lit `GET /api/v1/sync`
  et écrit `src/content/whatswrong/content.json` et `public/whatswrong/` (les
  images), puis commite si quelque chose a changé. Le commit déclenche le déploiement.
- Le site ne lit que ces fichiers (`src/lib/whatswrong-content.ts`). Il n'appelle
  jamais WhatsWrong pour s'afficher : si le service ou le compte s'arrête, rien ne
  bouge.
- Une erreur de l'API ou une perte suspecte ne touche jamais les fichiers.
- Les copies relues de `src/content/whatswrong/articles.json` gardent la priorité
  tant que l'article n'a pas changé dans WhatsWrong depuis (`reviewedAt`).
- Le code reste maître : si le `title` ou la description d'une page changent dans le
  code après la publication (`wwMeta`), le site garde les siens. Un texte modifié
  garde lui aussi la version du code. `content.json` est généré : ne pas l'éditer.

## Prérequis

- Secret **`WW_API_KEY`** dans le dépôt GitHub (Settings › Secrets and variables ›
  Actions). La clé n'est plus lue sur Vercel.

## Points d'attention

- Un article dont le slug est déjà pris par un guide du site
  (`src/content/pages/conseils__<slug>.json`) reste masqué : le guide passe
  d'abord.
- Le HTML des articles est assaini à l'affichage (`cleanBody`).
- Les images sont servies depuis `public/whatswrong/`, affichées telles quelles
  (sans optimisation d'images Vercel, facturée à l'image).
