"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
import { ActualitesTimeline } from "./ActualitesTimeline";
import { SidebarMenu } from "./SidebarMenu";

// =============================================================================
// CONFIGURATION — Scroll natif avec scroll-snap (fiable sur tous les navigateurs)
// =============================================================================

const PATH_LENGTH = 2400;
const NAVBAR_HEIGHT = 69; // 60 * 1.15

export interface SectionData {
  title: string;
  subtitle: string;
  imageUrl: string;
  linkHref?: string;
  linkLabel?: string;
}

// =============================================================================
// IMAGES LANDING — Placez vos fichiers dans public/images/landing/
// =============================================================================
// - 1.jpg : BIENVENUE
// - 2.jpg : LE PARCOURS
// - 3.jpg : NOS VALEURS
// Format recommandé : paysage 1920×1080 px
// =============================================================================

const LANDING_IMAGES = [
  "/images/landing/1.jpg",
  "/images/landing/2.JPG",
  "/images/landing/3.JPG",
];

const SECTIONS: SectionData[] = [
  {
    title: "BIENVENUE",
    subtitle:
      "Le parcours de votre enfant commence par un premier pas. De la 6e à la terminale, nous l'accompagnons pour qu'il grandisse en confiance.",
    imageUrl: LANDING_IMAGES[0],
    linkHref: "/a-propos/histoire",
    linkLabel: "Découvrir l'école",
  },
  {
    title: "LE PARCOURS",
    subtitle:
      "Un chemin riche en expériences et opportunités. Découvrez notre projet éducatif et nos installations adaptées à chaque âge.",
    imageUrl: LANDING_IMAGES[1],
    linkHref: "/a-propos",
    linkLabel: "Découvrir l'école",
  },
  {
    title: "NOS VALEURS",
    subtitle:
      "Excellence, bienveillance et accompagnement personnalisé au cœur de notre projet.",
    imageUrl: LANDING_IMAGES[2],
  },
];

// Sinuous path SVG — cubic bezier from top to bottom
const SINUOUS_PATH_D =
  "M 60 0 C 100 200 20 400 60 600 C 100 800 20 1000 60 1200 C 100 1400 20 1600 60 1800 C 100 2000 20 2200 60 2400";

// Waypoint positions along path (0–1) for the 6 dots
const WAYPOINT_POSITIONS = [0.08, 0.25, 0.42, 0.58, 0.75, 0.92];

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function ScrollHijackLanding() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const N = SECTIONS.length;
  const totalSections = N + 2; // images + map + footer

  // Mise à jour du scroll progress depuis le scroll natif
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const updateProgress = () => {
      const scrollTop = el.scrollTop;
      const maxScroll = el.scrollHeight - el.clientHeight;
      setScrollProgress(maxScroll > 0 ? scrollTop / maxScroll : 0);
    };

    updateProgress();
    el.addEventListener("scroll", updateProgress, { passive: true });
    return () => el.removeEventListener("scroll", updateProgress);
  }, []);

  // Bloquer le scroll du body pour éviter les conflits
  useEffect(() => {
    if (pathname === "/") {
      document.body.classList.add("landing-scroll-active");
      return () => document.body.classList.remove("landing-scroll-active");
    }
  }, [pathname]);

  // Carte visible : pic au centre de chaque section ; Bienvenue visible dès le haut (scrollProgress ~0)
  const cardProgress = (index: number) => {
    const sectionStart = index / totalSections;
    const sectionEnd = (index + 1) / totalSections;
    const p = (scrollProgress - sectionStart) / (sectionEnd - sectionStart);
    const clamped = Math.max(0, Math.min(1, p));
    // Section 0 : visible dès le haut (p=0) pour afficher Bienvenue immédiatement
    if (index === 0 && scrollProgress < sectionEnd * 0.5) return 1;
    return 4 * clamped * (1 - clamped);
  };
  const currentCardIndex = SECTIONS.reduce(
    (best, _, i) => (cardProgress(i) > cardProgress(best) ? i : best),
    0
  );

  return (
    <div
      ref={scrollRef}
      className="relative h-screen w-full overflow-y-auto overflow-x-hidden snap-y snap-proximity overscroll-none"
      style={{
        scrollBehavior: "smooth",
        WebkitOverflowScrolling: "touch",
        minHeight: "100dvh",
      }}
    >
      {/* ========== NAVBAR (+15% taille, MENU à gauche, sans liens droite) ========== */}
      <nav
        className="fixed left-0 right-0 top-0 z-[1000] flex min-h-[69px] items-center justify-between px-4 backdrop-blur-sm md:px-7"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          paddingTop: "max(0.75rem, env(safe-area-inset-top))",
        }}
      >
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="flex min-h-[44px] min-w-[44px] flex-shrink-0 items-center gap-2 text-black"
          aria-label="Menu"
        >
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="hidden font-semibold sm:inline">MENU</span>
        </button>
        <Link
          href="/"
          scroll={false}
          className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 font-serif text-xl font-semibold text-slate-800 hover:text-slate-600 sm:gap-2.5 sm:text-2xl"
        >
          <img src="/images/logo.png" alt="" className="h-8 w-8 object-contain sm:h-9 sm:w-9" />
          <span className="truncate">Hautefeuille</span>
        </Link>
        <div className="hidden min-w-[200px] items-center justify-end gap-4 md:flex lg:gap-6">
          <a
            href="https://www.ecoledirecte.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium uppercase tracking-wider text-slate-800 hover:text-slate-600"
          >
            École directe
          </a>
          <Link
            href="/contact"
            className="font-medium uppercase tracking-wider text-slate-800 hover:text-slate-600"
          >
            Contact
          </Link>
        </div>
        <div className="w-[44px] flex-shrink-0 md:hidden" aria-hidden />
      </nav>

      {/* ========== MENU DÉROULANT (pleine largeur sur mobile) ========== */}
      <div
        className={`fixed inset-0 z-[1001] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMenuOpen(false)}
        aria-hidden
      />
      <div
        className={`fixed left-0 top-0 z-[1002] flex h-full w-[85vw] max-w-[486px] flex-col overflow-y-auto pl-4 pr-6 pb-8 shadow-xl backdrop-blur-md transition-transform duration-300 ease-out md:pl-0 md:pr-8 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.98)",
          paddingTop: "max(3rem, calc(env(safe-area-inset-top) + 1rem))",
        }}
      >
        <SidebarMenu onClose={() => setMenuOpen(false)} currentPath={pathname} />
      </div>

      {/* ========== SECTIONS : scroll natif avec snap + overlay assombri ========== */}
      {SECTIONS.map((section, index) => (
        <section
          key={index}
          className="relative flex min-h-screen w-full snap-start snap-always items-center justify-center"
        >
          <div className="absolute inset-0">
            <img
              src={section.imageUrl}
              alt=""
              className="h-full w-full object-cover object-center"
              style={{ filter: "brightness(0.7)" }}
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        </section>
      ))}
      {/* Section cartes avec adresses (Collège + Lycée) */}
      <section className="flex min-h-screen w-full snap-start snap-always items-center justify-center bg-slate-900 p-6">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-6 md:flex-row">
          {/* Collège */}
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl md:p-8">
            <h3 className="font-serif text-xl font-bold text-slate-800">Collège</h3>
            <p className="mt-2 text-slate-600">5 Rue Armand Silvestre, 92400 Courbevoie, France</p>
            <div className="mt-6 aspect-video w-full overflow-hidden rounded bg-slate-200">
              <iframe
                title="Collège Hautefeuille - Courbevoie"
                src="https://www.google.com/maps?q=5+Rue+Armand+Silvestre+92400+Courbevoie+France&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
          {/* Lycée */}
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl md:p-8">
            <h3 className="font-serif text-xl font-bold text-slate-800">Lycée</h3>
            <p className="mt-2 text-slate-600">26 rue Pierre Joigneaux, 92270 Bois-Colombes, France</p>
            <div className="mt-6 aspect-video w-full overflow-hidden rounded bg-slate-200">
              <iframe
                title="Lycée Hautefeuille - Bois-Colombes"
                src="https://www.google.com/maps?q=26+rue+Pierre+Joigneaux+92270+Bois+Colombes+France&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
      {/* Section footer */}
      <section className="flex min-h-screen w-full snap-start snap-always items-center justify-center">
        <Footer />
      </section>

      {/* ========== FRISE ACTUALITÉS (gauche, visible à partir de la 2e image) ========== */}
      <div className="fixed left-6 top-1/2 z-[120] -translate-y-1/2">
        <ActualitesTimeline visible={scrollProgress >= 1 / totalSections} />
      </div>

      {/* ========== BANDES VERTICALES : s'arrêtent au pied de la dernière image ========== */}
      <div
        className="pointer-events-none fixed left-1/2 top-0 z-[50] flex -translate-x-1/2 transition-opacity duration-300"
        style={{
          width: 220,
          height: `${N * 100}vh`,
          opacity: scrollProgress > N / totalSections ? 0 : 1,
          maskImage: `linear-gradient(to bottom, transparent 0px, transparent ${NAVBAR_HEIGHT}px, black ${NAVBAR_HEIGHT + 20}px)`,
          WebkitMaskImage: `linear-gradient(to bottom, transparent 0px, transparent ${NAVBAR_HEIGHT}px, black ${NAVBAR_HEIGHT + 20}px)`,
        }}
      >
        <div className="w-[50px] flex-shrink-0" style={{ backgroundColor: "#B8860B", opacity: 0.8 }} />
        <div className="w-[120px] flex-shrink-0" style={{ backgroundColor: "#14532d", opacity: 0.75 }} />
        <div className="w-[50px] flex-shrink-0" style={{ backgroundColor: "#B8860B", opacity: 0.8 }} />
      </div>

      {/* ========== TROIS MOTS (Responsabilité, Exigence, Unité) — centrés sur la bande verte, au-dessus du bloc Bienvenue ========== */}
      {currentCardIndex === 0 && cardProgress(0) > 0 && (
        <div
          className="pointer-events-none fixed left-1/2 top-[28vh] z-[160] flex w-full max-w-2xl -translate-x-1/2 flex-col items-center justify-center text-center"
          style={{
            opacity: Math.max(0.5, Math.min(1, cardProgress(0) * 1.2)),
          }}
        >
          <span className="font-serif text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            Responsabilité
          </span>
          <span className="mt-0.5 font-serif text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            Exigence
          </span>
          <span className="mt-0.5 font-serif text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            Unité
          </span>
        </div>
      )}

      {/* ========== CARTES TEXTE : gris/blanc transparent, texte noir, boutons hover noir ========== */}
      {(() => {
        const index = currentCardIndex;
        const section = SECTIONS[index];
        const progress = cardProgress(index);
        const active = progress > 0;
        if (!active) return null;

        const displayOpacity = Math.max(0.5, Math.min(1, progress * 1.2));

        return (
          <div
            key={`card-${index}`}
            className="fixed left-0 top-0 z-[150] flex h-screen w-screen items-center justify-center"
            style={{
              opacity: displayOpacity,
              transform: index === 0 ? "translateY(25vh)" : `translate3d(0, ${-80 * (1 - Math.min(1, progress * 1.2))}px, 0)`,
              pointerEvents: "none",
            }}
          >
            <div
              className="mx-4 max-w-xl rounded-lg px-10 py-10 text-center backdrop-blur-sm"
              style={{
                background: "rgba(252, 250, 247, 0.62)",
                borderRadius: 8,
                padding: "2.5rem 3rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                pointerEvents: "none",
              }}
            >
              <h2 className="text-2xl font-bold uppercase tracking-wider text-black md:text-3xl">
                {section.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-800">
                {section.subtitle}
              </p>
              {index === 1 && (
                <div className="pointer-events-auto mt-6 flex justify-center gap-4">
                  <Link
                    href="/a-propos/college"
                    scroll={false}
                    className="rounded border-2 border-slate-800 bg-transparent px-6 py-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-black hover:border-black hover:text-white"
                  >
                    Collège
                  </Link>
                  <Link
                    href="/a-propos/lycee"
                    scroll={false}
                    className="rounded border-2 border-slate-800 bg-transparent px-6 py-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-black hover:border-black hover:text-white"
                  >
                    Lycée
                  </Link>
                </div>
              )}
              {(section.linkHref || section.linkLabel) && (
                <div className="pointer-events-auto mt-8 flex flex-wrap justify-center gap-4">
                  <Link
                    href={section.linkHref || "#"}
                    scroll={false}
                    className="rounded-full border-2 border-slate-800 bg-transparent px-6 py-2.5 text-sm font-medium text-slate-800 transition-colors hover:bg-black hover:border-black hover:text-white"
                  >
                    {section.linkLabel}
                  </Link>
                  <Link
                    href="/nouvelles"
                    scroll={false}
                    className="rounded-full border-2 border-slate-800 bg-transparent px-6 py-2.5 text-sm font-medium text-slate-800 transition-colors hover:bg-black hover:border-black hover:text-white"
                  >
                    Nos actualités
                  </Link>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* ========== CHEMIN SINUEUX : s'arrête au pied de la dernière image ========== */}
      <div
        className="pointer-events-none fixed right-[40px] top-0 z-[200] transition-opacity duration-300"
        style={{
          width: 12,
          height: `${N * 100}vh`,
          opacity: scrollProgress > N / totalSections ? 0 : 1,
        }}
      >
        <svg
          viewBox="0 0 120 2400"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <defs>
            <linearGradient id="pathGradGreen" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#14532d" />
              <stop offset="100%" stopColor="#166534" />
            </linearGradient>
            <linearGradient id="pathGradGold" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#B8860B" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>
          </defs>
          <g transform="translate(-4, 0)">
            <path
              d={SINUOUS_PATH_D}
              fill="none"
              stroke="url(#pathGradGold)"
              strokeWidth="3"
              strokeOpacity="0.9"
              strokeLinecap="round"
              style={{
                strokeDasharray: PATH_LENGTH,
                strokeDashoffset: PATH_LENGTH * (1 - scrollProgress),
                willChange: "stroke-dashoffset",
              }}
            />
          </g>
          <path
            d={SINUOUS_PATH_D}
            fill="none"
            stroke="url(#pathGradGreen)"
            strokeWidth="2.5"
            strokeOpacity="0.9"
            strokeLinecap="round"
            style={{
              strokeDasharray: PATH_LENGTH,
              strokeDashoffset: PATH_LENGTH * (1 - scrollProgress),
              willChange: "stroke-dashoffset",
            }}
          />
          <g transform="translate(4, 0)">
            <path
              d={SINUOUS_PATH_D}
              fill="none"
              stroke="url(#pathGradGold)"
              strokeWidth="3"
              strokeOpacity="0.9"
              strokeLinecap="round"
              style={{
                strokeDasharray: PATH_LENGTH,
                strokeDashoffset: PATH_LENGTH * (1 - scrollProgress),
                willChange: "stroke-dashoffset",
              }}
            />
          </g>
          {/* Waypoint dots */}
          {WAYPOINT_POSITIONS.map((t, i) => {
            const dotRevealProgress = (scrollProgress - t * 0.85) / 0.15;
            const opacity = Math.max(0, Math.min(1, dotRevealProgress));
            const y = t * 2400;
            const x = 60;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="5"
                fill="white"
                opacity={opacity}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}
