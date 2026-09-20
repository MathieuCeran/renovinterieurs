import Image from "next/image";
import Link from "next/link";

import { ArrowRight } from "@/components/ui/kit";
import { splitHeading } from "@/lib/content";

export function InnerHero({
  h1,
  intro,
  image,
  crumbLabel,
  crumbHref,
}: {
  h1: string;
  intro?: string;
  image: string;
  crumbLabel: string;
  crumbHref: string;
}) {
  const [lead, tail] = splitHeading(h1);

  return (
    <section data-hero aria-label={h1}>
      <div className="relative isolate flex min-h-[max(460px,70svh)] flex-col overflow-hidden bg-ink">
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="anim-zoom -z-10 object-cover object-center"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(10,8,6,0.86)_0%,rgba(10,8,6,0.52)_32%,rgba(10,8,6,0.2)_66%,rgba(10,8,6,0.5)_100%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(94deg,rgba(10,8,6,0.7)_0%,rgba(10,8,6,0.26)_48%,rgba(10,8,6,0.05)_78%)]"
        />

        <div className="container-x relative flex flex-1 items-end pt-32 pb-12 sm:pt-36 sm:pb-16">
          <div className="w-full">
            <nav aria-label="Fil d’Ariane">
              <ol
                className="anim-rise-sm flex flex-wrap items-center gap-2 text-[0.78rem] text-paper/70"
                style={{ "--d": "0.05s" } as React.CSSProperties}
              >
                <li>
                  <Link href="/" className="transition-colors hover:text-paper">
                    Accueil
                  </Link>
                </li>
                <li aria-hidden className="text-paper/35">
                  /
                </li>
                <li>
                  <Link
                    href={crumbHref}
                    className="transition-colors hover:text-paper"
                  >
                    {crumbLabel}
                  </Link>
                </li>
              </ol>
            </nav>

            <h1 className="mt-5 max-w-[19ch] text-[clamp(1.8rem,4.6vw,3.7rem)] leading-[0.99] font-medium tracking-[-0.03em] text-balance text-paper">
              <span
                className="mask anim-unmask"
                style={{ "--d": "0.12s" } as React.CSSProperties}
              >
                <span className="block">{lead}</span>
              </span>
              {tail && (
                <span
                  className="mask anim-unmask mt-1 block"
                  style={{ "--d": "0.24s" } as React.CSSProperties}
                >
                  <span className="display-italic block text-[1.02em] leading-[1.04] text-shell">
                    {tail}
                  </span>
                </span>
              )}
            </h1>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-14">
              <div
                className="anim-rise flex flex-wrap items-center gap-2.5 sm:gap-3"
                style={{ "--d": "0.46s" } as React.CSSProperties}
              >
                <Link
                  href="#devis"
                  className="group inline-flex items-center gap-3 rounded-full bg-paper py-1.5 pr-1.5 pl-6 text-[0.9rem] font-medium text-ink shadow-[0_14px_40px_-16px_rgba(0,0,0,0.8)] transition-colors duration-500 hover:bg-terra hover:text-paper"
                >
                  Obtenir un devis
                  <span className="pill-arrow flex size-9 items-center justify-center rounded-full bg-terra text-paper transition-colors duration-500 group-hover:bg-paper group-hover:text-terra">
                    <ArrowRight />
                  </span>
                </Link>
                <Link
                  href="/contact-devis"
                  className="group inline-flex items-center gap-2.5 rounded-full border border-paper/45 px-6 py-3 text-[0.9rem] font-medium text-paper transition-colors duration-500 hover:bg-paper hover:text-ink"
                >
                  Nous contacter
                  <span className="pill-arrow">
                    <ArrowRight className="size-3" />
                  </span>
                </Link>
              </div>

              {intro && (
                <p
                  className="anim-rise max-w-md border-paper/20 text-[0.9rem] leading-relaxed text-paper/85 [text-shadow:0_1px_14px_rgba(0,0,0,0.6)] lg:border-l lg:pb-1 lg:pl-8"
                  style={{ "--d": "0.36s" } as React.CSSProperties}
                >
                  {intro}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Slug d'ancre stable pour le sommaire. */
export function anchorId(title: string, i: number) {
  const base = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return `${base || "section"}-${i + 1}`;
}
