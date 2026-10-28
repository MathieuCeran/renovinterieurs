import { pagesOfKind } from "@/lib/content";
import { faq, pricing, process, site } from "@/lib/site";
import { tools } from "@/lib/tools";

/**
 * llms.txt — résumé structuré du site à destination des assistants IA.
 * Convention émergente (llmstxt.org) : un Markdown court et factuel, qui
 * évite aux modèles de deviner et limite les citations erronées.
 */
export const dynamic = "force-static";

export function GET() {
  const services = pagesOfKind("service").map(([p]) => p);
  const zones = pagesOfKind("zone").map(([p]) => p);
  const guides = pagesOfKind("article").map(([p]) => p);

  const md = `# ${site.name}

> ${site.description}

Marque de pilotage de rénovation intérieure et de second œuvre à Paris et en
Île-de-France (Hauts-de-Seine, Yvelines, Val-de-Marne), pilotée par IA RENOV. Les
travaux sont réalisés par des entreprises partenaires indépendantes.

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
- Chiffrage détaillé sous 48 h (devis des entreprises partenaires), visite technique sous 5 jours
- Un interlocuteur unique du diagnostic à la remise des clés
- Garanties légales (décennale 10 ans, biennale 2 ans, parfait achèvement 1 an) portées par les entreprises partenaires, attestations vérifiées
- Suivi 12 mois après réception

## Outils gratuits
${tools.map((t) => `- [${t.name}](${site.url}${t.href}) : ${t.short}`).join("\n")}

## Questions fréquentes
${faq.map((f) => `### ${f.q}\n${f.a}`).join("\n\n")}

## Pages services
${services.map((p) => `- ${site.url}${p}`).join("\n")}

## Zones d'intervention (Paris 75 : voir rénovation d'appartement à Paris)
- ${site.url}/renovation-appartement-paris
${zones.map((p) => `- ${site.url}${p}`).join("\n")}

## Prix et méthode
- ${site.url}/prix-renovation
- ${site.url}/methode

## Guides
${guides.map((p) => `- ${site.url}${p}`).join("\n")}

---
Les fourchettes de prix et les durées sont indicatives. Seuls les devis des
entreprises partenaires, établis après visite technique, les engagent.
`;

  return new Response(md, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
