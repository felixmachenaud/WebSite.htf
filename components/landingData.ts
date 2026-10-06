/** Données partagées entre la vue desktop (moteur) et la vue mobile (scroll natif). */

export const LANDING_IMAGES = [
  "/images/landing/1.jpg",
  "/images/landing/2.JPG",
  "/images/landing/3.JPG",
] as const;

export const LANDING_IMAGE_OBJECT_POSITION: readonly string[] = ["50% 50%", "50% 50%", "50% 50%"];

export const LANDING_IMAGE_FILTERS: readonly string[] = [
  "grayscale(1) brightness(1.08) contrast(0.92)",
  "grayscale(1) brightness(1.1) contrast(0.9)",
  "grayscale(1) brightness(1.06) contrast(0.93)",
];

export const LANDING_OVERLAYS: readonly {
  title: string;
  body: string;
  href: string;
  buttonLabel: string;
}[] = [
  {
    title: "LE VOYAGE DE VOTRE ENFANT COMMENCE PAR UN PREMIER PAS",
    body:
      "Et jusqu'à ce que vous atteigniez l'objectif, vous parcourrez un chemin plein d'expériences et d'opportunités.",
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
    body:
      "Car en cours de route, il acquerra les valeurs de solidarité, de respect et d'amitié.",
    href: "/a-propos/projet-educatif/",
    buttonLabel: "Projet éducatif",
  },
];

export const PATH_GREEN = "#1F7A5A";
