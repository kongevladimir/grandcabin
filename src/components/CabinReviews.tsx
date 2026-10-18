"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Language } from "@/components/useSiteLanguage";

type Review = { name: string; date: string; score: string; text: string };

// Norwegian wording supplied by the owner in text/screenshots on 19 October 2026.
// Preserve the displayed wording, including emojis; English is a full translation.
const airbnbReviews = [
  { name: "Hans Martin", month: "MARS 2024", enMonth: "MARCH 2024", nb: "Vi hadde en fantastisk opplevelse på denne vakre og moderne hytta som var perfekt egnet for vår store gjeng. Verten var ekstremt imøtekommende og gjorde alt for å sikre at oppholdet vårt var komfortabelt og hyggelig. Anbefales!", en: "We had a fantastic experience at this beautiful and modern cabin, which was perfectly suited to our large group. The host was extremely welcoming and did everything to ensure that our stay was comfortable and pleasant. Recommended!" },
  { name: "Anette", month: "SEPTEMBER 2024", enMonth: "SEPTEMBER 2024", nb: "Stor og fin hytte, ren og ryddig. Alt var som det skulle være, og vi hadde god kommunikasjon med Katerina hele tiden. Hun var vennlig og hjelpsom. Hytta har det som trengs for at en stor gruppe mennesker kan samles, og vi kunne lage mye god mat. I det fine været gikk vi en tur til en dam og badet, 1,5 km gange fra hytta🌸☀️", en: "A large and lovely cabin, clean and tidy. Everything was as it should be, and we had good communication with Katerina throughout. She was friendly and helpful. The cabin has everything needed for a large group of people to gather, and we were able to cook lots of good food. In the lovely weather, we walked to a pond and went swimming, a 1.5 km walk from the cabin🌸☀️" },
  { name: "Ole Christian", month: "MARS 2024", enMonth: "MARCH 2024", nb: "Vi hadde en fantastisk opplevelse på denne flotte hytten. Beliggenheten var også perfekt - med skimuligheter rett utenfor. Katerina var veldig imøtekommende.\n\nAnbefales!", en: "We had a fantastic experience at this wonderful cabin. The location was also perfect - with skiing right outside. Katerina was very welcoming.\n\nRecommended!" },
  { name: "Beate", month: "MARS 2024", enMonth: "MARCH 2024", nb: "Fantastisk fin hytte! Stort, fint, rent og gode fasiliteter. Verten var veldig hyggelig og svarte alltid raskt 😊 Kan virkelig anbefales!", en: "An absolutely lovely cabin! Spacious, beautiful, clean and with good facilities. The host was very friendly and always replied quickly 😊 Highly recommended!" },
  { name: "Pia", month: "FEBRUAR 2024", enMonth: "FEBRUARY 2024", nb: "Fantastisk hytte på et nydelig sted! Perfekt for barnefamilier. Veldig hyggelig og behjelpelig vert! 😊", en: "A fantastic cabin in a beautiful location! Perfect for families with children. A very friendly and helpful host! 😊" },
  { name: "Kristian", month: "OKTOBER 2026", enMonth: "OCTOBER 2026", nb: "Vi likte oppholdet vårt godt hos Katerina. Enkel tilgang og rikelig med plass.", en: "We enjoyed our stay with Katerina. Easy access and plenty of space." },
];

function ReviewRow({ language, reviews, source, href, rating }: { language: Language; reviews: Review[]; source: string; href: string; rating: string }) {
  const rail = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const nb = language === "nb";
  const move = useCallback((direction: number) => {
    const element = rail.current;
    if (!element) return;
    const end = element.scrollWidth - element.clientWidth;
    const target = direction < 0 && element.scrollLeft < 4 ? end : direction > 0 && element.scrollLeft >= end - 4 ? 0 : element.scrollLeft + direction * (element.clientWidth + 16);
    element.scrollTo({ left: target, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }, []);
  useEffect(() => {
    if (paused || interacting || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => move(-1), 12000);
    return () => window.clearInterval(timer);
  }, [paused, interacting, move]);

  return <div className="retreat-review-row" onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)} onFocusCapture={() => setInteracting(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false); }}>
    <header className="retreat-review-row-heading"><div><a href={href} target="_blank" rel="noreferrer">{source} ↗</a><span>{rating}</span></div><div className="retreat-reviews-navigation">
      <button type="button" onClick={() => setPaused(current => !current)} aria-label={`${paused ? (nb ? "Start automatisk visning" : "Start automatic scrolling") : (nb ? "Pause automatisk visning" : "Pause automatic scrolling")} · ${source}`}>{paused ? "▶" : "Ⅱ"}</button>
      <button type="button" onClick={() => move(-1)} aria-label={`${nb ? "Forrige tre vurderinger" : "Previous three reviews"} · ${source}`}>←</button>
      <button type="button" onClick={() => move(1)} aria-label={`${nb ? "Neste tre vurderinger" : "Next three reviews"} · ${source}`}>→</button>
    </div></header>
    <div ref={rail} className="retreat-reviews-grid" tabIndex={0} aria-label={`${nb ? "Bla gjennom vurderinger fra" : "Browse reviews from"} ${source}`} onKeyDown={event => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); move(event.key === "ArrowLeft" ? -1 : 1); }
    }}>{reviews.map(review => <article key={`${review.name}-${review.date}`}><div><span>{review.score}{source === "Airbnb" ? "/5 ★" : "/10"}</span><small>{review.date}</small></div><p>{review.text}</p><strong>{review.name}</strong></article>)}</div>
  </div>;
}

export function CabinReviews({ language, reviews, finnUrl }: { language: Language; reviews: Review[]; finnUrl: string }) {
  const nb = language === "nb";
  return <section className="retreat-reviews retreat-reviews-carousel" aria-label={nb ? "Gjestevurderinger fra FINN og Airbnb" : "Guest reviews from FINN and Airbnb"}>
    <header className="retreat-reviews-head"><div><p>{nb ? "GJESTENES OPPLEVELSER" : "GUEST EXPERIENCES"}</p><h2>{nb ? "Dette trekker gjestene frem." : "What guests highlight."}</h2></div></header>
    <ReviewRow language={language} reviews={reviews} source="FINN.no" href={finnUrl} rating="10/10" />
    <ReviewRow language={language} reviews={airbnbReviews.map(review => ({ name: review.name, date: nb ? review.month : review.enMonth, score: "5", text: review[language] }))} source="Airbnb" href="https://www.airbnb.com/rooms/1062840379999066478" rating="5/5" />
    <div className="retreat-reviews-source"><span>{nb ? "Norsk ordlyd fra FINN og Airbnb. Engelske tekster er oversatt." : "FINN and Airbnb reviews translated from the supplied Norwegian wording."}</span></div>
  </section>;
}
