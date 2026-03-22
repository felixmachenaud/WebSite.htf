// Données actualités — à remplacer par le CMS
export interface Actualite {
  id: string;
  slug: string;
  titre: string;
  excerpt: string;
  imageUrl: string;
  date?: string;
}

export const ACTUALITES: Actualite[] = [
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
    imageUrl: "/images/nouvelles/rome-latin.jpg",
  },
  {
    id: "3",
    slug: "cinquiemes-montmartre",
    titre: "Les cinquièmes à Montmartre",
    excerpt:
      "Pour la deuxième année consécutive, les élèves de cinquième se sont rendus à la Basilique du Sacré-Cœur de Montmartre pour une journée et une nuit d'adoration. Ce temps fort de l'année, désormais bien ancré dans le parcours des collégiens, propose une alternance entre des temps de prière devant le Saint-Sacrement et des moments de cohésion et d'amitiés partagés à travers des activités sportives. Une manière concrète pour les garçons de se mettre à l'écoute du Cœur de Jésus, tout en vivant pleinement la joie et l'esprit d'équipe.",
    imageUrl: "/images/nouvelles/cinquiemes-montmartre.jpg",
  },
];
