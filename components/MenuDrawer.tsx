"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { SidebarMenu } from "./SidebarMenu";
import type { SiteContent } from "@/lib/site-content";

const noop = () => () => {};

type ButtonProps = {
  open: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  "data-menu-button": true;
  "aria-expanded": boolean;
  "aria-controls": string;
};

/**
 * Menu latéral commun à l'accueil et aux pages intérieures.
 * S'ouvre au survol du bouton (ou au clic, pour le tactile), se referme quand la souris quitte
 * le bouton et le panneau ; la page derrière est seulement floutée, rien ne se décale.
 * Panneau rendu dans <body> pour échapper aux styles et empilements de la page (accueil .chemin).
 */
export function MenuDrawer({
  items,
  renderButton,
}: {
  items: SiteContent["chrome"]["nav"];
  renderButton: (props: ButtonProps) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  // Portail seulement côté client (le serveur rend le bouton seul).
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const panelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [shownPath, setShownPath] = useState(pathname);
  if (shownPath !== pathname) {
    setShownPath(pathname);
    setOpen(false);
  }
  // Fermé : liens hors tabulation (attribut DOM, React 18 ne gère pas `inert`).
  useEffect(() => {
    if (panelRef.current) panelRef.current.inert = !open;
  }, [open, mounted]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Au survol : reste ouvert tant que la souris est sur le bouton ou sur le panneau (même pendant qu'il glisse),
  // se referme dès qu'elle en sort. Suivi par position, car le voile flouté passe par-dessus le bouton :
  // des mouseleave déclencheraient une boucle ouverture/fermeture (clignotement).
  useEffect(() => {
    if (!open || !matchMedia("(hover: hover)").matches) return;
    const inside = (el: Element | null, x: number, y: number) => {
      const r = el?.getBoundingClientRect();
      return !!r && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const panel = document.getElementById("site-menu");
      const button = document.querySelector("[data-menu-button]");
      if (!inside(panel, e.clientX, e.clientY) && !inside(button, e.clientX, e.clientY)) setOpen(false);
    };
    const onOut = (e: MouseEvent) => !e.relatedTarget && setOpen(false);
    document.addEventListener("pointermove", onMove);
    document.addEventListener("mouseout", onOut);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseout", onOut);
    };
  }, [open]);

  const hoverable = () => matchMedia("(hover: hover)").matches;

  return (
    <>
      {renderButton({
        open,
        onClick: () => setOpen((o) => !o),
        onMouseEnter: () => hoverable() && setOpen(true),
        "data-menu-button": true,
        "aria-expanded": open,
        "aria-controls": "site-menu",
      })}
      {mounted
        ? createPortal(
            <>
              <div
                className={`fixed inset-0 z-[1001] backdrop-blur-md transition-opacity duration-300 ${
                  open ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
                onClick={() => setOpen(false)}
                aria-hidden
              />
              <div
                id="site-menu"
                ref={panelRef}
                className={`fixed left-0 top-0 z-[1002] flex h-full w-[85vw] max-w-[486px] flex-col overflow-y-auto pb-8 pl-4 pr-6 font-sans text-slate-800 shadow-xl transition-transform duration-300 ease-out md:pl-0 md:pr-8 ${
                  open ? "translate-x-0" : "pointer-events-none -translate-x-full"
                }`}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.98)",
                  paddingTop: "max(3rem, calc(env(safe-area-inset-top) + 1rem))",
                }}
              >
                <SidebarMenu items={items} onClose={() => setOpen(false)} currentPath={pathname} />
              </div>
            </>,
            document.body,
          )
        : null}
    </>
  );
}
