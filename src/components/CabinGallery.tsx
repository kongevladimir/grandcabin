"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Language } from "@/components/useSiteLanguage";

const photos = [
  { file: "05", nb: "Hovedstuen med store vinduer og fjellutsikt", en: "Main living room with large windows and mountain views" },
  { file: "02", nb: "Stuen med peis og utsikt", en: "Living room with a fireplace and scenic views" },
  { file: "04", nb: "Langbordet foran panoramavinduene", en: "Dining table beside the panoramic windows" },
  { file: "06", nb: "Kjøkken og sittegruppe i hovedetasjen", en: "Kitchen and seating area on the main floor" },
  { file: "01", nb: "Teleskop ved vinduet mot fjellene", en: "Telescope beside a window overlooking the mountains" },
  { file: "08", nb: "Stue og spiseområde sett fra loftet", en: "Living and dining spaces viewed from the loft" },
  { file: "09", nb: "Spiseområdet i underetasjen", en: "Lower-floor dining area" },
  { file: "10", nb: "Badekar og badstue med utsikt", en: "Bathtub and sauna with a view" },
  { file: "11", nb: "Loftstuen med fjellutsikt", en: "Loft living room with mountain views" },
  { file: "12", nb: "Bordtennis og sittegruppe på loftet", en: "Table tennis and seating in the loft" },
  { file: "15", nb: "Biljard og sofagruppe på loftet", en: "Pool table and sofas in the loft" },
  { file: "14", nb: "Bad med håndlaget servant i tre", en: "Bathroom with a handcrafted timber basin" },
  { file: "07", nb: "Detaljer fra kjøkkenøya", en: "Details of the kitchen island" },
  { file: "03", nb: "Garderobe med plass til skiutstyr", en: "Entrance storage for ski equipment" },
];

export function CabinGallery({ language }: { language: Language }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const viewer = useRef<HTMLDialogElement>(null);
  const nb = language === "nb";
  const photo = photos[active];
  const changePhoto = (direction: number) => setActive(current => (current + direction + photos.length) % photos.length);

  useEffect(() => {
    if (paused || interacting || expanded || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive(current => (current + 1) % photos.length), 8000);
    return () => window.clearInterval(timer);
  }, [paused, interacting, expanded, active]);

  useEffect(() => {
    if (!expanded) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [expanded]);

  return (
    <section className="retreat-suite-gallery retreat-cabin-gallery" aria-label={nb ? "Bildegalleri fra hytta" : "Cabin photo gallery"} onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)} onFocusCapture={() => setInteracting(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false); }}>
      <div className="retreat-suite-gallery-heading">
        <p>GRANDCABIN · {nb ? "I BILDER" : "IN PICTURES"}</p>
        <h2>{nb ? "Et nærmere blikk." : "A closer look."}</h2>
        <span>{nb ? "Utforsk rommene, de varme materialene og utsikten som følger dere gjennom hytta." : "Explore the rooms, warm materials and views that accompany you throughout the cabin."}</span>
      </div>
      <div className="retreat-suite-gallery-stage">
        <div className="retreat-cabin-gallery-photo" key={photo.file}><Image src={`/images/cabin-gallery/${photo.file}-view.webp`} alt={photo[language]} fill unoptimized sizes="100vw" /></div>
        <button className="retreat-suite-gallery-open" type="button" onClick={() => { viewer.current?.showModal(); setExpanded(true); }} aria-label={nb ? "Åpne bildet i fullskjerm" : "Open photo full screen"}><span>{nb ? "Se i fullskjerm" : "View full screen"} ↗</span></button>
        <button className="retreat-cabin-gallery-arrow is-previous" type="button" onClick={() => changePhoto(-1)} aria-label={nb ? "Forrige bilde" : "Previous photo"}>←</button>
        <button className="retreat-cabin-gallery-arrow is-next" type="button" onClick={() => changePhoto(1)} aria-label={nb ? "Neste bilde" : "Next photo"}>→</button>
      </div>
      <div className="retreat-cabin-gallery-navigation"><span aria-live="polite">{String(active + 1).padStart(2, "0")} / {photos.length}</span><div>
        <button type="button" onClick={() => setPaused(current => !current)} aria-label={paused ? (nb ? "Start automatisk bildevisning" : "Start slideshow") : (nb ? "Pause automatisk bildevisning" : "Pause slideshow")}>{paused ? "▶" : "Ⅱ"}</button>
      </div></div>
      <div className="retreat-suite-thumbs" aria-label={nb ? "Velg bilde" : "Choose a photo"}>{photos.map((item, index) => <button key={item.file} type="button" className={index === active ? "is-active" : ""} onClick={() => setActive(index)} aria-label={`${nb ? "Vis bilde" : "Show photo"} ${index + 1}: ${item[language]}`} aria-current={index === active ? "true" : undefined}><Image src={`/images/cabin-gallery/${item.file}-thumb.webp`} alt="" fill unoptimized sizes="120px" /></button>)}</div>
      <dialog ref={viewer} className="retreat-suite-viewer retreat-cabin-gallery-viewer" aria-label={nb ? "Hyttebilder i fullskjerm" : "Cabin photos full screen"} onClose={() => setExpanded(false)} onKeyDown={event => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); changePhoto(event.key === "ArrowLeft" ? -1 : 1); }
      }}>
        <header><span>GRANDCABIN</span><button type="button" onClick={() => viewer.current?.close()} aria-label={nb ? "Lukk fullskjerm" : "Close full screen"}>{nb ? "Lukk" : "Close"} ×</button></header>
        <div className="retreat-suite-viewer-image">{expanded && <Image src={`/images/cabin-gallery/${photo.file}-detail.webp`} alt={photo[language]} fill unoptimized sizes="100vw" />}<button className="retreat-cabin-gallery-arrow is-previous" type="button" onClick={() => changePhoto(-1)} aria-label={nb ? "Forrige bilde" : "Previous photo"}>←</button><button className="retreat-cabin-gallery-arrow is-next" type="button" onClick={() => changePhoto(1)} aria-label={nb ? "Neste bilde" : "Next photo"}>→</button></div>
        <footer><span aria-live="polite">{String(active + 1).padStart(2, "0")} / {photos.length}</span></footer>
      </dialog>
    </section>
  );
}
