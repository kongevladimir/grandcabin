"use client";

import Image from "next/image";
import { useState } from "react";
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

export function FloorPlans({ language }: { language: Language }) {
  const [selected, setSelected] = useState("main");
  const floor = floors.find((item) => item.id === selected) ?? floors[1];
  const nb = language === "nb";
  const name = nb ? floor.nb : floor.en;
  const planImage = nb ? floor.image : floor.imageEnglish;

  return <section className="retreat-floor-plans" aria-labelledby="floor-plans-title">
    <div className="retreat-floor-plans-heading">
      <div><p>{nb ? "TRE NIVÅER · ETT FJELLHJEM" : "THREE LEVELS · ONE MOUNTAIN HOME"}</p><h2 id="floor-plans-title">{nb ? "Finn rommet deres." : "Find your space."}</h2></div>
      <p>{nb ? "Se hvordan rommene er fordelt. Velg en etasje for å utforske plantegningen." : "Discover how the rooms connect. Choose a floor to explore its layout."}</p>
    </div>
    <div className="retreat-floor-plans-selector" role="group" aria-label={nb ? "Velg etasje" : "Choose a floor"}>
      {floors.map((item, index) => <button key={item.id} type="button" aria-pressed={selected === item.id} aria-controls="floor-plan-view" onClick={() => setSelected(item.id)}><span>0{index + 1}</span>{nb ? item.nb : item.en}</button>)}
    </div>
    <figure id="floor-plan-view" className="retreat-floor-plan-view">
      <a href={planImage.src} target="_blank" rel="noreferrer" aria-label={nb ? `Åpne hele plantegningen: ${name}` : `Open full floor plan: ${name}`}>
        <Image key={`${floor.id}-${language}`} src={planImage} alt={nb ? `Plantegning – ${name}, Turu Crown` : `Floor plan – ${name}, Turu Crown`} unoptimized sizes="(max-width: 900px) 100vw, 90vw" />
      </a>
      <figcaption><span aria-live="polite">{name}</span><a href={planImage.src} target="_blank" rel="noreferrer">{nb ? "SE HELE PLANTEGNINGEN" : "VIEW FULL FLOOR PLAN"} ↗</a></figcaption>
    </figure>
  </section>;
}
