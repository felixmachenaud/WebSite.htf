"use client";

import React from "react";
import Link from "next/link";
import {
  ScrollContainer,
  ImageTransitionStack,
  OverlayCard,
  PathAnimation,
} from "./scroll";

const PATH_IMAGES = ["1.jpg", "2.jpeg", "3.jpg", "4.jpg", "5.jpeg", "6.jpg", "7.jpg"] as const;
const getPathImage = (n: number) => `/images/path/${PATH_IMAGES[n - 1]}`;

export interface SectionData {
  title: string;
  subtitle: string;
  backgroundImage: string;
  linkHref?: string;
  linkLabel?: string;
}

const SECTIONS: SectionData[] = [
  {
    title: "Bienvenue au Collège Lycée Hautefeuille",
    subtitle:
      "Le parcours de votre enfant commence par un premier pas. De la 6e à la terminale, nous l'accompagnons pour qu'il grandisse en confiance.",
    backgroundImage: getPathImage(1),
    linkHref: "/a-propos",
    linkLabel: "Découvrir l'école",
  },
  {
    title: "Le parcours de votre enfant commence ici",
    subtitle:
      "Et jusqu'à atteindre la destination, il parcourra un chemin riche en expériences et opportunités. Découvrez notre projet éducatif et nos installations adaptées à chaque âge.",
    backgroundImage: getPathImage(2),
    linkHref: "/a-propos",
    linkLabel: "Découvrir l'école",
  },
  {
    title: "Enraciné dans la famille",
    subtitle:
      "Il apprendra à se développer avec liberté et responsabilité. Les parents, par leur exemple et leur dévouement, sont le facteur le plus important dans l'éducation de leurs enfants. Hautefeuille est un collège de familles.",
    backgroundImage: getPathImage(3),
  },
  {
    title: "Jamais seul",
    subtitle:
      "Pendant le trajet, il acquerra les valeurs de solidarité, de respect et d'amitié. Hautefeuille est plus qu'un collège : un lieu de relations et d'amitiés qui durent toute la vie.",
    backgroundImage: getPathImage(4),
  },
  {
    title: "Apprendre en continu",
    subtitle:
      "En affrontant de multiples défis, nous l'aiderons à les résoudre avec créativité, esprit d'entreprise et dépassement de soi. Notre projet éducatif enrichit le curriculum avec des activités culturelles, scientifiques, sportives et artistiques.",
    backgroundImage: getPathImage(5),
    linkHref: "/a-propos#projet",
    linkLabel: "Notre projet éducatif",
  },
  {
    title: "Une vision globale",
    subtitle:
      "Il développera les compétences intellectuelles, culturelles, artistiques et sportives qui fondent sa maturité personnelle. Nous collaborons avec les familles pour une éducation complète avec un accent international.",
    backgroundImage: getPathImage(6),
  },
  {
    title: "Un horizon ouvert",
    subtitle:
      "Parcourir le chemin de Hautefeuille ouvrira un avenir riche en possibilités, rêves et projets. Notre communauté de familles, professeurs et anciens élèves maintient vivant l'esprit du collège au-delà des années passées ensemble.",
    backgroundImage: getPathImage(7),
    linkHref: "/nouvelles",
    linkLabel: "Voir les actualités",
  },
];

function SectionContent({ section, isFirst }: { section: SectionData; isFirst: boolean }) {
  if (isFirst) {
    return (
      <>
        <h1 className="font-serif text-3xl font-semibold text-white sm:text-4xl md:text-5xl">
          {section.title}
        </h1>
        <p className="mt-6 text-lg text-white/90">{section.subtitle}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href={section.linkHref || "/a-propos"}
            className="inline-flex rounded-button bg-white px-6 py-3 text-sm font-medium text-slate-900 transition hover:bg-white/90"
          >
            {section.linkLabel}
          </Link>
          <Link
            href="/nouvelles"
            className="inline-flex rounded-button border-2 border-white px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Nos actualités
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <h2 className="font-serif text-2xl font-semibold text-white md:text-3xl">
        {section.title}
      </h2>
      <p className="mt-4 text-lg leading-relaxed text-white/90">{section.subtitle}</p>
      {section.linkHref && section.linkLabel && (
        <Link
          href={section.linkHref}
          className="mt-6 inline-flex rounded-button bg-white px-6 py-3 text-sm font-medium text-slate-900 transition hover:bg-white/90"
        >
          {section.linkLabel}
        </Link>
      )}
    </>
  );
}

export function ScrollLanding() {
  return (
    <ScrollContainer sectionCount={SECTIONS.length} ease={0.07} inertia={0.92}>
      {/* Virtual spacer for scroll height - not visible but defines scroll range */}
      <div
        className="pointer-events-none absolute left-0 top-0 z-0"
        style={{ height: `${SECTIONS.length * 100}vh`, width: 1 }}
        aria-hidden
      />

      {/* Image stack with parallax + bottom-to-top transition */}
      <ImageTransitionStack sections={SECTIONS} parallaxFactor={0.3} />

      {/* Red decorative path - right side, faster parallax */}
      <PathAnimation factor={1.0} />

      {/* Overlay cards - one per section, visibility based on scroll */}
      {SECTIONS.map((section, i) => (
        <OverlayCard key={i} sectionIndex={i}>
          <SectionContent section={section} isFirst={i === 0} />
        </OverlayCard>
      ))}
    </ScrollContainer>
  );
}
