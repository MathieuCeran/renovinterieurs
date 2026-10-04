# Publication des articles WhatsWrong

Depuis le 04/10/2026, les articles SEO rédigés par WhatsWrong (agent Léa) sont
**copiés dans le dépôt** : texte dans `src/content/whatswrong/articles.json`,
images dans `public/uploads/whatswrong/<slug>/`. Le site ne lit plus l'API
WhatsWrong à l'affichage. Si WhatsWrong tombe ou si l'abonnement s'arrête, les
articles restent en ligne.

Même fonctionnement que le site Archi Pilote.

## Le circuit

Le workflow `.github/workflows/whatswrong-sync.yml` lance toutes les heures
`scripts/whatswrong-sync.mjs`, qui :

1. lit les articles terminés (`DRAFT`) chez WhatsWrong, ainsi que les articles
   déjà `PUBLISHED` pas encore copiés (reprise unique de l'ancien
   fonctionnement, URL inchangée, pas de PATCH) ;
2. copie couverture et images, écrit l'article dans `articles.json` et garde
   l'id WhatsWrong dans `src/content/whatswrong/_state.json` (jamais deux
   imports du même article) ;
3. **pousse sur `main`** → Vercel reconstruit et publie ;
4. attend que la page soit réellement en ligne (15 min max, contrôle de la
   marque et du titre, pas seulement du code 200) ;
5. envoie `PATCH { state: PUBLISHED, url }` à WhatsWrong : c'est ce qui démarre
   le suivi SEO ;
6. si un article est retiré à la main d'`articles.json`, renvoie
   `{ state: DRAFT }`.

Les articles sont publiés sous `/conseils/<slug>`. Si le slug est déjà pris
par un guide du site (`src/content/pages/conseils__<slug>.json`), l'article
reçoit le suffixe `-2`.

Le HTML est assaini à l'affichage (`cleanBody`, `src/lib/whatswrong.ts`). Le
bot publie sans relecture humaine.

## Prérequis

- **Vercel branché sur le dépôt GitHub**, branche de production `main` : un
  push doit déclencher un déploiement, sinon les articles ne sortent jamais
  et le PATCH n'est pas envoyé.
- **Secret GitHub `WW_API_KEY`** : Settings → Secrets and variables →
  Actions → New repository secret.
- Facultatif : variable GitHub `SITE_ORIGIN` (défaut
  `https://www.renovinterieurs.fr`).

La clé n'est plus utile côté Vercel : `WW_API_KEY` et `CRON_SECRET` peuvent
être retirées des variables d'environnement du projet.

## Lancer à la main

GitHub → onglet **Actions** → « Synchronisation WhatsWrong » → **Run
workflow**. Cocher « Essai à blanc » pour lister les articles sans rien
écrire ni envoyer.

En local :

```bash
WW_API_KEY=… node scripts/whatswrong-sync.mjs --dry-run   # liste seulement
WW_API_KEY=… node scripts/whatswrong-sync.mjs --no-push   # importe sans pousser ni confirmer
```

Sur une erreur 429 (60 appels/min), le run s'arrête et le suivant reprend.
