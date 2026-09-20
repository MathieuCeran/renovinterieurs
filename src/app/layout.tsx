import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";

import { ActionBar } from "@/components/layout/action-bar";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Intro } from "@/components/ui/intro";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { SmoothScroll } from "@/components/ui/smooth-scroll";
import { grosOeuvre, services, site } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["italic", "normal"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.legalName,
  alternates: { canonical: "/" },
  category: "Rénovation intérieure",
  formatDetection: { telephone: true, address: true, email: true },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.description,
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Séjour haussmannien rénové par RenovIntérieur à Paris",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#efebe6",
  colorScheme: "light",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  "@id": `${site.url}#entreprise`,
  name: site.name,
  legalName: site.legalName,
  description: site.description,
  url: site.url,
  email: site.email,
  telephone: site.phoneDisplay,
  image: [`${site.url}/og.jpg`],
  logo: `${site.url}/brand/logo.png`,
  knowsLanguage: "fr-FR",
  currenciesAccepted: "EUR",
  areaServed: [
    { "@type": "City", name: "Paris" },
    { "@type": "AdministrativeArea", name: "Hauts-de-Seine" },
    { "@type": "AdministrativeArea", name: "Yvelines" },
    { "@type": "AdministrativeArea", name: "Val-de-Marne" },
    { "@type": "AdministrativeArea", name: "Île-de-France" },
  ],
  address: {
    "@type": "PostalAddress",
    addressRegion: "Île-de-France",
    addressCountry: "FR",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Prestations de rénovation",
    itemListElement: [...services, grosOeuvre].map((s) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: s.title,
        description: s.text,
        url: `${site.url}${s.href}`,
        provider: { "@id": `${site.url}#entreprise` },
        areaServed: { "@type": "AdministrativeArea", name: "Île-de-France" },
      },
    })),
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-dvh">
        {/* L’ouverture cinématique n’est jouée qu’une fois par session.
            Exécuté en tête de <body> : l’attribut est posé avant que le
            rideau ne soit peint. (Un <head> manuel casserait la gestion
            du head par l’App Router.) */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('ri-intro')){document.documentElement.setAttribute('data-intro-seen','')}else{sessionStorage.setItem('ri-intro','1')}}catch(e){}",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-90 focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-[0.82rem] focus:font-medium focus:text-paper"
        >
          Aller au contenu
        </a>

        <Intro />
        <SmoothScroll />
        <ScrollProgress />
        <Header />
        <main id="contenu">{children}</main>
        <Footer />
        <ActionBar />
      </body>
    </html>
  );
}
