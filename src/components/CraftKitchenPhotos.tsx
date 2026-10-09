"use client";

import Image from "next/image";
import { useState } from "react";
import type { Language } from "@/components/useSiteLanguage";
import mainKitchen from "../../public/images/craft-kitchen-main.webp";
import lowerKitchen from "../../public/images/craft-kitchen-lower.webp";
import wineCoolerKitchen from "../../public/images/craft-kitchen-wine-cooler.jpg";

export function CraftKitchenPhotos({ language }: { language: Language }) {
  const [active, setActive] = useState(0);
  const nb = language === "nb";
  const photos = [
    { src: mainKitchen, alt: nb ? "Kjøkkenet i hovedetasjen med kjøkkenøy og sittegruppe" : "Main-floor kitchen with island and seating area" },
    { src: lowerKitchen, alt: nb ? "Kjøkkenet i underetasjen med kjøkkenøy og langbord" : "Lower-floor kitchen with island and long dining table" },
    { src: wineCoolerKitchen, alt: nb ? "Detalj av kjøkkenet med vinskap og naturlig treverk" : "Kitchen detail with wine cooler and natural timber" },
  ];
  const changePhoto = (direction: number) => setActive(current => (current + direction + photos.length) % photos.length);

  return (
    <section className="retreat-craft-kitchen-photos" aria-label={nb ? "Bilder av begge kjøkkenene" : "Photographs of both kitchens"}>
      <figure><Image src={photos[active].src} alt={photos[active].alt} fill unoptimized sizes="(max-width: 900px) 100vw, 50vw" /></figure>
      <button type="button" className="is-previous" onClick={() => changePhoto(-1)} aria-label={nb ? "Forrige kjøkkenbilde" : "Previous kitchen photo"}>←</button>
      <button type="button" className="is-next" onClick={() => changePhoto(1)} aria-label={nb ? "Neste kjøkkenbilde" : "Next kitchen photo"}>→</button>
      <span aria-live="polite">{active + 1} / {photos.length}</span>
    </section>
  );
}
