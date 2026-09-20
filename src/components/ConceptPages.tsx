"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { finnUrl } from "@/content/site";

type Language = "nb" | "en";
type Concept = "themes" | "destination" | "editorial" | "groups" | "panorama" | "chalet" | "retreat";

const image = (name: string) => `/images/${name}.avif`;
const finnGalleryPhotos = Array.from({ length: 75 }, (_, index) => {
  const number = index + 1;
  const extension = [2, 58, 65].includes(number) ? "png" : "jpg";
  return `/images/finn-gallery/${number.toString().padStart(2, "0")}.${extension}`;
});

function LanguageToggle({ language, setLanguage, light = false }: {
  language: Language;
  setLanguage: (language: Language) => void;
  light?: boolean;
}) {
  return (
    <div className={`concept-language${light ? " concept-language-light" : ""}`} aria-label="Language">
      <button className={language === "nb" ? "active" : ""} onClick={() => setLanguage("nb")}>NO</button>
      <span>/</span>
      <button className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>EN</button>
    </div>
  );
}

function ConceptSwitcher({ active }: { active: Concept }) {
  const items: { id: Concept; href: string; label: string }[] = [
    { id: "themes", href: "/", label: "Temaer" },
    { id: "destination", href: "/concepts/destination", label: "1 · Destinasjon" },
    { id: "editorial", href: "/concepts/editorial", label: "2 · Arkitektur" },
    { id: "groups", href: "/concepts/groups", label: "3 · Store grupper" },
    { id: "panorama", href: "/concepts/panorama", label: "4 · Panorama" },
    { id: "chalet", href: "/concepts/chalet", label: "5 · Alpine suites" },
    { id: "retreat", href: "/concepts/retreat", label: "6 · Mountain retreat" },
  ];

  return (
    <nav className="concept-switcher" aria-label="Velg sidestruktur">
      <span className="concept-switcher-label">Sidestruktur</span>
      <div>{items.map((item) => <Link key={item.id} className={active === item.id ? "active" : ""} href={item.href}>{item.label}</Link>)}</div>
    </nav>
  );
}

export function DestinationConcept() {
  const [language, setLanguage] = useState<Language>("nb");
  const t = language === "nb" ? {
    nav: ["Opplevelser", "Hytta", "Reisen hit"], eyebrow: "Turufjell · Flå · Hallingdal",
    title: "Hele fjellet.\nEtt sted å samles.", lead: "En stor og lun base for 29 gjester, med natur og aktiviteter rett utenfor døren.", cta: "Se tilgjengelighet på FINN",
    seasonTitle: "Velg deres fjellopplevelse", seasonLead: "Turufjell skifter karakter med årstidene. Hytta gir dere samme gode utgangspunkt hele året.",
    winter: "Vinter på Turufjell", winterText: "Ski inn og ut, langrennsløyper og lune pauser rundt peisen.", summer: "Sommer i høyden", summerText: "Sykkel, fjellturer, fiskevann og lange kvelder på terrassen.",
    baseLabel: "DERES BASE", baseTitle: "Stor nok for alle.\nLun nok til å føles nær.", baseText: "360 kvadratmeter gir rom for både fellesskap og rolige øyeblikk. To kjøkken, to badstuer og store oppholdsrom gjør det enkelt å samle familie, venner eller kollegaer.",
    nearby: "Alt dere trenger, i nærheten", distances: [["200 m", "til langrennsløyper"], ["400 m", "til alpinbakken"], ["15 min", "til Flå sentrum"], ["< 2 timer", "fra Oslo"]],
    routeLabel: "EN ENKEL REISE TIL FJELLET", routeTitle: "Nær nok for en helg.\nStor nok for en anledning.", routeText: "Kjør fra Oslo på under to timer, eller ta toget til Flå og taxi videre. Ved hytta er det god plass til parkering.",
    close: "Klar for Turufjell?", closeText: "Se ledige datoer, priser og vilkår i vår FINN-annonse.",
  } : {
    nav: ["Experiences", "The cabin", "Getting here"], eyebrow: "Turufjell · Flå · Hallingdal",
    title: "The whole mountain.\nOne place to gather.", lead: "A generous, welcoming base for 29 guests, with nature and activities just outside.", cta: "Check availability on FINN",
    seasonTitle: "Choose your mountain experience", seasonLead: "Turufjell changes with the seasons. The cabin is your comfortable base all year round.",
    winter: "Winter at Turufjell", winterText: "Ski-in access, cross-country trails and warm evenings by the fire.", summer: "Summer in the mountains", summerText: "Cycling, mountain walks, fishing lakes and long evenings on the terrace.",
    baseLabel: "YOUR BASE", baseTitle: "Room for everyone.\nWarm enough to feel close.", baseText: "With 360 square metres, there is room to come together and room to unwind. Two kitchens, two saunas and generous living spaces make group stays easy.",
    nearby: "Everything close at hand", distances: [["200 m", "to cross-country trails"], ["400 m", "to the ski slope"], ["15 min", "to Flå village"], ["< 2 hours", "from Oslo"]],
    routeLabel: "AN EASY JOURNEY TO THE MOUNTAINS", routeTitle: "Close enough for a weekend.\nSpecial enough for an occasion.", routeText: "Drive from Oslo in under two hours, or take the train to Flå and continue by taxi. There is plenty of parking at the cabin.",
    close: "Ready for Turufjell?", closeText: "See available dates, prices and terms in our FINN listing.",
  };

  return (
    <div className="concept-page destination-page">
      <header className="dest-header"><Link className="dest-brand" href="/">GRANDCABIN <span>TURUFJELL</span></Link><nav>{t.nav.map((item, index) => <a key={item} href={`#dest-${index}`}>{item}</a>)}</nav><LanguageToggle language={language} setLanguage={setLanguage} /></header>
      <main>
        <section className="dest-hero">
          <Image src={image("exterior")} alt="Grandcabin at Turufjell" fill priority sizes="100vw" /><div className="dest-hero-shade" />
          <div className="dest-hero-copy"><p>{t.eyebrow}</p><h1>{t.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h1><div className="dest-hero-bottom"><p>{t.lead}</p><a href={finnUrl} target="_blank" rel="noreferrer">{t.cta} <span>↗</span></a></div></div>
          <div className="dest-capacity"><strong>29</strong><span>{language === "nb" ? "gjester" : "guests"}</span></div>
        </section>
        <section className="dest-season" id="dest-0"><div className="dest-section-heading"><h2>{t.seasonTitle}</h2><p>{t.seasonLead}</p></div><div className="dest-season-grid">
          <article><Image src={image("ski")} alt="Skiing at Turufjell" fill sizes="(max-width: 800px) 100vw, 50vw" /><div><span>01</span><h3>{t.winter}</h3><p>{t.winterText}</p></div></article>
          <article><Image src={image("cycling")} alt="Cycling at Turufjell" fill sizes="(max-width: 800px) 100vw, 50vw" /><div><span>02</span><h3>{t.summer}</h3><p>{t.summerText}</p></div></article>
        </div></section>
        <section className="dest-base" id="dest-1"><div className="dest-base-image"><Image src={image("living")} alt="Living room" fill sizes="(max-width: 800px) 100vw, 55vw" /></div><div className="dest-base-copy"><p className="concept-kicker">{t.baseLabel}</p><h2>{t.baseTitle.split("\n").map((line) => <span key={line}>{line}</span>)}</h2><p>{t.baseText}</p><ul><li><strong>9</strong> {language === "nb" ? "soverom" : "bedrooms"}</li><li><strong>4</strong> {language === "nb" ? "bad" : "bathrooms"}</li><li><strong>2</strong> {language === "nb" ? "kjøkken" : "kitchens"}</li><li><strong>2</strong> {language === "nb" ? "badstuer" : "saunas"}</li></ul></div></section>
        <section className="dest-nearby"><h2>{t.nearby}</h2><div>{t.distances.map(([distance, label]) => <article key={distance}><strong>{distance}</strong><span>{label}</span></article>)}</div></section>
        <section className="dest-route" id="dest-2"><div className="dest-route-copy"><p className="concept-kicker">{t.routeLabel}</p><h2>{t.routeTitle.split("\n").map((line) => <span key={line}>{line}</span>)}</h2><p>{t.routeText}</p></div><div className="dest-route-image"><Image src={image("terrace")} alt="View from the terrace" fill sizes="(max-width: 800px) 100vw, 50vw" /></div></section>
        <section className="dest-close"><p>GRANDCABIN · TURUFJELL</p><h2>{t.close}</h2><span>{t.closeText}</span><a href={finnUrl} target="_blank" rel="noreferrer">{t.cta} <b>↗</b></a></section>
      </main><ConceptSwitcher active="destination" />
    </div>
  );
}

export function EditorialConcept() {
  const [language, setLanguage] = useState<Language>("nb");
  const t = language === "nb" ? {
    issue: "ET FJELLHJEM PÅ TURUFJELL", title: "Arkitektur for de store øyeblikkene.", intro: "En særegen storhytte der materialer, lys og landskap skaper ro – med plass til 29 mennesker rundt samme bord.", enter: "Utforsk historien",
    chapter1: "01 · ARKITEKTUREN", craft: "Bygget for fellesskap.\nTegnet for utsikten.", craftText: "Store vindusflater slipper fjellet inn. Varme treflater, solide materialer og gjennomtenkte rom skaper en moderne hytte som fortsatt føles lun.",
    chapter2: "02 · ROMMENE", rooms: "Mange under samme tak.", roomsText: "Ni soverom og en sovealkove gir 29 sengeplasser. To etasjer med kjøkken og oppholdsrom lar gruppen være samlet – eller trekke seg litt tilbake.",
    chapter3: "03 · RITUALENE", rituals: "Morgenkaffe. Fjelluft. Badstuvarme.", ritualsText: "Her får dagene sin egen rytme: ut i løypene, hjem til lange måltider og inn i varmen når kveldsmørket faller.",
    quote: "En av Turufjells mest særpregede hytter – og det er lett å forstå hvorfor.", ctaTitle: "Gjør fjellet til deres.", cta: "Se datoer og priser på FINN",
  } : {
    issue: "A MOUNTAIN HOME AT TURUFJELL", title: "Architecture for life’s bigger moments.", intro: "A distinctive mountain home where material, light and landscape bring calm – with room for 29 people around the table.", enter: "Explore the story",
    chapter1: "01 · THE ARCHITECTURE", craft: "Built for gathering.\nFramed around the view.", craftText: "Wide windows bring the mountain inside. Warm timber, solid materials and carefully planned spaces create a modern cabin that still feels intimate.",
    chapter2: "02 · THE ROOMS", rooms: "Many guests. One roof.", roomsText: "Nine bedrooms and a sleeping alcove provide 29 beds. Two floors with kitchens and living rooms let everyone gather or find a quiet corner.",
    chapter3: "03 · THE RITUALS", rituals: "Morning coffee. Mountain air. Sauna heat.", ritualsText: "Days find their own rhythm here: time on the trails, long dinners and the warmth indoors as evening settles over the mountain.",
    quote: "One of Turufjell’s most distinctive cabins – and it is easy to see why.", ctaTitle: "Make the mountain yours.", cta: "See dates and prices on FINN",
  };

  return (
    <div className="concept-page editorial-page">
      <header className="ed-header"><Link href="/" className="ed-wordmark">GRAND<br />CABIN</Link><span>TURUFJELL · 60° 25&apos; N</span><LanguageToggle language={language} setLanguage={setLanguage} light /></header>
      <main>
        <section className="ed-hero"><div className="ed-hero-image"><Image src={image("exterior")} alt="Grandcabin exterior" fill priority sizes="(max-width: 900px) 100vw, 58vw" /></div><div className="ed-hero-copy"><p>{t.issue}</p><h1>{t.title}</h1><div><span>{t.intro}</span><a href="#chapter-one">{t.enter} ↓</a></div></div></section>
        <section className="ed-chapter ed-architecture" id="chapter-one"><div className="ed-chapter-title"><p>{t.chapter1}</p><h2>{t.craft.split("\n").map((line) => <span key={line}>{line}</span>)}</h2></div><div className="ed-chapter-main"><Image src={image("living")} alt="Living room architecture" fill sizes="70vw" /></div><div className="ed-chapter-aside"><Image src={image("dining")} alt="Dining room" fill sizes="30vw" /></div><p className="ed-chapter-text">{t.craftText}</p></section>
        <section className="ed-number"><strong>29</strong><div><span>{language === "nb" ? "sengeplasser" : "beds"}</span><p>{t.roomsText}</p></div></section>
        <section className="ed-chapter ed-rooms"><div className="ed-chapter-title"><p>{t.chapter2}</p><h2>{t.rooms}</h2></div><div className="ed-rooms-strip"><figure><Image src={image("bedroom")} alt="Bedroom" fill sizes="33vw" /></figure><figure><Image src={image("gathering")} alt="Gathering space" fill sizes="33vw" /></figure><figure><Image src={image("sauna")} alt="Sauna" fill sizes="33vw" /></figure></div></section>
        <section className="ed-rituals"><div className="ed-ritual-image"><Image src={image("terrace")} alt="Terrace at Turufjell" fill sizes="55vw" /></div><div className="ed-ritual-copy"><p>{t.chapter3}</p><h2>{t.rituals}</h2><span>{t.ritualsText}</span></div></section>
        <blockquote>{t.quote}</blockquote>
        <section className="ed-final"><Image src={image("ski")} alt="Turufjell in winter" fill sizes="100vw" /><div><h2>{t.ctaTitle}</h2><a href={finnUrl} target="_blank" rel="noreferrer">{t.cta} ↗</a></div></section>
      </main><ConceptSwitcher active="editorial" />
    </div>
  );
}

export function GroupsConcept() {
  const [language, setLanguage] = useState<Language>("nb");
  const t = language === "nb" ? {
    nav: ["For hvem", "Slik bor dere", "Fasiliteter"], eyebrow: "GRANDCABIN · TURUFJELL", title: "Samle alle.\nUten å bo oppå hverandre.", lead: "29 sengeplasser, ni soverom og hele fjellet utenfor. Laget for store familier, vennegjenger og bedrifter.", cta: "Sjekk ledige datoer", note: "Forespørsel og betaling skjer trygt via FINN",
    forTitle: "Hvem tar du med?", forLead: "Ett hus. Mange måter å bruke det på.", audiences: [["Familien", "Høytider, jubileer og helger der alle faktisk får plass."], ["Vennegjengen", "Aktive dager ute og lange middager når dere kommer hjem."], ["Kollegaene", "Kurs, møter og teambuilding med bredbånd og gode fellesrom."]],
    sleepLabel: "SLIK BOR DERE", sleepTitle: "God plass, fordelt på tre nivåer.", floors: [["Underetasje", "5 soverom · 16 sengeplasser", "Kjøkken, spisestue, stue, 2 bad og badstue"], ["Hovedetasje", "2 soverom · 5 sengeplasser", "Kjøkken, stue, 2 bad og badstue"], ["Loft", "2 soverom + alkove · 8 sengeplasser", "Et roligere nivå for søvn og hvile"]],
    flowTitle: "Møt. Spis. Pust ut.", flow: [["01", "Samle dere", "Store oppholdsrom og bredbånd gir plass til gode samtaler, møter og lek."], ["02", "Dekk langbordet", "To kjøkken og spiseplass for opptil 26–28 personer i underetasjen."], ["03", "Finn varmen", "To badstuer, varme gulv og peis etter dagen ute."]],
    included: "Dette får dere", includedItems: ["Wi-Fi", "Parkering", "4 oppvaskmaskiner", "Vaskemaskin", "TV", "Grill", "Barneseng og barnestol", "Ski inn / ski ut"], close: "Har dere funnet helgen?", closeText: "Se oppdaterte priser, vilkår og ledige datoer på FINN.",
  } : {
    nav: ["Who it’s for", "Sleeping", "Amenities"], eyebrow: "GRANDCABIN · TURUFJELL", title: "Bring everyone.\nKeep room to breathe.", lead: "29 beds, nine bedrooms and the whole mountain outside. Made for big families, groups of friends and company retreats.", cta: "Check available dates", note: "Enquiries and payment are handled securely through FINN",
    forTitle: "Who are you bringing?", forLead: "One house. Many ways to use it.", audiences: [["The family", "Holidays, anniversaries and weekends where everyone has room."], ["Friends", "Active days outside and long dinners when you come home."], ["The team", "Workshops, meetings and team time with broadband and generous shared spaces."]],
    sleepLabel: "WHERE EVERYONE SLEEPS", sleepTitle: "Space across three levels.", floors: [["Lower floor", "5 bedrooms · 16 beds", "Kitchen, dining room, lounge, 2 bathrooms and sauna"], ["Main floor", "2 bedrooms · 5 beds", "Kitchen, lounge, 2 bathrooms and sauna"], ["Loft", "2 bedrooms + alcove · 8 beds", "A quieter level for sleep and rest"]],
    flowTitle: "Meet. Eat. Exhale.", flow: [["01", "Come together", "Large living spaces and broadband make room for conversations, meetings and play."], ["02", "Set the long table", "Two kitchens and dining space for up to 26–28 people downstairs."], ["03", "Warm up", "Two saunas, heated floors and a fire after a day outdoors."]],
    included: "Everything included", includedItems: ["Wi-Fi", "Parking", "4 dishwashers", "Washing machine", "TV", "Barbecue", "Cot and high chair", "Ski in / ski out"], close: "Found your weekend?", closeText: "See current prices, terms and available dates on FINN.",
  };

  return (
    <div className="concept-page groups-page">
      <header className="groups-header"><Link href="/" className="groups-brand"><b>Grand</b>cabin<span>Turufjell</span></Link><nav>{t.nav.map((item, index) => <a key={item} href={`#groups-${index}`}>{item}</a>)}</nav><LanguageToggle language={language} setLanguage={setLanguage} /></header>
      <main>
        <section className="groups-hero"><div className="groups-hero-copy"><p>{t.eyebrow}</p><h1>{t.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h1><span>{t.lead}</span><a href={finnUrl} target="_blank" rel="noreferrer">{t.cta} ↗</a><small>{t.note}</small></div><div className="groups-hero-image"><Image src={image("gathering")} alt="Grandcabin gathering space" fill priority sizes="(max-width: 900px) 100vw, 52vw" /><div><strong>29</strong><span>{language === "nb" ? "sengeplasser" : "beds"}</span></div></div></section>
        <section className="groups-audience" id="groups-0"><div className="groups-section-title"><p>{t.forLead}</p><h2>{t.forTitle}</h2></div><div className="groups-audience-grid">{t.audiences.map(([title, body], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{body}</p></article>)}</div></section>
        <section className="groups-sleep" id="groups-1"><div className="groups-sleep-copy"><p>{t.sleepLabel}</p><h2>{t.sleepTitle}</h2><div>{t.floors.map(([floor, beds, details]) => <article key={floor}><h3>{floor}</h3><strong>{beds}</strong><span>{details}</span></article>)}</div></div><div className="groups-sleep-image"><Image src={image("bedroom")} alt="Bedroom" fill sizes="(max-width: 900px) 100vw, 42vw" /></div></section>
        <section className="groups-flow"><h2>{t.flowTitle}</h2><div className="groups-flow-grid">{["living", "dining", "sauna"].map((photo, index) => <article key={photo}><div><Image src={image(photo)} alt={t.flow[index][1]} fill sizes="33vw" /></div><span>{t.flow[index][0]}</span><h3>{t.flow[index][1]}</h3><p>{t.flow[index][2]}</p></article>)}</div></section>
        <section className="groups-included" id="groups-2"><h2>{t.included}</h2><ul>{t.includedItems.map((item) => <li key={item}><span>✓</span>{item}</li>)}</ul></section>
        <section className="groups-final"><div><p>GRANDCABIN · TURUFJELL</p><h2>{t.close}</h2><span>{t.closeText}</span><a href={finnUrl} target="_blank" rel="noreferrer">{t.cta} ↗</a></div><Image src={image("exterior")} alt="Grandcabin exterior" fill sizes="100vw" /></section>
      </main><ConceptSwitcher active="groups" />
    </div>
  );
}

type PanoramaVariant = 1 | 2 | 3 | 4;

function PanoramaVersionNav({ active }: { active: PanoramaVariant }) {
  return (
    <nav className="pano-version-nav" aria-label="Velg panoramaversjon">
      {[1, 2, 3, 4].map((version) => (
        <Link key={version} className={active === version ? "active" : ""} href={version === 1 ? "/concepts/panorama" : `/concepts/panorama-${version}`}>
          <span>0{version}</span>
        </Link>
      ))}
    </nav>
  );
}

export function PanoramaConcept({ variant = 1 }: { variant?: PanoramaVariant }) {
  const [language, setLanguage] = useState<Language>("nb");
  const heroPhotos = ["exterior", "terrace", "gathering", "living"];
  const t = language === "nb" ? {
    line: "Et fjellhus for store samlinger, med panoramautsikt over Turufjell.",
    introLabel: "SKAPT FOR Å SAMLE MANGE",
    introTitle: "Storslått ute.\nRaus plass inne.",
    introText: "Grandcabin kombinerer roen fra et eksklusivt fjellhus med kapasiteten en stor gruppe trenger. Her kan 29 gjester bo, spise, møtes og koble av under samme tak.",
    stats: [["29", "sengeplasser"], ["9", "soverom"], ["360 m²", "å leve på"], ["4", "bad"]],
    conferenceLabel: "MØTER OG SAMLINGER",
    conferenceTitle: "Utsikten gjør halve jobben.",
    conferenceText: "Et lyst møterom med stor skjerm, bredbånd og plass til å arbeide sammen. Når agendaen er ferdig, ligger fjellet rett utenfor døren.",
    conferenceFacts: ["Stor skjerm", "Trådløst nett", "Romslige fellesarealer", "Aktiviteter rett utenfor"],
    panoramaLabel: "PANORAMAET",
    panoramaTitle: "Fjellet følger dere gjennom hele oppholdet.",
    panoramaText: "Store vindusflater og terrasser vender oppholdet mot landskapet – fra det første morgenlyset til kvelden senker seg over Turufjell.",
    sleepLabel: "NI SOVEROM · TRE NIVÅER",
    sleepTitle: "Plass til alle.\nRom til å trekke seg tilbake.",
    floors: [["Underetasje", "16 sengeplasser"], ["Hovedetasje", "5 sengeplasser"], ["Loft", "8 sengeplasser"]],
    comfortTitle: "Etter møtet. Etter turen.",
    comfortText: "To badstuer, to kjøkken, varme gulv og store spisebord gir en enkel overgang fra aktivitet til hvile.",
    ctaLabel: "DERES NESTE SAMLING",
    ctaTitle: "Finn datoen.\nVi har plassen.",
    cta: "Se tilgjengelighet på FINN",
    finnNote: "Priser, vilkår og forespørsler håndteres på FINN.",
  } : {
    line: "A mountain home for large gatherings, with panoramic views across Turufjell.",
    introLabel: "MADE TO BRING PEOPLE TOGETHER",
    introTitle: "Expansive outside.\nGenerous inside.",
    introText: "Grandcabin combines the calm of an exclusive mountain home with the capacity a large group needs. Here, 29 guests can stay, dine, meet and unwind under one roof.",
    stats: [["29", "beds"], ["9", "bedrooms"], ["360 m²", "to enjoy"], ["4", "bathrooms"]],
    conferenceLabel: "MEETINGS AND RETREATS",
    conferenceTitle: "The view does half the work.",
    conferenceText: "A bright meeting room with a large screen, broadband and room to work together. When the agenda ends, the mountain begins outside the door.",
    conferenceFacts: ["Large screen", "Wi-Fi", "Generous shared spaces", "Outdoor activities nearby"],
    panoramaLabel: "THE PANORAMA",
    panoramaTitle: "The mountain stays with you throughout your stay.",
    panoramaText: "Wide windows and terraces turn every shared space towards the landscape, from first light to evening over Turufjell.",
    sleepLabel: "NINE BEDROOMS · THREE LEVELS",
    sleepTitle: "Room for everyone.\nSpace to step away.",
    floors: [["Lower floor", "16 beds"], ["Main floor", "5 beds"], ["Loft", "8 beds"]],
    comfortTitle: "After the meeting. After the mountain.",
    comfortText: "Two saunas, two kitchens, heated floors and long dining tables make the transition from activity to rest effortless.",
    ctaLabel: "YOUR NEXT GATHERING",
    ctaTitle: "Choose the date.\nWe have the space.",
    cta: "Check availability on FINN",
    finnNote: "Prices, terms and enquiries are handled through FINN.",
  };

  return (
    <div className={`concept-page panorama-page pano-v${variant}`}>
      <main>
        <section className="pano-hero">
          <Image src={image(heroPhotos[variant - 1])} alt="Grandcabin at Turufjell" fill priority sizes="100vw" />
          <div className="pano-hero-shade" />
          <div className="pano-language"><LanguageToggle language={language} setLanguage={setLanguage} light /></div>
          <div className="pano-hero-copy"><h1>Grandcabin</h1><p>{t.line}</p></div>
          <a className="pano-scroll" href="#pano-intro" aria-label={language === "nb" ? "Se mer" : "Explore"}><span>↓</span></a>
          <PanoramaVersionNav active={variant} />
        </section>

        <section className="pano-intro" id="pano-intro">
          <div><p className="pano-kicker">{t.introLabel}</p><h2>{t.introTitle.split("\n").map((line) => <span key={line}>{line}</span>)}</h2></div>
          <p>{t.introText}</p>
        </section>

        <section className="pano-stats" aria-label={language === "nb" ? "Hytta i tall" : "Cabin facts"}>
          {t.stats.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
        </section>

        <section className="pano-conference">
          <div className="pano-conference-image"><Image src={image("gathering")} alt="Conference room with a view" fill sizes="(max-width: 900px) 100vw, 58vw" /></div>
          <div className="pano-conference-copy"><p className="pano-kicker">{t.conferenceLabel}</p><h2>{t.conferenceTitle}</h2><p>{t.conferenceText}</p><ul>{t.conferenceFacts.map((fact) => <li key={fact}>{fact}</li>)}</ul></div>
        </section>

        <section className="pano-view">
          <Image src={image("terrace")} alt="Panoramic mountain view from the terrace" fill sizes="100vw" />
          <div className="pano-view-shade" />
          <div><p className="pano-kicker">{t.panoramaLabel}</p><h2>{t.panoramaTitle}</h2><span>{t.panoramaText}</span></div>
        </section>

        <section className="pano-sleep">
          <div className="pano-sleep-heading"><p className="pano-kicker">{t.sleepLabel}</p><h2>{t.sleepTitle.split("\n").map((line) => <span key={line}>{line}</span>)}</h2></div>
          <div className="pano-sleep-layout">
            <div className="pano-sleep-image"><Image src={image("bedroom")} alt="A Grandcabin bedroom" fill sizes="(max-width: 900px) 100vw, 50vw" /></div>
            <div className="pano-floors">{t.floors.map(([floor, beds], index) => <article key={floor}><span>0{index + 1}</span><h3>{floor}</h3><p>{beds}</p></article>)}</div>
          </div>
        </section>

        <section className="pano-comfort">
          <div className="pano-comfort-copy"><h2>{t.comfortTitle}</h2><p>{t.comfortText}</p></div>
          <div className="pano-comfort-images"><figure><Image src={image("dining")} alt="Long dining table" fill sizes="50vw" /></figure><figure><Image src={image("sauna")} alt="Private sauna" fill sizes="28vw" /></figure></div>
        </section>

        <section className="pano-final">
          <Image src={image("living")} alt="Grandcabin living room" fill sizes="100vw" />
          <div className="pano-final-shade" />
          <div><p className="pano-kicker">{t.ctaLabel}</p><h2>{t.ctaTitle.split("\n").map((line) => <span key={line}>{line}</span>)}</h2><a href={finnUrl} target="_blank" rel="noreferrer">{t.cta} <b>↗</b></a><small>{t.finnNote}</small></div>
        </section>
      </main>
      <ConceptSwitcher active="panorama" />
    </div>
  );
}

export function ChaletConcept() {
  const [language, setLanguage] = useState<Language>("nb");
  const t = language === "nb" ? {
    nav: ["Hytta", "Rommene", "Samlinger", "Velvære", "Beliggenhet"],
    title: "Grandcabin",
    subtitle: "RAFFINERT FJELLRO FOR STORE SELSKAP",
    intro: "Den rolige kraften i fjellandskapet merkes fra første øyeblikk. Grandcabin kombinerer moderne arkitektur, varme trematerialer og store vindusflater med plass til 29 gjester.",
    architecture: "Moderne fjellhytte i et elegant spill av kontraster",
    architectureText: "Lune treflater møter glass, stein og mørke detaljer. Rommene er åpne mot utsikten, men beholder den varme og nære følelsen man ønsker seg på fjellet.",
    rooms: "Sov godt midt i fjellroen",
    roomsText: "Ni soverom og en sovealkove fordeler 29 sengeplasser over tre nivåer. Det gir storfamilien, vennegjengen eller kollegaene både nærhet og mulighet til å trekke seg tilbake.",
    roomFacts: [["Underetasje", "5 soverom · 16 sengeplasser"], ["Hovedetasje", "2 soverom · 5 sengeplasser"], ["Loft", "2 soverom og alkove · 8 sengeplasser"]],
    meetings: "Fellesrom med funksjon og utsikt",
    meetingsText: "Store oppholdsrom, bredbånd og skjerm gjør hytta velegnet for møter, kurs og mindre konferanser. To kjøkken og spiseplass for opptil 26–28 personer gjør det enkelt å fortsette samtalen rundt bordet.",
    wellness: "Varme og ro etter dagen ute",
    wellnessText: "To badstuer, fire bad og gulvvarme gir god flyt når mange bor sammen. Her kan skuldrene senkes etter en dag i løypene eller et langt møte.",
    gallery: "Oppdag Grandcabin",
    closing: "Hele hytta. Bare for dere.",
    closingText: "Grandcabin leies ut samlet. Se ledige datoer, priser og vilkår på FINN.",
    cta: "Se tilgjengelighet på FINN",
  } : {
    nav: ["The cabin", "Bedrooms", "Retreats", "Wellness", "Location"],
    title: "Grandcabin",
    subtitle: "REFINED MOUNTAIN CALM FOR LARGE GROUPS",
    intro: "The quiet power of the mountain landscape can be felt from the first moment. Grandcabin combines modern architecture, warm timber and wide windows with room for 29 guests.",
    architecture: "A modern mountain home in an elegant play of contrasts",
    architectureText: "Warm timber meets glass, stone and dark details. The rooms open towards the view while keeping the intimate warmth of a Norwegian mountain cabin.",
    rooms: "Sleep well in the stillness of the mountains",
    roomsText: "Nine bedrooms and a sleeping alcove provide 29 beds across three levels. Families, friends and colleagues can stay close while still finding a quiet place of their own.",
    roomFacts: [["Lower floor", "5 bedrooms · 16 beds"], ["Main floor", "2 bedrooms · 5 beds"], ["Loft", "2 bedrooms and alcove · 8 beds"]],
    meetings: "Shared spaces with function and a view",
    meetingsText: "Large living spaces, broadband and a screen make the cabin well suited to meetings, workshops and smaller conferences. Two kitchens and dining space for up to 26–28 keep the conversation going around the table.",
    wellness: "Warmth and calm after a day outside",
    wellnessText: "Two saunas, four bathrooms and heated floors keep a large group comfortable. Settle in after a day on the trails or a productive meeting.",
    gallery: "Discover Grandcabin",
    closing: "The whole cabin. Only for you.",
    closingText: "Grandcabin is rented as one private property. See available dates, prices and terms on FINN.",
    cta: "Check availability on FINN",
  };

  return (
    <div className="concept-page chalet-page">
      <header className="chalet-header">
        <Link href="/" className="chalet-mark"><b>G</b><span>GRANDCABIN<small>TURUFJELL</small></span></Link>
        <nav>{t.nav.map((item, index) => <a key={item} href={`#chalet-${index}`}>{item}</a>)}</nav>
        <LanguageToggle language={language} setLanguage={setLanguage} light />
      </header>
      <main>
        <section className="chalet-hero"><Image src={image("living")} alt="Grandcabin living room overlooking Turufjell" fill priority sizes="100vw" /></section>

        <section className="chalet-intro" id="chalet-0"><h1>{t.title}</h1><p className="chalet-subtitle">{t.subtitle}</p><i /><p>{t.intro}</p></section>

        <section className="chalet-image-wide"><Image src={image("exterior")} alt="Grandcabin exterior in winter" fill sizes="100vw" /></section>

        <section className="chalet-editorial">
          <div className="chalet-editorial-copy"><h2>{t.architecture}</h2><i /><p>{t.architectureText}</p></div>
          <div className="chalet-editorial-images"><figure><Image src={image("dining")} alt="Dining room details" fill sizes="55vw" /></figure><figure><Image src={image("living")} alt="Living room materials" fill sizes="35vw" /></figure></div>
        </section>

        <section className="chalet-rooms" id="chalet-1">
          <div className="chalet-center-copy"><h2>{t.rooms}</h2><i /><p>{t.roomsText}</p></div>
          <div className="chalet-room-gallery"><figure><Image src={image("bedroom")} alt="Grandcabin bedroom" fill sizes="50vw" /></figure><figure><Image src={image("gathering")} alt="Shared living space" fill sizes="50vw" /></figure></div>
          <div className="chalet-room-facts">{t.roomFacts.map(([floor, beds]) => <article key={floor}><h3>{floor}</h3><p>{beds}</p></article>)}</div>
        </section>

        <section className="chalet-meetings" id="chalet-2"><div className="chalet-meetings-image"><Image src={image("gathering")} alt="Conference and meeting facilities" fill sizes="62vw" /></div><div className="chalet-meetings-copy"><h2>{t.meetings}</h2><i /><p>{t.meetingsText}</p></div></section>

        <section className="chalet-wellness" id="chalet-3"><div className="chalet-center-copy"><h2>{t.wellness}</h2><i /><p>{t.wellnessText}</p></div><div className="chalet-wellness-image"><Image src={image("sauna")} alt="Private sauna" fill sizes="100vw" /></div></section>

        <section className="chalet-gallery" id="chalet-4"><h2>{t.gallery}</h2><div><figure><Image src={image("terrace")} alt="Mountain panorama" fill sizes="33vw" /></figure><figure><Image src={image("ski")} alt="Winter at Turufjell" fill sizes="33vw" /></figure><figure><Image src={image("cycling")} alt="Summer at Turufjell" fill sizes="33vw" /></figure></div></section>

        <section className="chalet-closing"><p>GRANDCABIN · TURUFJELL</p><h2>{t.closing}</h2><span>{t.closingText}</span><a href={finnUrl} target="_blank" rel="noreferrer">{t.cta} ↗</a></section>
      </main>
      <ConceptSwitcher active="chalet" />
    </div>
  );
}

export function RetreatLongConcept() {
  const [language, setLanguage] = useState<Language>("nb");
  const t = language === "nb" ? {
    nav: ["Hytta", "Samlinger", "Badstuer", "Turufjell", "Galleri"],
    contact: "SE TILGJENGELIGHET",
    hero: "En uforglemmelig fjellsamling for opptil 29 gjester",
    heroCta: "UTFORSK HYTTA",
    experience: "Den komplette\nfjellopplevelsen",
    experienceText: "Grandcabin kombinerer moderne komfort, store fellesrom og en storslått beliggenhet på Turufjell. Her får familie, venner og kollegaer plass til å skape gode dager sammen.",
    discover: "OPPDAG MER",
    groups: "Samlinger\nmed rom for alle",
    groupsText: "Ni soverom, 29 sengeplasser og fleksible oppholdsrom gjør planleggingen enkel. Bredbånd og stor skjerm legger til rette for møter og kurs, mens fjellet gir naturlige pauser.",
    groupsLink: "MER OM SAMLINGER",
    sauna: "To badstuer",
    saunaText: "Etter en dag ute eller en lang økt rundt møtebordet venter badstuvarme, gulvvarme og rolige soner. Fire bad gir god flyt selv når hele gruppen er samlet.",
    saunaLink: "SE FASILITETENE",
    place: "Turufjell",
    placeText: "Ski inn og ut om vinteren. Sykkel, turstier og fjelluft når snøen forsvinner. Hytta ligger under to timer fra Oslo og 15 minutter fra Flå sentrum.",
    placeLink: "OPPLEV OMRÅDET",
    gallery: "Grandcabin galleri",
    showGallery: "SE BILDENE",
    final: "Planlegg deres neste opphold",
    finalText: "Se oppdaterte datoer, priser og vilkår i vår FINN-annonse.",
    finalCta: "GÅ TIL FINN",
  } : {
    nav: ["The cabin", "Retreats", "Saunas", "Turufjell", "Gallery"],
    contact: "CHECK AVAILABILITY",
    hero: "An unforgettable mountain retreat for up to 29 guests",
    heroCta: "EXPLORE THE CABIN",
    experience: "The complete\nmountain experience",
    experienceText: "Grandcabin combines modern comfort, generous shared spaces and a spectacular setting at Turufjell. Families, friends and colleagues have room to create memorable days together.",
    discover: "DISCOVER MORE",
    groups: "Gatherings\nwith room for everyone",
    groupsText: "Nine bedrooms, 29 beds and flexible living spaces make planning easy. Broadband and a large screen support meetings and workshops, while the mountain provides natural breaks.",
    groupsLink: "MORE ABOUT RETREATS",
    sauna: "Two saunas",
    saunaText: "After a day outside or a long session around the meeting table, sauna heat, heated floors and quiet spaces await. Four bathrooms keep a full group comfortable.",
    saunaLink: "VIEW THE AMENITIES",
    place: "Turufjell",
    placeText: "Ski in and out in winter. Cycling, trails and mountain air when the snow clears. The cabin is under two hours from Oslo and 15 minutes from Flå village.",
    placeLink: "EXPLORE THE AREA",
    gallery: "Grandcabin gallery",
    showGallery: "VIEW THE PHOTOS",
    final: "Plan your next stay",
    finalText: "See current dates, prices and terms in our FINN listing.",
    finalCta: "VISIT FINN",
  };

  return (
    <div className="concept-page retreat-page">
      <header className="retreat-header">
        <Link href="/" className="retreat-logo"><b>Grand</b><span>cabin</span><small>TURUFJELL</small></Link>
        <nav>{t.nav.map((item, index) => <a key={item} href={`#retreat-${index}`}>{item}</a>)}</nav>
        <div className="retreat-actions"><LanguageToggle language={language} setLanguage={setLanguage} light /><a href={finnUrl} target="_blank" rel="noreferrer">{t.contact}</a></div>
      </header>
      <main>
        <section className="retreat-hero">
          <Image src={image("exterior")} alt="Grandcabin and the mountains at Turufjell" fill priority sizes="100vw" />
          <div className="retreat-hero-shade" />
          <div className="retreat-hero-copy"><div className="retreat-hero-mark"><b>Grand</b><span>cabin</span><small>TURUFJELL</small></div><h1>{t.hero}</h1><a href="#retreat-0">{t.heroCta}</a></div>
        </section>

        <section className="retreat-intro" id="retreat-0">
          <div className="retreat-intro-image"><Image src={image("living")} alt="Living room with panoramic windows" fill sizes="(max-width: 900px) 100vw, 55vw" /></div>
          <div className="retreat-copy"><p>01</p><h2>{t.experience.split("\n").map((line) => <span key={line}>{line}</span>)}</h2><div><span>{t.experienceText}</span><a href="#retreat-4">{t.discover} →</a></div></div>
        </section>

        <section className="retreat-groups" id="retreat-1">
          <Image src={image("gathering")} alt="Meeting and conference room" fill sizes="100vw" />
          <div className="retreat-panel"><p>02</p><h2>{t.groups.split("\n").map((line) => <span key={line}>{line}</span>)}</h2><span>{t.groupsText}</span><a href="#retreat-gallery">{t.groupsLink} →</a></div>
          <div className="retreat-capacity"><strong>29</strong><span>{language === "nb" ? "sengeplasser" : "beds"}</span></div>
        </section>

        <section className="retreat-sauna" id="retreat-2">
          <div className="retreat-sauna-copy"><p>03</p><h2>{t.sauna}</h2><span>{t.saunaText}</span><a href="#retreat-gallery">{t.saunaLink} →</a></div>
          <div className="retreat-sauna-image"><Image src={image("sauna")} alt="One of Grandcabin's saunas" fill sizes="(max-width: 900px) 100vw, 62vw" /></div>
        </section>

        <section className="retreat-place" id="retreat-3">
          <Image src={image("ski")} alt="Winter at Turufjell" fill sizes="100vw" />
          <div className="retreat-place-shade" />
          <div><p>04</p><h2>{t.place}</h2><span>{t.placeText}</span><a href="#retreat-gallery">{t.placeLink} →</a></div>
        </section>

        <section className="retreat-gallery" id="retreat-gallery">
          <div className="retreat-gallery-head"><h2>{t.gallery}</h2><a href={finnUrl} target="_blank" rel="noreferrer">{t.showGallery} →</a></div>
          <div className="retreat-gallery-grid"><figure><Image src={image("terrace")} alt="Terrace and mountain view" fill sizes="40vw" /></figure><figure><Image src={image("dining")} alt="Dining space" fill sizes="30vw" /></figure><figure><Image src={image("bedroom")} alt="Bedroom" fill sizes="30vw" /></figure></div>
        </section>

        <section className="retreat-final" id="retreat-4">
          <Image src={image("cycling")} alt="Summer at Turufjell" fill sizes="100vw" />
          <div className="retreat-final-shade" />
          <div><h2>{t.final}</h2><p>{t.finalText}</p><a href={finnUrl} target="_blank" rel="noreferrer">{t.finalCta}</a></div>
        </section>
      </main>
      <ConceptSwitcher active="retreat" />
    </div>
  );
}

type RetreatPageKey = "cabin" | "bedrooms" | "meetings" | "saunas" | "turufjell" | "materials" | "gallery";

const retreatPaths = [
  "/concepts/retreat/cabin",
  "/concepts/retreat/bedrooms",
  "/concepts/retreat/meetings",
  "/concepts/retreat/saunas",
  "/concepts/retreat/materials",
  "/concepts/retreat/turufjell",
  "/concepts/retreat/gallery",
];

function RetreatNav({ language, setLanguage }: { language: Language; setLanguage: (language: Language) => void }) {
  const labels = language === "nb"
    ? ["Hytta", "Soverom", "Samlinger", "Badstuer", "Håndverk", "Turufjell", "Galleri"]
    : ["The cabin", "Bedrooms", "Retreats", "Saunas", "Craftsmanship", "Turufjell", "Gallery"];

  return (
    <header className="retreat-header retreat-header-pages">
      <Link href="/concepts/retreat" className="retreat-logo"><b>Grand</b><span>cabin</span><small>TURUFJELL</small></Link>
      <nav>{labels.map((label, index) => <Link key={label} href={retreatPaths[index]}>{label}</Link>)}</nav>
      <div className="retreat-actions"><LanguageToggle language={language} setLanguage={setLanguage} light /><a href={finnUrl} target="_blank" rel="noreferrer">{language === "nb" ? "SE TILGJENGELIGHET" : "CHECK AVAILABILITY"}</a></div>
    </header>
  );
}

export function RetreatConcept() {
  const [language, setLanguage] = useState<Language>("nb");
  const t = language === "nb" ? {
    hero: "En uforglemmelig fjellsamling for opptil 29 gjester",
    cta: "UTFORSK HYTTA",
  } : {
    hero: "An unforgettable mountain retreat for up to 29 guests",
    cta: "EXPLORE THE CABIN",
  };

  return (
    <div className="concept-page retreat-page retreat-home-page">
      <RetreatNav language={language} setLanguage={setLanguage} />
      <main>
        <section className="retreat-hero retreat-home-hero">
          <Image src={image("exterior")} alt="Grandcabin and the mountains at Turufjell" fill priority sizes="100vw" />
          <div className="retreat-hero-shade" />
          <div className="retreat-hero-copy"><div className="retreat-hero-mark"><b>Grand</b><span>cabin</span><small>TURUFJELL</small></div><h1>{t.hero}</h1><Link href="/concepts/retreat/cabin">{t.cta}</Link></div>
        </section>
      </main>
      <ConceptSwitcher active="retreat" />
    </div>
  );
}

export function RetreatDetailPage({ page }: { page: RetreatPageKey }) {
  const [language, setLanguage] = useState<Language>("nb");
  const nb = {
    cabin: { number: "01", title: "En stor hytte.\nEt privat fjellhjem.", text: "Grandcabin har 360 kvadratmeter med store vinduer, to kjøkken og romslige fellesarealer. Her kan hele gruppen være sammen uten at hytta mister den lune fjellfølelsen.", photo: "living", alt: "Stuen med utsikt", facts: ["360 m²", "2 kjøkken", "4 bad"] },
    bedrooms: { number: "02", title: "Ni soverom.\n29 sengeplasser.", text: "Soveplassene er fordelt over tre nivåer: 16 i underetasjen, fem i hovedetasjen og åtte på loftet. Det gir nærhet for gruppen og rolige soner når dagen er over.", photo: "bedroom", alt: "Et av soverommene", facts: ["16 nede", "5 hovedplan", "8 på loftet"] },
    meetings: { number: "03", title: "Samlinger med\nrom for ideer.", text: "Bredbånd, stor skjerm og fleksible oppholdsrom legger til rette for møter, kurs og mindre konferanser. Fjellandskapet gir naturlige pauser mellom øktene.", photo: "gathering", alt: "Møte- og konferanserom", facts: ["Stor skjerm", "Bredbånd", "Fleksible rom"] },
    saunas: { number: "04", title: "To badstuer.\nFire bad.", text: "Etter en dag ute eller rundt møtebordet venter badstuvarme, varme gulv og god plass til å lande. Fasilitetene er fordelt slik at en stor gruppe får en enkel flyt.", photo: "sauna", alt: "Badstuen", facts: ["2 badstuer", "4 bad", "Gulvvarme"] },
    materials: { number: "05", title: "Raffinert håndverk.\nNaturlige materialer.", text: "Massiv gran, børstet lerk og naturlige oljer gir Grandcabin en varm og moderne identitet. Hver overflate er valgt for å eldes vakkert og bringe naturen inn i rommene.", photo: "dining", alt: "Treverk og materialer i spisestuen", facts: ["Massiv gran", "Børstet lerk", "Naturlig oljebeis"] },
    turufjell: { number: "06", title: "Fjellet begynner\nutenfor døren.", text: "Ski inn og ut om vinteren, og sykkel, turstier og fiskevann når snøen forsvinner. Turufjell ligger under to timer fra Oslo og 15 minutter fra Flå sentrum.", photo: "terrace", alt: "Utsikten over Turufjell", facts: ["200 m til løype", "400 m til bakke", "Under 2 t fra Oslo"] },
    gallery: { number: "07", title: "Grandcabin\ni bilder.", text: "Se rommene, utsikten og fjellet gjennom årstidene. Alle 75 bilder og full informasjon finner dere i FINN-annonsen.", photo: "exterior", alt: "Grandcabin om vinteren", facts: ["75 bilder på FINN", "Fire årstider", "Ett privat opphold"] },
  };
  const en = {
    cabin: { number: "01", title: "A large cabin.\nA private mountain home.", text: "Grandcabin offers 360 square metres with wide windows, two kitchens and generous shared spaces. The whole group can gather without losing the intimate mountain atmosphere.", photo: "living", alt: "Living room with a view", facts: ["360 m²", "2 kitchens", "4 bathrooms"] },
    bedrooms: { number: "02", title: "Nine bedrooms.\n29 beds.", text: "Sleeping space is arranged across three levels: 16 beds downstairs, five on the main floor and eight in the loft. The group stays close while everyone can still find a quiet place.", photo: "bedroom", alt: "One of the bedrooms", facts: ["16 downstairs", "5 main floor", "8 in the loft"] },
    meetings: { number: "03", title: "Gatherings with\nroom for ideas.", text: "Broadband, a large screen and flexible living spaces support meetings, workshops and smaller conferences. The mountain landscape creates natural breaks between sessions.", photo: "gathering", alt: "Meeting and conference room", facts: ["Large screen", "Broadband", "Flexible rooms"] },
    saunas: { number: "04", title: "Two saunas.\nFour bathrooms.", text: "After a day outside or around the meeting table, sauna heat, warm floors and space to unwind await. The facilities make life easy for a large group.", photo: "sauna", alt: "Private sauna", facts: ["2 saunas", "4 bathrooms", "Heated floors"] },
    materials: { number: "05", title: "Refined craft.\nNatural materials.", text: "Solid spruce, brushed larch and natural oils give Grandcabin its warm, modern identity. Every surface is chosen to age beautifully and bring nature into the rooms.", photo: "dining", alt: "Timber and materials in the dining room", facts: ["Solid spruce", "Brushed larch", "Natural oil stain"] },
    turufjell: { number: "06", title: "The mountain begins\noutside the door.", text: "Ski in and out in winter, with cycling, trails and fishing lakes when the snow clears. Turufjell is under two hours from Oslo and 15 minutes from Flå village.", photo: "terrace", alt: "The view across Turufjell", facts: ["200 m to trails", "400 m to slopes", "Under 2 h from Oslo"] },
    gallery: { number: "07", title: "Grandcabin\nin pictures.", text: "See the rooms, views and mountain through the seasons. All 75 photos and full information are available in the FINN listing.", photo: "exterior", alt: "Grandcabin in winter", facts: ["75 photos on FINN", "Four seasons", "One private stay"] },
  };
  const t = (language === "nb" ? nb : en)[page];
  const extendedNb = {
    cabin: { leadTitle: "Laget for de lange dagene sammen", leadText: "To kjøkken, to store spiseområder og flere oppholdssoner gjør det enkelt å veksle mellom felles måltider, rolige samtaler og en pause for seg selv.", leadPhoto: "dining", bannerTitle: "Fjellutsikt fra morgen til kveld", bannerText: "De store vindusflatene lar lyset og landskapet bli en del av interiøret.", bannerPhoto: "exterior", pointsTitle: "Gjennomtenkt komfort", points: ["Vannbåren gulvvarme", "Balansert ventilasjon", "Parkering ved hytta"] },
    bedrooms: { leadTitle: "Tre nivåer gir naturlig ro", leadText: "Soverommene er fordelt slik at barn, voksne og mindre familier kan finne sin plass. En egen sovealkove på loftet gir ekstra fleksibilitet.", leadPhoto: "living", bannerTitle: "Våkne til fjellet", bannerText: "Naturlige materialer, varme flater og dempede farger skaper en rolig ramme rundt natten.", bannerPhoto: "terrace", pointsTitle: "Enkel romfordeling", points: ["5 soverom i underetasjen", "2 soverom i hovedetasjen", "2 soverom og alkove på loftet"] },
    meetings: { leadTitle: "Fra agenda til langbord", leadText: "Når arbeidsøkten er ferdig, kan gruppen fortsette samtalen rundt et langbord med plass til opptil 26–28 personer i underetasjen.", leadPhoto: "dining", bannerTitle: "Pauser som faktisk gir energi", bannerText: "Løyper, alpinbakke og fjelluft ligger rett utenfor. Et miljøskifte er bare noen skritt unna.", bannerPhoto: "terrace", pointsTitle: "For produktive samlinger", points: ["Stor skjerm", "Stabilt bredbånd", "Flere fellesarealer"] },
    saunas: { leadTitle: "Varme som samler kroppen", leadText: "De to badstuene gjør at flere kan finne ro samtidig. Kombinasjonen av tre, varme og stillhet gir en naturlig avslutning på aktive dager.", leadPhoto: "living", bannerTitle: "God plass også mellom øktene", bannerText: "Fire bad og flere soner gjør morgenene og kveldene smidige når mange bor sammen.", bannerPhoto: "bedroom", pointsTitle: "Velvære i hverdagen", points: ["2 private badstuer", "4 bad", "Varme gulv"] },
    turufjell: { leadTitle: "Vinteren starter ved hytta", leadText: "Langrennsløyper ligger omtrent 200 meter unna, og alpinbakken omtrent 400 meter unna. Mindre transport gir mer tid ute.", leadPhoto: "ski", bannerTitle: "Et fjell for alle årstider", bannerText: "Når snøen forsvinner, åpner området seg for sykkel, fjellturer, fiskevann og lange dager i frisk luft.", bannerPhoto: "cycling", pointsTitle: "Nærmere enn dere tror", points: ["Under 2 timer fra Oslo", "15 minutter til Flå", "Tog og taxi er mulig"] },
    materials: { leadTitle: "Heltre gran, formet av naturen", leadText: "Veggkledningen i massiv gran gir en moderne tolkning av tradisjonelt trehåndverk. Den tilhuggede overflaten skaper dybde og kontrast mot glass, glatte vegger og minimalistiske møbler. Ingen bord gjentar seg – hvert stykke får sitt eget uttrykk.", leadPhoto: "living", bannerTitle: "Børstet lerk med levende dybde", bannerText: "Børstingen fjerner det mykere vårveden og lar den hardere veden og årringene tre tydelig frem. Resultatet er en taktil overflate med naturlige fargevariasjoner, varme og en sterk forbindelse til landskapet.", bannerPhoto: "exterior", pointsTitle: "Materialer som arbeider med rommet", points: ["Massivtre fra Tirol", "Antistatisk og fuktighetsregulerende", "Innvendig og utvendig kledning"] },
    gallery: { leadTitle: "Fra de store rommene til de små detaljene", leadText: "Bildene viser hvordan utsikt, treverk og lys følger dere gjennom hele hytta – fra langbordet og møteplassen til soverommene og badstuen.", leadPhoto: "gathering", bannerTitle: "Samme utsikt. Nye årstider.", bannerText: "Vinteren er dramatisk og lun. Sommeren åpner terrassen og fjellet for lange dager ute.", bannerPhoto: "cycling", pointsTitle: "Se hele historien", points: ["Interiør og rom", "Fjell og aktiviteter", "Alle 75 bilder på FINN"] },
  };
  const extendedEn = {
    cabin: { leadTitle: "Made for long days together", leadText: "Two kitchens, two generous dining areas and several living zones make it easy to move between shared meals, quiet conversations and time alone.", leadPhoto: "dining", bannerTitle: "Mountain views from morning to evening", bannerText: "Wide windows bring the changing light and landscape into the interior.", bannerPhoto: "exterior", pointsTitle: "Considered comfort", points: ["Hydronic floor heating", "Balanced ventilation", "Parking at the cabin"] },
    bedrooms: { leadTitle: "Three levels create natural calm", leadText: "The bedrooms are arranged so children, adults and smaller families can find their place. A separate sleeping alcove in the loft adds flexibility.", leadPhoto: "living", bannerTitle: "Wake up to the mountains", bannerText: "Natural materials, warm surfaces and quiet colours create a restful setting for the night.", bannerPhoto: "terrace", pointsTitle: "A simple room plan", points: ["5 bedrooms downstairs", "2 bedrooms on the main floor", "2 bedrooms and loft alcove"] },
    meetings: { leadTitle: "From the agenda to the long table", leadText: "When the work session ends, the conversation can continue around a long table seating up to 26–28 people downstairs.", leadPhoto: "dining", bannerTitle: "Breaks that restore your energy", bannerText: "Trails, slopes and mountain air begin outside. A complete change of scene is only a few steps away.", bannerPhoto: "terrace", pointsTitle: "For productive retreats", points: ["Large screen", "Reliable broadband", "Several shared spaces"] },
    saunas: { leadTitle: "Warmth that resets the body", leadText: "Two saunas let several guests find calm at the same time. Timber, heat and stillness create a natural close to active days.", leadPhoto: "living", bannerTitle: "Space between every session", bannerText: "Four bathrooms and several zones keep mornings and evenings flowing smoothly for a full group.", bannerPhoto: "bedroom", pointsTitle: "Everyday wellbeing", points: ["2 private saunas", "4 bathrooms", "Heated floors"] },
    turufjell: { leadTitle: "Winter begins at the cabin", leadText: "Cross-country trails are around 200 metres away and the ski slope around 400 metres away. Less transport means more time outside.", leadPhoto: "ski", bannerTitle: "A mountain for every season", bannerText: "When the snow clears, the area opens for cycling, mountain walks, fishing lakes and long days in fresh air.", bannerPhoto: "cycling", pointsTitle: "Closer than it feels", points: ["Under 2 hours from Oslo", "15 minutes to Flå", "Train and taxi are possible"] },
    materials: { leadTitle: "Solid spruce, shaped by nature", leadText: "Solid spruce wall cladding gives traditional timber craft a modern expression. The hewn surface creates depth and contrast beside glass, smooth walls and minimal furniture. No board repeats; every piece has its own character.", leadPhoto: "living", bannerTitle: "Brushed larch with living depth", bannerText: "Brushing removes the softer earlywood and reveals the harder latewood and annual rings. The result is a tactile surface with natural colour variation, warmth and a strong connection to the landscape.", bannerPhoto: "exterior", pointsTitle: "Materials that work with the room", points: ["Solid timber from Tyrol", "Antistatic and moisture regulating", "Interior and exterior cladding"] },
    gallery: { leadTitle: "From generous spaces to quiet details", leadText: "The photographs show how views, timber and light follow you through the cabin, from the long table and meeting room to bedrooms and saunas.", leadPhoto: "gathering", bannerTitle: "The same view. New seasons.", bannerText: "Winter feels dramatic and intimate. Summer opens the terrace and mountain for long days outside.", bannerPhoto: "cycling", pointsTitle: "See the full story", points: ["Interiors and rooms", "Mountain and activities", "All 75 photos on FINN"] },
  };
  const more = (language === "nb" ? extendedNb : extendedEn)[page];
  const moreSections = (
    <>
      <section className="retreat-detail-story">
        <div className="retreat-detail-story-image"><Image src={image(more.leadPhoto)} alt="" fill sizes="(max-width: 900px) 100vw, 52vw" /></div>
        <div className="retreat-detail-story-copy"><p>{t.number} · GRANDCABIN</p><h2>{more.leadTitle}</h2><span>{more.leadText}</span></div>
      </section>
      <section className="retreat-detail-banner">
        <Image src={image(more.bannerPhoto)} alt="" fill sizes="100vw" /><div className="retreat-detail-banner-shade" />
        <div><h2>{more.bannerTitle}</h2><p>{more.bannerText}</p></div>
      </section>
      <section className="retreat-detail-points"><div><p>GRANDCABIN · TURUFJELL</p><h2>{more.pointsTitle}</h2></div><ul>{more.points.map((point, index) => <li key={point}><span>0{index + 1}</span>{point}</li>)}</ul></section>
      {page === "materials" && <section className="retreat-material-oil"><div><p>OSMO {language === "nb" ? "OLJEBEIS" : "OIL STAIN"}</p><h2>{language === "nb" ? <>Naturlig beskyttelse.<br />Treet får fortsatt puste.</> : <>Natural protection.<br />The timber still breathes.</>}</h2></div><div>{language === "nb" ? <><p>Overflatene er behandlet med Osmo oljebeis basert på naturlige planteoljer og harde vokser. Behandlingen trekker inn i treet og gir en vann- og smussavvisende overflate uten å legge en tett film over materialet.</p><p>Den diffusjonsåpne behandlingen lar treet ta opp og slippe ut fuktighet. Slik bevares det naturlige uttrykket, samtidig som overflaten blir slitesterk, antistatisk og enklere å holde ren. Osmo er FSC-sertifisert.</p></> : <><p>The surfaces are treated with Osmo oil stain based on natural plant oils and hard waxes. It penetrates the timber to create a water- and dirt-resistant finish without sealing the material beneath a dense film.</p><p>The breathable finish lets timber absorb and release moisture. Its natural appearance remains intact while the surface becomes durable, antistatic and easier to maintain. Osmo is FSC certified.</p></>}</div></section>}
      <section className="retreat-detail-footer"><h2>{language === "nb" ? "Klar for deres neste fjellopphold?" : "Ready for your next mountain stay?"}</h2><a href={finnUrl} target="_blank" rel="noreferrer">{language === "nb" ? "SE DATOER OG PRISER PÅ FINN" : "SEE DATES AND PRICES ON FINN"} ↗</a></section>
    </>
  );

  const cabinDirections = page === "cabin" && (
    <section className="retreat-directions">
      <div className="retreat-map"><iframe title="Grandcabin on Google Maps" src="https://www.google.com/maps?q=60.47143205,9.5007444&z=12&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>
      <div className="retreat-directions-copy"><p>GRANDCABIN · TURUFJELL</p><h2>{language === "nb" ? "Under to timer fra Oslo." : "Under two hours from Oslo."}</h2><div className="retreat-direction-list">
        <article><b>01</b><h3>{language === "nb" ? "Med bil" : "By car"}</h3><span>{language === "nb" ? "Kjør fra Oslo til Turufjell på under to timer. Det er rikelig med parkering på eiendommen." : "Drive from Oslo to Turufjell in under two hours. There is ample parking at the property."}</span></article>
        <article><b>02</b><h3>{language === "nb" ? "Med tog" : "By train"}</h3><span>{language === "nb" ? "Ta toget til Flå stasjon og fortsett den siste korte etappen med taxi opp til fjellet." : "Take the train to Flå station and continue the final short leg by taxi up the mountain."}</span></article>
        <article><b>03</b><h3>{language === "nb" ? "Med elbil" : "By electric car"}</h3><span>{language === "nb" ? "Ladestasjoner finnes ved kaféen nær skiheisen, omtrent 150 meter unna, og i Flå sentrum." : "Charging is available by the café near the ski lift, around 150 metres away, and in Flå village."}</span></article>
      </div><a className="retreat-map-link" href="https://www.google.com/maps/dir/?api=1&destination=60.47143205%2C9.5007444" target="_blank" rel="noreferrer">{language === "nb" ? "ÅPNE VEIBESKRIVELSE I GOOGLE MAPS" : "OPEN DIRECTIONS IN GOOGLE MAPS"} ↗</a></div>
    </section>
  );

  const bedroomBreakdown = page === "bedrooms" && (
    <>
      <section className="retreat-floor-plan">
        <div className="retreat-floor-heading"><p>{language === "nb" ? "SOVEPLAN" : "SLEEPING PLAN"}</p><h2>{language === "nb" ? "Alle rom, nivå for nivå." : "Every room, level by level."}</h2></div>
        <div className="retreat-floor-grid">
          <article><span>01</span><h3>{language === "nb" ? "Underetasje" : "Lower floor"}</h3><strong>{language === "nb" ? "16 sengeplasser" : "16 beds"}</strong><ul><li>{language === "nb" ? "Rom 1 · køyeseng · 3 plasser" : "Room 1 · bunk bed · sleeps 3"}</li><li>{language === "nb" ? "Rom 2 · køyeseng · 3 plasser" : "Room 2 · bunk bed · sleeps 3"}</li><li>{language === "nb" ? "Rom 3 · dobbeltseng · 2 plasser" : "Room 3 · double bed · sleeps 2"}</li><li>{language === "nb" ? "Rom 4 og 5 · to køyesenger · 4 i hvert rom" : "Rooms 4 and 5 · two bunk beds · 4 in each room"}</li></ul></article>
          <article><span>02</span><h3>{language === "nb" ? "Hovedetasje" : "Main floor"}</h3><strong>{language === "nb" ? "5 sengeplasser" : "5 beds"}</strong><ul><li>{language === "nb" ? "Rom 6 · dobbeltseng · 2 plasser" : "Room 6 · double bed · sleeps 2"}</li><li>{language === "nb" ? "Rom 7 · køyeseng · 3 plasser" : "Room 7 · bunk bed · sleeps 3"}</li><li>{language === "nb" ? "Badstue og eget toalett på nivået" : "Sauna and separate toilet on the floor"}</li></ul></article>
          <article><span>03</span><h3>{language === "nb" ? "Loft" : "Loft"}</h3><strong>{language === "nb" ? "8 sengeplasser" : "8 beds"}</strong><ul><li>{language === "nb" ? "Rom 8 · dobbeltseng · 2 plasser" : "Room 8 · double bed · sleeps 2"}</li><li>{language === "nb" ? "Rom 9 · dobbeltseng · 2 plasser" : "Room 9 · double bed · sleeps 2"}</li><li>{language === "nb" ? "Sovealkove · 4 separate madrasser" : "Sleeping alcove · 4 single mattresses"}</li><li>{language === "nb" ? "Bad med dusj" : "Bathroom with shower"}</li></ul></article>
        </div>
      </section>
      <section className="retreat-master-suite"><div className="retreat-master-image"><Image src="/images/finn-gallery/33.jpg" alt={language === "nb" ? "Hovedsoverommet" : "The main bedroom"} fill sizes="(max-width: 900px) 100vw, 58vw" /></div><div><p>{language === "nb" ? "HOVEDSUITEN" : "THE MAIN SUITE"}</p><h2>{language === "nb" ? "Over 35 m² med privat velvære." : "Over 35 m² of private wellbeing."}</h2><span>{language === "nb" ? "Hovedsoverommet og den tilhørende velværeavdelingen danner en romslig, privat sone med eget toalett, badstue og badekar. Et rolig tilfluktssted med samme varme materialitet som resten av hytta." : "The main bedroom and its adjoining wellness area form a generous private zone with its own toilet, sauna and bathtub. A quiet retreat with the same warm material palette as the rest of the cabin."}</span><ul><li>{language === "nb" ? "Over 35 m² totalt" : "Over 35 m² in total"}</li><li>{language === "nb" ? "Eget toalett" : "Private toilet"}</li><li>{language === "nb" ? "Badstue og badekar" : "Sauna and bathtub"}</li></ul></div></section>
    </>
  );

  const gatheringTypes = page === "meetings" && (
    <section className="retreat-gathering-types">
      <div className="retreat-gathering-heading"><p>{language === "nb" ? "TO MÅTER Å SAMLES PÅ" : "TWO WAYS TO GATHER"}</p><h2>{language === "nb" ? "Profesjonelt når det trengs. Personlig når det gjelder." : "Professional when needed. Personal when it matters."}</h2></div>
      <div className="retreat-gathering-grid">
        <article><div className="retreat-gathering-image"><Image src={image("gathering")} alt={language === "nb" ? "Bedriftssamling" : "Company retreat"} fill sizes="50vw" /></div><div><span>01</span><h3>{language === "nb" ? "Bedriftssamlinger" : "Company retreats"}</h3><p>{language === "nb" ? "Flytt strategien, ledergruppen eller hele teamet ut av de vante rammene. Grandcabin gir dere arbeidsro, stor skjerm, bredbånd og fleksible fellesrom – med fjellet som arena for pauser, kick-off og teambuilding." : "Move strategy sessions, leadership meetings or the whole team beyond the usual setting. Grandcabin offers focus, a large screen, broadband and flexible shared spaces, with the mountain as a setting for breaks, kick-offs and team building."}</p><ul><li>Kick-off</li><li>{language === "nb" ? "Strategi og ledermøter" : "Strategy and leadership meetings"}</li><li>{language === "nb" ? "Kurs og teambuilding" : "Workshops and team building"}</li></ul></div></article>
        <article><div className="retreat-gathering-image"><Image src={image("dining")} alt={language === "nb" ? "Privat samling" : "Private gathering"} fill sizes="50vw" /></div><div><span>02</span><h3>{language === "nb" ? "Private samlinger" : "Private gatherings"}</h3><p>{language === "nb" ? "Jubileum, storfamilie eller en helg med de nærmeste. Hele hytta er deres, med plass til lange middager, rolige morgener og feiringer som kan fortsette uten avbrudd. Ni soverom gjør det enkelt å samle alle under samme tak." : "An anniversary, the extended family or a weekend with close friends. The whole cabin is yours, with space for long dinners, slow mornings and celebrations that can continue uninterrupted. Nine bedrooms bring everyone under one roof."}</p><ul><li>{language === "nb" ? "Jubileer og merkedager" : "Anniversaries and milestones"}</li><li>{language === "nb" ? "Storfamilie og venner" : "Extended family and friends"}</li><li>{language === "nb" ? "Eksklusiv bruk av hele hytta" : "Exclusive use of the entire cabin"}</li></ul></div></article>
      </div>
      <div className="retreat-company-strip"><p>{language === "nb" ? "TEAM SOM HAR VALGT GRANDCABIN" : "TEAMS THAT HAVE CHOSEN GRANDCABIN"}</p><div>{["KIWI", "FLYTOGET", "RYSTAD ENERGY", "KPMG", "RSA"].map((company) => <span key={company}>{company}</span>)}</div></div>
    </section>
  );

  if (page === "gallery") {
    return (
      <div className="concept-page retreat-page retreat-detail-page">
        <RetreatNav language={language} setLanguage={setLanguage} />
        <main className="retreat-gallery-all">
          <div className="retreat-gallery-all-title"><p>{t.number} · GRANDCABIN</p><h1>{t.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h1><span>{language === "nb" ? "Hele FINN-galleriet samlet på ett sted." : "The complete FINN gallery in one place."}</span><b>75</b></div>
          <div className="retreat-gallery-all-grid">{finnGalleryPhotos.map((photo, index) => <figure className={index % 13 === 0 ? "wide" : index % 9 === 0 ? "tall" : ""} key={photo}><Image src={photo} alt={`${language === "nb" ? "Grandcabin bilde" : "Grandcabin photo"} ${index + 1}`} fill sizes="(max-width: 700px) 50vw, 33vw" /><span>{(index + 1).toString().padStart(2, "0")}</span></figure>)}</div>
        </main>
        {moreSections}
        <ConceptSwitcher active="retreat" />
      </div>
    );
  }

  return (
    <div className="concept-page retreat-page retreat-detail-page">
      <RetreatNav language={language} setLanguage={setLanguage} />
      <main className="retreat-detail">
        <div className="retreat-detail-image"><Image src={image(t.photo)} alt={t.alt} fill priority sizes="(max-width: 900px) 100vw, 58vw" /></div>
        <div className="retreat-detail-copy"><p>{t.number}</p><h1>{t.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h1><div className="retreat-detail-text"><span>{t.text}</span><ul>{t.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul></div><div className="retreat-detail-links"><Link href={page === "cabin" ? retreatPaths[1] : retreatPaths[Math.min(retreatPaths.indexOf(`/concepts/retreat/${page}`) + 1, retreatPaths.length - 1)]}>{language === "nb" ? "NESTE SIDE" : "NEXT PAGE"} →</Link><a href={finnUrl} target="_blank" rel="noreferrer">FINN ↗</a></div></div>
      </main>
      {cabinDirections}
      {bedroomBreakdown}
      {gatheringTypes}
      {moreSections}
      <ConceptSwitcher active="retreat" />
    </div>
  );
}
