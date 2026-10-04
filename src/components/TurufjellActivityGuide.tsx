"use client";

import Image from "next/image";
import Link from "next/link";
import { RetreatBookingFooter, RetreatNav } from "@/components/ConceptPages";
import { useSiteLanguage } from "@/components/useSiteLanguage";

type ActivityCopy = { title: string; text: string };
type GuideItem = { nb: ActivityCopy; en: ActivityCopy };
type GuideSection = {
  id: string;
  number: string;
  image: string;
  nb: { label: string; title: string; intro: string; imageAlt: string };
  en: { label: string; title: string; intro: string; imageAlt: string };
  items: GuideItem[];
};

const sections: GuideSection[] = [
  {
    id: "winter",
    number: "01",
    image: "/images/ski.avif",
    nb: { label: "VINTER", title: "Når fjellet kler seg i snø", intro: "Fra rolige spor til store fjelldager – finn vinteren som passer dere.", imageAlt: "Skidag på Turufjell" },
    en: { label: "WINTER", title: "When the mountains turn white", intro: "From gentle trails to full days on the mountain, make winter your own.", imageAlt: "Skiing at Turufjell" },
    items: [
      { nb: { title: "Langrenn", text: "Preparerte spor starter ved hytta. Velg lune rundløyper eller følg den 125 km lange Eventyrløypa videre gjennom Hallingdal." }, en: { title: "Cross-country skiing", text: "Groomed trails begin by the cabin. Choose sheltered loops or follow the 125 km Eventyrløypa farther into Hallingdal." } },
      { nb: { title: "Alpint", text: "Turufjell Skisenter har bakker for både nybegynnere og erfarne skiløpere, med barneområde, grønne løyper og mer utfordrende nedfarter." }, en: { title: "Alpine skiing", text: "Turufjell Ski Centre has slopes for beginners and experienced skiers, from the children’s area and green runs to more challenging descents." } },
      { nb: { title: "Toppturer på ski", text: "Kristnatten, Skarsvarden og fjellene omkring byr på muligheter for toppturer og vid utsikt. Velg tur etter erfaring og forhold." }, en: { title: "Ski touring", text: "Kristnatten, Skarsvarden and nearby peaks offer ski touring and sweeping views. Choose a route that suits your experience and the conditions." } },
      { nb: { title: "Skøyter ved Istjern", text: "Istjern aktivitetsområde har en skøytebane som gir familien en annen måte å nyte vinterdagen på." }, en: { title: "Skating at Istjern", text: "The skating area at Istjern offers families another way to enjoy a winter day outside." } },
      { nb: { title: "Svømmehall i Flå", text: "Når dere vil bytte snø med varmt vann, finnes det en svømmehall ved Flå skole i vintersesongen." }, en: { title: "Swimming in Flå", text: "When you want a break from the snow, Flå school has an indoor pool during the winter season." } },
    ],
  },
  {
    id: "summer",
    number: "02",
    image: "/images/cycling.avif",
    nb: { label: "SOMMER", title: "Lange dager ute", intro: "Stier, vann og små utflukter gir plass til både aktivitet og rolige pauser.", imageAlt: "Sykling på Turufjell" },
    en: { label: "SUMMER", title: "Long days outdoors", intro: "Trails, lakes and easy excursions leave room for adventure and quiet pauses.", imageAlt: "Cycling at Turufjell" },
    items: [
      { nb: { title: "Fjellturer", text: "Fra korte turer med barna til lengre toppturer finner dere merkede stier og utsiktspunkter på Turufjell og i Flå." }, en: { title: "Mountain walks", text: "From short walks with children to longer summit days, discover marked paths and viewpoints around Turufjell and Flå." } },
      { nb: { title: "Sykkel & pumptrack", text: "Prøv pumptracken, ferdighetsparken og flytstien, eller finn roligere runder i fjellterrenget." }, en: { title: "Cycling & pump track", text: "Try the pump track, skills park and flow trail, or choose a gentler ride through the mountain landscape." } },
      { nb: { title: "Fiske", text: "Mer enn 30 fiskevann rundt Turufjell gir mange steder å slå seg ned med fiskestangen og nyte stillheten." }, en: { title: "Fishing", text: "More than 30 lakes around Turufjell offer places to cast a line and enjoy the quiet." } },
      { nb: { title: "Bading & Øvre Vesleåtjern", text: "Ta en dukkert på varme dager, eller besøk Øvre Vesleåtjern for bading, en rolig båttur og pause ved vannet." }, en: { title: "Swimming & Øvre Vesleåtjern", text: "Take a dip on warm days, or visit Øvre Vesleåtjern for swimming, a gentle boat trip and time by the water." } },
      { nb: { title: "Rundløyper", text: "Korte merkede runder fra baseområdet passer for en gåtur, løpetur eller sykkeltur i eget tempo." }, en: { title: "Loop trails", text: "Short marked loops from the base area are ideal for walking, running or cycling at your own pace." } },
      { nb: { title: "Bjørneparken", text: "En familieutflukt til Bjørneparken i Flå byr på dyremøter og opplevelser for store og små." }, en: { title: "Bjørneparken", text: "A family trip to Bjørneparken in Flå brings animal encounters and experiences for all ages." } },
      { nb: { title: "Båttur på Krøderen", text: "Opplev landskapet fra vannet med en av de planlagte turene på Krøderen." }, en: { title: "Boat trips on Krøderen", text: "See the landscape from the water on one of the scheduled trips across Krøderen." } },
      { nb: { title: "Golf på Norefjell", text: "For en dag på banen ligger Norefjell Golfklubb ved Noresund, rundt 40 minutter fra Turufjell." }, en: { title: "Golf at Norefjell", text: "For a day on the course, Norefjell Golf Club near Noresund is around 40 minutes from Turufjell." } },
    ],
  },
  {
    id: "all-year",
    number: "03",
    image: "/images/turufjell-hero-original.avif",
    nb: { label: "HELE ÅRET", title: "Mer å oppdage", intro: "Også mellom turene finnes det gode grunner til å utforske nærområdet.", imageAlt: "Fjellandskap ved Turufjell" },
    en: { label: "ALL YEAR", title: "More to discover", intro: "Between mountain days, there is still plenty to explore nearby.", imageAlt: "Mountain landscape at Turufjell" },
    items: [
      { nb: { title: "Istjern & natursti", text: "Ved Istjern kan familien leke og samles, mens naturstien mot Slåttemyr inviterer til små oppdagelser underveis." }, en: { title: "Istjern & nature trail", text: "Gather and play at Istjern, then follow the nature trail towards Slåttemyr for small discoveries along the way." } },
      { nb: { title: "Mikrogym", text: "Det lille treningsrommet ved Istjern kan bookes når dere vil ha en aktiv pause innendørs." }, en: { title: "Micro gym", text: "The small gym by Istjern can be booked when you want an active break indoors." } },
      { nb: { title: "Jakt- og Fiskesenteret", text: "I Flå tilbyr Jakt- og Fiskesenteret kurs og opplevelser innen jakt, fiske, skyting og mat." }, en: { title: "Hunting & Fishing Centre", text: "In Flå, the Hunting and Fishing Centre offers courses and experiences in hunting, fishing, shooting and food." } },
      { nb: { title: "Langedrag", text: "Legg inn en dagstur til Langedrag for dyremøter og aktiviteter i fjellandskapet." }, en: { title: "Langedrag", text: "Plan a day trip to Langedrag for animal encounters and activities in the mountain landscape." } },
      { nb: { title: "Flå, mat & handel", text: "Flå sentrum har kjøpesenter, spisesteder og butikker. Turufjell Kafé er et hyggelig stopp rett på fjellet." }, en: { title: "Flå, food & shopping", text: "Flå village has a shopping centre, places to eat and useful shops. Turufjell Café is a welcoming stop on the mountain." } },
    ],
  },
];

export function TurufjellActivityGuide() {
  const [language, setLanguage] = useSiteLanguage();

  return (
    <div className="concept-page retreat-page retreat-detail-page">
      <RetreatNav language={language} setLanguage={setLanguage} page="turufjell" />
      <main className="retreat-activity-guide">
        <header className="retreat-activity-guide-intro">
          <Link href="/concepts/retreat/turufjell">← {language === "nb" ? "TILBAKE TIL OPPLEVELSER" : "BACK TO EXPERIENCES"}</Link>
          <p>GRANDCABIN · TURUFJELL</p>
          <h1>{language === "nb" ? "Opplevelser, hele året" : "Experiences, all year"}</h1>
          <span>{language === "nb" ? "Vinter og sommer samlet på ett sted. Finn aktivitetene som passer deres opphold, fra ski og fjellturer til fiske, sykkel og opplevelser i Flå." : "Winter and summer together in one place. Find experiences that suit your stay, from skiing and mountain walks to fishing, cycling and days out in Flå."}</span>
          <nav aria-label={language === "nb" ? "Aktiviteter etter årstid" : "Activities by season"}>
            {sections.map((section) => <a key={section.id} href={`#${section.id}`}>{section[language].label} ↓</a>)}
          </nav>
        </header>
        {sections.map((section) => {
          const copy = section[language];
          return (
            <section className="retreat-activity-guide-section" id={section.id} key={section.id}>
              <div className="retreat-activity-guide-photo"><Image src={section.image} alt={copy.imageAlt} fill sizes="100vw" /></div>
              <header><p>{section.number} · {copy.label}</p><h2>{copy.title}</h2><span>{copy.intro}</span></header>
              <div className="retreat-activity-guide-grid">
                {section.items.map((item, index) => <article key={item.nb.title}><small>{(index + 1).toString().padStart(2, "0")}</small><h3>{item[language].title}</h3><p>{item[language].text}</p></article>)}
              </div>
            </section>
          );
        })}
        <aside className="retreat-activity-guide-sources">
          <p>{language === "nb" ? "Aktivitetene og åpningstidene kan variere med årstid og forhold. Se oppdatert informasjon hos Turufjell." : "Activities and opening hours can vary by season and conditions. Check Turufjell for current information."}</p>
          <div><a href="https://www.turufjell.no/vinter-aktiviteter/" target="_blank" rel="noreferrer">{language === "nb" ? "VINTER HOS TURUFJELL" : "WINTER AT TURUFJELL"} ↗</a><a href="https://www.turufjell.no/sommer-aktiviteter/" target="_blank" rel="noreferrer">{language === "nb" ? "SOMMER HOS TURUFJELL" : "SUMMER AT TURUFJELL"} ↗</a></div>
        </aside>
      </main>
      <RetreatBookingFooter language={language} />
    </div>
  );
}
