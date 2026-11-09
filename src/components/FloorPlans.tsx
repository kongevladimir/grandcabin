"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Language } from "./useSiteLanguage";
import mainFloor from "../../public/images/floor-plan-main.png";
import lowerFloor from "../../public/images/floor-plan-lower.png";
import loftFloor from "../../public/images/floor-plan-loft.png";
import mainFloorEnglish from "../../public/images/floor-plan-main-en.png";
import lowerFloorEnglish from "../../public/images/floor-plan-lower-en.png";
import loftFloorEnglish from "../../public/images/floor-plan-loft-en.png";

const floors = [
  { id: "lower", nb: "Underetasjen", en: "Lower floor", image: lowerFloor, imageEnglish: lowerFloorEnglish },
  { id: "main", nb: "Hovedetasjen", en: "Main floor", image: mainFloor, imageEnglish: mainFloorEnglish },
  { id: "loft", nb: "Loftet", en: "Loft", image: loftFloor, imageEnglish: loftFloorEnglish },
];

function FloorPlanDrawing({ id, image, alt, full = false, zoomed = false }: { id: string; image: StaticImageData; alt: string; full?: boolean; zoomed?: boolean }) {
  // Viewports exclude only unused canvas. Both views reference the unchanged PNG.
  const views = id === "lower" ? ["0 40 1375 785"] : id === "loft" ? ["75 45 1425 885"] : [];
  return <div className={`retreat-floor-plan-drawing${full ? " is-full" : ""}${zoomed ? " is-zoomed" : ""}`} data-floor={id}>
    <Image className="retreat-floor-plan-original" src={image} alt={alt} fill={full || undefined} unoptimized sizes={full ? "100vw" : "(max-width: 900px) 100vw, 90vw"} />
    {views.length > 0 && <div className="retreat-floor-plan-mobile">
      {views.map((view) => <svg key={view} viewBox={view} role="img" aria-label={alt}>
        <image href={image.src} width={image.width} height={image.height} />
      </svg>)}
    </div>}
  </div>;
}

export function FloorPlans({ language }: { language: Language }) {
  const [selected, setSelected] = useState("main");
  const [expanded, setExpanded] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const viewer = useRef<HTMLDialogElement>(null);
  const floor = floors.find((item) => item.id === selected) ?? floors[1];
  const nb = language === "nb";
  const name = nb ? floor.nb : floor.en;
  const planImage = nb ? floor.image : floor.imageEnglish;
  const openViewer = () => {
    setZoomed(false);
    viewer.current?.showModal();
    setExpanded(true);
  };
  const zoomControl = floor.id === "loft" && <button className="retreat-floor-plan-zoom" type="button" aria-pressed={zoomed} onClick={() => setZoomed(!zoomed)}>{nb ? (zoomed ? "Vis hele tegningen" : "Forstørr tegningen") : (zoomed ? "Show whole drawing" : "Enlarge drawing")}</button>;

  useEffect(() => {
    if (!expanded) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [expanded]);

  return <section className="retreat-floor-plans" aria-labelledby="floor-plans-title">
    <div className="retreat-floor-plans-heading">
      <div><p>{nb ? "TRE NIVÅER · ETT FJELLHJEM" : "THREE LEVELS · ONE MOUNTAIN HOME"}</p><h2 id="floor-plans-title">{nb ? "Finn rommet deres." : "Find your space."}</h2></div>
      <p>{nb ? "Se hvordan rommene er fordelt. Velg en etasje for å utforske plantegningen." : "Discover how the rooms connect. Choose a floor to explore its layout."}</p>
    </div>
    <div className="retreat-floor-plans-selector" role="group" aria-label={nb ? "Velg etasje" : "Choose a floor"}>
      {floors.map((item, index) => <button key={item.id} type="button" aria-pressed={selected === item.id} aria-controls="floor-plan-view" onClick={() => { setSelected(item.id); setZoomed(false); }}><span>0{index + 1}</span>{nb ? item.nb : item.en}</button>)}
    </div>
    <figure id="floor-plan-view" className="retreat-floor-plan-view">
      <button className="retreat-floor-plan-open" type="button" onClick={openViewer} aria-haspopup="dialog" aria-label={nb ? `Åpne hele plantegningen: ${name}` : `Open full floor plan: ${name}`}>
        <FloorPlanDrawing key={`${floor.id}-${language}`} id={floor.id} image={planImage} alt={nb ? `Plantegning – ${name}, Turu Crown` : `Floor plan – ${name}, Turu Crown`} zoomed={zoomed} />
      </button>
      <figcaption><span aria-live="polite">{name}</span>{zoomControl}<button type="button" onClick={openViewer} aria-haspopup="dialog">{nb ? "SE HELE PLANTEGNINGEN" : "VIEW FULL FLOOR PLAN"} ↗</button></figcaption>
      {floor.id === "loft" && zoomed && <p className="retreat-floor-plan-swipe">{nb ? "Sveip sidelengs for å se hele tegningen." : "Swipe sideways to see the whole drawing."}</p>}
    </figure>
    <dialog ref={viewer} className="retreat-floor-plan-viewer" aria-labelledby="floor-plan-viewer-title" onClose={() => setExpanded(false)}>
      <header><h2 id="floor-plan-viewer-title">{name}</h2>{zoomControl}<button type="button" onClick={() => viewer.current?.close()}>{nb ? "Lukk og gå tilbake" : "Close and go back"} ×</button></header>
      <div className="retreat-floor-plan-viewer-image">{expanded && <FloorPlanDrawing id={floor.id} image={planImage} alt={nb ? `Hele plantegningen – ${name}, Turu Crown` : `Full floor plan – ${name}, Turu Crown`} full zoomed={zoomed} />}</div>
    </dialog>
  </section>;
}
