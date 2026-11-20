"use client";

/**
 * Accueil « chemin » : réplique du prototype validé par l'école
 * (hautefeuille-chemin-prototype.dimitri-dugasdebauda.chatgpt.site), mise en page, textes,
 * ruban doré et visuels. Seul écart voulu : les photos défilent de bas en haut
 * (la suivante monte du bas, la courante glisse vers le haut), comme sur l'accueil précédent.
 * Styles : app/chemin.css (CSS du prototype isolée sous .chemin).
 */

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { ActualiteItem, SiteContent } from "@/lib/site-content";
import { MenuDrawer } from "./MenuDrawer";
import "@/app/chemin.css";

const IMG = "/images/accueil";
const ANCHORS = ["depart", "confiance", "apprendre", "engager"];
const VALEURS = "/a-propos";

type Props = {
  news: ActualiteItem[];
  footer: SiteContent["footer"];
  chrome: SiteContent["chrome"];
};

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

function curve(p: number) {
  const phase = p * Math.PI * 3;
  const a = 880 + Math.sin(phase) * 300;
  const b = 800 + Math.sin(phase + 1.8) * 330;
  const c = 800 + Math.sin(phase + 3) * 300;
  return `M ${a} -200 C ${a + 60} 200 ${b} 360 ${b} 550 S ${c} 950 ${c} 1200`;
}

function xAtY(path: SVGPathElement, y: number) {
  let lo = 0;
  let hi = path.getTotalLength();
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (path.getPointAtLength(mid).y < y) lo = mid;
    else hi = mid;
  }
  return path.getPointAtLength((lo + hi) / 2).x;
}

function formatDate(iso?: string) {
  if (!iso) return null;
  const d = new Date(`${iso}T12:00:00`);
  return Number.isNaN(d.getTime()) ? null : d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export function CheminLanding({ news, footer, chrome }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    const $ = <T extends Element>(sel: string) => root.querySelector(sel) as T;
    const journey = $<HTMLElement>("#journey");
    const scenes = [...root.querySelectorAll<HTMLElement>(".scene")];
    const dots = [...root.querySelectorAll<HTMLAnchorElement>(".waypoints a")];
    const header = $<HTMLElement>("#header");
    const ribbon = $<SVGPathElement>("#ribbon-wide");
    const line = $<SVGPathElement>("#ribbon-line");
    const newsEl = $<HTMLElement>("#actualites");
    const endEl = $<HTMLElement>("#horizon");
    const endingRoute = $<SVGPathElement>(".sendoff-route path");
    const newsRoute = $<SVGPathElement>(".news-route path");
    const counter = $<HTMLElement>("#counter");
    const next = $<HTMLAnchorElement>("#next");
    const bar = $<HTMLElement>("#progress-bar");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let queued = false;
    let active = -1;
    let bounds = { newsTop: 0, newsHeight: 1, endTop: 0, endHeight: 1 };
    const extent = [0.4, 0, 0];

    function measureRoute() {
      const scroll = window.scrollY;
      bounds = {
        newsTop: newsEl.getBoundingClientRect().top + scroll,
        newsHeight: newsEl.offsetHeight,
        endTop: endEl.getBoundingClientRect().top + scroll,
        endHeight: endEl.offsetHeight,
      };
      const saved = line.getAttribute("d")!;
      line.setAttribute("d", curve(1));
      const start = xAtY(line, 1000);
      line.setAttribute("d", saved);
      const finish = xAtY(endingRoute, 0);
      const h = newsEl.offsetHeight;
      const w = newsEl.offsetWidth;
      const sx = (start * w) / 1440;
      const ex = (finish * w) / 1440;
      const edge = w * 0.975;
      newsRoute.ownerSVGElement!.setAttribute("viewBox", `0 0 ${w} ${h}`);
      newsRoute.setAttribute("d", `M ${sx} 0 C ${sx} 22 ${edge} 15 ${edge} 60 L ${edge} ${h - 65} C ${edge} ${h - 20} ${ex} ${h - 28} ${ex} ${h}`);
    }

    function revealRoute(p: number) {
      const reach = window.scrollY + innerHeight * 0.85;
      if (!reduced.matches) {
        extent[0] = Math.max(extent[0], 0.4 + 0.6 * p);
        extent[1] = Math.max(extent[1], clamp((reach - bounds.newsTop) / bounds.newsHeight, 0, 1));
        extent[2] = Math.max(extent[2], clamp((reach - bounds.endTop) / bounds.endHeight, 0, 1));
      }
      [line, newsRoute, endingRoute].forEach((path, i) => {
        path.style.strokeDasharray = "1";
        path.style.strokeDashoffset = String(reduced.matches ? 0 : 1 - extent[i]);
      });
    }

    function render() {
      queued = false;
      const range = Math.max(1, journey.offsetHeight - innerHeight);
      const travel = clamp(-journey.getBoundingClientRect().top / range, 0, 1) * 3.1;
      const pos = travel < 0.45 ? travel / 0.45 : travel + 0.55;
      const p = pos / 3.65;
      const index = Math.min(3, Math.floor(pos));
      const fraction = pos - index;
      // Bas vers haut : sur la fin de chaque étape, la photo suivante monte du bas.
      const t = reduced.matches || index >= 3 ? 0 : clamp((fraction - 0.55) / 0.45, 0, 1);
      const shown = t > 0.5 ? index + 1 : index;
      scenes.forEach((scene, i) => {
        const clip = i <= index ? 0 : i === index + 1 ? (1 - t) * 100 : 100;
        scene.style.clipPath = clip ? `inset(${clip.toFixed(2)}% 0 0 0)` : "";
        scene.style.transform = i === index && t > 0 ? `translate3d(0, ${(-t * 18).toFixed(2)}%, 0)` : "";
      });
      if (shown !== active) {
        active = shown;
        scenes.forEach((scene, i) => {
          scene.classList.toggle("active", i === shown);
          scene.inert = i !== shown;
          scene.setAttribute("aria-hidden", String(i !== shown));
        });
        dots.forEach((dot, i) => {
          dot.classList.toggle("selected", i === shown);
          if (i === shown) dot.setAttribute("aria-current", "step");
          else dot.removeAttribute("aria-current");
        });
        counter.textContent = `0${shown + 1} / 04`;
        next.href = shown < 3 ? `#${ANCHORS[shown + 1]}` : "#actualites";
      }
      const d = curve(reduced.matches ? 1 : p);
      ribbon.setAttribute("d", d);
      line.setAttribute("d", d);
      if (!reduced.matches) {
        const zoom = index === 1 ? 1 + clamp(fraction, 0, 1) * 0.012 : 1.04 + clamp(fraction, 0, 1) * 0.045;
        scenes[index].querySelector("img")!.style.transform = `scale(${zoom}) translateY(${index === 1 ? 0 : -fraction * 12}px)`;
      }
      revealRoute(p);
      bar.style.width = `${p * 100}%`;
      header.classList.toggle("solid", newsEl.getBoundingClientRect().top < 100);
    }

    const schedule = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(render);
      }
    };
    const remeasure = () => {
      measureRoute();
      schedule();
    };

    function navigate(id: string) {
      const index = ANCHORS.indexOf(id);
      const behavior: ScrollBehavior = reduced.matches ? "instant" : "smooth";
      if (index >= 0) {
        const range = journey.offsetHeight - innerHeight;
        window.scrollTo({ top: journey.offsetTop + (index === 0 ? 0 : ((index + 0.12 - 0.55) / 3.1) * range), behavior });
      } else {
        root.querySelector(`#${CSS.escape(id)}`)?.scrollIntoView({ behavior });
      }
    }

    function onClick(e: MouseEvent) {
      const target = e.target as Element;
      const anchor = target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (anchor && root.contains(anchor)) {
        e.preventDefault();
        const id = anchor.getAttribute("href")!.slice(1);
        history.replaceState(null, "", `#${id}`);
        navigate(id);
      }
    }

    measureRoute();
    render();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", remeasure);
    addEventListener("load", remeasure);
    reduced.addEventListener("change", schedule);
    document.addEventListener("click", onClick);
    if (location.hash) requestAnimationFrame(() => navigate(location.hash.slice(1)));

    // Apparitions : titre d'ouverture, puis texte de l'envoi quand il entre à l'écran.
    let observer: IntersectionObserver | undefined;
    const ending = $<HTMLElement>(".sendoff-copy");
    if (!reduced.matches) {
      $<HTMLElement>(".copy.hero").classList.add("opening-reveal");
      if ("IntersectionObserver" in window) {
        ending.classList.add("reveal-waiting");
        observer = new IntersectionObserver(
          (entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
              ending.classList.remove("reveal-waiting");
              ending.classList.add("reveal-visible");
              observer?.disconnect();
            }
          },
          { threshold: 0.2 },
        );
        observer.observe(ending);
      }
    }

    return () => {
      removeEventListener("scroll", schedule);
      removeEventListener("resize", remeasure);
      removeEventListener("load", remeasure);
      reduced.removeEventListener("change", schedule);
      document.removeEventListener("click", onClick);
      observer?.disconnect();
    };
  }, []);

  return (
    <div ref={rootRef} className="chemin">
      <a className="skip" href="#actualites">
        Passer le parcours animé
      </a>
      <header id="header">
        <MenuDrawer
          items={chrome.nav}
          renderButton={({ open, ...props }) => (
            <button id="menu-toggle" type="button" {...props} data-open={open}>
              <span className="burger">☰</span> <span>MENU</span>
            </button>
          )}
        />
        <a href="#depart" className="brand">
          {chrome.brand}
          <small className="brand-description">COLLÈGE &amp; LYCÉE DE GARÇONS</small>
        </a>
        <Link href="/a-propos/inscriptions" className="admissions">
          Inscriptions <span aria-hidden="true">↗</span>
        </Link>
      </header>
      <main>
        <div id="journey">
          <div className="stage">
            <div className="scenes">
              <section className="scene active" data-scene="0" aria-label="Un chemin pour grandir">
                <img src={`${IMG}/apprendre-hautefeuille.jpg`} alt="Des élèves de Hautefeuille attentifs et au travail en classe" fetchPriority="high" />
                <div className="shade" />
                <div className="copy hero">
                  <h1>
                    <span>Prendre confiance,</span>
                    <span>trouver sa place,</span>
                    <em>agir dans le monde.</em>
                  </h1>
                  <a className="text-link" href="#confiance">
                    Découvrir notre projet <span>↓</span>
                  </a>
                </div>
              </section>
              <section className="scene" data-scene="1" aria-label="Prendre confiance">
                <img src={`${IMG}/prendre-confiance.jpg`} alt="Un élève lève la main pendant un cours d'allemand, la professeure face à la classe" />
                <div className="shade" />
                <div className="copy right">
                  <span className="eyebrow">01 — PRENDRE CONFIANCE</span>
                  <h2 className="chapter-title">
                    <span className="title-line">Être encouragé,</span>
                    <br />
                    <span className="title-line">oser progresser,</span>
                    <br />
                    <em className="title-line">donner le meilleur de soi.</em>
                  </h2>
                  <Link className="text-link" href={`${VALEURS}#sens`}>
                    En savoir plus <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </section>
              <section className="scene" data-scene="2" aria-label="Se dépasser">
                <img src={`${IMG}/classe-hautefeuille.jpg`} alt="Un élève de Hautefeuille lisant en classe, entouré de ses camarades" />
                <div className="shade" />
                <div className="copy">
                  <span className="eyebrow">02 — SE DÉPASSER</span>
                  <h2 className="chapter-title">
                    <span className="title-line">Essayer, recommencer, persévérer,</span>
                    <br />
                    <em className="title-line">
                      et voir ses efforts <span className="keep-phrase">porter du fruit.</span>
                    </em>
                  </h2>
                  <Link className="text-link" href={`${VALEURS}#excellence`}>
                    En savoir plus <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </section>
              <section className="scene" data-scene="3" aria-label="S'engager">
                <img src={`${IMG}/engager-hautefeuille.jpg`} alt="Deux élèves de Hautefeuille travaillant ensemble au tableau" />
                <div className="shade" />
                <div className="copy right">
                  <span className="eyebrow">03 — S’ENGAGER</span>
                  <h2 className="chapter-title">
                    <span className="title-line">Prendre des responsabilités,</span>
                    <br />
                    <em>
                      <span className="title-line">et apprendre à</span>
                      <br />
                      <span className="title-line keep-phrase">servir les autres.</span>
                    </em>
                  </h2>
                  <Link className="text-link" href={`${VALEURS}#ouverture`}>
                    En savoir plus <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </section>
            </div>
            <svg className="ribbon" viewBox="0 0 1440 1000" preserveAspectRatio="none" aria-hidden="true">
              <path id="ribbon-wide" d="M1000 -200 C1100 300 700 600 800 1200" />
              <path id="ribbon-line" pathLength={1} d="M1000 -200 C1100 300 700 600 800 1200" />
            </svg>
            <nav className="waypoints" aria-label="Étapes du parcours">
              <div className="rail" />
              {[
                ["depart", "Départ", "Le premier pas"],
                ["confiance", "Prendre confiance", "Prendre confiance"],
                ["apprendre", "Se dépasser", "Se dépasser"],
                ["engager", "S’engager", "S’engager"],
                ["actualites", "La vie à Hautefeuille", "La vie à Hautefeuille"],
                ["horizon", "L’envoi", "L’envoi"],
              ].map(([id, aria, label], i) => (
                <a key={id} className={i === 0 ? "selected" : undefined} href={`#${id}`} aria-label={aria}>
                  <span>{label}</span>
                  <i />
                </a>
              ))}
            </nav>
            <div className="stage-bottom">
              <span />
              <a href="#confiance" id="next">
                FAITES DÉFILER <span>↓</span>
              </a>
              <span id="counter">01 / 04</span>
            </div>
            <div className="progress">
              <div id="progress-bar" />
            </div>
          </div>
        </div>

        <section id="actualites" className="news">
          <div className="news-heading">
            <h2>La vie à Hautefeuille</h2>
            <Link className="dark-link" href="/a-propos/information-generale#actualites">
              Toutes les actualités <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="news-grid">
            {news.map((item) => (
              <article key={item.id} className="news-card">
                {item.imageUrl ? (
                  <div className="news-photo">
                    <img src={item.imageUrl} alt="" loading="lazy" width={640} height={430} />
                  </div>
                ) : null}
                {formatDate(item.date) ? <time dateTime={item.date}>{formatDate(item.date)}</time> : null}
                <h3>{item.titre}</h3>
                <Link className="dark-link" href={`/nouvelles/${item.slug}`}>
                  Lire l’article <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
          <svg className="news-route" viewBox="0 0 1440 1000" preserveAspectRatio="none" aria-hidden="true">
            <path pathLength={1} d="M758 0 C758 25 1404 15 1404 60 L1404 935 C1404 980 880 972 880 1000" />
          </svg>
        </section>

        <section id="horizon" className="sendoff" aria-label="L’envoi">
          <img src={`${IMG}/mont-saint-michel.jpg`} alt="Des élèves marchant dans la baie vers le Mont-Saint-Michel, avec le groupe au loin" />
          <div className="sendoff-shade" />
          <svg className="sendoff-route" viewBox="0 0 1440 1000" preserveAspectRatio="none" aria-hidden="true">
            <path pathLength={1} d="M850 -100 C1000 200 690 430 820 700 S880 1050 900 1200" />
          </svg>
          <div className="sendoff-copy">
            <h2>
              <span className="sendoff-part">
                <span className="title-line">À chacun de choisir</span>
                <br />
                <span className="title-line">sa route,</span>
              </span>
              <em className="sendoff-part">
                <span className="title-line">et d&apos;en faire un</span>
                <br />
                <span className="title-line keep-phrase">chemin de service.</span>
              </em>
            </h2>
            <p>
              <strong>Chercher le Vrai, contempler le Beau, choisir le Bien : apprendre à être libre pour mieux se donner.</strong>
            </p>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-brand">
          <a className="brand" href="#depart">
            {chrome.brand}
            <small>COLLÈGE &amp; LYCÉE POUR GARÇONS</small>
          </a>
          <p>Courbevoie et Bois-Colombes</p>
        </div>
        <address>
          <strong>Collège Hautefeuille</strong>
          <br />
          {footer.addressCourbevoie.split("\n").map((l) => (
            <span key={l}>
              {l}
              <br />
            </span>
          ))}
        </address>
        <address>
          <strong>Lycée Hautefeuille</strong>
          <br />
          {footer.addressBoisColombes.split("\n").map((l) => (
            <span key={l}>
              {l}
              <br />
            </span>
          ))}
        </address>
        <div className="footer-practical">
          <a href={footer.phoneHref}>{footer.phone}</a>
          <a href={`mailto:${footer.email}`}>{footer.email}</a>
          <a href={chrome.ecoleDirecteHref} target="_blank" rel="noopener noreferrer">
            ÉcoleDirecte
          </a>
          <Link href="/contact">{chrome.contactLabel}</Link>
        </div>
        <div className="footer-bottom">
          <Link href="/mentions-legales">{footer.legalMentions}</Link>
          <Link href="/confidentialite">{footer.legalPrivacy}</Link>
          <a href="#depart">Retour au début ↑</a>
        </div>
      </footer>
    </div>
  );
}
