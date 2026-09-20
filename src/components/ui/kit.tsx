import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

/* ------------------------------------------------------------------ */
/*  Icônes                                                             */
/* ------------------------------------------------------------------ */

export function ArrowRight({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className={className}>
      <path
        d="M2.5 8h10M8.5 3.5L13 8l-4.5 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PhoneIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5L17 13l4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 3 5.2 2 2 0 0 1 5 3h1.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Boutons « pill » avec pastille flèche                              */
/* ------------------------------------------------------------------ */

type PillProps = {
  href: string;
  children: ReactNode;
  className?: string;
  tone?: "ink" | "paper" | "terra";
} & Omit<
  ComponentPropsWithoutRef<typeof Link>,
  "href" | "className" | "children"
>;

const tones = {
  ink: {
    wrap: "bg-ink text-paper hover:bg-ink-2",
    badge: "bg-paper text-ink",
  },
  paper: {
    wrap: "bg-paper text-ink hover:bg-sand",
    badge: "bg-ink text-paper",
  },
  terra: {
    wrap: "bg-terra text-paper hover:bg-terra-deep",
    badge: "bg-paper text-terra",
  },
} as const;

/** CTA principal : pilule + pastille circulaire contenant la flèche. */
export function Pill({
  href,
  children,
  className = "",
  tone = "ink",
  ...rest
}: PillProps) {
  const t = tones[tone];
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-3 rounded-full py-1.5 pr-1.5 pl-6 text-[0.88rem] font-medium transition-colors duration-500 ${t.wrap} ${className}`}
      {...rest}
    >
      {children}
      <span
        className={`pill-arrow flex size-9 items-center justify-center rounded-full ${t.badge}`}
      >
        <ArrowRight />
      </span>
    </Link>
  );
}

/** CTA secondaire : contour fin, sans pastille. */
export function PillGhost({
  href,
  children,
  className = "",
  dark,
  ...rest
}: Omit<PillProps, "tone"> & { dark?: boolean }) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2.5 rounded-full border px-6 py-3 text-[0.88rem] font-medium transition-colors duration-500 ${
        dark
          ? "border-paper/30 text-paper hover:border-paper hover:bg-paper hover:text-ink"
          : "border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-paper"
      } ${className}`}
      {...rest}
    >
      {children}
      <span className="pill-arrow">
        <ArrowRight className="size-3" />
      </span>
    </Link>
  );
}
