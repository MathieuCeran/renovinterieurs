"use client";

import { useState, type FormEvent } from "react";

import { ArrowRight } from "@/components/ui/kit";

type State = "idle" | "sending" | "done" | "error";

export function GuideForm() {
  const [email, setEmail] = useState("");
  const [prenom, setPrenom] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<State>("idle");

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && consent;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!valid) return;
    setState("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projet: "Guide rénovation 2026 (PDF)",
          nom: prenom || "Téléchargement guide",
          email,
          telephone: "0000000000",
          commune: "—",
          message: "Demande de téléchargement du guide PDF.",
          consent: true,
        }),
      });
      if (!res.ok) throw new Error();
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="anim-rise rounded-[clamp(18px,2.4vw,28px)] bg-paper p-8 text-center sm:p-10">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-terra text-paper">
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
        <h2 className="mt-6 text-[1.6rem] leading-tight font-medium">
          Guide <span className="display-italic">en route</span>
        </h2>
        <p className="mt-3 text-[0.92rem] leading-relaxed text-muted">
          Vous le recevez à l’adresse{" "}
          <strong className="text-ink">{email}</strong>. Pensez à vérifier vos
          indésirables.
        </p>
      </div>
    );
  }

  const field =
    "peer w-full rounded-xl border border-line bg-shell/60 px-4 pt-6 pb-2.5 text-[0.92rem] text-ink transition-colors duration-300 outline-none placeholder:text-transparent hover:border-ink/25 focus:border-terra";
  const label =
    "pointer-events-none absolute left-4 top-4 origin-left text-[0.86rem] text-muted transition-all duration-300 peer-focus:top-2 peer-focus:text-[0.66rem] peer-focus:tracking-[0.08em] peer-focus:text-terra peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[0.66rem] peer-[:not(:placeholder-shown)]:tracking-[0.08em] peer-[:not(:placeholder-shown)]:uppercase";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-[clamp(18px,2.4vw,28px)] bg-paper p-6 sm:p-8"
    >
      <p className="dot-label text-[0.74rem] text-terra">
        Recevez le guide gratuit
      </p>
      <h2 className="mt-2 text-[1.45rem] leading-tight font-medium">
        10 pages, <span className="display-italic">gratuitement</span>
      </h2>
      <p className="mt-3 text-[0.88rem] leading-relaxed text-muted">
        Entrez votre e-mail — vous le recevez immédiatement.
      </p>

      <div className="mt-6 space-y-4">
        <div className="relative">
          <input
            id="guide-prenom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            placeholder="Prénom"
            autoComplete="given-name"
            className={field}
          />
          <label htmlFor="guide-prenom" className={label}>
            Prénom
          </label>
        </div>
        <div className="relative">
          <input
            id="guide-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            className={field}
            required
          />
          <label htmlFor="guide-email" className={label}>
            Votre e-mail *
          </label>
        </div>

        <label className="flex cursor-pointer items-start gap-3 text-[0.8rem] leading-relaxed text-muted">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 size-4 shrink-0 accent-[var(--color-terra)]"
            required
          />
          <span>
            J’accepte de recevoir le guide par e-mail et d’être recontacté(e)
            par RenovIntérieur. *
          </span>
        </label>

        {state === "error" && (
          <p role="alert" className="text-[0.84rem] text-terra-deep">
            L’envoi a échoué. Réessayez ou écrivez-nous directement.
          </p>
        )}

        <button
          type="submit"
          disabled={!valid || state === "sending"}
          className="group flex w-full items-center justify-center gap-3 rounded-full bg-terra py-4 text-[0.88rem] font-medium text-paper transition-colors duration-400 hover:bg-terra-deep disabled:cursor-not-allowed disabled:opacity-35"
        >
          {state === "sending" ? "Envoi…" : "Recevoir le guide"}
          <span className="pill-arrow">
            <ArrowRight />
          </span>
        </button>

        <p className="text-center text-[0.74rem] leading-relaxed text-muted">
          Désinscription en 1 clic. Vos données ne servent qu’à l’envoi du guide
          et au suivi de votre projet.
        </p>
      </div>
    </form>
  );
}
