import type { ReactNode } from "react";

/** Mention à remplacer par le client avant mise en ligne. */
export function ToFill({ children }: { children: ReactNode }) {
  return (
    <mark className="rounded bg-terra/12 px-1.5 py-0.5 font-medium text-terra-deep">
      {children}
    </mark>
  );
}

export function LegalSection({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: ReactNode;
}) {
  const id = `art-${n}`;
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-28 py-8 lg:py-10"
    >
      <div className="grid gap-5 border-t border-line pt-8 lg:grid-cols-[minmax(0,220px)_1fr] lg:gap-14">
        <div className="reveal-sm lg:sticky lg:top-28 lg:self-start">
          <span className="display-italic text-[1.35rem] leading-none text-terra">
            {String(n).padStart(2, "0")}
          </span>
          <h2
            id={`${id}-title`}
            className="mt-3 text-[1.15rem] leading-tight font-medium tracking-[-0.01em] text-balance"
          >
            {title}
          </h2>
        </div>
        <div className="reveal max-w-3xl [&_a]:text-terra [&_a]:underline-offset-4 [&_a:hover]:underline [&_li]:mb-2 [&_p]:mt-4 [&_p:first-child]:mt-0 [&_p]:text-[0.95rem] [&_p]:leading-[1.75] [&_p]:text-muted [&_ul]:mt-4 [&_ul]:space-y-2 [&_li]:text-[0.95rem] [&_li]:leading-relaxed [&_li]:text-muted">
          {children}
        </div>
      </div>
    </section>
  );
}
