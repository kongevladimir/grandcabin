"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Language } from "@/components/useSiteLanguage";

const slides = [
  "master-suite",
  "lower-floor-double",
  "loft-double",
  "loft-mountain-bedroom",
  "lower-floor-bunk",
  "handcrafted-bunk",
  "family-bunk-room",
  "twin-bunk-room",
  "loft-alcove",
];

export function BedroomGallery({ language }: { language: Language }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 3000);
    return () => window.clearInterval(timer);
  }, [paused]);

  const changeSlide = (direction: number) => setActive((current) => (current + direction + slides.length) % slides.length);

  return (
    <section className="retreat-suite-gallery" aria-label={language === "nb" ? "Bildegalleri fra soverommene" : "Bedroom photo gallery"} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}>
      <div className="retreat-suite-gallery-heading">
        <p>SUITES · GRANDCABIN</p>
        <h2>{language === "nb" ? "Rom for å falle til ro" : "Rooms to return to"}</h2>
        <span>{language === "nb" ? "Se soverommene, fra luftige dobbeltsuiter til lune rom for familien." : "Explore the bedrooms, from airy double suites to inviting rooms for families."}</span>
      </div>
      <div className="retreat-suite-gallery-stage">
        {slides.map((slide, index) => <div key={slide} className={`retreat-suite-slide${index === active ? " is-active" : ""}`} aria-hidden={index !== active}><Image src={`/images/suites-updated/${slide}.webp`} alt={index === active ? (language === "nb" ? `Soverom i Grandcabin, bilde ${index + 1}` : `Grandcabin bedroom, photo ${index + 1}`) : ""} fill unoptimized sizes="100vw" priority={index === 0} /></div>)}
        <div className="retreat-suite-gallery-controls"><span>{String(active + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span><div><button type="button" onClick={() => changeSlide(-1)} aria-label={language === "nb" ? "Forrige bilde" : "Previous photo"}>←</button><button type="button" onClick={() => changeSlide(1)} aria-label={language === "nb" ? "Neste bilde" : "Next photo"}>→</button></div></div>
      </div>
      <div className="retreat-suite-thumbs" aria-label={language === "nb" ? "Velg bilde" : "Choose a photo"}>{slides.map((slide, index) => <button key={slide} type="button" className={index === active ? "is-active" : ""} onClick={() => setActive(index)} aria-label={`${language === "nb" ? "Vis bilde" : "Show photo"} ${index + 1}`} aria-current={index === active ? "true" : undefined}><Image src={`/images/suites-updated/${slide}-thumb.webp`} alt="" fill unoptimized sizes="(max-width: 700px) 24vw, 10vw" /></button>)}</div>
    </section>
  );
}
