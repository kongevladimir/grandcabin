"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import photos from "@/content/organized-gallery.json";
import type { Language } from "@/components/useSiteLanguage";

type Category = "all" | "cabin" | "living" | "bedrooms";

export function OrganizedGallery({ language }: { language: Language }) {
  const nb = language === "nb";
  const [category, setCategory] = useState<Category>("all");
  const [active, setActive] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const visible = category === "all" ? photos : photos.filter(photo => photo.category === category);
  const selected = active === null ? null : visible[active];
  const filters: { id: Category; label: string }[] = [
    { id: "all", label: nb ? "Alle" : "All" },
    { id: "cabin", label: nb ? "Hytta" : "Cabin" },
    { id: "living", label: nb ? "Oppholdsrom" : "Living space" },
    { id: "bedrooms", label: nb ? "Soverom" : "Bedrooms" },
  ];
  const labels: Record<string, string> = { cabin: nb ? "Hytta utvendig" : "Cabin exterior", living: nb ? "Oppholdsrom" : "Living space", bedrooms: nb ? "Soverom" : "Bedrooms" };
  const change = (direction: number) => setActive(current => current === null ? null : (current + direction + visible.length) % visible.length);

  useEffect(() => {
    if (active === null) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [active]);

  return (
    <main className="retreat-organized-gallery">
      <section className="retreat-organized-gallery-hero">
        <Image src={photos[0].preview} alt={nb ? "Grandcabin under nordlyset" : "Grandcabin beneath the northern lights"} fill unoptimized priority sizes="100vw" />
        <h1>{nb ? "Grandcabin i bilder" : "Grandcabin Gallery"}</h1>
      </section>
      <div className="retreat-organized-gallery-filters" role="group" aria-label={nb ? "Velg bildekategori" : "Choose photo category"}>
        {filters.map(filter => <button key={filter.id} type="button" aria-pressed={category === filter.id} onClick={() => setCategory(filter.id)}>{filter.label}</button>)}
      </div>
      <p className="retreat-organized-gallery-count" aria-live="polite">{visible.length} {nb ? "bilder" : "photos"}</p>
      <div className="retreat-organized-gallery-grid">
        {visible.map((photo, index) => <button key={photo.id} type="button" onClick={() => { setActive(index); dialog.current?.showModal(); }} aria-label={`${nb ? "Åpne bilde" : "Open photo"} ${index + 1}: ${labels[photo.category]}`}>
          <Image src={photo.preview} alt={`${labels[photo.category]} · ${index + 1}`} width={photo.width} height={photo.height} unoptimized sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw" />
          <span aria-hidden="true">↗</span>
        </button>)}
      </div>
      <dialog ref={dialog} className="retreat-organized-gallery-viewer" aria-label={nb ? "Bilde i originalkvalitet" : "Original-quality photo"} onClose={() => setActive(null)} onKeyDown={event => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); change(event.key === "ArrowLeft" ? -1 : 1); }
      }}>
        <header><span>GRANDCABIN</span><button type="button" onClick={() => dialog.current?.close()} aria-label={nb ? "Lukk bildet" : "Close photo"}>{nb ? "Lukk" : "Close"} ×</button></header>
        <div className="retreat-organized-gallery-full-photo">
          {selected && <Image key={selected.id} src={selected.original} alt={labels[selected.category]} fill unoptimized sizes="100vw" />}
        </div>
        <footer>
          <button type="button" onClick={() => change(-1)} aria-label={nb ? "Forrige bilde" : "Previous photo"}>←</button>
          <span aria-live="polite">{active === null ? "" : `${active + 1} / ${visible.length}`}</span>
          <button type="button" onClick={() => change(1)} aria-label={nb ? "Neste bilde" : "Next photo"}>→</button>
        </footer>
      </dialog>
    </main>
  );
}
