/* ============================================================
   Provenance d'une demande de contact : publicité, SEO, site référent…
   Relevée à l'arrivée sur le site et gardée en mémoire le temps de la
   visite, sans cookie ni stockage dans le navigateur ; elle n'est
   transmise qu'avec le formulaire. Un rechargement complet de la page
   ou un retour un autre jour la perd : le mail dit alors « inconnu »
   plutôt que d'attribuer la demande à tort.
   ============================================================ */

const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "gbraid", "wbraid", "msclkid", "fbclid"] as const;

export type Attribution = {
  /** Nom d'hôte du site d'où vient le visiteur (jamais l'adresse complète). */
  referrer?: string;
  /** Chemin de la première page vue. */
  landing?: string;
  params?: Partial<Record<(typeof PARAMS)[number], string>>;
};

let captured: Attribution | null = null;

/** À appeler au premier affichage : seule la page d'arrivée porte l'information. */
export function captureAttribution() {
  if (captured) return;
  const url = new URL(window.location.href);
  const params: NonNullable<Attribution["params"]> = {};
  for (const key of PARAMS) {
    const value = url.searchParams.get(key);
    if (value) params[key] = value.slice(0, 200);
  }
  let referrer: string | undefined;
  try {
    const host = document.referrer ? new URL(document.referrer).hostname : "";
    if (host && host !== url.hostname) referrer = host;
  } catch {
    // Référent illisible : provenance inconnue.
  }
  captured = { referrer, landing: url.pathname, params };
}

export function getAttribution(): Attribution | null {
  return captured;
}

const clean = (v: unknown, max = 120): string => (typeof v === "string" ? v.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max) : "");

const PAID_MEDIUM = /^(cpc|ppc|paid|paid[-_ ]?search|paid[-_ ]?social|sem|display|retargeting)$/i;

const SEARCH_ENGINES: [RegExp, string][] = [
  [/(^|\.)google\.(com|[a-z]{2}|co\.[a-z]{2}|com\.[a-z]{2})$|googlequicksearchbox/, "Google"],
  [/(^|\.)bing\.com$/, "Bing"],
  [/(^|\.)qwant\.com$/, "Qwant"],
  [/(^|\.)duckduckgo\.com$/, "DuckDuckGo"],
  [/(^|\.)ecosia\.org$/, "Ecosia"],
  [/(^|\.)yahoo\.(com|[a-z]{2}|co\.[a-z]{2}|com\.[a-z]{2})$/, "Yahoo"],
];

const AI_TOOLS: [RegExp, string][] = [
  [/(^|\.)chatgpt\.com$|(^|\.)openai\.com$/, "ChatGPT"],
  [/(^|\.)perplexity\.ai$/, "Perplexity"],
  [/(^|\.)claude\.ai$/, "Claude"],
  [/(^|\.)gemini\.google\.com$/, "Gemini"],
  [/(^|\.)copilot\.microsoft\.com$/, "Copilot"],
];

function sourceLabel(params: Record<string, unknown>, referrer: string): string {
  if (clean(params.gclid) || clean(params.gbraid) || clean(params.wbraid)) return "Publicité Google Ads";
  if (clean(params.msclkid)) return "Publicité Microsoft Ads";

  const utmSource = clean(params.utm_source);
  if (utmSource) {
    const medium = clean(params.utm_medium);
    if (PAID_MEDIUM.test(medium)) return `Publicité (${utmSource})`;
    return `Lien suivi : ${utmSource}${medium ? ` / ${medium}` : ""}`;
  }
  if (clean(params.fbclid)) return "Facebook ou Instagram (publicité ou publication)";

  // Les outils d'IA d'abord : gemini.google.com ressemble à un domaine Google.
  const ai = AI_TOOLS.find(([re]) => re.test(referrer));
  if (ai) return `Assistant IA (${ai[1]})`;
  const engine = SEARCH_ENGINES.find(([re]) => re.test(referrer));
  if (engine) return `SEO, recherche naturelle (${engine[1]})`;
  if (referrer) return `Site référent (${referrer})`;
  return "Accès direct ou inconnu";
}

/** Lignes à ajouter au mail ; côté serveur, le contenu reçu est traité comme non fiable. */
export function attributionRows(input: unknown): [string, string][] {
  const a = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const params = a.params && typeof a.params === "object" ? (a.params as Record<string, unknown>) : {};
  const rows: [string, string][] = [["Source", sourceLabel(params, clean(a.referrer).toLowerCase())]];
  const campaign = clean(params.utm_campaign);
  const term = clean(params.utm_term);
  const landing = clean(a.landing, 200);
  if (campaign) rows.push(["Campagne", campaign]);
  if (term) rows.push(["Mot-clé", term]);
  if (landing) rows.push(["Page d’arrivée", landing]);
  return rows;
}
