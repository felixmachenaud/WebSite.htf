/**
 * Pages issues de la maquette `références/site Hautefeuille maquette chemin v2`.
 * Regroupées pour limiter le nombre de pages : valeurs → /a-propos/projet-educatif, familles et témoignages → /a-propos,
 * vie → /nouvelles, documentation → infos pratiques, soutien → /a-propos/inscriptions (anciennes URL redirigées, next.config.js).
 * Textes repris de la maquette ; citations et annotations de maquette (« à rédiger », « XX % ») non publiées.
 * shortcut: contenu statique (hors CMS), passer dans lib/site-content.ts si l'école doit l'éditer.
 */

interface PageLink {
  label: string;
  href: string;
}

export interface ContentPageData {
  title: string;
  intro: string;
  image: string;
  imageAlt: string;
  breadcrumb: PageLink[];
  cards: { title: string; text: string; link?: PageLink }[];
  stats?: { title: string; items: { value: string; label: string }[] };
  band?: { title: string; text: string; link?: PageLink };
  next?: PageLink;
}

const VALEURS: PageLink = { label: "Nos valeurs", href: "/a-propos/projet-educatif" };
const CONTACT: PageLink = { label: "Nous contacter", href: "/contact" };
const INFOS: PageLink = { label: "Informations pratiques", href: "/a-propos/information-generale" };
const photo = (id: string) => `/images/photos/htf-${id}.jpg`;

export const CONTENT_PAGES = {
  excellence: {
    title: "Viser l'excellence",
    intro:
      "À Hautefeuille, l'exigence intellectuelle va de pair avec l'attention portée à chaque élève. Les programmes de l'Éducation nationale sont enrichis pour développer l'esprit critique et la capacité de juger.",
    image: photo("0057430"),
    imageAlt: "Élèves en classe devant le tableau",
    breadcrumb: [VALEURS],
    cards: [
      {
        title: "Une culture qui aide à penser",
        text: "Des enseignements conçus pour comprendre le monde et penser par soi-même : lettres, sciences, langues, histoire.",
      },
      {
        title: "L'étude encadrée",
        text: "Un temps de travail accompagné pour apprendre à s'organiser et à travailler seul.",
      },
      {
        title: "Un suivi personnel",
        text: "Le précepteur fait le point régulièrement avec l'élève et ses parents sur son travail et ses progrès.",
      },
    ],
    // shortcut: chiffres copiés des defaults CMS (college.resultsBody, lycee.resultats), à resynchroniser si l'école les change.
    stats: {
      title: "Hautefeuille en chiffres",
      items: [
        { value: "100 %", label: "de réussite au brevet" },
        { value: "96 %", label: "de mentions au brevet" },
        { value: "91 %", label: "de mentions au bac" },
        { value: "40 ans", label: "d'histoire" },
      ],
    },
  },
  ouverture: {
    title: "S'ouvrir au monde et aux autres",
    intro:
      "Au collège et au lycée, les garçons apprennent à vivre ensemble, à servir et à s'ouvrir aux autres. Les amitiés nouées à Hautefeuille durent souvent toute la vie.",
    image: photo("0057353"),
    imageAlt: "Élèves jouant au ping-pong",
    breadcrumb: [VALEURS],
    cards: [
      {
        title: "Amitié et camaraderie",
        text: "La vie de classe, les récréations, les sorties : un cadre où l'on apprend à se connaître et à s'entraider.",
      },
      {
        title: "Service et solidarité",
        text: "Des actions solidaires et des services rendus, dans l'école et au-dehors, auprès des plus fragiles.",
      },
      {
        title: "Ouverture culturelle",
        text: "Sorties, conférences, théâtre et musique pour élargir les horizons.",
      },
      {
        title: "Voyages et échanges",
        text: "Voyages scolaires et projets à l'étranger pour découvrir d'autres cultures.",
      },
    ],
    band: {
      title: "Les anciens : une camaraderie qui dure",
      text: "Témoignages d'anciens élèves, retrouvailles, réseau des anciens : ce que Hautefeuille leur a apporté et les amitiés qui restent.",
      link: { label: "Lire les témoignages", href: "/a-propos#temoignages" },
    },
  },
  sens: {
    title: "Donner du sens à sa vie",
    intro:
      "Hautefeuille propose une formation qui prend en compte toute la personne : intelligence, cœur et âme. Chaque garçon est aidé à découvrir ses talents et à construire sa vie.",
    image: photo("0057804"),
    imageAlt: "Élèves sautant de joie dans la cour",
    breadcrumb: [VALEURS],
    cards: [
      {
        title: "Le préceptorat",
        text: "Chaque élève est suivi par un précepteur, un adulte de confiance qui l'aide à progresser, en lien étroit avec ses parents.",
      },
      {
        title: "Vivre sa foi",
        text: "L'aumônerie et des temps de réflexion proposés à chacun, dans le respect de sa liberté.",
      },
      {
        title: "Cultiver ses talents",
        text: "Sport, musique, théâtre, engagement : chaque garçon trouve où donner le meilleur de lui-même.",
      },
      {
        title: "Former le caractère",
        text: "La pratique des vertus humaines au quotidien : effort, loyauté, sens des responsabilités.",
      },
    ],
  },
  vie: {
    title: "La vie à Hautefeuille",
    intro: "Sport, musique, théâtre, étude, engagement, voyages : six façons de grandir en dehors de la classe.",
    image: photo("0057337"),
    imageAlt: "Partie d'échecs entre élèves",
    breadcrumb: [],
    cards: [
      { title: "Sport", text: "Esprit d'équipe et dépassement de soi." },
      { title: "Musique", text: "Pratique instrumentale et chant." },
      { title: "Théâtre", text: "Prendre confiance et s'exprimer en public." },
      { title: "Étude", text: "Un temps de travail encadré chaque soir." },
      { title: "Engagement et solidarité", text: "Servir les autres, ici et ailleurs." },
      { title: "Voyages et ouverture", text: "Découvrir d'autres horizons." },
    ],
  },
  familles: {
    title: "Les familles",
    intro:
      "Hautefeuille est née de l'initiative de parents, et les familles restent au cœur du projet éducatif : premiers éducateurs de leurs fils, elles sont associées à la vie de l'école.",
    image: photo("0057309"),
    imageAlt: "Arrivée des élèves à l'école",
    breadcrumb: [],
    cards: [
      {
        title: "Une école portée par les familles",
        text: "Le rôle des parents dans le projet éducatif et l'association qui porte l'établissement.",
      },
      {
        title: "La formation des parents",
        text: "Conférences, rencontres et ressources pour accompagner l'éducation de son fils.",
      },
      {
        title: "La vie des familles",
        text: "Fêtes, événements, bénévolat : comment s'impliquer dans la vie de l'école.",
      },
      {
        title: "Le quotidien",
        text: "Calendrier, cantine, fournitures : tout se trouve dans les Informations pratiques.",
        link: INFOS,
      },
    ],
    band: {
      title: "Prochaines rencontres parents",
      text: "Conférences et rencontres de l'année : date, thème, intervenant, inscription.",
      link: CONTACT,
    },
  },
  temoignages: {
    title: "Témoignages",
    intro:
      "Anciens, professeurs, parents, élèves : ceux qui vivent Hautefeuille racontent ce qu'ils y trouvent. Ce sont eux qui rendent nos valeurs concrètes.",
    image: photo("0057764"),
    imageAlt: "Groupe d'élèves souriants",
    breadcrumb: [],
    cards: [
      { title: "Les anciens", text: "Parcours après Hautefeuille, souvenirs et amitiés qui durent." },
      { title: "Les professeurs", text: "Pourquoi ils enseignent à Hautefeuille, ce qu'ils cherchent à transmettre." },
      { title: "Les parents", text: "Pourquoi ils ont choisi Hautefeuille, ce qu'ils voient grandir chez leur fils." },
      { title: "Les élèves", text: "Ce qu'ils aiment, un souvenir, un projet." },
    ],
    band: {
      title: "Les 40 ans : appel aux anciens",
      text: "Vous êtes un ancien d'Hautefeuille ? Partagez votre parcours et vos souvenirs pour enrichir cette page.",
      link: { label: "Envoyer mon témoignage", href: "/contact" },
    },
  },
  documentation: {
    title: "Documentation",
    intro:
      "Les documents officiels de l'établissement. Pour les questions du quotidien (horaires, cantine, calendrier), voir les Informations pratiques.",
    image: photo("0057688"),
    imageAlt: "Élèves lisant ensemble",
    breadcrumb: [],
    cards: [
      { title: "Règlement intérieur", text: "Les règles de vie communes au collège et au lycée." },
      { title: "Projet éducatif", text: "Le projet d'Hautefeuille et son caractère propre.", link: { label: "Nos valeurs", href: VALEURS.href } },
      { title: "Charte informatique", text: "Le bon usage du numérique à l'école." },
      { title: "Brochure de présentation", text: "L'établissement en quelques pages, à demander ou à partager." },
    ],
    band: {
      title: "Espace familles",
      text: "Les circulaires de l'année et les documents réservés aux familles inscrites restent accessibles dans École Directe.",
      link: { label: "Accès École Directe", href: "https://www.ecoledirecte.com" },
    },
  },
  soutien: {
    title: "Soutenez-nous",
    intro:
      "Vos dons financent des projets, des bourses et des travaux, pour que la scolarité à Hautefeuille reste accessible au plus grand nombre de familles.",
    image: photo("0057648"),
    imageAlt: "Cour et portail du collège Hautefeuille",
    breadcrumb: [],
    cards: [
      { title: "Faire un don", text: "Modalités du don et avantage fiscal éventuel : nous vous renseignons.", link: CONTACT },
      {
        title: "La boutique",
        text: "Objets aux couleurs d'Hautefeuille, dont les goodies des 40 ans.",
        link: {
          label: "Voir la boutique",
          href: "https://www.helloasso.com/associations/vouloir-l-education/boutiques/40-ans-hautefeuille",
        },
      },
      { title: "Entreprises et anciens", text: "Mécénat, parrainage d'un projet : un contact dédié.", link: CONTACT },
    ],
  },
  inscriptions: {
    title: "Inscriptions",
    intro:
      "Vous envisagez Hautefeuille pour votre fils ? Voici les étapes et les réponses à vos questions. Nous serons heureux de vous rencontrer.",
    image: photo("0057397"),
    imageAlt: "Élèves en uniforme dans la cour",
    breadcrumb: [],
    cards: [
      {
        title: "Pourquoi Hautefeuille",
        text: "Viser l'excellence académique, s'ouvrir au monde et aux autres, donner du sens à sa vie.",
        link: { label: "Nos valeurs", href: VALEURS.href },
      },
      { title: "Procédure et calendrier", text: "Dossier, entretien, réponse : les étapes et les dates clés de l'année." },
      { title: "Portes ouvertes", text: "Prochaines dates et déroulement : renseignez-vous auprès de l'établissement.", link: CONTACT },
      { title: "Frais de scolarité", text: "Grille tarifaire et aides possibles.", link: CONTACT },
    ],
    band: {
      title: "Les étapes de l'inscription",
      text: "1. Dossier → 2. Entretien avec la famille → 3. Réponse",
      link: { label: "Prendre rendez-vous", href: "/contact" },
    },
    next: { label: "Déposer un dossier", href: "/contact" },
  },
} satisfies Record<string, ContentPageData>;
