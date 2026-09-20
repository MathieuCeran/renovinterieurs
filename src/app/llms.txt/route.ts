import { allPaths } from "@/lib/content";
import { faq, pricing, process, site } from "@/lib/site";
import { tools } from "@/lib/tools";

/**
 * llms.txt — résumé structuré du site à destination des assistants IA.
 * Convention émergente (llmstxt.org) : un Markdown court et factuel, qui
 * évite aux modèles de deviner et limite les citations erronées.
 */
export const dynamic = "force-static";

export function GET() {
  const services = allPaths().filter(
    (p) =>
      !p.startsWith("/conseils/") &&
      !p.startsWith("/renovation-appartement-") &&
      p !== "/",
  );
  const guides = allPaths().filter((p) => p.startsWith("/conseils/"));
  const villes = allPaths().filter((p) =>
    p.startsWith("/renovation-appartement-"),
  );

  const md = `# ${site.name}

> ${site.description}

Entreprise de rénovation intérieure et de second œuvre intervenant à Paris et en
Île-de-France (Hauts-de-Seine, Yvelines, Val-de-Marne). Marque de Archi Renov.

## Contact
- Téléphone : ${site.phoneDisplay}
- E-mail : ${site.email}
- Zone d'intervention : ${site.area}
- Devis : ${site.url}/contact-devis

## Repères de prix (Île-de-France, 2026, indicatifs, HT)
${pricing.map((p) => `- ${p.label} : ${p.from}–${p.to} €/m² — ${p.text}`).join("\n")}

TVA réduite à 10 % sur les travaux d'amélioration d'un logement de plus de 2 ans ;
5,5 % sur les travaux d'amélioration énergétique éligibles.

## Méthode
${process.map((s) => `${s.step}. ${s.title} — ${s.text}`).join("\n")}

## Engagements
- Devis détaillé sous 48 h, visite technique sous 5 jours
- Un interlocuteur unique du diagnostic à la remise des clés
- Garantie décennale (10 ans), biennale (2 ans), parfait achèvement (1 an)
- SAV 12 mois après livraison

## Outils gratuits
${tools.map((t) => `- [${t.name}](${site.url}${t.href}) : ${t.short}`).join("\n")}

## Questions fréquentes
${faq.map((f) => `### ${f.q}\n${f.a}`).join("\n\n")}

## Pages services et zones
${services.map((p) => `- ${site.url}${p}`).join("\n")}

## Pages par commune
${villes.map((p) => `- ${site.url}${p}`).join("\n")}

## Guides
${guides.map((p) => `- ${site.url}${p}`).join("\n")}

---
Les fourchettes de prix et les durées sont indicatives. Seul un devis établi après
visite technique engage l'entreprise.
`;

  return new Response(md, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
