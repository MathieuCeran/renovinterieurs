/**
 * Photothèque des chantiers réels (public/images/chantiers) : une entrée
 * par photo, avec son texte alternatif. Les visuels du blog restent hors
 * de ce registre.
 */

const DIR = "/images/chantiers";

export const photos = {
  // Appartement haussmannien rénové (reportage photo)
  sejourHaussmannien: {
    src: `${DIR}/sejour-haussmannien-canape-courbe.jpg`,
    alt: "Séjour haussmannien rénové, canapé courbe, moulures et parquet en chevron ouvert sur la salle à manger",
  },
  salonHaussmannien: {
    src: `${DIR}/salon-haussmannien-moulures.jpg`,
    alt: "Salon haussmannien aux moulures restaurées, canapé courbe et miroir de cheminée",
  },
  salleAManger: {
    src: `${DIR}/salle-a-manger-haussmannienne.jpg`,
    alt: "Salle à manger haussmannienne lumineuse, suspension en albâtre et grandes fenêtres",
  },
  tableSalleAManger: {
    src: `${DIR}/table-salle-a-manger-suspension-albatre.jpg`,
    alt: "Table de salle à manger dressée sous une suspension en albâtre, murs à moulures",
  },
  chambreHaussmannienne: {
    src: `${DIR}/chambre-haussmannienne-lustre.jpg`,
    alt: "Chambre haussmannienne avec lustre, armoire en bois et parquet en chevron",
  },
  suiteParentale: {
    src: `${DIR}/suite-parentale-armoire-bois.jpg`,
    alt: "Suite parentale avec armoire en bois toute hauteur et salle de bain ouverte en pierre",
  },
  chambreMarbre: {
    src: `${DIR}/chambre-suite-marbre-moulures.jpg`,
    alt: "Chambre ouverte sur une salle de bain en marbre, moulures et miroir ancien conservés",
  },
  cuisineIntegree: {
    src: `${DIR}/cuisine-integree-parquet-versailles.jpg`,
    alt: "Cuisine intégrée aux façades bois, coin repas avec banquette ronde et parquet Versailles",
  },
  entreeCuisine: {
    src: `${DIR}/entree-cuisine-banquette-ronde.jpg`,
    alt: "Entrée ouverte sur la cuisine, banquette ronde et appliques murales en laiton",
  },
  sdbBaignoireMarbre: {
    src: `${DIR}/salle-de-bain-baignoire-ilot-marbre-noir.jpg`,
    alt: "Salle de bain avec baignoire îlot cuivrée, marbre noir veiné et cheminée en marbre",
  },
  sdbBaignoireGranit: {
    src: `${DIR}/salle-de-bain-baignoire-ilot-granit.jpg`,
    alt: "Baignoire îlot cuivrée et vasque taillée dans la pierre, murs en granit",
  },
  salleDeauMarbre: {
    src: `${DIR}/salle-d-eau-marbre-gris.jpg`,
    alt: "Salle d’eau en marbre gris avec niche et robinetterie encastrée noire",
  },

  // Cuisines
  cuisineNoireIlot: {
    src: `${DIR}/cuisine-noire-ilot-bois.jpg`,
    alt: "Cuisine ouverte noire avec îlot et plans de travail en bois, parquet en chevron",
  },
  cuisineNoyer: {
    src: `${DIR}/cuisine-noyer-laque-blanche.jpg`,
    alt: "Cuisine linéaire en noyer avec meubles hauts laqués blancs et spots encastrés",
  },
  cuisineNoyerClaustra: {
    src: `${DIR}/cuisine-noyer-claustra-tasseaux.jpg`,
    alt: "Cuisine en noyer avec colonnes de rangement et claustra en tasseaux de bois",
  },
  cuisineBlanche: {
    src: `${DIR}/cuisine-blanche-laquee-marbre.jpg`,
    alt: "Cuisine blanche laquée sans poignées, fours en colonne et sol effet marbre",
  },
  cuisineBleue: {
    src: `${DIR}/cuisine-couloir-bleue-marbre.jpg`,
    alt: "Cuisine en longueur aux façades bleues, plan de travail et crédence effet marbre",
  },
  cuisineCouloir: {
    src: `${DIR}/cuisine-couloir-noire-bois.jpg`,
    alt: "Cuisine couloir noire et bois ouverte sur une fenêtre, sol en grand carreau gris",
  },
  cuisineSauge: {
    src: `${DIR}/cuisine-vert-sauge.jpg`,
    alt: "Cuisine vert sauge avec colonne réfrigérateur intégrée et crédence en marbre vert",
  },
  cuisineBoisFonce: {
    src: `${DIR}/cuisine-bois-fonce-parquet-chevron.jpg`,
    alt: "Cuisine en bois foncé avec retour en L, sol en parquet en chevron",
  },
  kitchenette: {
    src: `${DIR}/kitchenette-claustra-bois.jpg`,
    alt: "Kitchenette grise compacte séparée de l’entrée par une claustra en bois",
  },

  // Salles de bain et WC
  sdbTravertin: {
    src: `${DIR}/salle-de-bain-travertin-douche-italienne.jpg`,
    alt: "Salle de bain en travertin, douche à l’italienne et robinetterie cuivrée",
  },
  sdbNiches: {
    src: `${DIR}/salle-de-bain-niches-eclairees.jpg`,
    alt: "Salle de bain aux murs arrondis, niches éclairées par LED au-dessus de la baignoire",
  },
  sdbBaignoire: {
    src: `${DIR}/salle-de-bain-baignoire-douche.jpg`,
    alt: "Baignoire encastrée et douche avec niches lumineuses dans un carrelage en relief",
  },
  sdbDoubleVasque: {
    src: `${DIR}/salle-de-bain-double-vasque-marbre.jpg`,
    alt: "Salle de bain à double vasque, meuble suspendu en bois et murs effet marbre",
  },
  sdbVerriere: {
    src: `${DIR}/salle-de-bain-paroi-verriere-noire.jpg`,
    alt: "Salle d’eau avec paroi de douche style verrière noire et meuble vasque en bois",
  },
  sdbCarreauxCiment: {
    src: `${DIR}/salle-de-bain-carreaux-ciment.jpg`,
    alt: "Douche en carreaux de ciment, vasque en pierre posée sur un meuble en bois",
  },
  wc: {
    src: `${DIR}/wc-suspendu-travertin.jpg`,
    alt: "WC suspendu avec plaque de commande encastrée et murs habillés de travertin",
  },

  // Menuiserie et agencement sur mesure
  bibliothequeArche: {
    src: `${DIR}/bibliotheque-arche-sur-mesure.jpg`,
    alt: "Bibliothèque sur mesure en arche, étagères laquées terracotta et éclairage intégré",
  },
  bibliothequeTv: {
    src: `${DIR}/bibliotheque-meuble-tv-chene.jpg`,
    alt: "Bibliothèque et meuble TV sur mesure en chêne avec rangements bas fermés",
  },
  salonBibliotheques: {
    src: `${DIR}/salon-bibliotheques-parquet-chevron.jpg`,
    alt: "Salon avec bibliothèques rétroéclairées, comptoir arrondi et parquet en chevron",
  },
  comptoir: {
    src: `${DIR}/comptoir-bar-arrondi.jpg`,
    alt: "Comptoir arrondi cannelé avec bandeau LED et murs tendus de papier peint texturé",
  },
  niches: {
    src: `${DIR}/niches-arches-sur-mesure.jpg`,
    alt: "Niches en arche peintes en rose avec rangements bas et cache-radiateur à lames",
  },
  teteDeLit: {
    src: `${DIR}/chambre-tete-de-lit-noyer.jpg`,
    alt: "Chambre avec tête de lit en noyer, panneaux encadrés et appliques murales",
  },
  chambreTasseaux: {
    src: `${DIR}/chambre-mur-tasseaux-bois.jpg`,
    alt: "Chambre avec mur habillé de tasseaux de bois et faux plafond à éclairage indirect",
  },
  chambreEnfant: {
    src: `${DIR}/chambre-enfant-lit-cabane.jpg`,
    alt: "Chambre d’enfant avec lit cabane en mezzanine et bureau intégré sur mesure",
  },
  dressing: {
    src: `${DIR}/dressing-entree-parquet-chevron.jpg`,
    alt: "Dressing d’entrée toute hauteur aux façades beiges, parquet en chevron",
  },
  placardArches: {
    src: `${DIR}/placard-portes-arches-sur-mesure.jpg`,
    alt: "Placard sur mesure aux portes ornées de moulures en arche",
  },
  meubleEntree: {
    src: `${DIR}/meuble-entree-banc-sur-mesure.jpg`,
    alt: "Meuble d’entrée sur mesure avec banc et niche habillée de bois",
  },
  cacheRadiateur: {
    src: `${DIR}/cache-radiateur-banc-sur-mesure.jpg`,
    alt: "Cache-radiateur sur mesure arrondi avec dessus en chêne et banc coffre",
  },
  meubleBureau: {
    src: `${DIR}/meuble-rangement-bureau-bois.jpg`,
    alt: "Mur de rangements en bois avec étagères ouvertes et four intégré",
  },
  menuiserieChene: {
    src: `${DIR}/menuiserie-chene-placards-pose.jpg`,
    alt: "Pose de placards et niches en chêne sur mesure en cours de chantier",
  },
  mezzanine: {
    src: `${DIR}/mezzanine-escalier-chene-pose.jpg`,
    alt: "Mezzanine et escalier en chêne avec bureau intégré, en fin de pose",
  },
  escalier: {
    src: `${DIR}/escalier-habillage-bois.jpg`,
    alt: "Escalier habillé de marches en bois dans un volume blanc",
  },

  // Second œuvre et chantier
  fauxPlafond: {
    src: `${DIR}/faux-plafond-lumineux.jpg`,
    alt: "Faux plafond en cercles concentriques avec éclairage LED indirect",
  },
  fauxPlafondPose: {
    src: `${DIR}/faux-plafond-lumineux-pose.jpg`,
    alt: "Artisans en finition d’un faux plafond circulaire à éclairage indirect",
  },
  cloisons: {
    src: `${DIR}/cloisons-ossature-metallique.jpg`,
    alt: "Cloisons en plaques de plâtre sur ossature métallique en cours de montage",
  },
  doublage: {
    src: `${DIR}/doublage-plaques-de-platre.jpg`,
    alt: "Doublage de mur en plaques de plâtre sur rails métalliques",
  },
  placoHydro: {
    src: `${DIR}/cloison-placo-hydrofuge.jpg`,
    alt: "Cloison en plaques de plâtre hydrofuges avec bâti de porte",
  },
  boiseriesPose: {
    src: `${DIR}/boiseries-niche-arche-pose.jpg`,
    alt: "Pose de boiseries et d’une niche en arche dans un salon en travaux",
  },

  // Gros œuvre, extension, façade
  isolationExterieure: {
    src: `${DIR}/isolation-exterieure-laine-de-roche.jpg`,
    alt: "Isolation des murs en panneaux de laine de roche avant pose du bardage",
  },
  extensionCharpente: {
    src: `${DIR}/extension-maconnerie-charpente.jpg`,
    alt: "Extension en maçonnerie de parpaings avec charpente bois en cours de pose",
  },
  charpenteLucarnes: {
    src: `${DIR}/charpente-lucarnes-surelevation.jpg`,
    alt: "Surélévation : charpente bois et lucarnes en cours de montage sous échafaudage",
  },
  extensionBardage: {
    src: `${DIR}/extension-bardage-facade.jpg`,
    alt: "Bâtiment neuf habillé de bardage métallique gris et panneaux clairs",
  },
  ossatureBois: {
    src: `${DIR}/ossature-bois-charpente.jpg`,
    alt: "Structure à ossature bois et charpente traditionnelle montées sur dalle",
  },
  facadeImmeuble: {
    src: `${DIR}/ravalement-immeuble-ancien.jpg`,
    alt: "Immeuble ancien sous échafaudage pendant un ravalement de façade",
  },
  facadeToiture: {
    src: `${DIR}/ravalement-toiture-ardoise.jpg`,
    alt: "Maison bourgeoise à toiture en ardoise sous échafaudage de ravalement",
  },
  facadeEchafaudage: {
    src: `${DIR}/ravalement-facade-echafaudage.jpg`,
    alt: "Façade d’immeuble ancien entièrement échafaudée pour sa rénovation",
  },
} as const;

export type Photo = (typeof photos)[keyof typeof photos];

const ALT_BY_SRC = new Map<string, string>(
  Object.values(photos).map((p) => [p.src, p.alt]),
);

/** Texte alternatif d'une photo du registre ; vide pour un visuel inconnu. */
export function altOf(src: string): string {
  return ALT_BY_SRC.get(src) ?? "";
}
