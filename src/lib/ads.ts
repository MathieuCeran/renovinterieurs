/* Google Ads — suivi des conversions.

   Deux conversions seulement, celles qui font un client :
   - LEAD : la demande de devis est réellement partie (l'API ne répond ok
     en production qu'après envoi du mail ou du webhook). Le formulaire du
     guide PDF passe par la même API mais n'est volontairement pas compté ;
   - TEL  : un clic sur un lien tel:.

   Identifiants publics (ils partent dans le HTML de toute façon). Tant que
   ADS_ID est vide, la balise n'est pas chargée. */
export const ADS_ID = "AW-17906255882";
export const ADS_LABEL_LEAD = "fKAoCIDko5kdEIqQr9pC"; // RI - Formulaire envoyé (succès)
export const ADS_LABEL_TEL = "cdrKCIPko5kdEIqQr9pC"; // RI - Clic téléphone

/* Choix sur les cookies : refusé par défaut, gardé six mois avec sa date
   puis redemandé (recommandation CNIL). Valeur stockée : {"v":"granted"|"denied","t":<ms>}.
   Une ancienne valeur sans date ("granted"/"denied") compte comme absente. */
export const CONSENT_KEY = "ri-consent";
export const CONSENT_MAX_AGE_MS = 182 * 24 * 60 * 60 * 1000;
/* Événement émis à chaque changement de choix dans la page. */
export const CONSENT_EVENT = "ri-consent";

export type Choice = "granted" | "denied";

type Gtag = (...args: unknown[]) => void;

function gtag(): Gtag | null {
  if (typeof window === "undefined") return null;
  const g = (window as unknown as { gtag?: Gtag }).gtag;
  return typeof g === "function" ? g : null;
}

export function trackConversion(label: string) {
  const g = gtag();
  if (!ADS_ID || !label || !g) return;
  g("event", "conversion", { send_to: `${ADS_ID}/${label}` });
}

/* Choix donné dans la page en cours, si le stockage est indisponible. */
let pageChoice: Choice | null = null;

/** Choix enregistré et encore valable, sinon null. */
export function readConsent(): Choice | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return pageChoice;
    const { v, t } = JSON.parse(raw) as { v?: string; t?: number };
    if ((v !== "granted" && v !== "denied") || typeof t !== "number" || Date.now() - t > CONSENT_MAX_AGE_MS) return null;
    return v;
  } catch {
    return pageChoice;
  }
}

function updateGtag(v: Choice) {
  gtag()?.("consent", "update", { ad_storage: v, ad_user_data: v, ad_personalization: v, analytics_storage: v });
}

export function setConsent(granted: boolean) {
  const v: Choice = granted ? "granted" : "denied";
  pageChoice = v;
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ v, t: Date.now() }));
  } catch {
    /* navigation privée : le choix vaut pour la page en cours */
  }
  updateGtag(v);
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

/** Efface le choix (retour au refus) et rouvre le bandeau. */
export function resetConsent() {
  pageChoice = null;
  try {
    localStorage.removeItem(CONSENT_KEY);
  } catch {}
  updateGtag("denied");
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

/* Consentement par défaut, exécuté en tête de <body> AVANT gtm.js : GTM
   (Analytics) et la balise Ads démarrent tous deux en mode refusé tant que
   le visiteur n'a rien accepté (ou que son accord a plus de six mois). */
export const CONSENT_DEFAULT_SCRIPT =
  "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;" +
  `var v='denied';try{var c=JSON.parse(localStorage.getItem(${JSON.stringify(CONSENT_KEY)})||'null');if(c&&c.v==='granted'&&typeof c.t==='number'&&Date.now()-c.t<${CONSENT_MAX_AGE_MS})v='granted'}catch(e){}` +
  "gtag('consent','default',{ad_storage:v,ad_user_data:v,ad_personalization:v,analytics_storage:v,wait_for_update:500});";
