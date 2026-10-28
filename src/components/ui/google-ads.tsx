"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState, useSyncExternalStore } from "react";

import { ADS_ID, ADS_LABEL_TEL, CONSENT_KEY, setConsent, trackConversion } from "@/lib/ads";

/* Bandeau de consentement + balise Google Ads.

   Le consentement par défaut (refusé) est posé dans le layout, avant GTM.
   Ce composant affiche le choix « Refuser / Accepter » au même niveau
   (exigence CNIL), charge gtag.js pour Google Ads et compte les clics sur
   les liens tel:, éparpillés dans plusieurs composants, via un seul
   écouteur sur le document. */
function readConsent(): "granted" | "denied" | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

function subscribeConsent(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

export function GoogleAds() {
  // Choix enregistré (lu côté navigateur seulement : undefined au rendu serveur), puis réponse donnée ici.
  const stored = useSyncExternalStore(subscribeConsent, readConsent, () => undefined);
  const [answer, setAnswer] = useState<"granted" | "denied" | null>(null);
  const choix = answer ?? stored;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="tel:"]');
      if (a) trackConversion(ADS_LABEL_TEL);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  const repondre = (ok: boolean) => {
    setConsent(ok);
    setAnswer(ok ? "granted" : "denied");
  };

  return (
    <>
      {ADS_ID && (
        <>
          <Script id="gads-config" strategy="afterInteractive">{`
            window.gtag && gtag("js", new Date());
            window.gtag && gtag("config", ${JSON.stringify(ADS_ID)});
          `}</Script>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ADS_ID}`} strategy="afterInteractive" />
        </>
      )}

      {choix === null && (
        <div
          role="dialog"
          aria-label="Cookies de mesure"
          className="fixed right-4 bottom-4 left-4 z-50 flex flex-col gap-3 rounded-2xl bg-paper p-5 text-[0.85rem] leading-relaxed shadow-xl sm:left-auto sm:max-w-sm"
        >
          <p>
            Nous utilisons des cookies Google (Analytics et Ads) pour mesurer la fréquentation du site et
            l&apos;efficacité de nos annonces. Vous pouvez les accepter ou les refuser ; le site fonctionne
            de la même façon.{" "}
            <Link href="/politique-de-confidentialite" className="underline">
              En savoir plus
            </Link>
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => repondre(false)}
              className="flex-1 rounded-full border border-current px-4 py-2.5 font-medium"
            >
              Refuser
            </button>
            <button
              type="button"
              onClick={() => repondre(true)}
              className="flex-1 rounded-full border border-current px-4 py-2.5 font-medium"
            >
              Accepter
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* Bouton de la politique de confidentialité : efface le choix et rouvre le bandeau. */
export function ReinitialiserCookies() {
  return (
    <button
      type="button"
      className="underline"
      onClick={() => {
        setConsent(false);
        try {
          localStorage.removeItem(CONSENT_KEY);
        } catch {}
        location.reload();
      }}
    >
      Modifier mon choix sur les cookies
    </button>
  );
}
