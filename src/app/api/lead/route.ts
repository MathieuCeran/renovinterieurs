import { NextResponse } from "next/server";

import { isMailConfigured, sendLeadMail } from "@/lib/mail";

/**
 * Réception des demandes de devis.
 *
 * Le lead est envoyé par e-mail via le SMTP OVH (voir src/lib/mail.ts) et,
 * si LEAD_WEBHOOK_URL est défini, poussé en plus vers un webhook (CRM,
 * Make, Zapier…). Sans aucune configuration : journalisé en développement,
 * refusé en production pour que l'internaute soit invité à écrire directement.
 */

type Lead = {
  projet?: string;
  surface?: string;
  commune?: string;
  budget?: string;
  delai?: string;
  nom?: string;
  email?: string;
  telephone?: string;
  message?: string;
  consent?: boolean;
};

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

export async function POST(request: Request) {
  let body: Lead;

  try {
    body = (await request.json()) as Lead;
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const nom = (body.nom ?? "").trim();
  const email = (body.email ?? "").trim();
  const telephone = (body.telephone ?? "").trim();

  if (
    nom.length < 2 ||
    !isEmail(email) ||
    telephone.replace(/\D/g, "").length < 9 ||
    body.consent !== true
  ) {
    return NextResponse.json(
      { error: "Champs obligatoires manquants." },
      { status: 422 },
    );
  }

  const lead = {
    receivedAt: new Date().toISOString(),
    source: "site-web/accueil",
    projet: body.projet ?? "",
    surface: body.surface ?? "",
    commune: body.commune ?? "",
    budget: body.budget ?? "",
    delai: body.delai ?? "",
    nom,
    email,
    telephone,
    message: (body.message ?? "").slice(0, 4000),
  };

  const webhook = process.env.LEAD_WEBHOOK_URL;
  const mail = isMailConfigured();

  if (!mail && !webhook) {
    if (process.env.NODE_ENV === "production") {
      console.error("[lead] aucun canal configuré (SMTP_USER/SMTP_PASS)", lead);
      return NextResponse.json({ error: "Envoi impossible." }, { status: 503 });
    }
    console.info("[lead] nouvelle demande de devis (non envoyée, dev)", lead);
    return NextResponse.json({ ok: true });
  }

  const channels: Promise<void>[] = [];
  if (mail) channels.push(sendLeadMail(lead));
  if (webhook) {
    channels.push(
      fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      }).then((res) => {
        if (!res.ok) throw new Error(`webhook ${res.status}`);
      }),
    );
  }
  const results = await Promise.allSettled(channels);

  const failed = results.filter((r) => r.status === "rejected");
  if (failed.length === results.length) {
    console.error("[lead] échec de l'envoi", failed, lead);
    return NextResponse.json({ error: "Envoi impossible." }, { status: 502 });
  }
  for (const f of failed) console.error("[lead] canal en échec", f);

  return NextResponse.json({ ok: true });
}
