import Image from "next/image";
import Link from "next/link";

import { ArrowRight } from "@/components/ui/kit";

/**
 * Hero des pages à gabarit dédié : titre en deux temps (sans + serif
 * italique), sur-titre, chapeau et actions optionnelles.
 */
export function PageHero({
  eyebrow,
  line1,
  line2,
  intro,
  image,
  height = "58svh",
  primary,
  secondary,
  footer,
}: {
  eyebrow: string;
  line1: string;
  line2?: string;
  intro?: string;
  image: string;
  height?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  footer?: React.ReactNode;
}) {
  return (
    <section data-hero aria-label={`${line1} ${line2 ?? ""}`.trim()}>
      <div
        className="relative isolate flex flex-col overflow-hidden bg-ink"
        style={{ minHeight: `max(420px, ${height})` }}
      >
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
          className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(10,8,6,0.88)_0%,rgba(10,8,6,0.55)_32%,rgba(10,8,6,0.22)_66%,rgba(10,8,6,0.5)_100%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(94deg,rgba(10,8,6,0.7)_0%,rgba(10,8,6,0.26)_48%,rgba(10,8,6,0.05)_78%)]"
        />

        <div className="container-x relative flex flex-1 items-end pt-32 pb-12 sm:pb-14">
          <div className="w-full">
            <p
              className="dot-label anim-rise-sm text-paper/85"
              style={{ "--d": "0.05s" } as React.CSSProperties}
            >
              {eyebrow}
            </p>

            <h1 className="mt-5 max-w-[18ch] text-[clamp(1.95rem,4.8vw,3.9rem)] leading-[0.98] font-medium tracking-[-0.03em] text-balance text-paper">
              <span
                className="mask anim-unmask"
                style={{ "--d": "0.12s" } as React.CSSProperties}
              >
                <span className="block">{line1}</span>
              </span>
              {line2 && (
                <span
                  className="mask anim-unmask mt-1 block"
                  style={{ "--d": "0.24s" } as React.CSSProperties}
                >
                  <span className="display-italic block text-[1.04em] leading-[1.02] text-shell">
                    {line2}
                  </span>
                </span>
              )}
            </h1>

            {(primary || intro) && (
              <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-14">
                {primary && (
                  <div
                    className="anim-rise flex flex-wrap items-center gap-2.5 sm:gap-3"
                    style={{ "--d": "0.46s" } as React.CSSProperties}
                  >
                    <Link
                      href={primary.href}
                      className="group inline-flex items-center gap-3 rounded-full bg-paper py-1.5 pr-1.5 pl-6 text-[0.9rem] font-medium text-ink shadow-[0_14px_40px_-16px_rgba(0,0,0,0.8)] transition-colors duration-500 hover:bg-terra hover:text-paper"
                    >
                      {primary.label}
                      <span className="pill-arrow flex size-9 items-center justify-center rounded-full bg-terra text-paper transition-colors duration-500 group-hover:bg-paper group-hover:text-terra">
                        <ArrowRight />
                      </span>
                    </Link>
                    {secondary && (
                      <Link
                        href={secondary.href}
                        className="group inline-flex items-center gap-2.5 rounded-full border border-paper/45 px-6 py-3 text-[0.9rem] font-medium text-paper transition-colors duration-500 hover:bg-paper hover:text-ink"
                      >
                        {secondary.label}
                        <span className="pill-arrow">
                          <ArrowRight className="size-3" />
                        </span>
                      </Link>
                    )}
                  </div>
                )}

                {intro && (
                  <p
                    className="anim-rise max-w-md border-paper/20 text-[0.9rem] leading-relaxed text-paper/85 [text-shadow:0_1px_14px_rgba(0,0,0,0.6)] lg:border-l lg:pb-1 lg:pl-8"
                    style={{ "--d": "0.36s" } as React.CSSProperties}
                  >
                    {intro}
                  </p>
                )}
              </div>
            )}

            {footer && (
              <div
                className="anim-fade mt-8 border-t border-paper/20 pt-5"
                style={{ "--d": "0.62s" } as React.CSSProperties}
              >
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
