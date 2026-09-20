"use client";

import type { ReactNode } from "react";

/* ------------------------------------------------------------------ */
/*  Briques partagées des outils                                       */
/* ------------------------------------------------------------------ */

export function ToolPanel({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[clamp(18px,2.4vw,28px)] bg-paper p-6 sm:p-8">
      {children}
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="mt-7 first:mt-0">
      <legend className="text-[0.72rem] font-medium tracking-[0.1em] text-muted uppercase">
        {label}
      </legend>
      {hint && (
        <p className="mt-2 text-[0.82rem] leading-relaxed text-muted">{hint}</p>
      )}
      <div className="mt-3.5">{children}</div>
    </fieldset>
  );
}

/** Groupe de choix exclusif — fonctionne sans JavaScript (radios natives). */
export function ChipRadios<T extends string>({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: { id: T; label: string; desc?: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <label
          key={o.id}
          title={o.desc}
          className="cursor-pointer rounded-full border border-line text-ink transition-colors duration-300 hover:border-ink/40 has-[:checked]:border-terra has-[:checked]:bg-terra has-[:checked]:text-paper has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-terra"
        >
          <input
            type="radio"
            name={name}
            value={o.id}
            checked={value === o.id}
            onChange={() => onChange(o.id)}
            className="sr-only"
          />
          <span className="block px-4 py-2 text-[0.84rem]">{o.label}</span>
        </label>
      ))}
    </div>
  );
}

/** Cases à cocher en pastilles — natives elles aussi. */
export function ChipChecks<T extends string>({
  options,
  values,
  onToggle,
}: {
  options: { id: T; label: string; desc?: string }[];
  values: T[];
  onToggle: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <label
          key={o.id}
          title={o.desc}
          className="cursor-pointer rounded-full border border-line text-ink transition-colors duration-300 hover:border-ink/40 has-[:checked]:border-terra has-[:checked]:bg-terra has-[:checked]:text-paper has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-terra"
        >
          <input
            type="checkbox"
            checked={values.includes(o.id)}
            onChange={() => onToggle(o.id)}
            className="sr-only"
          />
          <span className="block px-4 py-2 text-[0.84rem]">{o.label}</span>
        </label>
      ))}
    </div>
  );
}

export function SurfaceSlider({
  value,
  onChange,
  min = 15,
  max = 200,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor="surface" className="text-[0.86rem] text-muted">
          Surface du logement
        </label>
        <span className="display-italic text-[1.5rem] leading-none">
          {value}
          <span className="ml-1 font-sans text-[0.8rem] text-muted">m²</span>
        </span>
      </div>
      <input
        id="surface"
        type="range"
        min={min}
        max={max}
        step={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full accent-[var(--color-terra)]"
      />
      <div className="mt-1 flex justify-between text-[0.72rem] text-muted">
        <span>{min} m²</span>
        <span>{max} m² et +</span>
      </div>
    </div>
  );
}

export function ResultCard({
  label,
  children,
  tone = "ink",
}: {
  label: string;
  children: ReactNode;
  tone?: "ink" | "clay";
}) {
  return (
    <div
      aria-live="polite"
      className={`rounded-[clamp(18px,2.4vw,28px)] p-7 text-paper sm:p-9 ${
        tone === "clay" ? "bg-clay" : "bg-ink"
      }`}
    >
      <p className="dot-label text-[0.74rem] text-paper/60">{label}</p>
      {children}
    </div>
  );
}

export function euro(n: number) {
  return n.toLocaleString("fr-FR");
}

/** Message affiché si le JavaScript ne s'exécute pas. */
export function NoScriptNote() {
  return (
    <noscript>
      <p className="mt-4 rounded-2xl border border-terra/25 bg-terra/6 p-4 text-[0.84rem] leading-relaxed text-ink/80">
        Cet outil a besoin de JavaScript pour calculer votre estimation. Vous
        pouvez aussi nous décrire votre projet : nous vous répondons sous 24 h
        ouvrées.
      </p>
    </noscript>
  );
}
