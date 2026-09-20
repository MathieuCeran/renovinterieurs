"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  ChipChecks,
  ChipRadios,
  Field,
  NoScriptNote,
  ResultCard,
  SurfaceSlider,
  ToolPanel,
  euro,
} from "@/components/tools/ui";
import { ArrowRight } from "@/components/ui/kit";
import {
  CONTRAINTES,
  type ContrainteId,
  NIVEAUX,
  type NiveauId,
  estimateBudget,
} from "@/lib/tools";

export function BudgetEstimator() {
  const [surface, setSurface] = useState(60);
  const [niveau, setNiveau] = useState<NiveauId>("complete");
  const [contraintes, setContraintes] = useState<ContrainteId[]>([]);
  const [energetique, setEnergetique] = useState(false);

  const r = useMemo(
    () => estimateBudget(surface, niveau, contraintes, energetique),
    [surface, niveau, contraintes, energetique],
  );

  const toggle = (id: ContrainteId) =>
    setContraintes((c) =>
      c.includes(id) ? c.filter((x) => x !== id) : [...c, id],
    );

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1fr_1fr] lg:gap-10">
      {/* Paramètres */}
      <ToolPanel>
        <Field label="Surface">
          <SurfaceSlider value={surface} onChange={setSurface} />
        </Field>

        <Field
          label="Niveau de rénovation"
          hint={NIVEAUX.find((n) => n.id === niveau)?.desc}
        >
          <ChipRadios
            name="niveau"
            value={niveau}
            onChange={setNiveau}
            options={NIVEAUX.map((n) => ({
              id: n.id,
              label: n.label,
              desc: n.desc,
            }))}
          />
        </Field>

        <Field
          label="Contraintes du chantier"
          hint="Chaque contrainte majore l’estimation — elles reflètent le temps et les protections supplémentaires."
        >
          <ChipChecks
            values={contraintes}
            onToggle={toggle}
            options={CONTRAINTES.map((c) => ({ id: c.id, label: c.label }))}
          />
        </Field>

        <Field label="TVA applicable">
          <label className="flex cursor-pointer items-start gap-3 text-[0.86rem] leading-relaxed text-muted">
            <input
              type="checkbox"
              checked={energetique}
              onChange={(e) => setEnergetique(e.target.checked)}
              className="mt-0.5 size-4 shrink-0 accent-[var(--color-terra)]"
            />
            <span>
              Mon projet comprend des travaux d’amélioration énergétique
              éligibles (isolation, menuiseries, VMC, chauffage).
            </span>
          </label>
        </Field>

        <NoScriptNote />
      </ToolPanel>

      {/* Résultat */}
      <div className="space-y-4 lg:sticky lg:top-28">
        <ResultCard label="Estimation indicative">
          <p className="mt-4 text-[clamp(1.7rem,4vw,2.8rem)] leading-none font-medium tracking-[-0.02em]">
            <span className="display-italic">{euro(r.low)}</span>
            <span className="text-paper/40"> — </span>
            <span className="display-italic">{euro(r.high)}</span>
            <span className="ml-2 align-middle font-sans text-[0.9rem] text-paper/60">
              € HT
            </span>
          </p>

          <p className="mt-3 text-[0.88rem] text-paper/65">
            soit {euro(r.lowM2)} à {euro(r.highM2)} €/m² sur {surface} m²
            {r.majoration > 0 && (
              <>
                {" "}
                — majoration de {Math.round(r.majoration * 100)} % liée aux
                contraintes
              </>
            )}
          </p>

          <p className="mt-5 border-t border-paper/15 pt-5 text-[0.84rem] leading-relaxed text-paper/60">
            TVA applicable :{" "}
            <strong className="font-medium text-paper">{r.tva.taux}</strong> —{" "}
            {r.tva.base}.
          </p>

          <Link
            href="/contact-devis"
            className="group mt-6 inline-flex items-center gap-3 rounded-full bg-paper py-1.5 pr-1.5 pl-6 text-[0.88rem] font-medium text-ink transition-colors duration-500 hover:bg-terra hover:text-paper"
          >
            Obtenir un devis précis
            <span className="pill-arrow flex size-9 items-center justify-center rounded-full bg-terra text-paper transition-colors duration-500 group-hover:bg-paper group-hover:text-terra">
              <ArrowRight />
            </span>
          </Link>
        </ResultCard>

        {/* Répartition par poste */}
        <div className="rounded-[clamp(18px,2.4vw,28px)] border border-line bg-paper p-6 sm:p-8">
          <p className="dot-label text-[0.74rem] text-muted">
            Répartition par poste
          </p>
          <ul className="mt-5">
            {r.postes.map((p) => (
              <li
                key={p.label}
                className="border-b border-line py-3 last:border-0"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-[0.92rem] font-medium">{p.label}</span>
                  <span className="shrink-0 text-[0.86rem] whitespace-nowrap text-muted">
                    {euro(p.low)} – {euro(p.high)} €
                  </span>
                </div>
                <div
                  className="mt-2 h-1 w-full overflow-hidden rounded-full bg-line"
                  role="presentation"
                >
                  <span
                    className="block h-full rounded-full bg-terra"
                    style={{ width: `${p.part}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[0.78rem] leading-relaxed text-muted">
            Estimation indicative fondée sur les fourchettes observées en
            Île-de-France en 2026. Elle ne constitue pas un devis : seule une
            visite technique permet un chiffrage engageant.
          </p>
        </div>
      </div>
    </div>
  );
}
