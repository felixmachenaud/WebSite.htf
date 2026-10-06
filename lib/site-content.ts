import { ecolePending } from "@/lib/ecole-pending";

export interface NavItem {
  href: string;
  label: string;
}

export interface LandingOverlay {
  title: string;
  body: string;
  href: string;
  buttonLabel: string;
}

export interface DirectionPerson {
  name: string;
  role: string;
}

export interface ProjetSection {
  title: string;
  text: string;
}

export interface InfoSection {
  id: string;
  label: string;
  title: string;
  body: string;
}

export interface Fondement {
  titre: string;
  phrase: string;
}

export interface ActualiteItem {
  id: string;
  slug: string;
  titre: string;
  excerpt: string;
  imageUrl: string;
  date?: string;
}

export interface ResultatMention {
  label: string;
  value: number;
}

export interface ResultatAnnee {
  annee: number;
  mentions: ResultatMention[];
}

export interface ActualitesPageCopy {
  metaTitle: string;
  metaDescription: string;
  title: string;
  backLabel: string;
  readPrefix: string;
}

export interface SiteContent {
  chrome: {
    menuButton: string;
    menuWord: string;
    brand: string;
    schoolLine: string;
    ecoleDirecte: string;
    ecoleDirecteHref: string;
    contactLabel: string;
    nav: NavItem[];
  };
  landing: { overlays: LandingOverlay[] };
  home: { welcomeTitle: string };
  footer: {
    newsletterTitle: string;
    newsletterBody: string;
    contactTitle: string;
    schoolName: string;
    addressCourbevoie: string;
    addressBoisColombes: string;
    phone: string;
    phoneHref: string;
    email: string;
    legalMentions: string;
    legalPrivacy: string;
  };
  about: { metaTitle: string; metaDescription: string; title: string; quote: string };
  college: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    intro: string;
    collageAlt: string;
    resultsTitle: string;
    resultsBody: string;
    practicalTitle: string;
    stats: string[];
    directionTitle: string;
    direction: DirectionPerson[];
  };
  lycee: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    intro: string;
    collageAlt: string;
    practicalTitle: string;
    stats: string[];
    directionTitle: string;
    direction: DirectionPerson[];
    resultats: { titre: string; sousTitre: string; annees: ResultatAnnee[] };
  };
  projet: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    quote: string;
    sections: ProjetSection[];
  };
  infos: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    welcome: string;
    kicker: string;
    indexTitle: string;
    mapButton: string;
    collegeCardTitle: string;
    lyceeCardTitle: string;
  collegeAddress: string;
  lyceeAddress: string;
  installationCaptions: string[];
  sections: InfoSection[];
  };
  histoire: {
    metaTitle: string;
    metaDescription: string;
    heroTitle: string;
    heroLead: string;
    accroche: string;
    convictionTitle: string;
    convictionP1: string;
    convictionP2: string;
    convictionAlt: string;
    fondementsTitle: string;
    fondementsLead: string;
    fondements: Fondement[];
    photoAlt1: string;
    photoAlt2: string;
    blasonTitle: string;
    blasonAlt: string;
    blasonBefore: string;
    blasonParents: string;
    blasonMid1: string;
    blasonTeachers: string;
    blasonMid2: string;
    blasonStudents: string;
    blasonAfter: string;
    blasonP2: string;
    conclusionTitle: string;
    conclusionBody: string;
    ctaProjet: string;
    ctaRencontrer: string;
  };
  actualites: ActualiteItem[];
  actualitesPage: ActualitesPageCopy;
  contact: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    intro: string;
    phoneTitle: string;
    emailTitle: string;
  };
}

const NAV: NavItem[] = [
  { href: "/", label: "Accueil" },
  { href: "/a-propos/college", label: "Collège" },
  { href: "/a-propos/lycee", label: "Lycée" },
  { href: "/a-propos/information-generale", label: "Information générale" },
  { href: "/a-propos/histoire", label: "Histoire" },
  { href: "/a-propos/projet-educatif", label: "Notre projet éducatif" },
  { href: "/nouvelles", label: "Actualités" },
  { href: "/contact", label: "Contact" },
];

export const DEFAULT_CONTENT: SiteContent = {
  chrome: {
    menuButton: "Menu",
    menuWord: "MENU",
    brand: "Hautefeuille",
    schoolLine: "Collège Lycée",
    ecoleDirecte: "École directe",
    ecoleDirecteHref: "https://www.ecoledirecte.com",
    contactLabel: "Contact",
    nav: NAV,
  },
  landing: {
    overlays: [
      {
        title: "LE VOYAGE DE VOTRE ENFANT COMMENCE PAR UN PREMIER PAS",
        body: "Et jusqu'à ce que vous atteigniez l'objectif, vous parcourrez un chemin plein d'expériences et d'opportunités.",
        href: "/a-propos/histoire/",
        buttonLabel: "Notre histoire",
      },
      {
        title: "ENRACINÉ DANS LA FAMILLE",
        body: "Vous apprendrez à vous débrouiller avec liberté et responsabilité.",
        href: "/a-propos/lycee/",
        buttonLabel: "Le lycée",
      },
      {
        title: "IL NE MARCHERA JAMAIS SEUL",
        body: "Car en cours de route, il acquerra les valeurs de solidarité, de respect et d'amitié.",
        href: "/a-propos/projet-educatif/",
        buttonLabel: "Projet éducatif",
      },
    ],
  },
  home: { welcomeTitle: "Bienvenue à Hautefeuille" },
  footer: {
    newsletterTitle: "Lettre d'information",
    newsletterBody:
      "Nouvelles, concours, projets internationaux, initiatives de solidarité... L'inscription à la lettre d'information sera bientôt disponible.",
    contactTitle: "Contactez-nous",
    schoolName: "Collège Lycée Hautefeuille",
    addressCourbevoie: "5 Rue Armand Silvestre\n92400 Courbevoie, France",
    addressBoisColombes: "26 rue Pierre Joigneaux\n92270 Bois-Colombes, France",
    phone: "01 43 33 24 02",
    phoneHref: "tel:+33143332402",
    email: ecolePending.contactEmail,
    legalMentions: "Mentions légales",
    legalPrivacy: "Politique de confidentialité",
  },
  about: {
    metaTitle: "À propos | Collège Lycée Hautefeuille",
    metaDescription: "Viser l'excellence académique, s'ouvrir au monde et aux autres, donner du sens à sa vie.",
    title: "À propos",
    quote: "Viser l'excellence académique, s'ouvrir au monde et aux autres, donner du sens à sa vie.",
  },
  college: {
    metaTitle: "Collège | Collège Lycée Hautefeuille",
    metaDescription: "Le collège Hautefeuille - 100% de réussite au brevet, 96% de mentions.",
    title: "Collège",
    intro:
      "Le collège Hautefeuille accueille les élèves de la 6e à la 3e dans un cadre bienveillant et exigeant. Notre projet éducatif vise à former des jeunes capables de s'engager avec confiance dans leur parcours scolaire et personnel.",
    collageAlt: "Vie au collège",
    resultsTitle: "Les résultats",
    resultsBody: ecolePending.collegeResults,
    practicalTitle: "Informations pratiques",
    stats: [...ecolePending.collegeStats],
    directionTitle: "La direction",
    direction: [
      { name: "François-Xavier Bouillet", role: "Chef d'Établissement" },
      { name: "Xavier Villarmet", role: "Directeur du Collège" },
      { name: "Luc Neuville", role: "Directeur Administratif" },
    ],
  },
  lycee: {
    metaTitle: "Lycée | Collège Lycée Hautefeuille",
    metaDescription: "Le lycée Hautefeuille - accompagnement vers l'excellence.",
    title: "Lycée",
    intro:
      "Le lycée Hautefeuille accompagne les élèves de la seconde à la terminale vers l'excellence académique et personnelle. Un cadre propice à la réussite et à l'épanouissement.",
    collageAlt: "Vie au lycée",
    practicalTitle: "Informations pratiques",
    stats: [...ecolePending.lyceeStats],
    directionTitle: "La direction",
    direction: [
      { name: "François-Xavier Bouillet", role: "Chef d'Établissement et Directeur du Lycée" },
      { name: "Frédéric Delorme", role: "Directeur des Études" },
      { name: "Luc Neuville", role: "Directeur Administratif" },
    ],
    resultats: {
      titre: "LES RÉSULTATS",
      sousTitre: "100 % de réussite au bac, 91 % de mentions",
      annees: [
        {
          annee: 2025,
          mentions: [
            { label: "TB", value: 3 },
            { label: "B", value: 18.4 },
            { label: "AB", value: 52.6 },
            { label: "Admis", value: 26 },
          ],
        },
        {
          annee: 2024,
          mentions: [
            { label: "TB", value: 24 },
            { label: "B", value: 26 },
            { label: "AB", value: 30 },
            { label: "Passable", value: 20 },
          ],
        },
        {
          annee: 2023,
          mentions: [
            { label: "TB", value: 15.2 },
            { label: "B", value: 36.4 },
            { label: "AB", value: 42.4 },
            { label: "Passable", value: 3 },
            { label: "Échec", value: 3 },
          ],
        },
      ],
    },
  },
  projet: {
    metaTitle: "Notre projet éducatif | Collège Lycée Hautefeuille",
    metaDescription: "Le projet éducatif de Hautefeuille.",
    title: "Notre projet éducatif",
    quote: "L'éducation est l'art de conduire les jeunes à la vérité. — Saint Jean Bosco",
    sections: [
      {
        title: "Éducation globale",
        text: "Notre projet éducatif vise à former des jeunes dans toutes les dimensions de leur personne : intellectuelle, humaine, spirituelle et sociale. Nous accompagnons chaque élève pour qu'il développe ses talents et grandisse en confiance.",
      },
      {
        title: "Formation du caractère",
        text: "La formation du caractère est au cœur de notre pédagogie. Nous encourageons l'effort, la persévérance et le sens des responsabilités. Chaque élève apprend à se dépasser et à donner le meilleur de lui-même.",
      },
      {
        title: "Ouverture au monde",
        text: "S'ouvrir au monde et aux autres est une priorité. Voyages, échanges, projets culturels et solidaires permettent aux élèves de développer leur curiosité et leur empathie.",
      },
    ],
  },
  infos: {
    metaTitle: "Informations générales | Collège Lycée Hautefeuille",
    metaDescription: "Informations pratiques : transport, uniforme, calendrier, etc.",
    title: "Informations générales",
    welcome: "Bienvenue à l'année scolaire 2025 / 2026",
    kicker: "Informations générales",
    indexTitle: "Index",
    mapButton: "Afficher la carte Google Maps",
    collegeCardTitle: "Collège",
    lyceeCardTitle: "Lycée",
    collegeAddress: "5 Rue Armand Silvestre, 92400 Courbevoie, France",
    lyceeAddress: "26 rue Pierre Joigneaux, 92270 Bois-Colombes, France",
    installationCaptions: ["Le Collège", "Le terrain de sport", "Le Lycée"],
    sections: [
      {
        id: "transport",
        label: "Transport",
        title: "Transport",
        body: "Le collège et le lycée sont à 5 minutes à pied de l'arrêt Bécon les Bruyères sur la ligne L. De plus, chaque établissement propose des espaces pour ranger les vélos et les trotinettes.",
      },
      {
        id: "uniforme",
        label: "Uniforme",
        title: "Uniforme",
        body: "Au collège, il se compose d'un pull vert au blason de l'école, d'une chemise blanche, d'un pantalon noir et d'une paire de chaussures de ville. Il n'y a pas d'uniforme pour le lycée, il est néanmoins exigé une chemise, un pantalon de toile ainsi qu'une paire de chaussures de ville.",
      },
      {
        id: "installations",
        label: "Installations",
        title: "Installations",
        body: "Présentation des locaux, salles spécialisées et espaces dédiés à la vie scolaire.",
      },
      {
        id: "materiel-scolaire",
        label: "Matériel scolaire",
        title: "Matériel scolaire",
        body: "Listes de fournitures par niveau et recommandations pour bien équiper votre enfant tout au long de l'année.",
      },
      {
        id: "menu-scolaire",
        label: "Menu scolaire",
        title: "Menu scolaire",
        body: "Menus de la cantine, équilibre alimentaire et informations sur les inscriptions.",
      },
      {
        id: "services",
        label: "Services",
        title: "Services",
        body: "Services proposés aux familles et aux élèves au sein de l'établissement.",
      },
      {
        id: "calendrier",
        label: "Calendrier",
        title: "Calendrier",
        body: "Vacances scolaires, jours fériés et dates importantes de l'année scolaire.",
      },
      {
        id: "extrascolaire",
        label: "Extrascolaire",
        title: "Extrascolaire",
        body: "Activités proposées en dehors des cours : sport, culture et projets collectifs.",
      },
    ],
  },
  histoire: {
    metaTitle: "Histoire | Collège Lycée Hautefeuille",
    metaDescription:
      "L'histoire, l'identité et les fondements éducatifs de Hautefeuille. Une école née d'une conviction en 1985.",
    heroTitle: "L'histoire de Hautefeuille",
    heroLead:
      "Une école née d'une conviction : former des jeunes exigeants, ouverts au monde et capables de donner du sens à leur vie.",
    accroche: "Viser l'excellence académique, s'ouvrir au monde et aux autres, donner du sens à sa vie.",
    convictionTitle: "Une école née d'une conviction",
    convictionP1:
      "Hautefeuille a été fondée en 1985 par des parents désireux d'offrir à leurs enfants une éducation exigeante, cohérente et ancrée dans des valeurs humaines et chrétiennes. Convaincus que l'école doit prolonger et renforcer le travail des familles, ces pionniers ont créé un lieu où l'excellence intellectuelle va de pair avec la formation du caractère.",
    convictionP2:
      "Depuis près de quarante ans, l'établissement a grandi et s'est structuré, tout en restant fidèle à cette intuition fondatrice : une école de parents, pour des parents, au service de la transmission.",
    convictionAlt: "Fondation de Hautefeuille",
    fondementsTitle: "Les fondements de Hautefeuille",
    fondementsLead: "Douze piliers structurent notre projet éducatif et définissent l'identité de l'établissement.",
    fondements: [
      { titre: "Une école de parents", phrase: "Créée et portée par des familles engagées dans l'éducation de leurs enfants." },
      { titre: "Une éducation pour garçons", phrase: "Un cadre adapté au développement et à l'épanouissement des garçons." },
      { titre: "Un enseignement de qualité", phrase: "Exigence académique et transmission des savoirs fondamentaux." },
      { titre: "Le préceptorat", phrase: "Accompagnement personnalisé et suivi individualisé de chaque élève." },
      { titre: "L'éducation aux vertus", phrase: "Formation du caractère et développement des qualités humaines." },
      { titre: "L'uniforme", phrase: "Symbole d'appartenance et d'égalité au sein de la communauté scolaire." },
      { titre: "La relation professeurs-élèves", phrase: "Proximité et confiance au cœur de la transmission." },
      { titre: "La formation chrétienne", phrase: "Ouverture à la foi et sens de la vie." },
      { titre: "Un avantage Parcoursup", phrase: "Préparation solide pour les études supérieures." },
      { titre: "De belles sorties", phrase: "Découvertes culturelles et voyages formateurs." },
      { titre: "De vraies méthodes de travail", phrase: "Rigueur, organisation et autonomie." },
      { titre: "Des activités attrayantes", phrase: "Sport, arts et vie de groupe." },
    ],
    photoAlt1: "Vie scolaire et relation éducative",
    photoAlt2: "Activités et sorties",
    blasonTitle: "Le blason et sa signification",
    blasonAlt: "Blason Hautefeuille",
    blasonBefore: "Le blason de Hautefeuille porte trois feuilles de chêne, symbolisant les trois piliers de l'éducation : les ",
    blasonParents: "parents",
    blasonMid1: ", les ",
    blasonTeachers: "professeurs",
    blasonMid2: " et les ",
    blasonStudents: "élèves",
    blasonAfter: ". Ensemble, ils forment une communauté éducative unie autour d'un même projet.",
    blasonP2:
      "L'or évoque la charité et la générosité ; l'argent, la science et la clarté de l'esprit. Ces couleurs rappellent que la formation intellectuelle et la formation du cœur vont de pair.",
    conclusionTitle: "Fidélité aux fondamentaux, renouvellement permanent",
    conclusionBody:
      "Hautefeuille reste fidèle à ses racines tout en s'adaptant aux défis de chaque époque. Une équipe éducative généreuse et engagée œuvre au quotidien pour offrir à chaque élève une formation intellectuelle, humaine et chrétienne de qualité.",
    ctaProjet: "Découvrir notre projet éducatif",
    ctaRencontrer: "Nous rencontrer",
  },
  actualites: [
    {
      id: "1",
      slug: "goodies-40-ans",
      titre: "Goodies des 40 ans de Hautefeuille",
      excerpt:
        "À l'occasion des 40 ans de Hautefeuille, découvrez nos goodies ! 👉 Rendez-vous sur notre boutique HelloAsso : https://www.helloasso.com/associations/vouloir-l-education/boutiques/40-ans-hautefeuille 📦 Offrez-les autour de vous ou gardez un souvenir : chaque achat soutient…",
      imageUrl: "/images/nouvelles/goodies-40-ans.jpg",
    },
    {
      id: "2",
      slug: "rome-latin",
      titre: "Une semaine à Rome qui fait parler le latin",
      excerpt:
        "À l'occasion du week-end de l'Ascension, nos élèves latinistes de seconde ont eu la chance de séjourner à Rome, au sein de l'Académie Vivarium Novum. Cette institution unique accueille chaque année des étudiants venus du monde entier pour s'immerger pleinement dans la langue et la culture latines.",
      imageUrl: "",
    },
    {
      id: "3",
      slug: "cinquiemes-montmartre",
      titre: "Les cinquièmes à Montmartre",
      excerpt:
        "Pour la deuxième année consécutive, les élèves de cinquième se sont rendus à la Basilique du Sacré-Cœur de Montmartre pour une journée et une nuit d'adoration. Ce temps fort de l'année, désormais bien ancré dans le parcours des collégiens, propose une alternance entre des temps de prière devant le Saint-Sacrement et des moments de cohésion et d'amitiés partagés à travers des activités sportives. Une manière concrète pour les garçons de se mettre à l'écoute du Cœur de Jésus, tout en vivant pleinement la joie et l'esprit d'équipe.",
      imageUrl: "",
    },
  ],
  actualitesPage: {
    metaTitle: "Actualités | Collège Lycée Hautefeuille",
    metaDescription: "Les dernières actualités du Collège Lycée Hautefeuille.",
    title: "Actualités",
    backLabel: "Retour aux actualités",
    readPrefix: "Lire",
  },
  contact: {
    metaTitle: "Contact | Collège Lycée Hautefeuille",
    metaDescription: "Contactez le Collège Lycée Hautefeuille.",
    title: "Contact",
    intro: "Pour toute question, contactez-nous par téléphone ou par courriel.",
    phoneTitle: "Téléphone",
    emailTitle: "Courriel",
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function str(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

function num(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function mergeFixed<T>(defaults: T[], saved: unknown, map: (item: T, savedItem: unknown) => T): T[] {
  const list = Array.isArray(saved) ? saved : [];
  return defaults.map((item, index) => map(item, list[index]));
}

function blankActualite(): ActualiteItem {
  return { id: "", slug: "", titre: "", excerpt: "", imageUrl: "" };
}

function readActualites(saved: unknown, defaults: ActualiteItem[]): ActualiteItem[] {
  if (!Array.isArray(saved)) return defaults;
  return saved.map((item, index) => {
    const row = isRecord(item) ? item : {};
    const fallback = blankActualite();
    const id = str(row.id, fallback.id) || `item-${index + 1}`;
    return {
      id,
      slug: str(row.slug, fallback.slug),
      titre: str(row.titre, fallback.titre),
      excerpt: str(row.excerpt, fallback.excerpt),
      imageUrl: str(row.imageUrl, fallback.imageUrl),
    };
  });
}

function readFondements(saved: unknown, defaults: Fondement[]): Fondement[] {
  if (!Array.isArray(saved)) return defaults;
  return saved.map((item) => {
    const row = isRecord(item) ? item : {};
    return { titre: str(row.titre, ""), phrase: str(row.phrase, "") };
  });
}

function readAnnees(saved: unknown, defaults: ResultatAnnee[]): ResultatAnnee[] {
  if (!Array.isArray(saved)) return defaults;
  return saved.map((item) => {
    const row = isRecord(item) ? item : {};
    const mentions = Array.isArray(row.mentions)
      ? row.mentions.map((mention) => {
          const m = isRecord(mention) ? mention : {};
          return { label: str(m.label, ""), value: num(m.value, 0) };
        })
      : [];
    return { annee: num(row.annee, 0), mentions };
  });
}

export function mergeContent(defaults: SiteContent, saved: unknown): SiteContent {
  const s = isRecord(saved) ? saved : {};
  const chrome = isRecord(s.chrome) ? s.chrome : {};
  const footer = isRecord(s.footer) ? s.footer : {};
  const home = isRecord(s.home) ? s.home : {};
  const landing = isRecord(s.landing) ? s.landing : {};
  const about = isRecord(s.about) ? s.about : {};
  const college = isRecord(s.college) ? s.college : {};
  const lycee = isRecord(s.lycee) ? s.lycee : {};
  const projet = isRecord(s.projet) ? s.projet : {};
  const infos = isRecord(s.infos) ? s.infos : {};
  const histoire = isRecord(s.histoire) ? s.histoire : {};
  const actualitesPage = isRecord(s.actualitesPage) ? s.actualitesPage : {};
  const contact = isRecord(s.contact) ? s.contact : {};
  const resultats = isRecord(lycee.resultats) ? lycee.resultats : {};

  return {
    chrome: {
      menuButton: str(chrome.menuButton, defaults.chrome.menuButton),
      menuWord: str(chrome.menuWord, defaults.chrome.menuWord),
      brand: str(chrome.brand, defaults.chrome.brand),
      schoolLine: str(chrome.schoolLine, defaults.chrome.schoolLine),
      ecoleDirecte: str(chrome.ecoleDirecte, defaults.chrome.ecoleDirecte),
      ecoleDirecteHref: str(chrome.ecoleDirecteHref, defaults.chrome.ecoleDirecteHref),
      contactLabel: str(chrome.contactLabel, defaults.chrome.contactLabel),
      nav: mergeFixed(defaults.chrome.nav, chrome.nav, (item, savedItem) => ({
        href: item.href,
        label: str(isRecord(savedItem) ? savedItem.label : undefined, item.label),
      })),
    },
    landing: {
      overlays: mergeFixed(defaults.landing.overlays, landing.overlays, (item, savedItem) => {
        const row = isRecord(savedItem) ? savedItem : {};
        return {
          title: str(row.title, item.title),
          body: str(row.body, item.body),
          href: str(row.href, item.href) || item.href,
          buttonLabel: str(row.buttonLabel, item.buttonLabel),
        };
      }),
    },
    home: { welcomeTitle: str(home.welcomeTitle, defaults.home.welcomeTitle) },
    footer: {
      newsletterTitle: str(footer.newsletterTitle, defaults.footer.newsletterTitle),
      newsletterBody: str(footer.newsletterBody, defaults.footer.newsletterBody),
      contactTitle: str(footer.contactTitle, defaults.footer.contactTitle),
      schoolName: str(footer.schoolName, defaults.footer.schoolName),
      addressCourbevoie: str(footer.addressCourbevoie, defaults.footer.addressCourbevoie),
      addressBoisColombes: str(footer.addressBoisColombes, defaults.footer.addressBoisColombes),
      phone: str(footer.phone, defaults.footer.phone),
      phoneHref: str(footer.phoneHref, defaults.footer.phoneHref),
      email: str(footer.email, defaults.footer.email),
      legalMentions: str(footer.legalMentions, defaults.footer.legalMentions),
      legalPrivacy: str(footer.legalPrivacy, defaults.footer.legalPrivacy),
    },
    about: {
      metaTitle: str(about.metaTitle, defaults.about.metaTitle),
      metaDescription: str(about.metaDescription, defaults.about.metaDescription),
      title: str(about.title, defaults.about.title),
      quote: str(about.quote, defaults.about.quote),
    },
    college: {
      metaTitle: str(college.metaTitle, defaults.college.metaTitle),
      metaDescription: str(college.metaDescription, defaults.college.metaDescription),
      title: str(college.title, defaults.college.title),
      intro: str(college.intro, defaults.college.intro),
      collageAlt: str(college.collageAlt, defaults.college.collageAlt),
      resultsTitle: str(college.resultsTitle, defaults.college.resultsTitle),
      resultsBody: str(college.resultsBody, defaults.college.resultsBody),
      practicalTitle: str(college.practicalTitle, defaults.college.practicalTitle),
      stats: mergeFixed(defaults.college.stats, college.stats, (item, savedItem) => str(savedItem, item)),
      directionTitle: str(college.directionTitle, defaults.college.directionTitle),
      direction: mergeFixed(defaults.college.direction, college.direction, (item, savedItem) => {
        const row = isRecord(savedItem) ? savedItem : {};
        return { name: str(row.name, item.name), role: str(row.role, item.role) };
      }),
    },
    lycee: {
      metaTitle: str(lycee.metaTitle, defaults.lycee.metaTitle),
      metaDescription: str(lycee.metaDescription, defaults.lycee.metaDescription),
      title: str(lycee.title, defaults.lycee.title),
      intro: str(lycee.intro, defaults.lycee.intro),
      collageAlt: str(lycee.collageAlt, defaults.lycee.collageAlt),
      practicalTitle: str(lycee.practicalTitle, defaults.lycee.practicalTitle),
      stats: mergeFixed(defaults.lycee.stats, lycee.stats, (item, savedItem) => str(savedItem, item)),
      directionTitle: str(lycee.directionTitle, defaults.lycee.directionTitle),
      direction: mergeFixed(defaults.lycee.direction, lycee.direction, (item, savedItem) => {
        const row = isRecord(savedItem) ? savedItem : {};
        return { name: str(row.name, item.name), role: str(row.role, item.role) };
      }),
      resultats: {
        titre: str(resultats.titre, defaults.lycee.resultats.titre),
        sousTitre: str(resultats.sousTitre, defaults.lycee.resultats.sousTitre),
        annees: readAnnees(resultats.annees, defaults.lycee.resultats.annees),
      },
    },
    projet: {
      metaTitle: str(projet.metaTitle, defaults.projet.metaTitle),
      metaDescription: str(projet.metaDescription, defaults.projet.metaDescription),
      title: str(projet.title, defaults.projet.title),
      quote: str(projet.quote, defaults.projet.quote),
      sections: mergeFixed(defaults.projet.sections, projet.sections, (item, savedItem) => {
        const row = isRecord(savedItem) ? savedItem : {};
        return { title: str(row.title, item.title), text: str(row.text, item.text) };
      }),
    },
    infos: {
      metaTitle: str(infos.metaTitle, defaults.infos.metaTitle),
      metaDescription: str(infos.metaDescription, defaults.infos.metaDescription),
      title: str(infos.title, defaults.infos.title),
      welcome: str(infos.welcome, defaults.infos.welcome),
      kicker: str(infos.kicker, defaults.infos.kicker),
      indexTitle: str(infos.indexTitle, defaults.infos.indexTitle),
      mapButton: str(infos.mapButton, defaults.infos.mapButton),
      collegeCardTitle: str(infos.collegeCardTitle, defaults.infos.collegeCardTitle),
      lyceeCardTitle: str(infos.lyceeCardTitle, defaults.infos.lyceeCardTitle),
      collegeAddress: str(infos.collegeAddress, defaults.infos.collegeAddress),
      lyceeAddress: str(infos.lyceeAddress, defaults.infos.lyceeAddress),
      installationCaptions: mergeFixed(
        defaults.infos.installationCaptions,
        infos.installationCaptions,
        (item, savedItem) => str(savedItem, item),
      ),
      sections: mergeFixed(defaults.infos.sections, infos.sections, (item, savedItem) => {
        const row = isRecord(savedItem) ? savedItem : {};
        return {
          id: item.id,
          label: str(row.label, item.label),
          title: str(row.title, item.title),
          body: str(row.body, item.body),
        };
      }),
    },
    histoire: {
      metaTitle: str(histoire.metaTitle, defaults.histoire.metaTitle),
      metaDescription: str(histoire.metaDescription, defaults.histoire.metaDescription),
      heroTitle: str(histoire.heroTitle, defaults.histoire.heroTitle),
      heroLead: str(histoire.heroLead, defaults.histoire.heroLead),
      accroche: str(histoire.accroche, defaults.histoire.accroche),
      convictionTitle: str(histoire.convictionTitle, defaults.histoire.convictionTitle),
      convictionP1: str(histoire.convictionP1, defaults.histoire.convictionP1),
      convictionP2: str(histoire.convictionP2, defaults.histoire.convictionP2),
      convictionAlt: str(histoire.convictionAlt, defaults.histoire.convictionAlt),
      fondementsTitle: str(histoire.fondementsTitle, defaults.histoire.fondementsTitle),
      fondementsLead: str(histoire.fondementsLead, defaults.histoire.fondementsLead),
      fondements: readFondements(histoire.fondements, defaults.histoire.fondements),
      photoAlt1: str(histoire.photoAlt1, defaults.histoire.photoAlt1),
      photoAlt2: str(histoire.photoAlt2, defaults.histoire.photoAlt2),
      blasonTitle: str(histoire.blasonTitle, defaults.histoire.blasonTitle),
      blasonAlt: str(histoire.blasonAlt, defaults.histoire.blasonAlt),
      blasonBefore: str(histoire.blasonBefore, defaults.histoire.blasonBefore),
      blasonParents: str(histoire.blasonParents, defaults.histoire.blasonParents),
      blasonMid1: str(histoire.blasonMid1, defaults.histoire.blasonMid1),
      blasonTeachers: str(histoire.blasonTeachers, defaults.histoire.blasonTeachers),
      blasonMid2: str(histoire.blasonMid2, defaults.histoire.blasonMid2),
      blasonStudents: str(histoire.blasonStudents, defaults.histoire.blasonStudents),
      blasonAfter: str(histoire.blasonAfter, defaults.histoire.blasonAfter),
      blasonP2: str(histoire.blasonP2, defaults.histoire.blasonP2),
      conclusionTitle: str(histoire.conclusionTitle, defaults.histoire.conclusionTitle),
      conclusionBody: str(histoire.conclusionBody, defaults.histoire.conclusionBody),
      ctaProjet: str(histoire.ctaProjet, defaults.histoire.ctaProjet),
      ctaRencontrer: str(histoire.ctaRencontrer, defaults.histoire.ctaRencontrer),
    },
    actualites: readActualites(s.actualites, defaults.actualites),
    actualitesPage: {
      metaTitle: str(actualitesPage.metaTitle, defaults.actualitesPage.metaTitle),
      metaDescription: str(actualitesPage.metaDescription, defaults.actualitesPage.metaDescription),
      title: str(actualitesPage.title, defaults.actualitesPage.title),
      backLabel: str(actualitesPage.backLabel, defaults.actualitesPage.backLabel),
      readPrefix: str(actualitesPage.readPrefix, defaults.actualitesPage.readPrefix),
    },
    contact: {
      metaTitle: str(contact.metaTitle, defaults.contact.metaTitle),
      metaDescription: str(contact.metaDescription, defaults.contact.metaDescription),
      title: str(contact.title, defaults.contact.title),
      intro: str(contact.intro, defaults.contact.intro),
      phoneTitle: str(contact.phoneTitle, defaults.contact.phoneTitle),
      emailTitle: str(contact.emailTitle, defaults.contact.emailTitle),
    },
  };
}
