import nodemailer from "nodemailer";

/**
 * Envoi d'e-mails via le SMTP de la boîte OVH.
 *
 * Variables d'environnement :
 *   SMTP_HOST  ssl0.ovh.net (MX Plan) — pro1.mail.ovh.net pour Email Pro
 *   SMTP_PORT  465 (SSL) ou 587 (STARTTLS)
 *   SMTP_USER  adresse complète de la boîte, ex. contact@renovinterieurs.fr
 *   SMTP_PASS  mot de passe de la boîte
 *   LEAD_TO    destinataire des demandes (défaut : SMTP_USER)
 */

export type LeadMail = {
  receivedAt: string;
  source: string;
  projet: string;
  surface: string;
  commune: string;
  budget: string;
  delai: string;
  nom: string;
  email: string;
  telephone: string;
  message: string;
};

export function isMailConfigured() {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

function transporter() {
  const port = Number(process.env.SMTP_PORT ?? 465);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "ssl0.ovh.net",
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export async function sendLeadMail(lead: LeadMail) {
  const user = process.env.SMTP_USER!;
  const to = process.env.LEAD_TO ?? user;
  const isGuide = lead.projet.toLowerCase().startsWith("guide");

  const subject = isGuide
    ? `Téléchargement guide — ${lead.nom}`
    : `Demande de devis — ${lead.nom}${lead.projet ? ` (${lead.projet})` : ""}`;

  const rows: [string, string][] = [
    ["Nom", lead.nom],
    ["Email", lead.email],
    ["Téléphone", lead.telephone],
    ["Projet", lead.projet],
    ["Surface", lead.surface],
    ["Commune", lead.commune],
    ["Budget", lead.budget],
    ["Délai", lead.delai],
    ["Message", lead.message],
    ["Reçu le", new Date(lead.receivedAt).toLocaleString("fr-FR", { timeZone: "Europe/Paris" })],
    ["Source", lead.source],
  ];
  const filled = rows.filter(([, v]) => v && v !== "—");

  const text = filled.map(([k, v]) => `${k} : ${v}`).join("\n");
  const html = `<table cellpadding="6" style="font-family:sans-serif;font-size:14px;border-collapse:collapse">${filled
    .map(
      ([k, v]) =>
        `<tr><td style="color:#777;vertical-align:top;white-space:nowrap">${k}</td><td style="white-space:pre-wrap">${escape(v)}</td></tr>`,
    )
    .join("")}</table>`;

  await transporter().sendMail({
    from: { name: "RenovIntérieurs — Site web", address: user },
    to,
    replyTo: lead.email,
    subject,
    text,
    html,
  });
}
