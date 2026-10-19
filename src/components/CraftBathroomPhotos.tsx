"use client";

import { useEffect, useRef, useState } from "react";
import { GalleryOriginal } from "@/components/GalleryOriginal";
import photos from "@/content/craft-bathroom-photos.json";
import type { Language } from "@/components/useSiteLanguage";

const descriptions = {
  nb: ["Baderom med doble eikeservanter, badekar og fjellutsikt", "Baderom med eikeservant og dusj", "Håndlaget baderomsmøbel i eik med doble servanter"],
  en: ["Bathroom with twin oak basins, bathtub and mountain views", "Bathroom with an oak basin and shower", "Handcrafted oak vanity with twin basins"],
};

export function CraftBathroomPhotos({ language }: { language: Language }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const stage = useRef<HTMLElement>(null);
  const nb = language === "nb";

  useEffect(() => {
    if (!stage.current) return;
    let inView = false;
    const updateVisibility = () => setVisible(inView && document.visibilityState === "visible");
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting && entry.intersectionRatio >= .2;
      updateVisibility();
    }, { threshold: [0, .2] });
    observer.observe(stage.current);
    const reset = () => setActive(0);
    window.addEventListener("pageshow", reset);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      observer.disconnect();
      window.removeEventListener("pageshow", reset);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (!visible || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => setActive(current => (current + 1) % photos.length), 10000);
    return () => window.clearTimeout(timer);
  }, [visible, paused, active]);

  function change(direction: number) {
    setPaused(true);
    setActive(current => (current + direction + photos.length) % photos.length);
  }

  return <section className="retreat-craft-bathroom-photos" ref={stage} aria-label={nb ? "Bilder av baderomsmøblene i eik" : "Oak bathroom furniture photographs"}>
    <figure><GalleryOriginal key={photos[active].id} photo={photos[active]} alt={descriptions[language][active]} nb={nb} /></figure>
    <button className="retreat-cabin-gallery-arrow is-previous" type="button" onClick={() => change(-1)} aria-label={nb ? "Forrige baderomsbilde" : "Previous bathroom photo"}>←</button>
    <button className="retreat-cabin-gallery-arrow is-next" type="button" onClick={() => change(1)} aria-label={nb ? "Neste baderomsbilde" : "Next bathroom photo"}>→</button>
    <div className="retreat-craft-bathroom-controls">
      <span aria-live="polite">{active + 1} / {photos.length}</span>
      <button type="button" onClick={() => setPaused(current => !current)} aria-pressed={paused}>{paused ? (nb ? "▶ Start" : "▶ Play") : (nb ? "Ⅱ Pause" : "Ⅱ Pause")}</button>
    </div>
  </section>;
}
