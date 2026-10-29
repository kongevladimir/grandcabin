"use client";

import Image from "next/image";
import { useState } from "react";
import type { Language } from "./useSiteLanguage";
import mainFloor from "../../public/images/floor-plan-main.png";
import lowerFloor from "../../public/images/floor-plan-lower.png";
import loftFloor from "../../public/images/floor-plan-loft.png";

const floors = [
  { id: "lower", nb: "Underetasjen", en: "Lower floor", image: lowerFloor },
  { id: "main", nb: "Hovedetasjen", en: "Main floor", image: mainFloor },
  { id: "loft", nb: "Loftet", en: "Loft", image: loftFloor },
];

export function FloorPlans({ language }: { language: Language }) {
  const [selected, setSelected] = useState("main");
  const floor = floors.find((item) => item.id === selected) ?? floors[1];
  const nb = language === "nb";
  const name = nb ? floor.nb : floor.en;

  return <section className="retreat-floor-plans" aria-labelledby="floor-plans-title">
    <div className="retreat-floor-plans-heading">
      <div><p>{nb ? "TRE NIVÅER · ETT FJELLHJEM" : "THREE LEVELS · ONE MOUNTAIN HOME"}</p><h2 id="floor-plans-title">{nb ? "Finn rommet deres." : "Find your space."}</h2></div>
      <p>{nb ? "Se hvordan rommene er fordelt. Velg en etasje for å utforske plantegningen." : "Discover how the rooms connect. Choose a floor to explore its layout."}</p>
    </div>
    <div className="retreat-floor-plans-selector" role="group" aria-label={nb ? "Velg etasje" : "Choose a floor"}>
      {floors.map((item, index) => <button key={item.id} type="button" aria-pressed={selected === item.id} aria-controls="floor-plan-view" onClick={() => setSelected(item.id)}><span>0{index + 1}</span>{nb ? item.nb : item.en}</button>)}
    </div>
    <figure id="floor-plan-view" className="retreat-floor-plan-view">
      <a href={floor.image.src} target="_blank" rel="noreferrer" aria-label={nb ? `Åpne hele plantegningen: ${name}` : `Open full floor plan: ${name}`}>
        <Image key={floor.id} src={floor.image} alt={nb ? `Plantegning – ${name}, Turu Crown` : `Floor plan – ${name}, Turu Crown`} unoptimized sizes="(max-width: 900px) 100vw, 90vw" />
      </a>
      <figcaption><span aria-live="polite">{name}</span><a href={floor.image.src} target="_blank" rel="noreferrer">{nb ? "SE HELE PLANTEGNINGEN" : "VIEW FULL FLOOR PLAN"} ↗</a></figcaption>
    </figure>
  </section>;
}
