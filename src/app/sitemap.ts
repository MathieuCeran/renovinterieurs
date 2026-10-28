import type { MetadataRoute } from "next";

import { allPaths } from "@/lib/content";
import { tools } from "@/lib/tools";
import { site } from "@/lib/site";
import { publishedArticles, wwPath } from "@/lib/whatswrong";
import { mergedPaths } from "@/lib/whatswrong-pages";

/** Dérivé du store de contenu : toute page ajoutée y apparaît automatiquement. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const priority = (path: string) => {
    if (path === "/") return 1;
    if (path.startsWith("/conseils/")) return 0.5;
    if (path.startsWith("/outils/")) return 0.6;
    if (
      /^\/(mentions-legales|politique-de-confidentialite|ai-instruction)$/.test(
        path,
      )
    )
      return 0.2;
    return 0.8;
  };

  const local = allPaths();
  const articles = (await publishedArticles())
    .map(wwPath)
    .filter((p) => !local.includes(p));
  // Une page fusionnée dans une autre depuis WhatsWrong redirige : elle n'a rien à faire dans le plan du site.
  const merged = await mergedPaths();
  const paths = [
    ...local.filter((p) => !merged.has(p)),
    ...articles,
    "/outils",
    ...tools.map((t) => t.href),
    "/ai-instruction",
  ];

  return paths.map((path) => ({
    url: `${site.url}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency: path.startsWith("/conseils/") ? "monthly" : "weekly",
    priority: priority(path),
  }));
}
