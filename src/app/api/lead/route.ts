import { NextResponse } from "next/server";

/**
 * Réception des demandes de devis.
 *
 * Par défaut le lead est journalisé côté serveur. Pour le router vers un CRM,
 * un webhook Make/Zapier ou un service d'e-mail, définir LEAD_WEBHOOK_URL.
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

  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      if (!res.ok) throw new Error(`webhook ${res.status}`);
    } catch (err) {
      console.error("[lead] échec du webhook", err, lead);
      return NextResponse.json({ error: "Envoi impossible." }, { status: 502 });
    }
  } else {
    console.info("[lead] nouvelle demande de devis", lead);
  }

  return NextResponse.json({ ok: true });
}
