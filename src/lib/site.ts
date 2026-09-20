/**
 * Contenu éditorial du site — repris à l’identique du site existant.
 * Centralisé ici pour que les pages internes puissent le réutiliser.
 */

export const site = {
  name: "RenovIntérieur",
  legalName: "RenovIntérieur — Marque de Archi Renov",
  tagline: "Rénovation intérieur & second œuvre",
  url: "https://renovinterieurs.fr",
  email: "contact@renovinterieurs.fr",
  phoneDisplay: "06 12 24 55 27",
  phoneHref: "tel:+33612245527",
  whatsapp: "https://wa.me/33612245527",
  area: "Île-de-France",
  title: "Entreprise rénovation Paris & IDF — devis 48h | RenovIntérieur",
  description:
    "Rénovation appartement à Paris & Île-de-France : second œuvre tous corps d’état, cuisine sur-mesure, salle de bain, isolation DPE. Devis 48 h.",
} as const;

export const nav = [
  {
    label: "Nos services",
    href: "/nos-services",
    children: [
      {
        label: "Rénovation d’appartement",
        href: "/renovation-appartement-paris",
        desc: "Second œuvre tous corps d’état",
      },
      {
        label: "Paris (75)",
        href: "/renovation-appartement-paris",
        desc: "Les 20 arrondissements",
      },
      {
        label: "Hauts-de-Seine (92)",
        href: "/renovation-hauts-de-seine-92",
        desc: "Boulogne, Neuilly, Levallois…",
      },
      {
        label: "Yvelines (78)",
        href: "/renovation-yvelines-78",
        desc: "Versailles, Saint-Germain…",
      },
      {
        label: "Val-de-Marne (94)",
        href: "/renovation-val-de-marne-94",
        desc: "Vincennes, Saint-Maur…",
      },
      {
        label: "Isolation / DPE",
        href: "/isolation-amelioration-energetique",
        desc: "Sortie de passoire énergétique",
      },
      {
        label: "Dépannage",
        href: "/depannage",
        desc: "Plomberie, électricité, serrurerie",
      },
      { label: "Débarras", href: "/debarras", desc: "Vidage et évacuation" },
    ],
  },
  { label: "Nos Réalisations", href: "/realisations-renovation" },
  { label: "Outils", href: "/outils" },
  { label: "Conseils", href: "/conseils" },
  { label: "Contact", href: "/contact-devis" },
] as const;

export const heroSlides = [
  {
    eyebrow: "Entreprise rénovation Paris & IDF",
    titleTop: "Rénovation d’appartement",
    titleBottom: "à Paris & en Île-de-France",
    text: "Second œuvre tous corps d’état, cuisine sur-mesure, salle de bain étanche, parquet, béton ciré, sortie de passoire énergétique. Un seul interlocuteur, devis détaillé sous 48 h.",
    primary: { label: "Obtenir un devis", href: "#devis" },
    secondary: { label: "Nous contacter", href: "/contact-devis" },
    image: "/images/nos-services-hero.jpg",
    alt: "Séjour haussmannien rénové, moulures et parquet clair",
  },
  {
    eyebrow: "Spécialistes du haussmannien",
    titleTop: "Restauration patrimoniale",
    titleBottom: "& standards modernes",
    text: "Moulures, parquets point de Hongrie, cheminées en marbre — nous savons préserver le cachet haussmannien tout en intégrant l’isolation, la performance énergétique et les normes 2026.",
    primary: {
      label: "Voir nos réalisations",
      href: "/realisations-renovation",
    },
    secondary: { label: "Nous contacter", href: "/contact-devis" },
    image: "/images/salon-haussmannien-moulures.jpg",
    alt: "Salon haussmannien restauré : moulures, cheminée et parquet chevron",
  },
  {
    eyebrow: "Signatures techniques",
    titleTop: "Joints époxy, béton ciré,",
    titleBottom: "nattes d’étanchéité",
    text: "Zéro noircissement, étanchéité totale, durabilité 15-20 ans. Nos signatures techniques font la différence entre une rénovation qui dure et une rénovation à refaire dans 5 ans.",
    primary: { label: "Demander un devis", href: "#devis" },
    secondary: { label: "Découvrir nos services", href: "/nos-services" },
    image: "/images/sdb-douche-italienne.webp",
    alt: "Salle de bain sombre haut de gamme, douche à l’italienne et baignoire îlot",
  },
  {
    eyebrow: "Gros œuvre & surélévation",
    titleTop: "Surélévation, extension,",
    titleBottom: "ouverture de mur porteur",
    text: "Architectes DPLG, ingénieurs structure et entreprises sélectionnées : nous orchestrons votre projet de A à Z, toutes démarches pilotées, jusqu’à 15-20 % d’économie.",
    primary: {
      label: "Découvrir le gros œuvre",
      href: "/renovation-gros-oeuvre-surelevation-extension-idf",
    },
    secondary: { label: "Obtenir un devis", href: "#devis" },
    image: "/images/loft-beton-cire.jpg",
    alt: "Grand volume ouvert après dépose de mur porteur, escalier suspendu",
  },
] as const;

export const trustPoints = [
  "Devis gratuit",
  "Intervention rapide",
  "Interlocuteur unique",
  "Second œuvre spécialisé",
  "100% Île-de-France",
] as const;

export const services = [
  {
    title: "Rénovation d’appartement",
    text: "Second œuvre tous corps d’état, du diagnostic à la livraison clé en main.",
    href: "/renovation-appartement-paris",
    image: "/images/salon-canape-courbe.jpg",
    index: "01",
  },
  {
    title: "Salle de bain étanche",
    text: "Joints époxy + nattes d’étanchéité. Zéro noircissement, durabilité 15-20 ans.",
    href: "/joints-epoxy-paris",
    image: "/images/paris-sdb.jpg",
    index: "02",
  },
  {
    title: "Cuisine sur-mesure",
    text: "Conception sur plan ou optimisation IKEA Metod avec façades sur-mesure.",
    href: "/cuisine-sur-mesure-paris",
    image: "/images/paris-cuisine-sur-mesure.jpg",
    index: "03",
  },
  {
    title: "Isolation & DPE",
    text: "Sortie de passoire énergétique F ou G : isolation, VMC, chauffage, MaPrimeRénov'.",
    href: "/isolation-amelioration-energetique",
    image: "/images/dpe-1.jpg",
    index: "04",
  },
  {
    title: "Béton ciré",
    text: "Sols, murs, douches italiennes, plans de travail. Finition monobloc contemporaine.",
    href: "/beton-cire-paris",
    image: "/images/loft-cuisine-cheminee.jpg",
    index: "05",
  },
  {
    title: "Dépannage urgent",
    text: "Plomberie, électricité, serrurerie, chauffage. Intervention rapide, devis transparent.",
    href: "/depannage",
    image: "/images/nos-services-depannage.jpg",
    index: "06",
  },
] as const;

export const grosOeuvre = {
  eyebrow: "Gros œuvre",
  title: "Gros œuvre, surélévation & extension",
  text: "Mur porteur, surélévation, extension : orchestrés avec nos partenaires architectes DPLG, ingénieurs structure et entreprises sélectionnées. Jusqu’à 15-20 % d’économie, toutes les démarches pilotées.",
  href: "/renovation-gros-oeuvre-surelevation-extension-idf",
  image: "/images/paris-chantier.jpg",
} as const;

export const pillars = [
  {
    title: "Un savoir-faire artisanal",
    text: "Nos équipes maîtrisent chaque étape de la rénovation intérieure. De la plâtrerie à la pose de matériaux nobles, nous apportons un soin particulier aux finitions qui font toute la différence dans votre quotidien.",
    image: "/images/savoir-faire-1.jpg",
    alt: "Artisan réalisant les finitions d’un chantier de rénovation",
  },
  {
    title: "La qualité dans chaque détail",
    text: "Parquet chevron, tasseaux bois, éclairages encastrés — chaque élément est pensé pour créer un ensemble cohérent et durable. Nous ne livrons un chantier que lorsque chaque détail est parfait.",
    image: "/images/why-2.jpg",
    alt: "Détail de parquet chevron et tasseaux bois",
  },
  {
    title: "Un accompagnement de A à Z",
    text: "Du premier diagnostic à la livraison finale, un interlocuteur unique coordonne votre projet. Pas de sous-traitance opaque, pas de surprise : vous savez toujours où en est votre chantier.",
    image: "/images/paris-pourquoi-specialiste.jpg",
    alt: "Conducteur de travaux échangeant avec les artisans sur le chantier",
  },
] as const;

export const zones = [
  {
    dept: "Paris (75)",
    text: "Tous les arrondissements 1er → 20e. Haussmannien, art déco, résidences modernes.",
    href: "/renovation-appartement-paris",
    cities: ["1er → 20e arrondissement"],
  },
  {
    dept: "Hauts-de-Seine (92)",
    text: "Boulogne, Neuilly, Levallois, Issy, Courbevoie, Puteaux, Suresnes, Sceaux…",
    href: "/renovation-hauts-de-seine-92",
    cities: [
      "Boulogne-Billancourt",
      "Neuilly-sur-Seine",
      "Levallois-Perret",
      "Issy-les-Moulineaux",
      "Courbevoie",
      "Puteaux",
      "Suresnes",
      "Saint-Cloud",
      "Rueil-Malmaison",
      "Asnières-sur-Seine",
      "Clichy",
      "Bois-Colombes",
      "Colombes",
      "Sèvres",
      "Meudon",
      "Vanves",
      "Antony",
      "Sceaux",
    ],
  },
  {
    dept: "Yvelines (78)",
    text: "Versailles, Saint-Germain-en-Laye, Le Vésinet, Maisons-Laffitte, Croissy, Le Pecq…",
    href: "/renovation-yvelines-78",
    cities: [
      "Versailles",
      "Saint-Germain-en-Laye",
      "Le Vésinet",
      "Maisons-Laffitte",
      "Croissy-sur-Seine",
      "Le Pecq",
      "Chatou",
    ],
  },
  {
    dept: "Val-de-Marne (94)",
    text: "Vincennes, Saint-Mandé, Charenton, Saint-Maur, Maisons-Alfort, Nogent, Cachan…",
    href: "/renovation-val-de-marne-94",
    cities: [
      "Vincennes",
      "Saint-Mandé",
      "Charenton-le-Pont",
      "Saint-Maur-des-Fossés",
      "Maisons-Alfort",
      "Nogent-sur-Marne",
      "Joinville-le-Pont",
      "Champigny-sur-Marne",
      "Cachan",
      "Arcueil",
    ],
  },
] as const;

export const pricing = [
  {
    label: "Rafraîchissement",
    from: 250,
    to: 450,
    text: "Peinture, sols simples, petites finitions.",
  },
  {
    label: "Rénovation partielle",
    from: 600,
    to: 900,
    text: "1 à 2 pièces refaites, plomberie/électricité partielles.",
  },
  {
    label: "Rénovation complète",
    from: 1000,
    to: 1500,
    text: "Toutes pièces, plomberie/électricité refaites, cuisine et SDB neuves.",
    featured: true,
  },
  {
    label: "Haut de gamme",
    from: 1500,
    to: 2500,
    text: "Matériaux premium, design sur-mesure, finitions architecte.",
  },
] as const;

export const pricingNote =
  "TVA réduite à 10 % applicable sur les travaux d’amélioration d’un logement de plus de 2 ans. TVA à 5,5 % sur les travaux d’amélioration énergétique éligibles.";

export const process = [
  {
    step: "01",
    title: "Premier échange",
    text: "Par téléphone ou WhatsApp, nous cadrons votre projet, votre commune et votre budget.",
  },
  {
    step: "02",
    title: "Visite technique",
    text: "Sous 5 jours. Relevés, contraintes de copropriété, diagnostic des existants.",
  },
  {
    step: "03",
    title: "Devis détaillé",
    text: "Sous 48 h. Poste par poste, sans ligne floue, avec planning prévisionnel.",
  },
  {
    step: "04",
    title: "Travaux coordonnés",
    text: "Tous corps d’état pilotés par un interlocuteur unique, compte-rendu hebdomadaire.",
  },
  {
    step: "05",
    title: "Livraison & SAV",
    text: "Réception des travaux, levée des réserves, SAV 12 mois et garanties légales.",
  },
] as const;

export const faq = [
  {
    q: "Combien coûte une rénovation d’appartement à Paris ?",
    a: "Comptez 250-450 €/m² pour un rafraîchissement, 600-900 €/m² pour une rénovation partielle, 1 000-1 500 €/m² pour une rénovation complète, 1 500-2 500 €/m² pour du haut de gamme. Au-delà, prestige et architecte.",
    link: {
      label: "Voir le détail Paris",
      href: "/renovation-appartement-paris",
    },
  },
  {
    q: "Combien de temps dure une rénovation complète ?",
    a: "Une rénovation partielle dure 3-6 semaines. Une rénovation complète d’un appartement parisien de 50-80 m² s’étale sur 8-14 semaines. Au-delà de 100 m² ou en haut de gamme, comptez 4-6 mois. Planning précis remis dès le devis.",
  },
  {
    q: "Pourquoi des joints époxy plutôt que des joints classiques ?",
    a: "Les joints ciment noircissent en quelques mois et se fissurent. Les joints époxy que nous posons systématiquement en salle de bain et cuisine sont étanches, ne noircissent pas, ne bougent pas et durent 15-20 ans.",
    link: { label: "En savoir plus", href: "/joints-epoxy-paris" },
  },
  {
    q: "Sortez-vous un appartement classé DPE F ou G ?",
    a: "Oui, c’est une de nos expertises. Nous traitons les passoires énergétiques de bout en bout : audit DPE, isolation, VMC double-flux, remplacement du chauffage, accompagnement MaPrimeRénov' et CEE. Objectif : gagner 2-3 classes DPE.",
    link: {
      label: "Voir notre offre isolation",
      href: "/isolation-amelioration-energetique",
    },
  },
  {
    q: "Quelles garanties offrez-vous sur vos travaux ?",
    a: "Trois garanties légales sur tous nos chantiers : garantie décennale (10 ans), garantie biennale (2 ans, équipements), garantie de parfait achèvement (1 an). Plus responsabilité civile professionnelle à jour. Attestations fournies avant démarrage.",
  },
  {
    q: "Comment se déroule un projet avec RenovIntérieur ?",
    a: "5 étapes : (1) premier échange par téléphone/WhatsApp, (2) visite technique sous 5 jours, (3) devis détaillé sous 48 h, (4) travaux coordonnés tous corps d’état avec compte-rendu hebdo, (5) livraison et SAV 12 mois. Un seul interlocuteur du diagnostic à la remise des clés.",
  },
] as const;

export const gallery = [
  {
    src: "/images/sejour-haussmannien.jpg",
    alt: "Séjour haussmannien rénové, double exposition et moulures restaurées",
    tag: "Séjour",
  },
  {
    src: "/images/paris-parquet.jpg",
    alt: "Parquet chêne posé en point de Hongrie",
    tag: "Parquet",
  },
  {
    src: "/images/bibliotheque-sur-mesure.webp",
    alt: "Bibliothèque sur-mesure en bois massif, niches et rangements fermés",
    tag: "Bibliothèque",
  },
  {
    src: "/images/dressing-sur-mesure.webp",
    alt: "Dressing sur-mesure intégré sous pente, penderie et tiroirs",
    tag: "Dressing",
  },
  {
    src: "/images/service-renovation.jpg",
    alt: "Habillage mural en tasseaux de bois et placard intégré",
    tag: "Menuiserie",
  },
  {
    src: "/images/service-sdb.jpg",
    alt: "Plan vasque en pierre naturelle et robinetterie laiton",
    tag: "Salle de bain",
  },
  {
    src: "/images/balcon-haussmannien-paris.jpg",
    alt: "Balcon parisien restauré, ferronnerie et garde-corps d’origine",
    tag: "Façade & balcon",
  },
] as const;

export const footerTools = [
  {
    label: "Estimateur de budget",
    href: "/outils/estimateur-budget-renovation",
  },
  {
    label: "Simulateur DPE",
    href: "/outils/simulateur-dpe-passoire-energetique",
  },
  {
    label: "Planning de chantier",
    href: "/outils/planning-travaux-renovation",
  },
] as const;

export const footerServices = [
  { label: "Cuisine sur-mesure", href: "/cuisine-sur-mesure-paris" },
  { label: "Béton ciré", href: "/beton-cire-paris" },
  { label: "Joints époxy", href: "/joints-epoxy-paris" },
  { label: "Isolation & DPE", href: "/isolation-amelioration-energetique" },
  { label: "Dépannage urgent", href: "/depannage" },
  { label: "Débarras", href: "/debarras" },
] as const;

export const footerInfo = [
  { label: "Nos services", href: "/nos-services" },
  { label: "Outils gratuits", href: "/outils" },
  { label: "Réalisations", href: "/realisations-renovation" },
  { label: "À propos", href: "/a-propos" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact-devis" },
] as const;
