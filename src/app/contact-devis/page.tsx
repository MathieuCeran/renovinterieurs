import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Process } from "@/components/sections/process";
import { LeadForm } from "@/components/sections/lead-form";
import { ArrowRight, PhoneIcon } from "@/components/ui/kit";
import { cleanTitle, getPage, visualsFor } from "@/lib/content";
import { site, zones } from "@/lib/site";

const path = "/contact-devis";

export async function generateMetadata(): Promise<Metadata> {
  const page = getPage(path);
  const title = page?.title ?? "Contact & devis gratuit — RenovIntérieur";
  const description =
    page?.description ??
    "Décrivez votre projet de rénovation : visite technique sous 5 jours, devis détaillé sous 48 h. Paris & Île-de-France.";

  return {
    title: cleanTitle(title),
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      url: `${site.url}${path}`,
      siteName: site.name,
      title,
      description,
      images: [{ url: "/og.jpg" }],
    },
  };
}

const promesses = [
  {
    k: "24 h",
    v: "Première réponse",
    d: "Un conducteur de travaux vous rappelle, pas un standard.",
  },
  {
    k: "5 jours",
    v: "Visite technique",
    d: "Sur place, relevés et contraintes de copropriété.",
  },
  {
    k: "48 h",
    v: "Devis détaillé",
    d: "Poste par poste, avec planning prévisionnel.",
  },
  {
    k: "0 €",
    v: "Sans engagement",
    d: "L’étude et le chiffrage sont offerts.",
  },
];

export default function ContactPage() {
  const { hero } = visualsFor(path);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact & devis — RenovIntérieur",
    url: `${site.url}${path}`,
    mainEntity: {
      "@id": `${site.url}#entreprise`,
      "@type": "GeneralContractor",
      name: site.name,
      telephone: site.phoneDisplay,
      email: site.email,
      areaServed: "Île-de-France",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ---------- Hero compact ---------- */}
      <section data-hero aria-label="Contact et devis">
        <div className="relative isolate flex min-h-[max(420px,58svh)] flex-col overflow-hidden bg-ink">
          <Image
            src={hero}
            alt=""
            fill
            priority
            sizes="100vw"
            className="anim-zoom -z-10 object-cover object-center"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(10,8,6,0.88)_0%,rgba(10,8,6,0.55)_34%,rgba(10,8,6,0.22)_68%,rgba(10,8,6,0.5)_100%)]"
          />

          <div className="container-x relative flex flex-1 items-end pt-32 pb-12 sm:pb-14">
            <div className="w-full">
              <p
                className="dot-label anim-rise-sm text-paper/85"
                style={{ "--d": "0.05s" } as React.CSSProperties}
              >
                Devis gratuit — Paris &amp; Île-de-France
              </p>

              <h1 className="mt-5 max-w-[17ch] text-[clamp(2rem,5vw,4rem)] leading-[0.97] font-medium tracking-[-0.03em] text-balance text-paper">
                <span
                  className="mask anim-unmask"
                  style={{ "--d": "0.12s" } as React.CSSProperties}
                >
                  <span className="block">Parlons de</span>
                </span>
                <span
                  className="mask anim-unmask mt-1 block"
                  style={{ "--d": "0.24s" } as React.CSSProperties}
                >
                  <span className="display-italic block text-[1.04em] leading-[1.02] text-shell">
                    votre projet
                  </span>
                </span>
              </h1>

              <ul
                className="anim-fade mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-paper/20 pt-5"
                style={{ "--d": "0.6s" } as React.CSSProperties}
              >
                {promesses.map((p) => (
                  <li key={p.k} className="flex items-baseline gap-2">
                    <span className="display-italic text-[1.1rem] text-paper">
                      {p.k}
                    </span>
                    <span className="text-[0.8rem] text-paper/70">{p.v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Cœur de conversion ---------- */}
      <section
        id="devis"
        className="py-14 lg:py-20"
        aria-labelledby="devis-title"
      >
        <div className="container-x grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* Colonne de réassurance */}
          <div className="lg:sticky lg:top-28">
            <h2
              id="devis-title"
              className="text-[clamp(1.5rem,3vw,2.2rem)] leading-[1.06] font-medium tracking-[-0.02em]"
            >
              <span className="mask reveal-mask">
                <span className="block">Ce qui se passe</span>
              </span>
              <span className="mask reveal-mask">
                <span className="display-italic block text-[1.1em]">
                  après l’envoi
                </span>
              </span>
            </h2>

            <ol className="reveal-stagger mt-8 border-t border-line">
              {promesses.slice(0, 3).map((p, i) => (
                <li
                  key={p.k}
                  style={{ "--i": i } as React.CSSProperties}
                  className="flex gap-5 border-b border-line py-5"
                >
                  <span className="display-italic w-16 shrink-0 text-[1.35rem] leading-none text-terra">
                    {p.k}
                  </span>
                  <span>
                    <span className="block text-[1rem] font-medium">{p.v}</span>
                    <span className="mt-1 block text-[0.86rem] leading-relaxed text-muted">
                      {p.d}
                    </span>
                  </span>
                </li>
              ))}
            </ol>

            {/* Contact direct */}
            <div className="reveal mt-9 space-y-2.5">
              <a
                href={site.phoneHref}
                className="group flex items-center gap-4 rounded-2xl border border-line bg-paper p-4 transition-colors duration-400 hover:border-ink/30"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-terra text-paper">
                  <PhoneIcon className="size-4.5" />
                </span>
                <span className="flex-1">
                  <span className="block text-[0.72rem] text-muted">
                    Appeler directement
                  </span>
                  <span className="block text-[1.12rem] font-medium">
                    {site.phoneDisplay}
                  </span>
                </span>
                <span className="pill-arrow text-muted">
                  <ArrowRight />
                </span>
              </a>

              <a
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-line bg-paper p-4 transition-colors duration-400 hover:border-ink/30"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden
                    className="size-5"
                    fill="currentColor"
                  >
                    <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.17-1.35a9.93 9.93 0 0 0 4.87 1.24h.01c5.5 0 9.96-4.46 9.96-9.96 0-2.66-1.04-5.16-2.92-7.04A9.9 9.9 0 0 0 12.04 2Zm0 18.13h-.01a8.26 8.26 0 0 1-4.21-1.15l-.3-.18-3.07.8.82-2.99-.2-.31a8.24 8.24 0 0 1-1.26-4.39c0-4.56 3.71-8.27 8.28-8.27 2.21 0 4.29.86 5.85 2.43a8.22 8.22 0 0 1 2.42 5.85c0 4.57-3.71 8.28-8.32 8.28Z" />
                  </svg>
                </span>
                <span className="flex-1">
                  <span className="block text-[0.72rem] text-muted">
                    Envoyer une photo
                  </span>
                  <span className="block text-[1.12rem] font-medium">
                    WhatsApp
                  </span>
                </span>
                <span className="pill-arrow text-muted">
                  <ArrowRight />
                </span>
              </a>

              <a
                href={`mailto:${site.email}`}
                className="group flex items-center gap-4 rounded-2xl border border-line bg-paper p-4 transition-colors duration-400 hover:border-ink/30"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-ink text-paper">
                  <svg viewBox="0 0 24 24" aria-hidden className="size-4.5">
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="14"
                      rx="2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M3.5 6.5L12 13l8.5-6.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </span>
                <span className="flex-1">
                  <span className="block text-[0.72rem] text-muted">
                    Écrire
                  </span>
                  <span className="block text-[0.95rem] font-medium">
                    {site.email}
                  </span>
                </span>
                <span className="pill-arrow text-muted">
                  <ArrowRight />
                </span>
              </a>
            </div>

            <p className="reveal mt-7 border-t border-line pt-5 text-[0.84rem] leading-relaxed text-muted">
              Garantie décennale, biennale et parfait achèvement — attestations
              fournies avant le démarrage du chantier.
            </p>
          </div>

          {/* Formulaire */}
          <div className="reveal">
            <LeadForm />
          </div>
        </div>
      </section>

      {/* ---------- Zones ---------- */}
      <section className="py-12 lg:py-16" aria-labelledby="zones-contact">
        <div className="container-x border-t border-line pt-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="zones-contact" className="dot-label text-muted">
              Nous intervenons
            </h2>
            <span className="display-italic text-[0.95rem] text-muted">
              Paris &amp; Île-de-France
            </span>
          </div>
          <ul className="reveal-sm mt-5 flex flex-wrap gap-2">
            {zones.map((z) => (
              <li key={z.href}>
                <Link
                  href={z.href}
                  className="inline-block rounded-full border border-line px-4 py-2 text-[0.84rem] text-ink/75 transition-colors duration-400 hover:border-terra hover:bg-terra hover:text-paper"
                >
                  {z.dept}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Process />
    </>
  );
}
