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

export const CONSENT_KEY = "ri-consent";

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

export function setConsent(granted: boolean) {
  try {
    localStorage.setItem(CONSENT_KEY, granted ? "granted" : "denied");
  } catch {
    /* navigation privée : le choix vaut pour la page en cours */
  }
  const v = granted ? "granted" : "denied";
  gtag()?.("consent", "update", { ad_storage: v, ad_user_data: v, ad_personalization: v, analytics_storage: v });
}

/* Consentement par défaut, exécuté en tête de <body> AVANT gtm.js : GTM
   (Analytics) et la balise Ads démarrent tous deux en mode refusé tant que
   le visiteur n'a rien accepté. */
export const CONSENT_DEFAULT_SCRIPT =
  "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;" +
  `var c=null;try{c=localStorage.getItem(${JSON.stringify(CONSENT_KEY)})}catch(e){}` +
  "var v=c==='granted'?'granted':'denied';" +
  "gtag('consent','default',{ad_storage:v,ad_user_data:v,ad_personalization:v,analytics_storage:v,wait_for_update:500});";
