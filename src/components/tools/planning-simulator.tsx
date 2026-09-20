"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  ChipRadios,
  Field,
  NoScriptNote,
  ResultCard,
  SurfaceSlider,
  ToolPanel,
} from "@/components/tools/ui";
import { ArrowRight } from "@/components/ui/kit";
import { NIVEAUX, type NiveauId, planChantier } from "@/lib/tools";

export function PlanningSimulator() {
  const [surface, setSurface] = useState(65);
  const [niveau, setNiveau] = useState<NiveauId>("complete");

  const r = useMemo(() => planChantier(surface, niveau), [surface, niveau]);

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-10">
      <ToolPanel>
        <Field label="Surface">
          <SurfaceSlider value={surface} onChange={setSurface} />
        </Field>

        <Field
          label="Ampleur des travaux"
          hint={NIVEAUX.find((n) => n.id === niveau)?.desc}
        >
          <ChipRadios
            name="ampleur"
            value={niveau}
            onChange={setNiveau}
            options={NIVEAUX.map((n) => ({
              id: n.id,
              label: n.label,
              desc: n.desc,
            }))}
          />
        </Field>

        <div className="mt-8 border-t border-line pt-6">
          <p className="dot-label text-[0.74rem] text-terra">
            Avant le chantier
          </p>
          <ul className="mt-4 space-y-2.5 text-[0.88rem] leading-relaxed text-muted">
            <li className="flex gap-3">
              <span
                aria-hidden
                className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-terra"
              />
              <span>Visite technique sous 5 jours après votre demande.</span>
            </li>
            <li className="flex gap-3">
              <span
                aria-hidden
                className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-terra"
              />
              <span>
                Devis détaillé sous 48 h, planning prévisionnel inclus.
              </span>
            </li>
          </ul>
        </div>

        <NoScriptNote />
      </ToolPanel>

      <div className="space-y-4">
        <ResultCard label="Durée estimée du chantier">
          <p className="mt-4 text-[clamp(1.7rem,4vw,2.8rem)] leading-none font-medium tracking-[-0.02em]">
            <span className="display-italic">{r.weeksLow}</span>
            <span className="text-paper/40"> — </span>
            <span className="display-italic">{r.weeksHigh}</span>
            <span className="ml-2 align-middle font-sans text-[0.9rem] text-paper/60">
              semaines
            </span>
          </p>
          <p className="mt-3 text-[0.88rem] text-paper/65">
            pour {surface} m² en{" "}
            {NIVEAUX.find((n) => n.id === niveau)?.label.toLowerCase()}, hors
            délai d’approvisionnement des matériaux sur-mesure.
          </p>

          <Link
            href="/contact-devis"
            className="group mt-6 inline-flex items-center gap-3 rounded-full bg-paper py-1.5 pr-1.5 pl-6 text-[0.88rem] font-medium text-ink transition-colors duration-500 hover:bg-terra hover:text-paper"
          >
            Caler mes dates
            <span className="pill-arrow flex size-9 items-center justify-center rounded-full bg-terra text-paper transition-colors duration-500 group-hover:bg-paper group-hover:text-terra">
              <ArrowRight />
            </span>
          </Link>
        </ResultCard>

        {/* Diagramme des phases */}
        <div className="rounded-[clamp(18px,2.4vw,28px)] border border-line bg-paper p-6 sm:p-8">
          <p className="dot-label text-[0.74rem] text-muted">
            Enchaînement des phases
          </p>

          <ol className="mt-5">
            {r.phases.map((p, i) => (
              <li
                key={p.label}
                className="border-b border-line py-3.5 last:border-0"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="flex items-baseline gap-3">
                    <span className="display-italic w-6 shrink-0 text-[0.8rem] text-terra">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[0.94rem] font-medium">
                      {p.label}
                    </span>
                  </span>
                  <span className="shrink-0 text-[0.82rem] whitespace-nowrap text-muted">
                    S{Math.max(1, Math.ceil(p.startLow) || 1)} → S
                    {Math.ceil(p.endLow)}
                  </span>
                </div>

                <div className="mt-2 ml-9 h-1.5 w-[calc(100%-2.25rem)] overflow-hidden rounded-full bg-line">
                  <span
                    className="block h-full rounded-full bg-terra"
                    style={{
                      marginLeft: `${(p.startLow / r.weeksHigh) * 100}%`,
                      width: `${((p.endLow - p.startLow) / r.weeksHigh) * 100}%`,
                    }}
                  />
                </div>

                <p className="mt-1.5 ml-9 text-[0.8rem] leading-relaxed text-muted">
                  {p.lots}
                </p>
              </li>
            ))}
          </ol>

          <p className="mt-5 text-[0.78rem] leading-relaxed text-muted">
            Planning indicatif fondé sur nos durées de chantier observées en
            Île-de-France. Le planning contractuel est remis avec le devis,
            après visite technique.
          </p>
        </div>
      </div>
    </div>
  );
}
