import type { MetadataRoute } from "next";

import { allPaths } from "@/lib/content";
import { tools } from "@/lib/tools";
import { site } from "@/lib/site";
import { publishedArticles, wwPath } from "@/lib/whatswrong";

/** Les articles WhatsWrong y entrent au plus tard une heure après publication. */
export const revalidate = 3600;

/** Dérivé du store de contenu : toute page ajoutée y apparaît automatiquement. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const priority = (path: string) => {
    if (path === "/") return 1;
    if (path.startsWith("/conseils/")) return 0.5;
    if (path.startsWith("/outils/")) return 0.6;
    if (/^\/(mentions-legales|politique-de-confidentialite)$/.test(path))
      return 0.2;
    return 0.8;
  };

  const local = allPaths();
  const articles = (await publishedArticles())
    .map(wwPath)
    .filter((p) => !local.includes(p));
  const paths = [...local, ...articles, "/outils", ...tools.map((t) => t.href)];

  return paths.map((path) => ({
    url: `${site.url}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency: path.startsWith("/conseils/") ? "monthly" : "weekly",
    priority: priority(path),
  }));
}
