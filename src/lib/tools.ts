/**
 * Les trois outils interactifs du site.
 *
 * Toutes les valeurs de calcul proviennent des contenus publiés par
 * RenovIntérieur (fourchettes de prix au m², durées de chantier, gains
 * de classes DPE annoncés). Rien n'est inventé : les résultats sont
 * présentés comme des estimations indicatives, jamais comme un devis.
 */

export type Tool = {
  slug: string;
  href: string;
  name: string;
  short: string;
  title: string;
  description: string;
  eyebrow: string;
  line1: string;
  line2: string;
  image: string;
  keywords: string[];
};

export const tools: Tool[] = [
  {
    slug: "estimateur-budget-renovation",
    href: "/outils/estimateur-budget-renovation",
    name: "Estimateur de budget",
    short: "Chiffrez votre rénovation au m², poste par poste.",
    title: "Estimateur de budget rénovation au m² — Paris & Île-de-France",
    description:
      "Estimez le budget de votre rénovation d’appartement en 30 secondes : prix au m² selon le niveau de finition, répartition par poste et TVA applicable. Gratuit, sans inscription.",
    eyebrow: "Outil gratuit",
    line1: "Estimez le budget",
    line2: "de votre rénovation",
    image: "/images/paris-renovation-appartement.jpg",
    keywords: [
      "estimation prix rénovation appartement",
      "prix rénovation au m2 Paris",
      "calculateur budget travaux",
      "coût rénovation appartement 2026",
    ],
  },
  {
    slug: "simulateur-dpe-passoire-energetique",
    href: "/outils/simulateur-dpe-passoire-energetique",
    name: "Simulateur DPE",
    short: "Sortez de la passoire énergétique : quels travaux, quel gain.",
    title: "Simulateur DPE : sortir d’une passoire énergétique (F ou G)",
    description:
      "Quels travaux pour gagner des classes DPE ? Simulez l’impact de l’isolation, des menuiseries, de la VMC et du chauffage, et identifiez les aides mobilisables.",
    eyebrow: "Outil gratuit",
    line1: "Sortez de la",
    line2: "passoire énergétique",
    image: "/images/dpe-1.jpg",
    keywords: [
      "simulateur DPE",
      "sortir passoire énergétique",
      "DPE F ou G travaux",
      "gagner des classes DPE",
    ],
  },
  {
    slug: "planning-travaux-renovation",
    href: "/outils/planning-travaux-renovation",
    name: "Planning de chantier",
    short: "Visualisez la durée et l’enchaînement de vos travaux.",
    title: "Planning de travaux : durée d’une rénovation, semaine par semaine",
    description:
      "Combien de temps durent vos travaux ? Générez un planning indicatif phase par phase selon la surface et l’ampleur du chantier, du diagnostic à la réception.",
    eyebrow: "Outil gratuit",
    line1: "Planifiez votre",
    line2: "chantier semaine par semaine",
    image: "/images/paris-chantier.jpg",
    keywords: [
      "durée travaux rénovation appartement",
      "planning chantier rénovation",
      "combien de temps rénovation complète",
      "étapes travaux rénovation",
    ],
  },
];

export function getTool(slug: string) {
  return tools.find((t) => t.slug === slug) ?? null;
}

/* ------------------------------------------------------------------ */
/*  1. Estimateur de budget                                            */
/* ------------------------------------------------------------------ */

/** Fourchettes €/m² publiées par RenovIntérieur (page Prix). */
export const NIVEAUX = [
  {
    id: "rafraichissement",
    label: "Rafraîchissement",
    desc: "Peinture, sols simples, petites finitions.",
    from: 250,
    to: 450,
  },
  {
    id: "partielle",
    label: "Rénovation partielle",
    desc: "1 à 2 pièces refaites, plomberie/électricité partielles.",
    from: 600,
    to: 900,
  },
  {
    id: "complete",
    label: "Rénovation complète",
    desc: "Toutes pièces, réseaux refaits, cuisine et SDB neuves.",
    from: 1000,
    to: 1500,
  },
  {
    id: "premium",
    label: "Haut de gamme",
    desc: "Matériaux premium, design sur-mesure, finitions architecte.",
    from: 1500,
    to: 2500,
  },
] as const;

export type NiveauId = (typeof NIVEAUX)[number]["id"];

/**
 * Répartition indicative par poste, en part du budget total.
 * Somme = 100 % pour chaque niveau.
 */
export const POSTES: Record<NiveauId, { label: string; part: number }[]> = {
  rafraichissement: [
    { label: "Peinture & enduits", part: 45 },
    { label: "Revêtements de sol", part: 30 },
    { label: "Petite menuiserie", part: 15 },
    { label: "Protection & évacuation", part: 10 },
  ],
  partielle: [
    { label: "Plomberie & électricité", part: 28 },
    { label: "Plâtrerie & peinture", part: 24 },
    { label: "Revêtements de sol", part: 20 },
    { label: "Menuiserie & agencement", part: 18 },
    { label: "Dépose & évacuation", part: 10 },
  ],
  complete: [
    { label: "Plomberie & électricité", part: 25 },
    { label: "Cuisine & salle de bain", part: 24 },
    { label: "Plâtrerie & peinture", part: 19 },
    { label: "Revêtements de sol", part: 16 },
    { label: "Menuiserie & agencement", part: 11 },
    { label: "Dépose & évacuation", part: 5 },
  ],
  premium: [
    { label: "Cuisine & salle de bain", part: 27 },
    { label: "Matériaux & finitions premium", part: 23 },
    { label: "Plomberie & électricité", part: 20 },
    { label: "Menuiserie sur-mesure", part: 17 },
    { label: "Plâtrerie & peinture", part: 9 },
    { label: "Dépose & évacuation", part: 4 },
  ],
};

/** Majorations indicatives liées aux contraintes de chantier. */
export const CONTRAINTES = [
  { id: "haussmannien", label: "Immeuble haussmannien", coef: 0.08 },
  { id: "etage", label: "Étage élevé sans ascenseur", coef: 0.05 },
  { id: "occupe", label: "Logement occupé pendant les travaux", coef: 0.06 },
  { id: "murporteur", label: "Ouverture de mur porteur", coef: 0.12 },
] as const;

export type ContrainteId = (typeof CONTRAINTES)[number]["id"];

export type BudgetResult = {
  low: number;
  high: number;
  lowM2: number;
  highM2: number;
  majoration: number;
  postes: { label: string; low: number; high: number; part: number }[];
  tva: { taux: string; base: string };
};

export function estimateBudget(
  surface: number,
  niveau: NiveauId,
  contraintes: ContrainteId[],
  energetique: boolean,
): BudgetResult {
  const n = NIVEAUX.find((x) => x.id === niveau) ?? NIVEAUX[2];
  const majoration = contraintes.reduce(
    (acc, id) => acc + (CONTRAINTES.find((c) => c.id === id)?.coef ?? 0),
    0,
  );
  const k = 1 + majoration;

  const lowM2 = Math.round(n.from * k);
  const highM2 = Math.round(n.to * k);
  const low = Math.round((surface * lowM2) / 100) * 100;
  const high = Math.round((surface * highM2) / 100) * 100;

  const postes = POSTES[niveau].map((p) => ({
    label: p.label,
    part: p.part,
    low: Math.round((low * p.part) / 100 / 100) * 100,
    high: Math.round((high * p.part) / 100 / 100) * 100,
  }));

  return {
    low,
    high,
    lowM2,
    highM2,
    majoration,
    postes,
    tva: energetique
      ? {
          taux: "5,5 %",
          base: "travaux d’amélioration énergétique éligibles",
        }
      : {
          taux: "10 %",
          base: "logement achevé depuis plus de 2 ans",
        },
  };
}

/* ------------------------------------------------------------------ */
/*  2. Simulateur DPE                                                  */
/* ------------------------------------------------------------------ */

export const CLASSES = ["A", "B", "C", "D", "E", "F", "G"] as const;
export type Classe = (typeof CLASSES)[number];

/** Gains indicatifs en classes DPE, par poste de travaux. */
export const POSTES_DPE = [
  {
    id: "murs",
    label: "Isolation des murs par l’intérieur",
    gain: 1.1,
    note: "Le poste le plus structurant en appartement ancien.",
    href: "/isolation-amelioration-energetique",
  },
  {
    id: "combles",
    label: "Isolation des combles ou du plancher haut",
    gain: 0.9,
    note: "Principale source de déperdition en dernier étage.",
    href: "/isolation-amelioration-energetique",
  },
  {
    id: "menuiseries",
    label: "Remplacement des menuiseries",
    gain: 0.7,
    note: "Double ou triple vitrage, étanchéité thermique et acoustique.",
    href: "/conseils/isolation-thermique-fenetres-portes",
  },
  {
    id: "vmc",
    label: "VMC double flux",
    gain: 0.5,
    note: "Renouvellement d’air sans perte de chaleur.",
    href: "/isolation-amelioration-energetique",
  },
  {
    id: "chauffage",
    label: "Remplacement du système de chauffage",
    gain: 1.0,
    note: "Pompe à chaleur ou chaudière performante selon la copropriété.",
    href: "/isolation-amelioration-energetique",
  },
  {
    id: "planchers",
    label: "Isolation des planchers bas",
    gain: 0.4,
    note: "Sur vide sanitaire, cave ou passage non chauffé.",
    href: "/conseils/isolation-cave-maison-ancienne",
  },
] as const;

export type PosteDpeId = (typeof POSTES_DPE)[number]["id"];

export type DpeResult = {
  from: Classe;
  to: Classe;
  gain: number;
  sortiePassoire: boolean;
  aides: string[];
  retenus: (typeof POSTES_DPE)[number][];
};

export function simulateDpe(from: Classe, postes: PosteDpeId[]): DpeResult {
  const retenus = POSTES_DPE.filter((p) => postes.includes(p.id));
  const brut = retenus.reduce<number>((n, p) => n + p.gain, 0);
  // Rendements décroissants : un bouquet de travaux ne s'additionne pas linéairement.
  const gain = Math.min(4, Math.floor(brut > 0 ? brut * 0.85 : 0));

  const i = CLASSES.indexOf(from);
  const to = CLASSES[Math.max(0, i - gain)];

  const aides: string[] = [];
  if (retenus.length > 0) {
    aides.push("TVA réduite à 5,5 % sur les travaux énergétiques éligibles");
    aides.push("Certificats d’économie d’énergie (CEE)");
  }
  if (retenus.length >= 2)
    aides.push("MaPrimeRénov’ — parcours par geste ou rénovation d’ampleur");
  if (retenus.length >= 3) aides.push("Éco-prêt à taux zéro (éco-PTZ)");

  return {
    from,
    to,
    gain,
    sortiePassoire: ["F", "G"].includes(from) && !["F", "G"].includes(to),
    aides,
    retenus: [...retenus],
  };
}

/* ------------------------------------------------------------------ */
/*  3. Planning de chantier                                            */
/* ------------------------------------------------------------------ */

/**
 * Durées issues des repères publiés par RenovIntérieur :
 * rénovation partielle 3-6 semaines, complète 50-80 m² 8-14 semaines,
 * au-delà de 100 m² ou haut de gamme 4-6 mois.
 */
type Phase = { id: string; label: string; part: number; lots: string };

export const PHASES: Phase[] = [
  {
    id: "prepa",
    label: "Préparation & protection",
    part: 8,
    lots: "Dépose, protections, benne",
  },
  {
    id: "depose",
    label: "Démolition & dépose",
    part: 12,
    lots: "Cloisons, revêtements, sanitaires",
  },
  {
    id: "reseaux",
    label: "Plomberie & électricité",
    part: 20,
    lots: "Réseaux, tableau, évacuations",
  },
  {
    id: "platrerie",
    label: "Plâtrerie & cloisons",
    part: 16,
    lots: "Doublages, faux plafonds, enduits",
  },
  {
    id: "revetements",
    label: "Sols & carrelage",
    part: 16,
    lots: "Chapes, parquet, faïence, étanchéité",
  },
  {
    id: "cuisine",
    label: "Cuisine & salle de bain",
    part: 14,
    lots: "Meubles, plans, robinetterie",
  },
  {
    id: "finitions",
    label: "Peinture & finitions",
    part: 10,
    lots: "Peinture, menuiseries, luminaires",
  },
  {
    id: "reception",
    label: "Réception & levée des réserves",
    part: 4,
    lots: "Visite, réserves, SAV 12 mois",
  },
] as const;

export type PlanningResult = {
  weeksLow: number;
  weeksHigh: number;
  phases: {
    label: string;
    lots: string;
    startLow: number;
    endLow: number;
    part: number;
  }[];
};

export function planChantier(
  surface: number,
  niveau: NiveauId,
): PlanningResult {
  let weeksLow: number;
  let weeksHigh: number;

  if (niveau === "rafraichissement") {
    weeksLow = 2;
    weeksHigh = 4;
  } else if (niveau === "partielle") {
    weeksLow = 3;
    weeksHigh = 6;
  } else if (niveau === "complete") {
    weeksLow = 8;
    weeksHigh = 14;
  } else {
    weeksLow = 16;
    weeksHigh = 26;
  }

  // Ajustement par la surface, autour du repère 50-80 m².
  if (surface > 100) {
    weeksLow = Math.round(weeksLow * 1.35);
    weeksHigh = Math.round(weeksHigh * 1.45);
  } else if (surface > 80) {
    weeksLow = Math.round(weeksLow * 1.15);
    weeksHigh = Math.round(weeksHigh * 1.2);
  } else if (surface < 40) {
    weeksLow = Math.max(2, Math.round(weeksLow * 0.8));
    weeksHigh = Math.max(3, Math.round(weeksHigh * 0.85));
  }

  const actives =
    niveau === "rafraichissement"
      ? PHASES.filter((p) =>
          ["prepa", "revetements", "finitions", "reception"].includes(p.id),
        )
      : PHASES;

  const total = actives.reduce((n, p) => n + p.part, 0);
  let cursor = 0;
  const phases = actives.map((p) => {
    const span = (p.part / total) * weeksHigh;
    const startLow = cursor;
    cursor += span;
    return {
      label: p.label,
      lots: p.lots,
      part: Math.round((p.part / total) * 100),
      startLow: Math.round(startLow * 10) / 10,
      endLow: Math.round(cursor * 10) / 10,
    };
  });

  return { weeksLow, weeksHigh, phases };
}
