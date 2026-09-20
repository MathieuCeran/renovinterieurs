import type { MetadataRoute } from "next";

import { allPaths } from "@/lib/content";
import { tools } from "@/lib/tools";
import { site } from "@/lib/site";

/** Dérivé du store de contenu : toute page ajoutée y apparaît automatiquement. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const priority = (path: string) => {
    if (path === "/") return 1;
    if (path.startsWith("/conseils/")) return 0.5;
    if (
      path.startsWith("/renovation-appartement-") &&
      path !== "/renovation-appartement-paris"
    )
      return 0.6;
    return 0.8;
  };

  const paths = [...allPaths(), "/outils", ...tools.map((t) => t.href)];

  return paths.map((path) => ({
    url: `${site.url}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency: path.startsWith("/conseils/") ? "monthly" : "weekly",
    priority: priority(path),
  }));
}
