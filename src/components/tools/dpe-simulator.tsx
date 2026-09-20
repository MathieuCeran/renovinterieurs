"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  ChipChecks,
  ChipRadios,
  Field,
  NoScriptNote,
  ResultCard,
  ToolPanel,
} from "@/components/tools/ui";
import { ArrowRight } from "@/components/ui/kit";
import {
  CLASSES,
  type Classe,
  POSTES_DPE,
  type PosteDpeId,
  simulateDpe,
} from "@/lib/tools";

const COULEURS: Record<Classe, string> = {
  A: "#2e7d32",
  B: "#4c9c2e",
  C: "#8cba2b",
  D: "#f2c200",
  E: "#f08c00",
  F: "#e6562b",
  G: "#c62828",
};

function Etiquette({ c, actif }: { c: Classe; actif: boolean }) {
  return (
    <span
      className={`flex size-9 items-center justify-center rounded-lg text-[0.92rem] font-semibold text-white transition-all duration-400 ${
        actif ? "scale-110 shadow-lg" : "opacity-35"
      }`}
      style={{ backgroundColor: COULEURS[c] }}
    >
      {c}
    </span>
  );
}

export function DpeSimulator() {
  const [from, setFrom] = useState<Classe>("F");
  const [postes, setPostes] = useState<PosteDpeId[]>(["murs", "menuiseries"]);

  const r = useMemo(() => simulateDpe(from, postes), [from, postes]);

  const toggle = (id: PosteDpeId) =>
    setPostes((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1fr_1fr] lg:gap-10">
      <ToolPanel>
        <Field
          label="Classe DPE actuelle"
          hint="Indiquée sur le diagnostic de performance énergétique de votre bien."
        >
          <ChipRadios
            name="classe"
            value={from}
            onChange={setFrom}
            options={CLASSES.map((c) => ({ id: c, label: c }))}
          />
        </Field>

        <Field
          label="Travaux envisagés"
          hint="Sélectionnez les postes que vous envisagez. Un bouquet de travaux est toujours plus efficace qu’un geste isolé."
        >
          <ChipChecks
            values={postes}
            onToggle={toggle}
            options={POSTES_DPE.map((p) => ({
              id: p.id,
              label: p.label,
              desc: p.note,
            }))}
          />
        </Field>

        <NoScriptNote />
      </ToolPanel>

      <div className="space-y-4 lg:sticky lg:top-28">
        <ResultCard label="Gain estimé" tone="clay">
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="flex gap-1.5">
              {CLASSES.map((c) => (
                <Etiquette key={c} c={c} actif={c === r.from} />
              ))}
            </span>
          </div>

          <p className="mt-6 text-[clamp(1.5rem,3.4vw,2.3rem)] leading-tight font-medium tracking-[-0.02em]">
            {r.gain > 0 ? (
              <>
                <span className="display-italic">{r.from}</span>
                <span className="mx-3 text-paper/40">→</span>
                <span className="display-italic">{r.to}</span>
                <span className="ml-3 align-middle font-sans text-[0.9rem] text-paper/65">
                  {r.gain} classe{r.gain > 1 ? "s" : ""} gagnée
                  {r.gain > 1 ? "s" : ""}
                </span>
              </>
            ) : (
              <span className="text-[1.3rem] font-medium">
                Sélectionnez au moins un poste de travaux
              </span>
            )}
          </p>

          {r.sortiePassoire && (
            <p className="mt-4 inline-block rounded-full bg-paper/15 px-4 py-2 text-[0.84rem] font-medium">
              Sortie du statut de passoire énergétique
            </p>
          )}

          <Link
            href="/isolation-amelioration-energetique"
            className="group mt-7 inline-flex items-center gap-3 rounded-full bg-paper py-1.5 pr-1.5 pl-6 text-[0.88rem] font-medium text-ink transition-colors duration-500 hover:bg-terra hover:text-paper"
          >
            Notre offre isolation & DPE
            <span className="pill-arrow flex size-9 items-center justify-center rounded-full bg-terra text-paper transition-colors duration-500 group-hover:bg-paper group-hover:text-terra">
              <ArrowRight />
            </span>
          </Link>
        </ResultCard>

        {r.retenus.length > 0 && (
          <div className="rounded-[clamp(18px,2.4vw,28px)] border border-line bg-paper p-6 sm:p-8">
            <p className="dot-label text-[0.74rem] text-muted">
              Postes retenus
            </p>
            <ul className="mt-5">
              {r.retenus.map((p) => (
                <li
                  key={p.id}
                  className="border-b border-line py-3.5 last:border-0"
                >
                  <Link href={p.href} className="group block">
                    <span className="flex items-baseline justify-between gap-4">
                      <span className="text-[0.94rem] font-medium transition-colors group-hover:text-terra">
                        {p.label}
                      </span>
                      <span className="pill-arrow shrink-0 text-muted">
                        <ArrowRight className="size-3" />
                      </span>
                    </span>
                    <span className="mt-1 block text-[0.84rem] leading-relaxed text-muted">
                      {p.note}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {r.aides.length > 0 && (
          <div className="rounded-[clamp(18px,2.4vw,28px)] border border-line bg-paper p-6 sm:p-8">
            <p className="dot-label text-[0.74rem] text-terra">
              Aides mobilisables
            </p>
            <ul className="mt-4 space-y-2.5">
              {r.aides.map((a) => (
                <li
                  key={a}
                  className="flex gap-3 text-[0.9rem] leading-relaxed text-muted"
                >
                  <span
                    aria-hidden
                    className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-terra"
                  />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[0.78rem] leading-relaxed text-muted">
              Simulation indicative. Les gains réels dépendent du bâti, de
              l’exposition et des équipements existants : seul un audit
              énergétique fait foi. L’éligibilité aux aides est vérifiée au cas
              par cas lors de l’étude du projet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
