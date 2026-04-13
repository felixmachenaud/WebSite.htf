"use client";

import React, { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarMenu } from "./SidebarMenu";

// =============================================================================
// Landing — scroll hijack (wheel + rAF), peek + révélation (tout au scroll)
// Images : public/images/landing/
// =============================================================================

/** Re-render quand le moteur d’images / applyTransforms évolue (refs seules ne déclenchent pas React). */
let landingEngineRevision = 0;
const landingEngineListeners = new Set<() => void>();

function subscribeLandingEngine(cb: () => void) {
  landingEngineListeners.add(cb);
  return () => landingEngineListeners.delete(cb);
}

function getLandingEngineRevision(): number {
  return landingEngineRevision;
}

function publishLandingEngineFrame() {
  landingEngineRevision += 1;
  landingEngineListeners.forEach((fn) => fn());
}

type EngineMode =
  | { mode: "idle" }
  | { mode: "fwd_p1"; curY: number }
  | { mode: "fwd_p2"; curY: number; nextY: number }
  | { mode: "back_p1"; curY: number }
  | { mode: "back_p2"; curY: number; prevY: number };

/** Même translateY que `setLayer` dans applyTransforms — pour savoir si le calque du dessus a quitté l’écran. */
function getLayerTranslateY(
  i: number,
  idx: number,
  m: EngineMode,
  vh: number
): number {
  switch (m.mode) {
    case "idle": {
      if (i < idx) return -vh;
      if (i > idx) return vh;
      return 0;
    }
    case "fwd_p1": {
      if (i < idx) return -vh;
      if (i === idx) return m.curY;
      if (i === idx + 1) return vh;
      return vh;
    }
    case "fwd_p2": {
      if (i < idx) return -vh;
      if (i === idx) return m.curY;
      if (i === idx + 1) return 0;
      return vh;
    }
    case "back_p1": {
      if (i < idx - 1) return -vh;
      if (i === idx - 1) return -vh;
      if (i === idx) return m.curY;
      return vh;
    }
    case "back_p2": {
      if (i < idx - 1) return -vh;
      if (i === idx - 1) return m.prevY;
      if (i === idx) return m.curY;
      return vh;
    }
    default:
      return 0;
  }
}

/**
 * Fraction min. du viewport où la slide *entrante* doit être visible (depuis le bas) avant
 * d’afficher l’encadré — évite l’encadré 2/3 tant que la 1re image occupe encore l’écran.
 * `nextY` baisse quand la révélation progresse ; seuil : nextY <= vh * (1 - cette fraction).
 */
const OVERLAY_INCOMING_MIN_REVEAL_FRAC = 0.5;

/**
 * Slide sortante en `fwd_p2` : garder l’encadré jusqu’au moment où la révélation par le bas
 * occupe la moitié basse du viewport (`nextY <= vh * fraction`). Avant : l’encadré disparaissait
 * dès le début de la phase 2. `nextY` diminue quand la nouvelle image monte depuis le bas.
 */
const OVERLAY_OUTGOING_HIDE_NEXTY_FRAC = 0.5;

/**
 * Visibilité des encadrés (slides 2+).
 *
 * - `fwd_p1` + idx === i : encadré suit le peek (micro-scroll sans clignotement).
 * - `fwd_p2` + idx === i - 1 : encadré entrant quand la révélation est assez avancée.
 * - `fwd_p2` + idx === i (sortant) : encadré visible tant que nextY > seuil (50 % par défaut), puis masqué.
 * - `idle` sur la slide i : encadré figé.
 */
function shouldShowLandingOverlay(i: number, idx: number, m: EngineMode, vh: number, menuOpen: boolean): boolean {
  if (menuOpen) return false;

  if (i === 0) {
    if (m.mode === "idle") return idx === 0;
    if (m.mode === "fwd_p1" && idx === 0) return true;
    if (m.mode === "fwd_p2" && idx === 0) return false;
    if (m.mode === "back_p1" && idx === 1) return true;
    if (m.mode === "back_p2" && idx === 1) return true;
    return false;
  }

  // i >= 1
  if (m.mode === "idle" && idx === i) return true;

  if (m.mode === "fwd_p1" && idx === i) return true;

  if (m.mode === "fwd_p2" && idx === i - 1) {
    const maxNextY = vh * (1 - OVERLAY_INCOMING_MIN_REVEAL_FRAC);
    return m.nextY <= maxNextY;
  }

  if (m.mode === "fwd_p2" && idx === i) {
    return m.nextY > vh * OVERLAY_OUTGOING_HIDE_NEXTY_FRAC;
  }

  if (m.mode === "back_p2" && idx === i) return false;

  if (m.mode === "back_p1" && idx === i) return true;

  return false;
}

const LANDING_IMAGES = [
  "/images/landing/1.jpg",
  "/images/landing/2.JPG",
  "/images/landing/3.JPG",
];

/**
 * Point de fuite object-fit (cover). La 2e image est verrouillée au milieu du cadrage visible ;
 * ajuster un seul pourcentage si le sujet n’est pas au centre du fichier.
 */
const LANDING_IMAGE_OBJECT_POSITION: readonly string[] = [
  "50% 50%",
  "50% 50%",
  "50% 50%",
];

const PHASE1_DAMP = 0.5;
const PHASE2_DAMP = 0.88;
const PHASE1_MAX_FRAC = 0.18;
const DELTA_CAP = 48;
/** Découpage du delta par frame : évite les gros sauts d’un seul tick. */
const SCROLL_MAX_CHUNK = 20;
const SCROLL_SUBSTEP_BUDGET = 44;
/** Zoom très léger : juste assez pour découvrir un peu le bas au peek */
const IMAGE_ZOOM = 1.03;

/** Ombre intérieure sur le bas du calque de l’image remplacée (visible même avec overflow:hidden) */
const SHADOW_REPLACED_INSET = "inset 0 -14px 28px rgba(0,0,0,0.18)";

/**
 * Le chemin SVG couvre une hauteur `n * vh` ; le viewport en montre `vh`.
 * À P = maxJourney, translateY = -(n*vh - vh) pour que la fin du tracé (bas du SVG) coïncide
 * avec le bas du viewport — pas de prolongement fantôme sous la dernière image.
 */

/**
 * Tracé unique (viewBox 0 0 100 300) : quadratiques enchaînées → courbes épurées, sans sommets.
 */
const GOLDEN_PATH_D =
  "M50 0 Q48 38 50 50 Q58 105 54 150 Q46 200 44 250 Q46 274 51 300";

/** Vert identique au logo */
const PATH_GREEN = "#1F7A5A";
/** Progression sur le minimap */
const MINIMAP_PROGRESS_DOT = "#EAB308";
const MINIMAP_PAGE_DOT = "#9ca3af";

/**
 * N&B + luminosité par image (dominante légèrement claire, pas « boue » sombre).
 */
const LANDING_IMAGE_FILTERS: readonly string[] = [
  "grayscale(1) brightness(1.08) contrast(0.92)",
  "grayscale(1) brightness(1.1) contrast(0.9)",
  "grayscale(1) brightness(1.06) contrast(0.93)",
];

const LANDING_OVERLAYS: readonly {
  title: string;
  body: string;
  href: string;
  /** Libellé du bouton = nom de la page cible */
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

const LOGO_PX_FULL = 52;
const LOGO_PX_COMPACT = 32;

/** Hauteur min. du bandeau header : pleine → compacte = −30 % sur la hauteur (largeur inchangée). */
const HEADER_MIN_H_PX = 69;
const HEADER_MIN_H_COMPACT_PX = HEADER_MIN_H_PX * 0.7;

/** Marge px avant bascule p1 → p2 (un peu plus large = transition moins « dure »). */
const SNAP_P1 = 1.35;
/** Seuil relatif à la hauteur viewport pour finir `fwd_p2` / `back_p2` (invariant resize). */
function epsPhase2(vh: number) {
  return Math.max(3, vh * 6e-5);
}
const MAX_WHEEL_STEPS = 512;

function clamp(n: number, a: number, b: number) {
  return Math.min(b, Math.max(a, n));
}

/** Courbe S sur [0,1] pour un fondu moins « mécanique » que le linéaire pur. */
function smoothstep01(t: number) {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
}

/** Perlin-style smoother step (Ken Perlin), plus doux en tête/queue pour le header. */
function smootherstep01(t: number) {
  const x = clamp(t, 0, 1);
  return x * x * x * (x * (x * 6 - 15) + 10);
}

function normalizeWheelDelta(e: WheelEvent): number {
  let raw = e.deltaY;
  if (e.deltaMode === 1) raw *= 16;
  else if (e.deltaMode === 2) raw *= 32;
  return capDelta(raw);
}

function capDelta(raw: number): number {
  const sign = raw > 0 ? 1 : -1;
  return sign * Math.min(Math.abs(raw), DELTA_CAP);
}

/** Progression verticale « voyage » 0 → (n-1)*vh, alignée sur les phases du moteur (hors dérive). */
function computePathProgressPx(vh: number, p1Max: number, idx: number, m: EngineMode): number {
  const span = p1Max + vh;
  if (m.mode === "idle") {
    return idx * vh;
  }
  if (m.mode === "fwd_p1") {
    return idx * vh + (-m.curY * vh) / span;
  }
  if (m.mode === "fwd_p2") {
    return idx * vh + (p1Max * vh) / span + ((vh - m.nextY) * vh) / span;
  }
  if (m.mode === "back_p1") {
    return idx * vh - (m.curY * vh) / span;
  }
  if (m.mode === "back_p2") {
    return idx * vh - (p1Max * vh) / span - ((vh + m.prevY) * vh) / span;
  }
  return idx * vh;
}

// =============================================================================

export function ScrollHijackLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  /** Défilement document : le hero fixe se translate vers le haut comme une page normale. */
  const [scrollState, setScrollState] = useState({ y: 0, vh: 800 });
  const pathname = usePathname();

  const landingEngineRev = useSyncExternalStore(
    subscribeLandingEngine,
    getLandingEngineRevision,
    () => 0
  );
  const layersRef = useRef<(HTMLDivElement | null)[]>([]);
  const revealRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pendingDelta = useRef(0);
  const raf = useRef<number | null>(null);
  const vhRef = useRef(0);
  const p1MaxRef = useRef(0);

  const engineIndex = useRef(0);
  const engineMode = useRef<EngineMode>({ mode: "idle" });
  const lastTouchY = useRef<number | null>(null);
  const headerNavRef = useRef<HTMLElement | null>(null);
  const goldenPathInnerRef = useRef<HTMLDivElement | null>(null);
  const minimapPathRef = useRef<SVGPathElement | null>(null);
  const minimapProgressDotRef = useRef<SVGCircleElement | null>(null);
  /** Même translateY que chaque calque image (pour positionner les encadrés au-dessus du chemin). */
  const layerYsRef = useRef<number[]>([0, 0, 0]);

  useEffect(() => {
    if (pathname !== "/") return;
    document.body.classList.add("landing-scroll-active");
    const syncScroll = () => {
      const y = window.scrollY;
      const vh = Math.max(window.innerHeight, document.documentElement?.clientHeight ?? 0, 1);
      setScrollState({ y, vh });
      if (y > 0.01) {
        document.body.classList.remove("landing-scroll-active");
      } else {
        document.body.classList.add("landing-scroll-active");
      }
    };
    syncScroll();
    window.addEventListener("scroll", syncScroll, { passive: true });
    window.addEventListener("resize", syncScroll);
    return () => {
      window.removeEventListener("scroll", syncScroll);
      window.removeEventListener("resize", syncScroll);
      document.body.classList.remove("landing-scroll-active");
    };
  }, [pathname]);

  function syncMetrics() {
    if (typeof window === "undefined") return;
    const vh = Math.max(
      window.innerHeight,
      document.documentElement?.clientHeight ?? 0,
      1
    );
    vhRef.current = vh;
    p1MaxRef.current = PHASE1_MAX_FRAC * vh;
  }

  /** Pleine largeur ; hauteur du bandeau −30 % quand la 2e image arrive ; blason en fondu (l’emplacement reste réservé → « Hautefeuille » fixe). */
  function syncLandingHeader() {
    const nav = headerNavRef.current;
    if (!nav) return;
    const vh = Math.max(vhRef.current, 1);
    const p1Max = Math.max(p1MaxRef.current, 1);
    const idx = engineIndex.current;
    const m = engineMode.current;

    let minHPx = HEADER_MIN_H_PX;
    let logoOpacity = 1;
    let logoPx = LOGO_PX_FULL;

    if (m.mode === "fwd_p1" && idx === 0) {
      const t = smootherstep01(clamp(-m.curY / p1Max, 0, 1));
      minHPx = HEADER_MIN_H_PX - (HEADER_MIN_H_PX - HEADER_MIN_H_COMPACT_PX) * t;
      logoOpacity = 1 - t;
      logoPx = LOGO_PX_FULL - (LOGO_PX_FULL - LOGO_PX_COMPACT) * t;
    } else if (m.mode === "fwd_p2" && idx === 0) {
      const t = smootherstep01(clamp(1 - m.nextY / vh, 0, 1));
      minHPx = HEADER_MIN_H_PX - (HEADER_MIN_H_PX - HEADER_MIN_H_COMPACT_PX) * t;
      logoOpacity = 1 - t;
      logoPx = LOGO_PX_FULL - (LOGO_PX_FULL - LOGO_PX_COMPACT) * t;
    } else if (m.mode === "back_p1" && idx === 1) {
      const t = smootherstep01(clamp(m.curY / p1Max, 0, 1));
      minHPx = HEADER_MIN_H_COMPACT_PX + (HEADER_MIN_H_PX - HEADER_MIN_H_COMPACT_PX) * t;
      logoOpacity = t;
      logoPx = LOGO_PX_COMPACT + (LOGO_PX_FULL - LOGO_PX_COMPACT) * t;
    } else if (m.mode === "back_p2" && idx === 1) {
      const t = smootherstep01(clamp(1 + m.prevY / vh, 0, 1));
      minHPx = HEADER_MIN_H_COMPACT_PX + (HEADER_MIN_H_PX - HEADER_MIN_H_COMPACT_PX) * t;
      logoOpacity = t;
      logoPx = LOGO_PX_COMPACT + (LOGO_PX_FULL - LOGO_PX_COMPACT) * t;
    } else if (m.mode === "idle") {
      if (idx === 0) {
        minHPx = HEADER_MIN_H_PX;
        logoOpacity = 1;
        logoPx = LOGO_PX_FULL;
      } else {
        minHPx = HEADER_MIN_H_COMPACT_PX;
        logoOpacity = 0;
        logoPx = LOGO_PX_COMPACT;
      }
    } else {
      if (idx === 0) {
        minHPx = HEADER_MIN_H_PX;
        logoOpacity = 1;
        logoPx = LOGO_PX_FULL;
      } else {
        minHPx = HEADER_MIN_H_COMPACT_PX;
        logoOpacity = 0;
        logoPx = LOGO_PX_COMPACT;
      }
    }

    nav.style.minHeight = `${minHPx}px`;

    const logo = nav.querySelector("[data-landing-logo]") as HTMLElement | null;
    if (logo) {
      logo.style.opacity = String(logoOpacity);
      logo.style.pointerEvents = logoOpacity < 0.02 ? "none" : "auto";
      logo.style.width = `${logoPx}px`;
      logo.style.height = `${logoPx}px`;
    }
  }

  function applyTransforms() {
    const vh = Math.max(vhRef.current, 1);
    const p1Max = Math.max(p1MaxRef.current, 1);
    const idx = engineIndex.current;
    const m = engineMode.current;
    const layers = layersRef.current;
    const reveals = revealRefs.current;

    const layerH = vh + p1Max;

    /**
     * Même « grammaire » pour l’image partout : hauteur layerH, cover + centre + scale + origin centre.
     * En mode incoming, seul le masque (reveal) change — évite le flash fwd_p2 → idle.
     */
    /** Même bitmap que idle : bas du calque = bas de l’image (incoming : masque ne couvre que le viewport). */
    function applyImgUnified(img: HTMLImageElement, incomingMask: boolean, layerIndex: number) {
      img.style.position = "absolute";
      img.style.left = "0";
      img.style.right = "0";
      img.style.width = "100%";
      img.style.height = `${layerH}px`;
      img.style.objectFit = "cover";
      img.style.objectPosition = LANDING_IMAGE_OBJECT_POSITION[layerIndex] ?? "50% 50%";
      img.style.transform = `scale(${IMAGE_ZOOM})`;
      img.style.transformOrigin = "center center";
      img.style.bottom = incomingMask ? `${-p1Max}px` : "0";
    }

    function applyRevealInner(i: number, mode: "normal" | "incomingBottom", heightPx: number) {
      const reveal = reveals[i];
      const img = reveal?.querySelector("img") as HTMLImageElement | null;
      if (!reveal) return;

      if (mode === "incomingBottom") {
        const h = Math.max(0, Math.min(heightPx, vh));
        reveal.style.position = "absolute";
        reveal.style.left = "0";
        reveal.style.right = "0";
        reveal.style.top = `${vh - h}px`;
        reveal.style.bottom = "auto";
        reveal.style.width = "100%";
        reveal.style.height = `${h}px`;
        reveal.style.overflow = "hidden";
        const seam = reveal.querySelector(".landing-seam-edge") as HTMLElement | null;
        if (seam) {
          seam.style.display = "block";
          seam.style.top = "0";
        }
        if (img) applyImgUnified(img, true, i);
      } else {
        reveal.style.position = "absolute";
        reveal.style.inset = "0";
        reveal.style.top = "0";
        reveal.style.bottom = "0";
        reveal.style.left = "0";
        reveal.style.right = "0";
        reveal.style.width = "100%";
        reveal.style.height = "100%";
        reveal.style.overflow = "hidden";
        const seam = reveal.querySelector(".landing-seam-edge") as HTMLElement | null;
        if (seam) seam.style.display = "none";
        if (img) applyImgUnified(img, false, i);
      }
    }

    const setLayer = (
      i: number,
      y: number,
      z: number,
      opts?: { tall?: boolean; incomingBottomPx?: number | null; replacedShadow?: boolean }
    ) => {
      const el = layers[i];
      if (!el) return;
      el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
      el.style.zIndex = String(z);
      const tall = opts?.tall !== false;
      el.style.height = tall ? `${layerH}px` : `${vh}px`;
      el.style.clipPath = "";
      el.style.boxShadow = opts?.replacedShadow ? SHADOW_REPLACED_INSET : "";

      const hIn = opts?.incomingBottomPx;
      if (hIn !== undefined && hIn !== null) {
        applyRevealInner(i, "incomingBottom", hIn);
      } else {
        applyRevealInner(i, "normal", 0);
      }
    };

    const baseZ = (i: number) => 10 + i;

    try {
      if (m.mode === "idle") {
        for (let i = 0; i < LANDING_IMAGES.length; i++) {
          let y = 0;
          if (i < idx) y = -vh;
          else if (i > idx) y = vh;
          setLayer(i, y, baseZ(i), { tall: true, incomingBottomPx: null });
        }
        return;
      }

      if (m.mode === "fwd_p1") {
        for (let i = 0; i < LANDING_IMAGES.length; i++) {
          if (i < idx) setLayer(i, -vh, baseZ(i));
          else if (i === idx) setLayer(i, m.curY, baseZ(i), { replacedShadow: true });
          else if (i === idx + 1) setLayer(i, vh, baseZ(i));
          else setLayer(i, vh, baseZ(i));
        }
        return;
      }

      if (m.mode === "fwd_p2") {
        const heightFromBottom = vh - m.nextY;
        for (let i = 0; i < LANDING_IMAGES.length; i++) {
          if (i < idx) setLayer(i, -vh, baseZ(i));
          else if (i === idx) setLayer(i, m.curY, baseZ(i), { replacedShadow: true });
          else if (i === idx + 1)
            setLayer(i, 0, baseZ(i) + 50, { tall: true, incomingBottomPx: heightFromBottom });
          else setLayer(i, vh, baseZ(i));
        }
        return;
      }

      if (m.mode === "back_p1") {
        for (let i = 0; i < LANDING_IMAGES.length; i++) {
          if (i < idx - 1) setLayer(i, -vh, baseZ(i));
          else if (i === idx - 1) setLayer(i, -vh, baseZ(i));
          else if (i === idx) setLayer(i, m.curY, baseZ(i), { replacedShadow: true });
          else setLayer(i, vh, baseZ(i));
        }
        return;
      }

      if (m.mode === "back_p2") {
        for (let i = 0; i < LANDING_IMAGES.length; i++) {
          if (i < idx - 1) setLayer(i, -vh, baseZ(i));
          else if (i === idx - 1) setLayer(i, m.prevY, baseZ(i) + 50);
          else if (i === idx) setLayer(i, m.curY, baseZ(i), { replacedShadow: true });
          else setLayer(i, vh, baseZ(i));
        }
      }
    } finally {
      syncLandingHeader();
      const n = LANDING_IMAGES.length;
      const maxJourney = Math.max(1e-6, (n - 1) * vh);
      const P = clamp(computePathProgressPx(vh, p1Max, idx, m), 0, maxJourney);

      const inner = goldenPathInnerRef.current;
      if (inner) {
        inner.style.height = `${n * vh}px`;
        const scrollRange = Math.max(0, n * vh - vh);
        const track = scrollRange > 0 ? -(P / maxJourney) * scrollRange : 0;
        inner.style.transform = `translate3d(0, ${track.toFixed(2)}px, 0)`;
      }

      const miniPath = minimapPathRef.current;
      const miniDot = minimapProgressDotRef.current;
      if (miniPath && miniDot) {
        const len = miniPath.getTotalLength();
        if (len > 0) {
          const r = maxJourney > 0 ? P / maxJourney : 0;
          const pt = miniPath.getPointAtLength(clamp(r, 0, 1) * len);
          miniDot.setAttribute("cx", pt.x.toFixed(2));
          miniDot.setAttribute("cy", pt.y.toFixed(2));
        }
      }

      const ys: number[] = [];
      for (let li = 0; li < LANDING_IMAGES.length; li++) {
        ys.push(getLayerTranslateY(li, idx, m, vh));
      }
      layerYsRef.current = ys;

      publishLandingEngineFrame();
    }
  }

  function scheduleFrame() {
    if (raf.current != null) return;
    raf.current = requestAnimationFrame(tick);
  }

  /**
   * Réaligne l’état moteur après resize ou erreurs flottantes (évite blocages « à 0,01 px » près d’une transition).
   */
  function sanitizeEngineState() {
    const vh = Math.max(vhRef.current, 1);
    const p1Max = Math.max(p1MaxRef.current, 1);
    const eps2 = epsPhase2(vh);
    let m = engineMode.current;

    if (m.mode === "fwd_p1") {
      if (m.curY > 0) {
        engineMode.current = { mode: "idle" };
        return;
      }
      if (m.curY <= -p1Max + SNAP_P1) {
        engineMode.current = { mode: "fwd_p2", curY: -p1Max, nextY: vh };
        return;
      }
      return;
    }

    if (m.mode === "back_p1") {
      if (m.curY < 0) {
        engineMode.current = { mode: "idle" };
        return;
      }
      if (m.curY >= p1Max - SNAP_P1) {
        engineMode.current = { mode: "back_p2", curY: p1Max, prevY: -vh };
        return;
      }
      return;
    }

    if (m.mode === "fwd_p2") {
      if (m.nextY > vh) {
        engineMode.current = { mode: "fwd_p1", curY: -p1Max };
        return;
      }
      if (m.nextY <= eps2) {
        engineIndex.current += 1;
        engineMode.current = { mode: "idle" };
        return;
      }
      return;
    }

    if (m.mode === "back_p2") {
      if (m.prevY >= -eps2) {
        engineIndex.current -= 1;
        engineMode.current = { mode: "idle" };
        return;
      }
      if (m.prevY < -vh) {
        engineMode.current = { mode: "back_p1", curY: p1Max };
        return;
      }
    }
  }

  function processWheelDelta(delta: number, applyVisuals = true) {
    const vh = Math.max(vhRef.current, 1);
    const p1Max = Math.max(p1MaxRef.current, 1);
    const eps2 = epsPhase2(vh);
    let d = delta;
    let guard = 0;

    while (Math.abs(d) > 0.0001 && guard < MAX_WHEEL_STEPS) {
      guard += 1;
      sanitizeEngineState();
      const idx = engineIndex.current;
      const m = engineMode.current;

      if (m.mode === "idle") {
        if (d > 0 && idx < LANDING_IMAGES.length - 1) {
          engineMode.current = { mode: "fwd_p1", curY: 0 };
          continue;
        }
        if (d < 0 && idx > 0) {
          engineMode.current = { mode: "back_p1", curY: 0 };
          continue;
        }
        break;
      }

      if (m.mode === "fwd_p1") {
        let next = m.curY - d * PHASE1_DAMP;
        if (next > 0) {
          engineMode.current = { mode: "idle" };
          d = 0;
          break;
        }
        next = clamp(next, -p1Max, 0);
        if (next <= -p1Max + SNAP_P1) {
          const consumed = (m.curY + p1Max) / PHASE1_DAMP;
          d -= consumed;
          engineMode.current = { mode: "fwd_p2", curY: -p1Max, nextY: vh };
          continue;
        }
        engineMode.current = { mode: "fwd_p1", curY: next };
        d = 0;
        break;
      }

      if (m.mode === "fwd_p2") {
        let next = m.nextY - d * PHASE2_DAMP;
        if (next > vh) {
          engineMode.current = { mode: "fwd_p1", curY: -p1Max };
          continue;
        }
        if (next <= eps2) {
          const consumed = m.nextY / PHASE2_DAMP;
          d -= consumed;
          engineIndex.current += 1;
          engineMode.current = { mode: "idle" };
          continue;
        }
        next = clamp(next, 0, vh);
        engineMode.current = { mode: "fwd_p2", curY: -p1Max, nextY: next };
        d = 0;
        break;
      }

      if (m.mode === "back_p1") {
        let next = m.curY - d * PHASE1_DAMP;
        if (next < 0) {
          engineMode.current = { mode: "idle" };
          d = 0;
          break;
        }
        next = clamp(next, 0, p1Max);
        if (next >= p1Max - SNAP_P1) {
          const consumed = (m.curY - p1Max) / PHASE1_DAMP;
          d -= consumed;
          engineMode.current = { mode: "back_p2", curY: p1Max, prevY: -vh };
          continue;
        }
        engineMode.current = { mode: "back_p1", curY: next };
        d = 0;
        break;
      }

      if (m.mode === "back_p2") {
        let next = m.prevY - d * PHASE2_DAMP;
        if (next < -vh) {
          engineMode.current = { mode: "back_p1", curY: p1Max };
          continue;
        }
        if (next >= -eps2 || next > 0) {
          const consumed = m.prevY / PHASE2_DAMP;
          d -= consumed;
          engineIndex.current -= 1;
          engineMode.current = { mode: "idle" };
          continue;
        }
        next = clamp(next, -vh, 0);
        engineMode.current = { mode: "back_p2", curY: p1Max, prevY: next };
        d = 0;
        break;
      }

      break;
    }

    sanitizeEngineState();
    if (applyVisuals) {
      applyTransforms();
    }
  }

  function tick() {
    raf.current = null;

    let remaining = pendingDelta.current;
    pendingDelta.current = 0;
    if (Math.abs(remaining) < 1e-8) {
      sanitizeEngineState();
      applyTransforms();
      return;
    }

    for (let step = 0; step < SCROLL_SUBSTEP_BUDGET && Math.abs(remaining) > 1e-8; step++) {
      const chunk =
        Math.abs(remaining) > SCROLL_MAX_CHUNK
          ? Math.sign(remaining) * SCROLL_MAX_CHUNK
          : remaining;
      remaining -= chunk;

      processWheelDelta(chunk, false);
    }

    if (Math.abs(remaining) > 1e-8) {
      pendingDelta.current += remaining;
      scheduleFrame();
    }

    sanitizeEngineState();

    applyTransforms();
  }

  /**
   * Wheel : carrousel **uniquement** quand la page est en haut (`scrollY ≈ 0`). Dès qu’il y a un
   * défilement document (même 2 px après la dernière slide), la molette doit d’abord gérer le
   * scroll natif — sinon on reste « coincé » : impossible de remonter sans aller au bas de page.
   * Zone contenu (`scrollY >= vh`) : toujours natif. Dernière slide + bas : natif pour entrer dans la page.
   */
  function shouldHijackWheel(e: WheelEvent): boolean {
    if (typeof window === "undefined") return true;
    const vh = Math.max(vhRef.current, window.innerHeight, document.documentElement?.clientHeight ?? 0, 1);
    const y = window.scrollY;
    if (y >= vh - 0.5) return false;
    if (y > 1) return false;

    const idx = engineIndex.current;
    const m = engineMode.current;
    if (idx === LANDING_IMAGES.length - 1 && m.mode === "idle" && e.deltaY > 0) {
      return false;
    }
    return true;
  }

  useEffect(() => {
    if (pathname !== "/") return;

    syncMetrics();

    const onWheel = (e: WheelEvent) => {
      if (menuOpen) return;
      if (!shouldHijackWheel(e)) {
        document.body.classList.remove("landing-scroll-active");
        return;
      }
      e.preventDefault();
      pendingDelta.current += normalizeWheelDelta(e);
      scheduleFrame();
    };

    const onResize = () => {
      syncMetrics();
      sanitizeEngineState();
      applyTransforms();
    };

    const onTouchStart = (e: TouchEvent) => {
      if (menuOpen) return;
      lastTouchY.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (menuOpen) return;
      if (typeof window !== "undefined") {
        const vh = Math.max(
          vhRef.current,
          window.innerHeight,
          document.documentElement?.clientHeight ?? 0,
          1
        );
        const sy = window.scrollY;
        if (sy >= vh - 0.5) return;
        if (sy > 1) return;
      }
      if (lastTouchY.current == null) return;
      const y = e.touches[0].clientY;
      const raw = lastTouchY.current - y;
      const idx = engineIndex.current;
      const m = engineMode.current;
      if (
        idx === LANDING_IMAGES.length - 1 &&
        m.mode === "idle" &&
        raw > 0
      ) {
        document.body.classList.remove("landing-scroll-active");
        lastTouchY.current = y;
        return;
      }
      e.preventDefault();
      lastTouchY.current = y;
      pendingDelta.current += capDelta(raw);
      scheduleFrame();
    };

    const onTouchEnd = () => {
      lastTouchY.current = null;
    };

    const onTouchCancel = () => {
      lastTouchY.current = null;
    };

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchCancel);

    return () => {
      window.removeEventListener("wheel", onWheel, { capture: true } as AddEventListenerOptions);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchCancel);
      if (raf.current != null) cancelAnimationFrame(raf.current);
    };
  }, [pathname, menuOpen]);

  useLayoutEffect(() => {
    if (pathname !== "/") return;
    syncMetrics();
    sanitizeEngineState();
    applyTransforms();

    const syncMinimapGray = () => {
      const path = minimapPathRef.current;
      if (!path) return;
      const len = path.getTotalLength();
      if (len < 1) return;
      const ratios = [1 / 6, 0.5, 5 / 6];
      for (let i = 0; i < ratios.length; i++) {
        const pt = path.getPointAtLength(ratios[i] * len);
        const el = document.getElementById(`landing-minimap-gray-${i}`);
        if (el) {
          el.setAttribute("cx", pt.x.toFixed(2));
          el.setAttribute("cy", pt.y.toFixed(2));
        }
      }
    };
    syncMinimapGray();

    const id = requestAnimationFrame(() => {
      syncMetrics();
      sanitizeEngineState();
      applyTransforms();
      syncMinimapGray();
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  const heroShift =
    scrollState.y > 0 ? Math.min(scrollState.y, scrollState.vh) : 0;

  const vhPx = Math.max(vhRef.current, 1);
  const idxNow = engineIndex.current;
  const modeNow = engineMode.current;
  void landingEngineRev;

  return (
    <>
      <div
        className={`fixed inset-0 z-[800] overflow-x-hidden will-change-transform ${
          heroShift > 2 ? "pointer-events-none" : ""
        }`}
        style={{
          transform:
            heroShift > 0 ? `translate3d(0, ${-heroShift}px, 0)` : undefined,
        }}
        aria-hidden={heroShift > scrollState.vh * 0.9}
      >
        <div className="absolute inset-0 overflow-hidden">
          {LANDING_IMAGES.map((src, index) => (
            <div
              key={src}
              ref={(el) => {
                layersRef.current[index] = el;
              }}
              className="landing-slide absolute left-0 right-0 top-0 overflow-hidden will-change-transform [backface-visibility:hidden]"
              style={{ zIndex: 10 + index }}
            >
              <div
                ref={(el) => {
                  revealRefs.current[index] = el;
                }}
                className="absolute inset-0 overflow-hidden"
              >
                <div
                  className="landing-seam-edge pointer-events-none absolute left-0 right-0 z-[8] h-12 bg-gradient-to-b from-black/25 to-transparent"
                  style={{ display: "none" }}
                  aria-hidden
                />
                <img
                  src={src}
                  alt=""
                  className="h-full w-full min-h-full object-cover"
                  style={{
                    objectFit: "cover",
                    objectPosition: LANDING_IMAGE_OBJECT_POSITION[index] ?? "50% 50%",
                    transform: `scale(${IMAGE_ZOOM})`,
                    transformOrigin: "center center",
                    filter: LANDING_IMAGE_FILTERS[index] ?? LANDING_IMAGE_FILTERS[0],
                  }}
                  draggable={false}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Chemin (logo) : sous les encadrés (z-840) */}
        <div
          className="pointer-events-none fixed left-0 right-0 top-0 z-[840] h-[100dvh] min-h-0 overflow-hidden"
          aria-hidden
        >
          <div
            ref={goldenPathInnerRef}
            className="absolute left-0 top-0 m-0 w-full p-0 will-change-transform"
          >
            <svg
              className="m-0 block h-full w-full p-0 align-top"
              viewBox="0 0 100 300"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d={GOLDEN_PATH_D}
                stroke={PATH_GREEN}
                strokeWidth={4.65}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="nonScalingStroke"
                opacity={0.98}
              />
            </svg>
          </div>
        </div>

        {/* Encadrés : même translateY que les calques, au-dessus du tracé vert (z-840) */}
        <div className="pointer-events-none fixed inset-0 z-[856] overflow-hidden">
          {LANDING_IMAGES.map((_, index) => {
            const showOverlay = shouldShowLandingOverlay(index, idxNow, modeNow, vhPx, menuOpen);
            const ov = LANDING_OVERLAYS[index];
            const y = layerYsRef.current[index] ?? 0;
            return (
              <div
                key={`landing-overlay-${index}`}
                className="absolute left-0 right-0 top-0 flex items-center justify-center px-5 py-12 sm:px-8"
                style={{
                  // Hauteur = viewport : le centre du flex = milieu de la zone visible (pas vh+p1Max, qui décalait tout vers le bas)
                  height: `${vhPx}px`,
                  transform: `translate3d(0, ${y.toFixed(2)}px, 0)`,
                  willChange: "transform",
                  zIndex: 20 + index,
                }}
              >
                {showOverlay && ov ? (
                  <div
                    className={`pointer-events-auto w-full max-w-[min(22rem,88vw)] rounded-[14px] border border-white/10 bg-black/65 px-5 py-6 text-center shadow-xl backdrop-blur-[2px] sm:max-w-[min(24rem,40vw)] sm:px-7 sm:py-7 md:max-h-[min(50vh,26rem)]${
                      index === 0
                        ? " landing-overlay-first-in"
                        : index >= 1
                          ? " landing-overlay-from-bottom"
                          : ""
                    }`}
                  >
                    <h3 className="font-sans text-base font-bold uppercase leading-snug tracking-wide text-white sm:text-lg md:text-xl">
                      {ov.title}
                    </h3>
                    <p className="mt-3 font-sans text-[0.8rem] leading-relaxed text-white/95 sm:text-sm">
                      {ov.body}
                    </p>
                    <div className="mx-2 mt-5 border-t border-white/90 sm:mx-4 sm:mt-6" />
                    <Link
                      href={ov.href}
                      className="mt-5 inline-flex min-h-[40px] items-center justify-center rounded-full border border-white/35 bg-black/35 px-6 text-xs font-semibold uppercase tracking-wider text-white transition-colors duration-200 hover:border-white hover:bg-white hover:text-slate-900 sm:mt-6"
                    >
                      {ov.buttonLabel}
                    </Link>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        {/* Minimap : même tracé, plus lisible (taille augmentée) */}
        <div
          className="pointer-events-none fixed right-1 top-1/2 z-[890] w-[4.5rem] -translate-y-1/2 sm:right-4 sm:w-[6.25rem]"
          aria-hidden
        >
          <svg
            className="mx-auto block h-[min(58vh,480px)] w-full min-w-[3.5rem]"
            viewBox="0 0 100 300"
            preserveAspectRatio="xMidYMid meet"
          >
            <path
              ref={minimapPathRef}
              d={GOLDEN_PATH_D}
              fill="none"
              stroke={PATH_GREEN}
              strokeWidth={7.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="nonScalingStroke"
            />
            <circle
              id="landing-minimap-gray-0"
              r={4.5}
              fill={MINIMAP_PAGE_DOT}
              cx={50}
              cy={50}
            />
            <circle
              id="landing-minimap-gray-1"
              r={4.5}
              fill={MINIMAP_PAGE_DOT}
              cx={50}
              cy={150}
            />
            <circle
              id="landing-minimap-gray-2"
              r={4.5}
              fill={MINIMAP_PAGE_DOT}
              cx={50}
              cy={250}
            />
            <circle
              ref={minimapProgressDotRef}
              r={5.5}
              fill={MINIMAP_PROGRESS_DOT}
              cx={50}
              cy={0}
            />
          </svg>
        </div>
      </div>

      <nav
        ref={headerNavRef}
        className="fixed left-0 right-0 top-0 z-[1000] flex min-h-[69px] items-center justify-between px-4 backdrop-blur-sm md:px-7"
        style={{
          backgroundColor: "rgba(209, 250, 229, 0.42)",
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
          <img
            data-landing-logo
            src="/images/logo.png"
            alt=""
            className="shrink-0 object-contain"
            style={{ width: LOGO_PX_FULL, height: LOGO_PX_FULL }}
          />
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
    </>
  );
}
