"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
  const [expanded, setExpanded] = useState(false);
  const viewer = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (paused || expanded || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 8000);
    return () => window.clearInterval(timer);
  }, [paused, expanded]);

  useEffect(() => {
    if (!expanded) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [expanded]);

  const changeSlide = (direction: number) => setActive((current) => (current + direction + slides.length) % slides.length);
  const openViewer = () => {
    viewer.current?.showModal();
    setExpanded(true);
  };
  const photoAlt = language === "nb" ? `Soverom i Grandcabin, bilde ${active + 1}` : `Grandcabin bedroom, photo ${active + 1}`;
  const previousLabel = language === "nb" ? "Forrige bilde" : "Previous photo";
  const nextLabel = language === "nb" ? "Neste bilde" : "Next photo";

  return (
    <section className="retreat-suite-gallery" aria-label={language === "nb" ? "Bildegalleri fra soverommene" : "Bedroom photo gallery"} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}>
      <div className="retreat-suite-gallery-heading">
        <p>SUITES · GRANDCABIN</p>
        <h2>{language === "nb" ? "Rom for å falle til ro" : "Rooms to return to"}</h2>
        <span>{language === "nb" ? "Se soverommene, fra luftige dobbeltsuiter til lune rom for familien." : "Explore the bedrooms, from airy double suites to inviting rooms for families."}</span>
      </div>
      <div className="retreat-suite-gallery-stage">
        {slides.map((slide, index) => <div key={slide} className={`retreat-suite-slide${index === active ? " is-active" : ""}`} aria-hidden={index !== active}><Image src={`/images/suites-updated/${slide}.webp`} alt={index === active ? (language === "nb" ? `Soverom i Grandcabin, bilde ${index + 1}` : `Grandcabin bedroom, photo ${index + 1}`) : ""} fill unoptimized sizes="100vw" priority={index === 0} /></div>)}
        <button className="retreat-suite-gallery-open" type="button" onClick={openViewer} aria-label={language === "nb" ? "Åpne bildet i fullskjerm" : "Open photo full screen"}><span>{language === "nb" ? "Se i fullskjerm" : "View full screen"} ↗</span></button>
        <div className="retreat-suite-gallery-controls"><span>{String(active + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span><div><button type="button" onClick={() => changeSlide(-1)} aria-label={language === "nb" ? "Forrige bilde" : "Previous photo"}>←</button><button type="button" onClick={() => changeSlide(1)} aria-label={language === "nb" ? "Neste bilde" : "Next photo"}>→</button></div></div>
      </div>
      <div className="retreat-suite-thumbs" aria-label={language === "nb" ? "Velg bilde" : "Choose a photo"}>{slides.map((slide, index) => <button key={slide} type="button" className={index === active ? "is-active" : ""} onClick={() => setActive(index)} aria-label={`${language === "nb" ? "Vis bilde" : "Show photo"} ${index + 1}`} aria-current={index === active ? "true" : undefined}><Image src={`/images/suites-updated/${slide}-thumb.webp`} alt="" fill unoptimized sizes="(max-width: 700px) 24vw, 10vw" /></button>)}</div>
      <dialog ref={viewer} className="retreat-suite-viewer" aria-label={language === "nb" ? "Soveromsbilder i fullskjerm" : "Bedroom photos full screen"} onClose={() => setExpanded(false)} onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          changeSlide(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}>
        <header><span>SUITES · GRANDCABIN</span><button type="button" onClick={() => viewer.current?.close()} aria-label={language === "nb" ? "Lukk fullskjerm" : "Close full screen"}>{language === "nb" ? "Lukk" : "Close"} ×</button></header>
        <div className="retreat-suite-viewer-image">{expanded && <Image src={`/images/suites-updated/${slides[active]}.webp`} alt={photoAlt} fill unoptimized sizes="100vw" />}</div>
        <footer><button type="button" onClick={() => changeSlide(-1)} aria-label={previousLabel}>←</button><span aria-live="polite">{String(active + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span><button type="button" onClick={() => changeSlide(1)} aria-label={nextLabel}>→</button></footer>
      </dialog>
    </section>
  );
}
