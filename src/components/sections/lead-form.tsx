"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

import { ArrowRight } from "@/components/ui/kit";

const projets = [
  "Rénovation complète",
  "Rénovation partielle",
  "Salle de bain",
  "Cuisine sur-mesure",
  "Isolation / DPE",
  "Béton ciré",
  "Gros œuvre",
  "Dépannage urgent",
  "Débarras",
];

const budgets = [
  "Moins de 15 000 €",
  "15 000 – 40 000 €",
  "40 000 – 80 000 €",
  "80 000 – 150 000 €",
  "Plus de 150 000 €",
  "À définir ensemble",
];

const delais = [
  "Dès que possible",
  "Sous 3 mois",
  "Dans 3 à 6 mois",
  "Plus tard",
];

type State = "idle" | "sending" | "done" | "error";

const field =
  "peer w-full rounded-xl border border-line bg-shell/60 px-4 pt-6 pb-2.5 text-[0.92rem] text-ink transition-colors duration-300 outline-none placeholder:text-transparent hover:border-ink/25 focus:border-terra";
const label =
  "pointer-events-none absolute left-4 top-4 origin-left text-[0.86rem] text-muted transition-all duration-300 peer-focus:top-2 peer-focus:text-[0.66rem] peer-focus:tracking-[0.08em] peer-focus:text-terra peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[0.66rem] peer-[:not(:placeholder-shown)]:tracking-[0.08em] peer-[:not(:placeholder-shown)]:uppercase";
const select =
  "w-full appearance-none rounded-xl border border-line bg-shell/60 px-4 pt-6 pb-2.5 text-[0.92rem] text-ink transition-colors duration-300 outline-none hover:border-ink/25 focus:border-terra";

export function LeadForm() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState({
    projet: "",
    surface: "",
    commune: "",
    budget: "",
    delai: "",
    nom: "",
    email: "",
    telephone: "",
    message: "",
    consent: false,
  });

  const formRef = useRef<HTMLFormElement>(null);
  const [touched, setTouched] = useState(false);

  const set = <K extends keyof typeof data>(k: K, v: (typeof data)[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  /**
   * Le DOM fait foi.
   *
   * Deux cas cassent l'état React seul : l'autocomplétion Chrome, qui
   * écrit dans les champs sans déclencher `onChange`, et les clics sur
   * les pastilles (radios visuellement masqués). On relit donc le
   * formulaire après le montage puis à chaque interaction, et l'on
   * aligne l'état sur ce que contient réellement le DOM.
   */
  useEffect(() => {
    const f = formRef.current;
    if (!f) return;

    const sync = () => {
      setData((d) => {
        const next = { ...d };
        let changed = false;

        for (const key of [
          "commune",
          "surface",
          "nom",
          "email",
          "telephone",
          "message",
        ] as const) {
          const el = f.elements.namedItem(key) as HTMLInputElement | null;
          if (el && typeof el.value === "string" && el.value !== next[key]) {
            next[key] = el.value;
            changed = true;
          }
        }

        const projet =
          f.querySelector<HTMLInputElement>('input[name="projet"]:checked')
            ?.value ?? "";
        if (projet !== next.projet) {
          next.projet = projet;
          changed = true;
        }

        for (const key of ["budget", "delai"] as const) {
          const el = f.elements.namedItem(key) as HTMLSelectElement | null;
          if (el && el.value !== next[key]) {
            next[key] = el.value;
            changed = true;
          }
        }

        const consent = f.querySelector<HTMLInputElement>(
          'input[name="consent"]',
        );
        if (consent && consent.checked !== next.consent) {
          next.consent = consent.checked;
          changed = true;
        }

        return changed ? next : d;
      });
    };

    const events = ["input", "change", "click", "focusin"] as const;
    events.forEach((e) => f.addEventListener(e, sync));
    const t = setTimeout(sync, 350);

    return () => {
      clearTimeout(t);
      events.forEach((e) => f.removeEventListener(e, sync));
    };
  }, [step]);

  const step1Valid = data.projet !== "" && data.commune.trim().length > 1;
  const step2Valid =
    data.nom.trim().length > 1 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email) &&
    data.telephone.replace(/\D/g, "").length >= 9 &&
    data.consent;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!step2Valid) {
      setTouched(true);
      return;
    }
    setState("sending");
    setError(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("request failed");
      setState("done");
    } catch {
      setState("error");
      setError(
        "L’envoi a échoué. Écrivez-nous directement à contact@renovinterieurs.fr ou appelez-nous.",
      );
    }
  }

  if (state === "done") {
    return (
      <div className="anim-rise flex min-h-[26rem] flex-col items-center justify-center rounded-[clamp(18px,2.4vw,28px)] bg-paper p-10 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-terra text-paper">
          <svg viewBox="0 0 24 24" aria-hidden className="size-6">
            <path
              d="M4 12.5l5 5L20 6.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <h3 className="mt-6 text-[1.7rem] leading-tight font-medium">
          Demande <span className="display-italic">bien reçue</span>
        </h3>
        <p className="mt-4 max-w-sm text-[0.92rem] leading-relaxed text-muted">
          Merci {data.nom.split(" ")[0]}. Nous revenons vers vous sous 24 h
          ouvrées pour caler la visite technique — puis votre devis détaillé
          sous 48 h.
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className="rounded-[clamp(18px,2.4vw,28px)] bg-paper p-6 sm:p-8"
    >
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="dot-label text-[0.74rem] text-terra">
            Étape {step + 1} / 2
          </p>
          <h3 className="mt-2 text-[1.45rem] leading-tight font-medium">
            {step === 0 ? (
              <>
                Votre <span className="display-italic">projet</span>
              </>
            ) : (
              <>
                Vos <span className="display-italic">coordonnées</span>
              </>
            )}
          </h3>
        </div>
        <p className="hidden text-right text-[0.74rem] leading-snug text-muted sm:block">
          Réponse sous 24 h
          <br />
          Devis sous 48 h
        </p>
      </div>

      <div className="mt-5 h-px w-full overflow-hidden bg-line">
        <span
          className="block h-full bg-terra transition-[width] duration-700 ease-[cubic-bezier(.16,1,.3,1)]"
          style={{ width: step === 0 ? "50%" : "100%" }}
        />
      </div>

      {step === 0 ? (
        <div className="anim-rise-sm mt-7 space-y-5">
          <fieldset>
            <legend className="mb-3 text-[0.72rem] font-medium tracking-[0.1em] text-muted uppercase">
              Type de projet *
            </legend>
            <div className="flex flex-wrap gap-2">
              {projets.map((p) => (
                <label
                  key={p}
                  className="cursor-pointer rounded-full border border-line text-ink transition-colors duration-300 has-[:checked]:border-terra has-[:checked]:bg-terra has-[:checked]:text-paper hover:border-ink/40 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-terra"
                >
                  <input
                    type="radio"
                    name="projet"
                    value={p}
                    checked={data.projet === p}
                    onChange={() => set("projet", p)}
                    className="sr-only"
                    required
                  />
                  <span className="block px-3.5 py-2 text-[0.8rem]">{p}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="relative">
              <input
                id="commune"
                name="commune"
                value={data.commune}
                onChange={(e) => set("commune", e.target.value)}
                placeholder="Commune"
                autoComplete="address-level2"
                className={field}
                required
              />
              <label htmlFor="commune" className={label}>
                Commune ou arrondissement *
              </label>
            </div>
            <div className="relative">
              <input
                id="surface"
                name="surface"
                value={data.surface}
                onChange={(e) => set("surface", e.target.value)}
                placeholder="Surface"
                inputMode="numeric"
                className={field}
              />
              <label htmlFor="surface" className={label}>
                Surface (m²)
              </label>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="relative">
              <select
                id="budget"
                name="budget"
                value={data.budget}
                onChange={(e) => set("budget", e.target.value)}
                className={select}
              >
                <option value="">—</option>
                {budgets.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute top-2 left-4 text-[0.66rem] tracking-[0.08em] text-muted uppercase">
                Budget estimé
              </span>
            </div>
            <div className="relative">
              <select
                id="delai"
                name="delai"
                value={data.delai}
                onChange={(e) => set("delai", e.target.value)}
                className={select}
              >
                <option value="">—</option>
                {delais.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute top-2 left-4 text-[0.66rem] tracking-[0.08em] text-muted uppercase">
                Échéance
              </span>
            </div>
          </div>

          {touched && !step1Valid && (
            <p
              role="alert"
              className="text-[0.84rem] leading-relaxed text-terra-deep"
            >
              {data.projet === ""
                ? "Choisissez d’abord un type de projet."
                : "Indiquez votre commune ou votre arrondissement."}
            </p>
          )}

          <button
            type="button"
            onClick={() => (step1Valid ? setStep(1) : setTouched(true))}
            aria-disabled={!step1Valid}
            className={`group flex w-full items-center justify-center gap-3 rounded-full py-4 text-[0.88rem] font-medium text-paper transition-colors duration-400 ${
              step1Valid ? "bg-ink hover:bg-terra" : "bg-ink/35 hover:bg-ink/45"
            }`}
          >
            Continuer
            <span className="pill-arrow">
              <ArrowRight />
            </span>
          </button>
          <p className="text-center text-[0.76rem] text-muted">
            Aucun engagement — devis gratuit et détaillé.
          </p>
        </div>
      ) : (
        <div className="anim-rise-sm mt-7 space-y-4">
          <div className="relative">
            <input
              id="nom"
              name="nom"
              value={data.nom}
              onChange={(e) => set("nom", e.target.value)}
              placeholder="Nom"
              autoComplete="name"
              className={field}
              required
            />
            <label htmlFor="nom" className={label}>
              Nom et prénom *
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                value={data.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="Email"
                autoComplete="email"
                className={field}
                required
              />
              <label htmlFor="email" className={label}>
                Email *
              </label>
            </div>
            <div className="relative">
              <input
                id="telephone"
                name="telephone"
                type="tel"
                value={data.telephone}
                onChange={(e) => set("telephone", e.target.value)}
                placeholder="Téléphone"
                autoComplete="tel"
                className={field}
                required
              />
              <label htmlFor="telephone" className={label}>
                Téléphone *
              </label>
            </div>
          </div>

          <div className="relative">
            <textarea
              id="message"
              name="message"
              value={data.message}
              onChange={(e) => set("message", e.target.value)}
              placeholder="Message"
              rows={4}
              className={`${field} resize-none`}
            />
            <label htmlFor="message" className={label}>
              Décrivez votre projet
            </label>
          </div>

          <label className="flex cursor-pointer items-start gap-3 pt-1 text-[0.8rem] leading-relaxed text-muted">
            <input
              type="checkbox"
              name="consent"
              checked={data.consent}
              onChange={(e) => set("consent", e.target.checked)}
              className="mt-0.5 size-4 shrink-0 accent-[var(--color-terra)]"
              required
            />
            <span>
              J’accepte d’être recontacté au sujet de ma demande. Mes données ne
              sont utilisées que pour établir mon devis. *
            </span>
          </label>

          {touched && !step2Valid && !error && (
            <p
              role="alert"
              className="text-[0.84rem] leading-relaxed text-terra-deep"
            >
              {data.nom.trim().length < 2
                ? "Indiquez votre nom."
                : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)
                  ? "Vérifiez votre adresse e-mail."
                  : data.telephone.replace(/\D/g, "").length < 9
                    ? "Indiquez un numéro de téléphone valide."
                    : "Merci de cocher la case d’autorisation de contact."}
            </p>
          )}

          {error && (
            <p role="alert" className="text-[0.84rem] text-terra-deep">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row">
            <button
              type="button"
              onClick={() => setStep(0)}
              className="rounded-full border border-line px-6 py-4 text-[0.86rem] font-medium text-ink transition-colors duration-400 hover:border-ink"
            >
              Retour
            </button>
            <button
              type="submit"
              aria-disabled={!step2Valid}
              className={`group flex flex-1 items-center justify-center gap-3 rounded-full py-4 text-[0.88rem] font-medium text-paper transition-colors duration-400 ${
                step2Valid && state !== "sending"
                  ? "bg-terra hover:bg-terra-deep"
                  : "bg-terra/40"
              }`}
            >
              {state === "sending" ? "Envoi…" : "Recevoir mon devis"}
              <span className="pill-arrow">
                <ArrowRight />
              </span>
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
