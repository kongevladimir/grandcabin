"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Language } from "@/components/useSiteLanguage";

type Review = { name: string; date: string; score: string; text: string };

const finnSummaries: Record<Language, Record<string, string>> = {
  nb: {
    "Elin Haga": "24 gjester opplevde hytta som romslig og gjennomført, med høy kvalitet, lite lyd mellom rommene og flotte bad og badstuer. Enkel ankomst med god veiledning. De kommer gjerne tilbake.",
    "Ina Vilde L": "En gruppe på 24 fremhever en flott, godt utstyrt hytte med spiseplass til alle i underetasjen. Fire oppvaskmaskiner kom godt med. Hemsen var perfekt for barna, men har ikke dør.",
    "Pål Berg": "En flott hytte som passet godt til 17 kollegaer. Gjestene fremhever god oppfølging, tydelige instruksjoner og raske svar på spørsmål før oppholdet.",
    "Anadine": "En fantastisk helg i en stor og vakker hytte, med imponerende utsikt og et stilfullt, gjennomført interiør.",
    "Anne W.": "16 familiemedlemmer feiret en vellykket jul sammen. De fremhever en lekker hytte, behagelig gulvvarme og svært god kommunikasjon med en hyggelig og hjelpsom vert. Anbefales varmt.",
    "Alex Iqbal": "Helt utrolig! Anbefales til alle, 10/10!",
  },
  en: {
    "Elin Haga": "A group of 24 found the cabin spacious and thoughtfully finished, with high quality, little sound between rooms and beautiful bathrooms and saunas. Clear arrival guidance. They would gladly return.",
    "Ina Vilde L": "A group of 24 praised the well-equipped cabin and downstairs dining space for everyone. Four dishwashers proved useful. The loft was perfect for the children, although it has no door.",
    "Pål Berg": "A beautiful cabin that suited 17 colleagues well. Guests praised attentive follow-up, clear instructions and quick answers to their questions before the stay.",
    "Anadine": "A wonderful weekend in a large, beautiful cabin, with remarkable views and a stylish, carefully considered interior.",
    "Anne W.": "Sixteen family members enjoyed Christmas together. They praised the beautiful cabin, comfortable underfloor heating and excellent communication with a friendly, helpful host. Warmly recommended.",
    "Alex Iqbal": "Absolutely incredible! Recommended to everyone, 10/10!",
  },
};

// Verified in the public Airbnb review dialog on 8 October 2026.
// Concise paraphrases rather than verbatim quotations; all six received 5 stars.
const airbnbReviews = [
  { name: "Hans Martin", month: "MARS 2024", enMonth: "MARCH 2024", nb: "En moderne og vakker hytte som passet gruppen godt, med en svært imøtekommende vert.", en: "A beautiful modern cabin suited their group well, with a welcoming host ensuring a comfortable stay." },
  { name: "Anette", month: "SEPTEMBER 2024", enMonth: "SEPTEMBER 2024", nb: "Romslig, rent og velutstyrt, med god kommunikasjon og en hyggelig, hjelpsom vert.", en: "Spacious, clean and well equipped, with good communication and a friendly, helpful host." },
  { name: "Ole Christian", month: "MARS 2024", enMonth: "MARCH 2024", nb: "En flott hytte med skimuligheter rett utenfor og en svært imøtekommende vert.", en: "A wonderful cabin with skiing right outside and a very accommodating host." },
  { name: "Beate", month: "MARS 2024", enMonth: "MARCH 2024", nb: "Stor, ren og velutstyrt hytte. Verten var hyggelig og svarte alltid raskt.", en: "A spacious, clean cabin with good facilities. The friendly host always responded quickly." },
  { name: "Pia", month: "FEBRUAR 2024", enMonth: "FEBRUARY 2024", nb: "En flott hytte i vakre omgivelser, godt egnet for barnefamilier, med en hjelpsom vert.", en: "A lovely cabin in beautiful surroundings, ideal for families with children, with a helpful host." },
  { name: "Kristian", month: "OKTOBER 2026", enMonth: "OCTOBER 2026", nb: "Et svært hyggelig opphold, med enkel adkomst og god plass.", en: "An enjoyable stay, with easy access and plenty of space." },
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
    <ReviewRow language={language} reviews={reviews.map(review => ({ ...review, text: finnSummaries[language][review.name] ?? review.text }))} source="FINN.no" href={finnUrl} rating="10/10" />
    <ReviewRow language={language} reviews={airbnbReviews.map(review => ({ name: review.name, date: nb ? review.month : review.enMonth, score: "5", text: review[language] }))} source="Airbnb" href="https://www.airbnb.com/rooms/1062840379999066478" rating="5/5" />
    <div className="retreat-reviews-source"><span>{nb ? "Utvalgte gjestevurderinger, gjengitt som korte sammendrag. Airbnb-vurderingene gjelder annonsen for underetasjen." : "Selected guest reviews, presented as brief summaries. Airbnb reviews relate to the lower-floor listing."}</span></div>
  </section>;
}
