import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

/**
 * Les moteurs classiques et les crawlers d'IA sont explicitement
 * autorisés : le contenu du site (prix, méthode, FAQ) a vocation à être
 * cité par les assistants. Seules les routes techniques sont exclues.
 */
const AI_AGENTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "CCBot",
  "cohere-ai",
  "meta-externalagent",
];

export default function robots(): MetadataRoute.Robots {
  const disallow = ["/api/"];

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      ...AI_AGENTS.map((userAgent) => ({ userAgent, allow: "/", disallow })),
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
