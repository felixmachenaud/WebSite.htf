/** Données partagées entre la vue desktop (moteur) et la vue mobile (scroll natif). */

/** Parcours de l'accueil — une étape par photo, ordre de la maquette « chemin » (références/). */
export const LANDING_IMAGES = [
  "/images/landing/chemin-1.jpg",
  "/images/landing/chemin-2.jpg",
  "/images/landing/chemin-3.jpg",
  "/images/landing/chemin-4.jpg",
  "/images/landing/chemin-5.jpg",
  "/images/landing/chemin-6.jpg",
  "/images/landing/chemin-7.jpg",
] as const;

export const LANDING_IMAGE_OBJECT_POSITION: readonly string[] = LANDING_IMAGES.map(() => "50% 50%");

export const LANDING_IMAGE_FILTERS: readonly string[] = LANDING_IMAGES.map(() => "none");

export const PATH_GREEN = "#1F7A5A";
