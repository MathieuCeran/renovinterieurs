import content from "@/content/whatswrong/content.json";

/* ------------------------------------------------------------------ */
/*  Le contenu créé par WhatsWrong, enregistré dans ce dépôt             */
/*                                                                     */
/*  L'Action .github/workflows/whatswrong-sync.yml l'écrit ici, avec    */
/*  ses images (public/whatswrong/). Le site ne lit que ce fichier : il */
/*  n'appelle jamais WhatsWrong pour s'afficher, et garde tout si le    */
/*  service ou le compte s'arrête.                                      */
/* ------------------------------------------------------------------ */

type Content = {
  articles: unknown[];
  pages: unknown[];
  redirects: { from: string; to: string }[];
};

export const wwContent = content as unknown as Content;
