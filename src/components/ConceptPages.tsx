"use client";

import Image from "next/image";
import Link from "next/link";
import { finnUrl } from "@/content/site";
import { useSiteLanguage, type Language } from "@/components/useSiteLanguage";

const image = (name: string) => name === "ski" ? "/images/turufjell-ski-map-original.png" : `/images/${name}.avif`;
const galleryPhotos = Array.from({ length: 74 }, (_, index) => `/images/gallery-updated/${(index + 1).toString().padStart(2, "0")}.png`);
const locationMapTiles = Array.from({ length: 16 }, (_, index) => ({
  x: 4310 + (index % 4),
  y: 2355 + Math.floor(index / 4),
}));
const regionalMapTiles = Array.from({ length: 16 }, (_, index) => ({
  x: 32 + (index % 4),
  y: 16 + Math.floor(index / 4),
}));

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

export function DestinationConcept() {
  const [language, setLanguage] = useSiteLanguage();
  const t = language === "nb" ? {
    nav: ["Opplevelser", "Hytta", "Reisen hit"], eyebrow: "Turufjell · Flå · Hallingdal",
    title: "Hele fjellet.\nEtt sted å samles.", lead: "En stor og lun base for 29 gjester, med natur og aktiviteter rett utenfor døren.", cta: "Se tilgjengelighet på FINN",
    seasonTitle: "Velg deres fjellopplevelse", seasonLead: "Turufjell skifter karakter med årstidene. Hytta gir dere samme gode utgangspunkt hele året.",
    winter: "Vinter på Turufjell", winterText: "Ski inn og ut, langrennsløyper og lune pauser rundt peisen.", summer: "Sommer i høyden", summerText: "Sykkel, fjellturer, fiskevann og lange kvelder på terrassen.",
    baseLabel: "DERES BASE", baseTitle: "Stor nok for alle.\nLun nok til å føles nær.", baseText: "360 kvadratmeter gir rom for både fellesskap og rolige øyeblikk. To kjøkken, to badstuer og store oppholdsrom gjør det enkelt å samle familie, venner eller kollegaer.",
    nearby: "Alt dere trenger, i nærheten", distances: [["Ved døren", "til langrennsløypa"], ["Ca. 150 m", "til alpinbakken"], ["15 min", "til Flå sentrum"], ["< 2 timer", "fra Oslo"]],
    routeLabel: "EN ENKEL REISE TIL FJELLET", routeTitle: "Nær nok for en helg.\nStor nok for en anledning.", routeText: "Kjør fra Oslo på under to timer, eller ta toget til Flå og taxi videre. Ved hytta er det god plass til parkering.",
    close: "Klar for Turufjell?", closeText: "Se ledige datoer, priser og vilkår i vår FINN-annonse.",
  } : {
    nav: ["Experiences", "The cabin", "Getting here"], eyebrow: "Turufjell · Flå · Hallingdal",
    title: "The whole mountain.\nOne place to gather.", lead: "A generous, welcoming base for 29 guests, with nature and activities just outside.", cta: "Check availability on FINN",
    seasonTitle: "Choose your mountain experience", seasonLead: "Turufjell changes with the seasons. The cabin is your comfortable base all year round.",
    winter: "Winter at Turufjell", winterText: "Ski-in access, cross-country trails and warm evenings by the fire.", summer: "Summer in the mountains", summerText: "Cycling, mountain walks, fishing lakes and long evenings on the terrace.",
    baseLabel: "YOUR BASE", baseTitle: "Room for everyone.\nWarm enough to feel close.", baseText: "With 360 square metres, there is room to come together and room to unwind. Two kitchens, two saunas and generous living spaces make group stays easy.",
    nearby: "Everything close at hand", distances: [["At the door", "to cross-country trails"], ["Approx. 150 m", "to the ski slope"], ["15 min", "to Flå village"], ["< 2 hours", "from Oslo"]],
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
      </main>
    </div>
  );
}

export function EditorialConcept() {
  const [language, setLanguage] = useSiteLanguage();
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
      </main>
    </div>
  );
}

export function GroupsConcept() {
  const [language, setLanguage] = useSiteLanguage();
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
      </main>
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
  const [language, setLanguage] = useSiteLanguage();
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
    </div>
  );
}

export function ChaletConcept() {
  const [language, setLanguage] = useSiteLanguage();
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
    nav: ["The cabin", "Bedrooms", "Retreats", "Wellness", "Turufjell"],
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
    </div>
  );
}

export function RetreatLongConcept() {
  const [language, setLanguage] = useSiteLanguage();
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
    </div>
  );
}

type RetreatPageKey = "cabin" | "bedrooms" | "meetings" | "turufjell" | "location" | "materials" | "gallery" | "tour";

const retreatPaths = [
  "/concepts/retreat/cabin",
  "/concepts/retreat/bedrooms",
  "/concepts/retreat/meetings",
  "/concepts/retreat/materials",
  "/concepts/retreat/turufjell",
  "/concepts/retreat/location",
  "/concepts/retreat/gallery",
  "/concepts/retreat/3d-tour",
];

export function RetreatNav({ language, setLanguage, page }: { language: Language; setLanguage: (language: Language) => void; page?: RetreatPageKey }) {
  const labels = language === "nb"
    ? ["Hytta", "Soverom", "Samlinger", "Håndverk", "Turufjell", "Beliggenhet", "Galleri", "3D-visning"]
    : ["The cabin", "Bedrooms", "Retreats", "Craftsmanship", "Turufjell", "Location", "Gallery", "3D tour"];

  return (
    <header className="retreat-header retreat-header-pages">
      <Link href="/concepts/retreat" className="retreat-logo"><b>Grand</b><span>cabin</span><small>TURUFJELL</small></Link>
      <nav aria-label={language === "nb" ? "Grandcabin-sider" : "Grandcabin pages"}>{labels.map((label, index) => <Link key={label} href={retreatPaths[index]} aria-current={page && retreatPaths[index].endsWith(`/${page === "tour" ? "3d-tour" : page}`) ? "page" : undefined}>{label}</Link>)}</nav>
      <div className="retreat-actions"><LanguageToggle language={language} setLanguage={setLanguage} light /><Link className="retreat-booking-link" href="/booking">{language === "nb" ? "BESTILLING" : "BOOKING"} <span aria-hidden="true">↗</span></Link></div>
    </header>
  );
}

export function RetreatBookingFooter({ language }: { language: Language }) {
  return (
    <section className="retreat-detail-footer">
      <div className="retreat-footer-address">
        <p>GRANDCABIN</p>
        <span>Øvre Turusvingen 7<br />3539 Flå<br />{language === "nb" ? "Norge" : "Norway"}</span>
      </div>
      <div className="retreat-footer-booking">
        <p>{language === "nb" ? "FORESPØRSEL OG BESTILLING" : "ENQUIRIES AND BOOKING"}</p>
        <h2>{language === "nb" ? "Velkommen til fjells." : "Welcome to the mountains."}</h2>
        <span>{language === "nb" ? "La fjelldrømmen bli virkelighet. Velg datoene som passer, og send oss en forespørsel om et opphold skapt for dere." : "Make your mountain escape a reality. Choose your dates and send us an enquiry for a stay made for you."}</span>
        <Link href="/booking">{language === "nb" ? "SEND INN FORESPØRSEL" : "SEND AN ENQUIRY"} →</Link>
      </div>
      <div className="retreat-footer-contact">
        <p>{language === "nb" ? "KONTAKT OSS" : "CONTACT US"}</p>
        <a href="tel:+4797816981">+47 978 16 981</a>
        <a href="tel:+4796878888">+47 968 78 888</a>
      </div>
    </section>
  );
}

export function RetreatConcept() {
  const [language, setLanguage] = useSiteLanguage();
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
      <RetreatBookingFooter language={language} />
    </div>
  );
}

export function RetreatDetailPage({ page }: { page: RetreatPageKey }) {
  const [language, setLanguage] = useSiteLanguage();
  const nb = {
    cabin: { number: "01", title: "En stor hytte.\nEt privat fjellhjem.", text: "En av Norges mest særpregede hytter – og det er lett å forstå hvorfor. Gjennomtenkt arkitektur, solide materialer og høy komfort skaper rammene for et helt spesielt opphold.", photo: "living", alt: "Stuen med utsikt", facts: ["Ny fra 2024", "360 m²", "4 bad · 2 badstuer"] },
    bedrooms: { number: "02", title: "Ni soverom.\n29 sengeplasser.", text: "Soveplassene er fordelt over tre nivåer: 16 i underetasjen, fem i hovedetasjen og åtte på loftet. Det gir nærhet for gruppen og rolige soner når dagen er over.", photo: "bedroom", alt: "Et av soverommene", facts: ["16 nede", "5 hovedplan", "8 på loftet"] },
    meetings: { number: "03", title: "Samlinger med\nrom for ideer.", text: "Bredbånd, stor skjerm og fleksible oppholdsrom legger til rette for møter, kurs og mindre konferanser. Fjellandskapet gir naturlige pauser mellom øktene.", photo: "gathering", alt: "Møte- og konferanserom", facts: ["Stor skjerm", "Bredbånd", "Fleksible rom"] },
    materials: { number: "04", title: "Raffinert håndverk.\nNaturlige materialer.", text: "Massiv gran, børstet lerk og naturlige oljer gir Grandcabin en varm og moderne identitet. Hver overflate er valgt for å eldes vakkert og bringe naturen inn i rommene.", photo: "dining", alt: "Treverk og materialer i spisestuen", facts: ["4 bad · 2 badstuer", "Balansert ventilasjon", "Vannbåren varme"] },
    turufjell: { number: "05", title: "Fjellet begynner\nutenfor døren.", text: "Ski inn og ut om vinteren, og sykkel, turstier og fiskevann når snøen forsvinner. Turufjell ligger under to timer fra Oslo og 15 minutter fra Flå sentrum.", photo: "turufjell-hero-original", alt: "Panoramautsikt over Turufjell og Hallingdal", facts: ["Langrenn ved døren", "Ca. 150 m til alpint", "Under 2 t fra Oslo"] },
    location: { number: "06", title: "Nærmere enn\ndere tror.", text: "Grandcabin ligger på solsiden av Turufjell, under to timer fra Oslo og omtrent 15 minutter fra Flå. Kom med bil, tog eller buss – den siste etappen går rolig opp til fjellet.", photo: "terrace", alt: "Utsikten fra Grandcabin på Turufjell", facts: ["116 km fra Oslo", "15 min fra Flå", "Parkering ved hytta"] },
    gallery: { number: "07", title: "Grandcabin\ni bilder.", text: "Se rommene, utsikten og fjellet gjennom årstidene i den oppdaterte bildesamlingen.", photo: "exterior", alt: "Grandcabin om vinteren", facts: ["74 bilder", "Fire årstider", "Ett privat opphold"] },
    tour: { number: "08", title: "Gå gjennom\nGrandcabin.", text: "Utforsk hytta rom for rom i en interaktiv 3D-visning.", photo: "living", alt: "Grandcabin 3D-visning", facts: ["360° visning", "Tre nivåer", "Utforsk i eget tempo"] },
  };
  const en = {
    cabin: { number: "01", title: "A large cabin.\nA private mountain home.", text: "One of Norway’s most distinctive cabins – and it is easy to understand why. Thoughtful architecture, solid materials and exceptional comfort create the setting for a truly special stay.", photo: "living", alt: "Living room with a view", facts: ["New in 2024", "360 m²", "4 bathrooms · 2 saunas"] },
    bedrooms: { number: "02", title: "Nine bedrooms.\n29 beds.", text: "Sleeping space is arranged across three levels: 16 beds downstairs, five on the main floor and eight in the loft. The group stays close while everyone can still find a quiet place.", photo: "bedroom", alt: "One of the bedrooms", facts: ["16 downstairs", "5 main floor", "8 in the loft"] },
    meetings: { number: "03", title: "Gatherings with\nroom for ideas.", text: "Broadband, a large screen and flexible living spaces support meetings, workshops and smaller conferences. The mountain landscape creates natural breaks between sessions.", photo: "gathering", alt: "Meeting and conference room", facts: ["Large screen", "Broadband", "Flexible rooms"] },
    materials: { number: "04", title: "Refined craft.\nNatural materials.", text: "Solid spruce, brushed larch and natural oils give Grandcabin its warm, modern identity. Every surface is chosen to age beautifully and bring nature into the rooms.", photo: "dining", alt: "Timber and materials in the dining room", facts: ["4 bathrooms · 2 saunas", "Balanced ventilation", "Hydronic heating"] },
    turufjell: { number: "05", title: "The mountain begins\noutside the door.", text: "Ski in and out in winter, with cycling, trails and fishing lakes when the snow clears. Turufjell is under two hours from Oslo and 15 minutes from Flå village.", photo: "turufjell-hero-original", alt: "Panoramic view across Turufjell and Hallingdal", facts: ["Trails at the door", "Approx. 150 m to alpine", "Under 2 h from Oslo"] },
    location: { number: "06", title: "Closer than\nit feels.", text: "Grandcabin sits on the sunny side of Turufjell, under two hours from Oslo and around 15 minutes from Flå. Arrive by car, train or bus, then enjoy the final quiet climb into the mountains.", photo: "terrace", alt: "The view from Grandcabin at Turufjell", facts: ["116 km from Oslo", "15 min from Flå", "Parking at the cabin"] },
    gallery: { number: "07", title: "Grandcabin\nin pictures.", text: "See the rooms, views and mountain through the seasons in the updated photo collection.", photo: "exterior", alt: "Grandcabin in winter", facts: ["74 photos", "Four seasons", "One private stay"] },
    tour: { number: "08", title: "Walk through\nGrandcabin.", text: "Explore the cabin room by room in an interactive 3D experience.", photo: "living", alt: "Grandcabin 3D tour", facts: ["360° view", "Three levels", "Explore at your pace"] },
  };
  const t = (language === "nb" ? nb : en)[page];
  const extendedNb = {
    cabin: { leadTitle: "Laget for de lange dagene sammen", leadText: "To kjøkken, to store spiseområder og flere oppholdssoner gjør det enkelt å veksle mellom felles måltider, rolige samtaler og en pause for seg selv.", leadPhoto: "dining", bannerTitle: "Fjellutsikt fra morgen til kveld", bannerText: "De store vindusflatene lar lyset og landskapet bli en del av interiøret.", bannerPhoto: "exterior", pointsTitle: "Gjennomtenkt komfort", points: ["Vannbåren varme i hele hytta", "Balansert ventilasjon", "Parkering ved hytta"] },
    bedrooms: { leadTitle: "Tre nivåer gir naturlig ro", leadText: "Soverommene er fordelt slik at barn, voksne og mindre familier kan finne sin plass. En egen sovealkove på loftet gir ekstra fleksibilitet.", leadPhoto: "living", bannerTitle: "Våkne til fjellet", bannerText: "Naturlige materialer, varme flater og dempede farger skaper en rolig ramme rundt natten.", bannerPhoto: "terrace", pointsTitle: "Enkel romfordeling", points: ["5 soverom i underetasjen", "2 soverom i hovedetasjen", "2 soverom og alkove på loftet"] },
    meetings: { leadTitle: "Fra agenda til langbord", leadText: "Når arbeidsøkten er ferdig, kan gruppen fortsette samtalen rundt et langbord med plass til opptil 26–28 personer i underetasjen.", leadPhoto: "dining", bannerTitle: "Pauser som faktisk gir energi", bannerText: "Langrennsløypa starter utenfor døren, og alpinbakken nås på ski uten bil. Et miljøskifte er bare noen skritt unna.", bannerPhoto: "terrace", pointsTitle: "For produktive samlinger", points: ["Stor skjerm", "Stabilt bredbånd", "Flere fellesarealer"] },
    turufjell: { leadTitle: "Vinteren starter ved hytta", leadText: "Langrennsløypa starter rett utenfor hyttedøren. Herfra kan dere ta på skiene og følge løypa omtrent 150 meter til alpinanlegget – helt uten bil.", leadPhoto: "exterior", bannerTitle: "Et fjell for alle årstider", bannerText: "Når snøen forsvinner, åpner området seg for sykkel, fjellturer, fiskevann og lange dager i frisk luft.", bannerPhoto: "cycling", pointsTitle: "Nærmere enn dere tror", points: ["Under 2 timer fra Oslo", "15 minutter til Flå", "Tog og taxi er mulig"] },
    location: { leadTitle: "En enkel reise til fjellet", leadText: "Adressen fører dere helt frem til hytta. Bilreisen fra Oslo er 116 kilometer, mens tog og buss stopper i Flå for en kort videre tur med taxi. Ved ankomst er det god plass til parkering på eiendommen.", leadPhoto: "exterior", bannerTitle: "Fra reisen til roen", bannerText: "Planlegg den siste etappen før avreise, så kan oppholdet begynne idet fjellandskapet åpner seg over Turufjell.", bannerPhoto: "terrace", pointsTitle: "Godt å vite før avreise", points: ["Øvre Turusvingen 7, 3539 Flå", "Bestill taxi fra Flå på forhånd", "Lading ved skikaféen og i Flå"] },
    materials: { leadTitle: "Heltre gran, formet av naturen", leadText: "Veggkledningen i massiv gran gir en moderne tolkning av tradisjonelt trehåndverk. Den tilhuggede overflaten skaper dybde og kontrast mot glass, glatte vegger og minimalistiske møbler. Ingen bord gjentar seg – hvert stykke får sitt eget uttrykk.", leadPhoto: "living", bannerTitle: "Børstet lerk med levende dybde", bannerText: "Børstingen fjerner det mykere vårveden og lar den hardere veden og årringene tre tydelig frem. Resultatet er en taktil overflate med naturlige fargevariasjoner, varme og en sterk forbindelse til landskapet.", bannerPhoto: "exterior", pointsTitle: "Materialer som arbeider med rommet", points: ["Massivtre fra Tirol", "Antistatisk og fuktighetsregulerende", "Innvendig og utvendig kledning"] },
    gallery: { leadTitle: "Fra de store rommene til de små detaljene", leadText: "Bildene viser hvordan utsikt, treverk og lys følger dere gjennom hele hytta – fra langbordet og møteplassen til soverommene og badstuen.", leadPhoto: "gathering", bannerTitle: "Samme utsikt. Nye årstider.", bannerText: "Vinteren er dramatisk og lun. Sommeren åpner terrassen og fjellet for lange dager ute.", bannerPhoto: "cycling", pointsTitle: "Se hele historien", points: ["Interiør og rom", "Fjell og aktiviteter", "74 oppdaterte bilder"] },
    tour: { leadTitle: "Se rommene før dere kommer", leadText: "Den interaktive visningen gir et tydelig inntrykk av planløsning, avstander og de store fellesrommene.", leadPhoto: "living", bannerTitle: "Tre nivåer. Ett fjellhjem.", bannerText: "Beveg dere fritt gjennom Grandcabin og finn rommene som passer gruppen.", bannerPhoto: "exterior", pointsTitle: "Utforsk hele hytta", points: ["Interaktiv 3D-visning", "Alle tre nivåer", "Åpne i fullskjerm"] },
  };
  const extendedEn = {
    cabin: { leadTitle: "Made for long days together", leadText: "Two kitchens, two generous dining areas and several living zones make it easy to move between shared meals, quiet conversations and time alone.", leadPhoto: "dining", bannerTitle: "Mountain views from morning to evening", bannerText: "Wide windows bring the changing light and landscape into the interior.", bannerPhoto: "exterior", pointsTitle: "Considered comfort", points: ["Hydronic heating throughout the cabin", "Balanced ventilation", "Parking at the cabin"] },
    bedrooms: { leadTitle: "Three levels create natural calm", leadText: "The bedrooms are arranged so children, adults and smaller families can find their place. A separate sleeping alcove in the loft adds flexibility.", leadPhoto: "living", bannerTitle: "Wake up to the mountains", bannerText: "Natural materials, warm surfaces and quiet colours create a restful setting for the night.", bannerPhoto: "terrace", pointsTitle: "A simple room plan", points: ["5 bedrooms downstairs", "2 bedrooms on the main floor", "2 bedrooms and loft alcove"] },
    meetings: { leadTitle: "From the agenda to the long table", leadText: "When the work session ends, the conversation can continue around a long table seating up to 26–28 people downstairs.", leadPhoto: "dining", bannerTitle: "Breaks that restore your energy", bannerText: "Cross-country trails begin at the door, and the alpine area is reached on skis without a car. A complete change of scene is only a few steps away.", bannerPhoto: "terrace", pointsTitle: "For productive retreats", points: ["Large screen", "Reliable broadband", "Several shared spaces"] },
    turufjell: { leadTitle: "Winter begins at the cabin", leadText: "The cross-country trail begins right outside the cabin. From the doorstep, you can put on your skis and follow the trail for approximately 150 metres to the alpine area – no car needed.", leadPhoto: "exterior", bannerTitle: "A mountain for every season", bannerText: "When the snow clears, the area opens for cycling, mountain walks, fishing lakes and long days in fresh air.", bannerPhoto: "cycling", pointsTitle: "Closer than it feels", points: ["Under 2 hours from Oslo", "15 minutes to Flå", "Train and taxi are possible"] },
    location: { leadTitle: "A simple journey to the mountains", leadText: "The address brings you all the way to the cabin. Oslo is 116 kilometres away, while trains and buses stop in Flå for a short onward taxi journey. Ample parking is available at the property when you arrive.", leadPhoto: "exterior", bannerTitle: "From the journey to the calm", bannerText: "Plan the final leg before departure, then let the stay begin as the mountain landscape opens across Turufjell.", bannerPhoto: "terrace", pointsTitle: "Good to know before you leave", points: ["Øvre Turusvingen 7, 3539 Flå", "Pre-book a taxi from Flå", "Charging by the ski café and in Flå"] },
    materials: { leadTitle: "Solid spruce, shaped by nature", leadText: "Solid spruce wall cladding gives traditional timber craft a modern expression. The hewn surface creates depth and contrast beside glass, smooth walls and minimal furniture. No board repeats; every piece has its own character.", leadPhoto: "living", bannerTitle: "Brushed larch with living depth", bannerText: "Brushing removes the softer earlywood and reveals the harder latewood and annual rings. The result is a tactile surface with natural colour variation, warmth and a strong connection to the landscape.", bannerPhoto: "exterior", pointsTitle: "Materials that work with the room", points: ["Solid timber from Tyrol", "Antistatic and moisture regulating", "Interior and exterior cladding"] },
    gallery: { leadTitle: "From generous spaces to quiet details", leadText: "The photographs show how views, timber and light follow you through the cabin, from the long table and meeting room to bedrooms and saunas.", leadPhoto: "gathering", bannerTitle: "The same view. New seasons.", bannerText: "Winter feels dramatic and intimate. Summer opens the terrace and mountain for long days outside.", bannerPhoto: "cycling", pointsTitle: "See the full story", points: ["Interiors and rooms", "Mountain and activities", "74 updated photos"] },
    tour: { leadTitle: "See the rooms before you arrive", leadText: "The interactive view gives a clear sense of the layout, distances and generous shared spaces.", leadPhoto: "living", bannerTitle: "Three levels. One mountain home.", bannerText: "Move freely through Grandcabin and find the rooms that suit your group.", bannerPhoto: "exterior", pointsTitle: "Explore the entire cabin", points: ["Interactive 3D view", "All three levels", "Open full screen"] },
  };
  const more = (language === "nb" ? extendedNb : extendedEn)[page];
  const detailBanner = (
    <>
      <section className={`retreat-detail-banner${page === "cabin" ? " retreat-detail-banner-cabin" : ""}`}>
        <Image src={image(more.bannerPhoto)} alt="" fill sizes="100vw" />
      </section>
      <section className={`retreat-banner-caption${page === "cabin" ? " retreat-banner-caption-single" : ""}`}><h2>{more.bannerTitle}</h2>{page !== "cabin" && <p>{more.bannerText}</p>}</section>
    </>
  );
  const guestReviews = language === "nb" ? [
    { name: "Alex I.", date: "DESEMBER 2025", score: "10", text: "Et helt utrolig opphold som anbefales til alle. Ti av ti." },
    { name: "Pål B.", date: "OKTOBER 2025", score: "10", text: "Hytta passet svært godt for 17 kollegaer. De fremhever god oppfølging, tydelige instruksjoner og raske svar." },
    { name: "Anadine", date: "JANUAR 2025", score: "10", text: "En fantastisk helg i en stor og vakker hytte, med imponerende utsikt og et stilfullt, gjennomført interiør." },
    { name: "Anne W.", date: "DESEMBER 2024", score: "10", text: "Familien på 16 storkoste seg gjennom juleoppholdet. Gulvvarmen, hytta og den hyggelige kommunikasjonen ble særlig trukket frem." },
  ] : [
    { name: "Alex I.", date: "DECEMBER 2025", score: "10", text: "An incredible stay that they would recommend to everyone. Ten out of ten." },
    { name: "Pål B.", date: "OCTOBER 2025", score: "10", text: "The cabin worked beautifully for 17 colleagues. They highlighted the helpful follow-up, clear instructions and quick replies." },
    { name: "Anadine", date: "JANUARY 2025", score: "10", text: "A wonderful weekend in a large, beautiful cabin, with remarkable views and a stylish, carefully considered interior." },
    { name: "Anne W.", date: "DECEMBER 2024", score: "10", text: "A family of 16 loved their Christmas stay, especially the warm floors, beautiful cabin and friendly communication." },
  ];
  const cabinReviews = page === "cabin" && (
    <section className="retreat-reviews">
      <header className="retreat-reviews-head">
        <div><p>{language === "nb" ? "VURDERINGER PÅ FINN" : "REVIEWS ON FINN"}</p><h2>{language === "nb" ? "Dette trekker gjestene frem." : "What guests highlight."}</h2></div>
        <div className="retreat-reviews-summary"><strong>10</strong><span>{language === "nb" ? "UTMERKET" : "EXCELLENT"}</span><small>{language === "nb" ? "Vurderinger på FINN" : "Reviews on FINN"}</small></div>
      </header>
      <div className="retreat-reviews-grid">{guestReviews.map((review) => <article key={`${review.name}-${review.date}`}><div><span>{review.score}/10</span><small>{review.date}</small></div><p>{review.text}</p><strong>{review.name}</strong></article>)}</div>
      <div className="retreat-reviews-source"><span>{language === "nb" ? "Kortfattede sammendrag av utvalgte positive gjestevurderinger på FINN." : "Concise summaries of selected positive guest reviews on FINN."}</span></div>
    </section>
  );
  const moreSections = (
    <>
      <section className="retreat-detail-story">
        <div className="retreat-detail-story-image"><Image src={image(more.leadPhoto)} alt="" fill sizes="(max-width: 900px) 100vw, 52vw" /></div>
        <div className="retreat-detail-story-copy"><p>{t.number} · GRANDCABIN</p><h2>{more.leadTitle}</h2><span>{more.leadText}</span></div>
      </section>
      {page === "materials" && (
        <section className="retreat-bespoke">
          <header>
            <p>{language === "nb" ? "SKREDDERSYDD INTERIØR" : "BESPOKE INTERIORS"}</p>
            <h2>{language === "nb" ? "Bygget for hytta. Laget for hånd." : "Built for the cabin. Made by hand."}</h2>
            <span>{language === "nb" ? "Grandcabin er formet som en helhet, der varme naturmaterialer møter presise, moderne linjer. Mange av møblene og de faste løsningene er tegnet og bygget spesielt for rommene. Resultatet er en rolig luksus som merkes i detaljene." : "Grandcabin is conceived as a whole, where warm natural materials meet precise, modern lines. Many furnishings and fitted solutions were designed and built specifically for the rooms, creating a quiet sense of luxury in every detail."}</span>
          </header>
          <article className="retreat-bespoke-feature">
            <div className="retreat-bespoke-images">
              <figure className="retreat-craft-double-vanity"><Image src="/images/finn-gallery/46.jpg" alt={language === "nb" ? "Håndlaget baderomsmøbel i eik med doble servanter" : "Handmade oak bathroom vanity with twin basins"} fill unoptimized sizes="(max-width: 900px) 100vw, 48vw" /></figure>
              <figure className="retreat-craft-vanity-detail"><Image src="/images/finn-gallery/34.jpg" alt={language === "nb" ? "Unikt baderomsmøbel i eik" : "Unique oak bathroom vanity"} fill unoptimized sizes="(max-width: 900px) 58vw, 28vw" /></figure>
            </div>
            <div className="retreat-bespoke-copy"><span>01</span><h3>{language === "nb" ? "Unike baderomsmøbler i eik" : "Unique oak bathroom furniture"}</h3><p>{language === "nb" ? "Baderomsmøblene er utført i eik og bygget enkeltvis for det rommet de står i. De er ikke hentet fra en fabrikkserie. Hver benk, skuff og detalj er tilpasset materialene, målene og uttrykket i hytta." : "The bathroom furniture is crafted in oak and built individually for each room. Nothing comes from a standard factory range. Every counter, drawer and detail is tailored to the cabin’s dimensions, materials and architectural character."}</p><p>{language === "nb" ? "Treets naturlige spill står i kontrast til mørk stein, sorte armaturer og rene flater. Det gir badene et moderne, eksklusivt uttrykk uten å miste varmen og nærheten til naturen." : "The natural grain contrasts with dark stone, black fittings and clean surfaces, giving the bathrooms a modern, exclusive character while retaining warmth and a close connection to nature."}</p></div>
          </article>
          <article className="retreat-bespoke-feature retreat-bespoke-feature-reverse">
            <div className="retreat-bespoke-images">
              <figure className="retreat-craft-bunks"><Image src="/images/finn-gallery/52.jpg" alt={language === "nb" ? "Integrerte senger bygget i tre" : "Built-in timber beds"} fill unoptimized sizes="(max-width: 900px) 100vw, 48vw" /></figure>
              <figure className="retreat-craft-bed-detail"><Image src="/images/finn-gallery/21.jpg" alt={language === "nb" ? "Spesialbygget seng i tre" : "Custom-built timber bed"} fill unoptimized sizes="(max-width: 900px) 58vw, 28vw" /></figure>
            </div>
            <div className="retreat-bespoke-copy"><span>02</span><h3>{language === "nb" ? "Senger integrert i arkitekturen" : "Beds integrated into the architecture"}</h3><p>{language === "nb" ? "Flere av sengene er bygget inn og håndtilpasset på stedet. De følger takvinkler og vegger, utnytter plassen godt og skaper lune, private soner selv når mange gjester bor sammen." : "Many beds are built in and fitted by hand on site. They follow roof angles and walls, make excellent use of space and create sheltered, private zones even when a large group stays together."}</p><p>{language === "nb" ? "De solide trekonstruksjonene gir hvert rom sitt eget særpreg. Sammen med behagelig belysning, myke tekstiler og gjennomtenkt oppbevaring blir soverommene både funksjonelle, moderne og inviterende." : "Solid timber construction gives every room its own identity. Paired with soft lighting, tactile textiles and considered storage, the bedrooms feel functional, modern and inviting."}</p></div>
          </article>
          <div className="retreat-bespoke-more">
            <figure className="retreat-craft-single-vanity"><Image src="/images/finn-gallery/47.jpg" alt={language === "nb" ? "Eikemøbel og servant i et av badene" : "Oak vanity and basin in one of the bathrooms"} fill unoptimized sizes="(max-width: 900px) 100vw, 40vw" /></figure>
            <figure className="retreat-craft-bunks-detail"><Image src="/images/finn-gallery/50.jpg" alt={language === "nb" ? "Håndbygde køyesenger i tre" : "Hand-built timber bunk beds"} fill unoptimized sizes="(max-width: 900px) 100vw, 45vw" /></figure>
          </div>
        </section>
      )}
      {page === "materials" && (
        <section className="retreat-technical-comfort">
          <header>
            <p>{language === "nb" ? "KOMFORT I HELE HYTTA" : "COMFORT THROUGHOUT"}</p>
            <h2>{language === "nb" ? "Teknikk som merkes som ro." : "Technology that feels effortless."}</h2>
            <span>{language === "nb" ? "Fire bad og to badstuer gir god flyt for store grupper. Samtidig sørger vannbåren varme i hele hytta og balansert ventilasjon for jevn temperatur og frisk luft på alle tre nivåer." : "Four bathrooms and two saunas keep a large group moving with ease. Hydronic heating throughout the cabin and balanced ventilation provide even warmth and fresh air across all three levels."}</span>
          </header>
          <div className="retreat-technical-comfort-grid">
            <article><strong>4</strong><h3>{language === "nb" ? "Bad" : "Bathrooms"}</h3><p>{language === "nb" ? "God kapasitet gjennom travle morgener og rolige kvelder." : "Generous capacity through busy mornings and relaxed evenings."}</p></article>
            <article><strong>2</strong><h3>{language === "nb" ? "Badstuer" : "Saunas"}</h3><p>{language === "nb" ? "To separate badstuer gir flere gjester plass til å lande samtidig." : "Two separate saunas give more guests room to unwind at the same time."}</p></article>
            <article><strong>{language === "nb" ? "HELE" : "ALL"}</strong><h3>{language === "nb" ? "Vannbåren varme" : "Hydronic heating"}</h3><p>{language === "nb" ? "Jevn og behagelig varme i hele hytta." : "Even, comfortable warmth throughout the cabin."}</p></article>
            <article><strong>{language === "nb" ? "FRISK" : "FRESH"}</strong><h3>{language === "nb" ? "Balansert ventilasjon" : "Balanced ventilation"}</h3><p>{language === "nb" ? "Kontinuerlig utskifting av luft gir et friskt og behagelig inneklima." : "Continuous air exchange supports a fresh, comfortable indoor climate."}</p></article>
          </div>
        </section>
      )}
      {page !== "cabin" && detailBanner}
      <section className="retreat-detail-points"><div><p>GRANDCABIN · TURUFJELL</p><h2>{more.pointsTitle}</h2></div><ul>{more.points.map((point, index) => <li key={point}><span>0{index + 1}</span>{point}</li>)}</ul></section>
      {page === "materials" && <section className="retreat-material-oil"><div><p>OSMO {language === "nb" ? "OLJEBEIS" : "OIL STAIN"}</p><h2>{language === "nb" ? <>Naturlig beskyttelse.<br />Treet får fortsatt puste.</> : <>Natural protection.<br />The timber still breathes.</>}</h2></div><div>{language === "nb" ? <><p>Overflatene er behandlet med Osmo oljebeis basert på naturlige planteoljer og harde vokser. Behandlingen trekker inn i treet og gir en vann- og smussavvisende overflate uten å legge en tett film over materialet.</p><p>Den diffusjonsåpne behandlingen lar treet ta opp og slippe ut fuktighet. Slik bevares det naturlige uttrykket, samtidig som overflaten blir slitesterk, antistatisk og enklere å holde ren. Osmo er FSC-sertifisert.</p></> : <><p>The surfaces are treated with Osmo oil stain based on natural plant oils and hard waxes. It penetrates the timber to create a water- and dirt-resistant finish without sealing the material beneath a dense film.</p><p>The breathable finish lets timber absorb and release moisture. Its natural appearance remains intact while the surface becomes durable, antistatic and easier to maintain. Osmo is FSC certified.</p></>}</div></section>}
      {cabinReviews}
      <RetreatBookingFooter language={language} />
    </>
  );

  const locationDirections = page === "location" && (
    <section className="retreat-directions">
      <div className="retreat-map">
        <div className="retreat-map-tiles" aria-hidden="true">{locationMapTiles.map(({ x, y }) => <span key={`${x}-${y}`} style={{ backgroundImage: `url(https://tile.openstreetmap.org/13/${x}/${y}.png)` }} />)}</div>
        <span className="retreat-map-pin" aria-hidden="true"><i /></span>
        <a className="retreat-map-credit" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap</a>
        <a className="retreat-map-card" href="https://www.google.com/maps/dir/?api=1&destination=%C3%98vre%20Turusvingen%207%2C%203539%20Fl%C3%A5" target="_blank" rel="noreferrer"><span>GRANDCABIN</span><b>Øvre Turusvingen 7</b><small>{language === "nb" ? "KLIKK FOR VEIBESKRIVELSE" : "CLICK FOR DIRECTIONS"} ↗</small></a>
      </div>
      <div className="retreat-directions-copy"><p>GRANDCABIN · TURUFJELL</p><h2>{language === "nb" ? "Under to timer fra Oslo." : "Under two hours from Oslo."}</h2><div className="retreat-direction-list">
        <article><b>01</b><h3>{language === "nb" ? "Med bil" : "By car"}</h3><span>{language === "nb" ? "Kjør fra Oslo til Turufjell på under to timer. Google Maps leder dere helt frem til Øvre Turusvingen 7, og det er rikelig med parkering på eiendommen." : "Drive from Oslo to Turufjell in under two hours. Google Maps leads you directly to Øvre Turusvingen 7, with ample parking at the property."}</span><a href="https://www.google.com/maps/dir/?api=1&destination=%C3%98vre%20Turusvingen%207%2C%203539%20Fl%C3%A5" target="_blank" rel="noreferrer">{language === "nb" ? "START VEIBESKRIVELSE" : "START DIRECTIONS"} ↗</a></article>
        <article><b>02</b><h3>{language === "nb" ? "Med tog" : "By train"}</h3><span>{language === "nb" ? "La bilen stå og reis komfortabelt med Bergensbanen. Flere daglige avganger i begge retninger stopper på Flå stasjon. Derfra tar dere taxi eller avtaler annen transport den siste korte etappen opp til Turufjell." : "Leave the car behind and travel comfortably on the Bergen railway. Several daily services in both directions stop at Flå station. From there, take a taxi or arrange transport for the final short journey to Turufjell."}</span><a href="https://www.vy.no/" target="_blank" rel="noreferrer">{language === "nb" ? "SJEKK AVGANGER OG BESTILL TOGBILLETT" : "CHECK TIMES AND BOOK TRAIN TICKETS"} ↗</a></article>
        <article><b>03</b><h3>{language === "nb" ? "Med buss" : "By bus"}</h3><span>{language === "nb" ? "Vy Buss har flere daglige avganger i begge retninger med stopp i Flå. Fra holdeplassen fortsetter dere med taxi eller annen avtalt transport det siste stykket opp til Turufjell." : "Vy Bus operates several daily services in both directions with stops in Flå. Continue from the bus stop by taxi or other arranged transport for the final journey to Turufjell."}</span><a href="https://www.vybuss.no/#!/" target="_blank" rel="noreferrer">{language === "nb" ? "SJEKK RUTETIDER OG BESTILL BUSSBILLETT" : "CHECK TIMES AND BOOK BUS TICKETS"} ↗</a></article>
        <article><b>04</b><h3>{language === "nb" ? "Med elbil" : "By electric car"}</h3><span>{language === "nb" ? "Ladestasjoner finnes ved kaféen nær skiheisen, omtrent 150 meter unna, og i Flå sentrum. Det er lurt å planlegge ladingen før oppkjøringen til fjellet." : "Charging is available by the café near the ski lift, around 150 metres away, and in Flå village. It is helpful to plan your charge before the final drive into the mountains."}</span><a href="https://www.google.com/maps/search/?api=1&query=elbillading%20Fl%C3%A5" target="_blank" rel="noreferrer">{language === "nb" ? "FINN LADESTASJONER" : "FIND CHARGING STATIONS"} ↗</a></article>
      </div><a className="retreat-map-link" href="https://www.google.com/maps/dir/?api=1&destination=%C3%98vre%20Turusvingen%207%2C%203539%20Fl%C3%A5" target="_blank" rel="noreferrer">{language === "nb" ? "ÅPNE VEIBESKRIVELSE I GOOGLE MAPS" : "OPEN DIRECTIONS IN GOOGLE MAPS"} ↗</a></div>
    </section>
  );

  const locationDistances = page === "location" && (
    <section className="retreat-distance-guide">
      <div className="retreat-distance-overview">
        <div className="retreat-distance-copy">
          <p>{language === "nb" ? "KJØREAVSTANDER" : "DRIVING DISTANCES"}</p>
          <h2>{language === "nb" ? "Under 2 timer fra Oslo." : "Under two hours from Oslo."}</h2>
          <dl>
            {[["Ringerike", "66 km"], ["Oslo", "116 km"], ["Asker", "117 km"], ["Drammen", "137 km"], ["Tønsberg", "197 km"], ["Fredrikstad", "213 km"], ["Sandefjord", "215 km"], ["Larvik", "226 km"], ["Bergen", "353 km"]].map(([place, distance]) => <div key={place}><dt>{place}</dt><dd>{distance}</dd></div>)}
          </dl>
          <a href="https://www.google.com/maps/dir/?api=1&destination=%C3%98vre%20Turusvingen%207%2C%203539%20Fl%C3%A5" target="_blank" rel="noreferrer">{language === "nb" ? "FINN VEIEN MED GOOGLE MAPS" : "GET DIRECTIONS WITH GOOGLE MAPS"} ↗</a>
        </div>
        <div className="retreat-regional-map">
          <div className="retreat-regional-map-tiles" aria-hidden="true">{regionalMapTiles.map(({ x, y }) => <span key={`${x}-${y}`} style={{ backgroundImage: `url(https://tile.openstreetmap.org/6/${x}/${y}.png)` }} />)}</div>
          <span className="retreat-regional-pin" aria-hidden="true"><i /></span>
          <div className="retreat-regional-label"><span>GRANDCABIN</span><b>TURUFJELL</b></div>
          <a className="retreat-regional-credit" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap</a>
        </div>
      </div>
      <div className="retreat-nearby">
        <div className="retreat-nearby-image"><Image src={image("bjorneparken-bear")} alt={language === "nb" ? "Brunbjørn i norsk fjellnatur" : "Brown bear in Norwegian mountain nature"} fill sizes="(max-width: 900px) 100vw, 48vw" /></div>
        <div className="retreat-nearby-copy">
          <p>{language === "nb" ? "KORT VEI TIL DET DERE TRENGER" : "EVERYTHING YOU NEED NEARBY"}</p>
          <h2>{language === "nb" ? "Flå og Bjørneparken." : "Flå and Bjørneparken."}</h2>
          <dl>
            {[[language === "nb" ? "Bjørneparken" : "Bjørneparken wildlife park", "11 km"], [language === "nb" ? "Kjøpesenter" : "Shopping centre", "10 km"], [language === "nb" ? "Vinmonopol" : "Wine shop", "10 km"], [language === "nb" ? "Matbutikker" : "Grocery shops", "10 km"], [language === "nb" ? "Sportsbutikker" : "Sports shops", "10 km"], [language === "nb" ? "Spisesteder i Flå" : "Restaurants in Flå", "10 km"]].map(([place, distance]) => <div key={place}><dt>{place}</dt><dd>{distance}</dd></div>)}
          </dl>
        </div>
      </div>
    </section>
  );

  const locationArrival = page === "location" && (
    <section className="retreat-arrival-notes">
      <header><p>{language === "nb" ? "FØR DERE REISER" : "BEFORE YOU LEAVE"}</p><h2>{language === "nb" ? "En smidig ankomst for hele gruppen." : "A smooth arrival for the whole group."}</h2><span>{language === "nb" ? "Noen enkle valg før avreise gjør den siste etappen rolig, enten dere kommer samlet eller fra forskjellige steder." : "A few simple choices before departure make the final leg easy, whether you travel together or arrive from different places."}</span></header>
      <div>
        <article><b>01</b><h3>{language === "nb" ? "Avtal den siste etappen" : "Arrange the final leg"}</h3><p>{language === "nb" ? "Kommer dere med tog eller buss, anbefaler vi å bestille taxi eller annen transport fra Flå på forhånd." : "If you arrive by train or bus, we recommend pre-booking a taxi or other transport from Flå."}</p></article>
        <article><b>02</b><h3>{language === "nb" ? "Handle i Flå" : "Shop in Flå"}</h3><p>{language === "nb" ? "Flå sentrum ligger omtrent 15 minutter unna og har matbutikker, kjøpesenter, vinmonopol, sportsbutikker og spisesteder." : "Flå village is around 15 minutes away, with grocery shops, a shopping centre, wine shop, sports stores and places to eat."}</p></article>
        <article><b>03</b><h3>{language === "nb" ? "Del adressen" : "Share the address"}</h3><p>{language === "nb" ? "Send Google Maps-lenken til alle sjåfører før avreise. Ved hytta er det god plass til parkering for gruppen." : "Send the Google Maps link to every driver before departure. There is ample parking for the group at the cabin."}</p></article>
      </div>
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
      <section className="retreat-bedroom-wellness">
        <header className="retreat-bedroom-wellness-head">
          <p>{language === "nb" ? "VELVÆRE VED HOVEDSOVEROMMET" : "WELLNESS BESIDE THE MAIN BEDROOM"}</p>
          <div>
            <h2>{language === "nb" ? "Eget bad. Privat badstue. Badekar." : "Private bathroom. Sauna. Bathtub."}</h2>
            <span>{language === "nb" ? "Hovedsuiten fortsetter inn i en lun velværeavdeling, der tre, mørk stein og store vindusflater skaper en rolig og privat ramme." : "The main suite continues into a warm wellness area, where timber, dark stone and generous windows create a calm, private setting."}</span>
          </div>
        </header>
        <div className="retreat-bedroom-wellness-grid">
          <figure>
            <div><Image src="/images/finn-gallery/24.jpg" alt={language === "nb" ? "Privat bad med badekar og håndlagde baderomsmøbler" : "Private bathroom with bathtub and handcrafted vanity"} fill sizes="(max-width: 900px) 100vw, 34vw" /></div>
            <figcaption><span>01</span><strong>{language === "nb" ? "Bad i varme naturmaterialer" : "Bathroom in warm natural materials"}</strong></figcaption>
          </figure>
          <figure>
            <div><Image src="/images/finn-gallery/25.jpg" alt={language === "nb" ? "Privat badstue ved hovedsoverommet" : "Private sauna beside the main bedroom"} fill sizes="(max-width: 900px) 100vw, 34vw" /></div>
            <figcaption><span>02</span><strong>{language === "nb" ? "Privat badstue med utsikt" : "Private sauna with a view"}</strong></figcaption>
          </figure>
          <figure>
            <div><Image src="/images/finn-gallery/26.jpg" alt={language === "nb" ? "Frittstående badekar med utsikt og badstue" : "Freestanding bathtub with a view and sauna"} fill sizes="(max-width: 900px) 100vw, 34vw" /></div>
            <figcaption><span>03</span><strong>{language === "nb" ? "Badekar med utsikt" : "Bathtub with a view"}</strong></figcaption>
          </figure>
        </div>
      </section>
    </>
  );

  const gatheringTypes = page === "meetings" && (
    <section className="retreat-gathering-types">
      <div className="retreat-gathering-heading"><p>{language === "nb" ? "TO MÅTER Å SAMLES PÅ" : "TWO WAYS TO GATHER"}</p><h2>{language === "nb" ? "Profesjonelt når det trengs. Personlig når det gjelder." : "Professional when needed. Personal when it matters."}</h2></div>
      <div className="retreat-gathering-grid">
        <article><div className="retreat-gathering-image"><Image src={image("gathering")} alt={language === "nb" ? "Bedriftssamling" : "Company retreat"} fill sizes="50vw" /></div><div><span>01</span><h3>{language === "nb" ? "Bedriftssamlinger" : "Company retreats"}</h3><p>{language === "nb" ? "Flytt strategien, ledergruppen eller hele teamet ut av de vante rammene. Grandcabin gir dere arbeidsro, stor skjerm, bredbånd og fleksible fellesrom – med fjellet som arena for pauser, kick-off og teambuilding." : "Move strategy sessions, leadership meetings or the whole team beyond the usual setting. Grandcabin offers focus, a large screen, broadband and flexible shared spaces, with the mountain as a setting for breaks, kick-offs and team building."}</p><ul><li>Kick-off</li><li>{language === "nb" ? "Strategi og ledermøter" : "Strategy and leadership meetings"}</li><li>{language === "nb" ? "Kurs og teambuilding" : "Workshops and team building"}</li></ul></div></article>
        <article><div className="retreat-gathering-image"><Image src={image("dining")} alt={language === "nb" ? "Privat samling" : "Private gathering"} fill sizes="50vw" /></div><div><span>02</span><h3>{language === "nb" ? "Private samlinger" : "Private gatherings"}</h3><p>{language === "nb" ? "Jubileum, storfamilie eller en helg med de nærmeste. Hele hytta er deres, med plass til lange middager, rolige morgener og feiringer som kan fortsette uten avbrudd. Ni soverom gjør det enkelt å samle alle under samme tak." : "An anniversary, the extended family or a weekend with close friends. The whole cabin is yours, with space for long dinners, slow mornings and celebrations that can continue uninterrupted. Nine bedrooms bring everyone under one roof."}</p><ul><li>{language === "nb" ? "Jubileer og merkedager" : "Anniversaries and milestones"}</li><li>{language === "nb" ? "Storfamilie og venner" : "Extended family and friends"}</li><li>{language === "nb" ? "Eksklusiv bruk av hele hytta" : "Exclusive use of the entire cabin"}</li></ul></div></article>
      </div>
      <div className="retreat-company-strip">
        <p>{language === "nb" ? "NOEN AV VIRKSOMHETENE SOM HAR VALGT GRANDCABIN" : "SOME OF THE COMPANIES THAT HAVE CHOSEN GRANDCABIN"}</p>
        <div className="retreat-company-wall">
          <article className="retreat-company-card retreat-company-kiwi">
            <div className="retreat-company-logo retreat-company-logo-kiwi" aria-label="KIWI"><strong>KIWI</strong><span>MINIPRIS</span></div>
            <small>{language === "nb" ? "BEDRIFTSSAMLING PÅ TURUFJELL" : "COMPANY RETREAT AT TURUFJELL"}</small>
          </article>
          <article className="retreat-company-card retreat-company-flytoget">
            <div className="retreat-company-logo retreat-company-logo-flytoget" aria-label="Flytoget"><span aria-hidden="true" /><strong>FLYTOGET</strong></div>
            <small>{language === "nb" ? "BEDRIFTSSAMLING PÅ TURUFJELL" : "COMPANY RETREAT AT TURUFJELL"}</small>
          </article>
          <article className="retreat-company-card retreat-company-rystad">
            <div className="retreat-company-logo retreat-company-logo-rystad" aria-label="Rystad Energy"><span aria-hidden="true">R</span><strong>Rystad<small>ENERGY</small></strong></div>
            <small>{language === "nb" ? "BEDRIFTSSAMLING PÅ TURUFJELL" : "COMPANY RETREAT AT TURUFJELL"}</small>
          </article>
          <article className="retreat-company-card retreat-company-kpmg">
            <div className="retreat-company-logo retreat-company-logo-kpmg" aria-label="KPMG"><span aria-hidden="true"><i /><i /><i /><i /></span><strong>KPMG</strong></div>
            <small>{language === "nb" ? "BEDRIFTSSAMLING PÅ TURUFJELL" : "COMPANY RETREAT AT TURUFJELL"}</small>
          </article>
          <article className="retreat-company-card retreat-company-rsa">
            <div className="retreat-company-logo retreat-company-logo-rsa" aria-label="RSA"><strong>RSA</strong><span>GROUP</span></div>
            <small>{language === "nb" ? "BEDRIFTSSAMLING PÅ TURUFJELL" : "COMPANY RETREAT AT TURUFJELL"}</small>
          </article>
        </div>
      </div>
    </section>
  );

  const turufjellDetails = page === "turufjell" && (
    <>
      <section className="retreat-turufjell-about">
        <div className="retreat-turufjell-about-image"><Image src={image("terrace")} alt={language === "nb" ? "Utsikt fra Turufjell" : "View from Turufjell"} fill sizes="(max-width: 900px) 100vw, 52vw" /></div>
        <div className="retreat-turufjell-about-copy"><p>{language === "nb" ? "OM TURUFJELL" : "ABOUT TURUFJELL"}</p><h2>{language === "nb" ? "Solsiden av Flå." : "The sunny side of Flå."}</h2><p>{language === "nb" ? "Turufjell ligger vestvendt med lange soldager og vid utsikt over Hallingdal. Destinasjonen er utviklet med akkurat passe avstand mellom hyttene: nær nok til et levende miljø, med nok luft til å trekke seg tilbake." : "Turufjell faces west, with long sunny days and wide views across Hallingdal. The destination is designed with balanced spacing between cabins: close enough for a lively atmosphere, with room to retreat."}</p><p>{language === "nb" ? "Her møtes langrenn, alpint, turstier, pumptrack og fiskevann i ett kompakt helårsområde. Turufjell Kafé er det naturlige samlingspunktet, mens Flå sentrum og Bjørneparken ligger omtrent 15 minutter unna." : "Cross-country skiing, alpine slopes, trails, pump tracks and fishing lakes meet in one compact year-round destination. Turufjell Café is the natural gathering place, while Flå village and Bjørneparken are around 15 minutes away."}</p><a href="https://www.turufjell.no/om-oss/" target="_blank" rel="noreferrer">{language === "nb" ? "LES MER HOS TURUFJELL" : "READ MORE AT TURUFJELL"} ↗</a></div>
      </section>
      <section className="retreat-turufjell-travel">
        <div className="retreat-turufjell-travel-title"><p>{language === "nb" ? "ENKELT Å KOMME HIT" : "EASY TO REACH"}</p><h2>{language === "nb" ? "Fjellet er nærmere enn det føles." : "The mountain is closer than it feels."}</h2></div>
        <div className="retreat-turufjell-travel-grid">
          <article><span>01</span><strong>116 km</strong><h3>{language === "nb" ? "Fra Oslo" : "From Oslo"}</h3><p>{language === "nb" ? "Kjøreturen tar normalt litt under to timer." : "The drive normally takes just under two hours."}</p></article>
          <article><span>02</span><strong>15 min</strong><h3>{language === "nb" ? "Fra Flå" : "From Flå"}</h3><p>{language === "nb" ? "Kort vei til butikker, spisesteder, vinmonopol og Bjørneparken." : "A short drive to shops, restaurants, the wine shop and Bjørneparken."}</p></article>
          <article><span>03</span><strong>{language === "nb" ? "Tog & buss" : "Train & bus"}</strong><h3>{language === "nb" ? "Til Flå stasjon" : "To Flå station"}</h3><p>{language === "nb" ? "Bergensbanen og Vy Buss stopper i Flå. Derfra fortsetter dere den siste etappen med taxi." : "The Bergen railway and Vy buses stop in Flå. Continue the final leg by taxi."}</p></article>
        </div>
      </section>
      <section className="retreat-turufjell-future">
        <div className="retreat-turufjell-future-head"><p>{language === "nb" ? "PLANENE FREMOVER" : "LOOKING AHEAD"}</p><h2>{language === "nb" ? "Et fjellsted i utvikling." : "A mountain destination in development."}</h2><span>{language === "nb" ? "Turufjell arbeider med en større alpinsatsing og et nytt, bilfritt sentrum. Planene utvikles trinnvis og kan bli justert underveis." : "Turufjell is developing a major alpine expansion and a new car-free village centre. The plans will be delivered in stages and may change over time."}</span></div>
        <div className="retreat-turufjell-future-grid">
          <article>
            <figure className="retreat-turufjell-map-figure">
              <div className="retreat-turufjell-map-image">
                <Image src={image("ski")} alt={language === "nb" ? "Løypekart over Turufjell med Grandcabin markert" : "Turufjell trail map with Grandcabin marked"} fill unoptimized sizes="(max-width: 900px) 100vw, 50vw" />
                <div className="retreat-cabin-map-marker"><i aria-hidden="true" /><span><strong>Grandcabin</strong><small>{language === "nb" ? "HYTTA LIGGER HER" : "THE CABIN IS HERE"}</small></span></div>
              </div>
              <figcaption>{language === "nb" ? "Originalt løypekart fra Turufjell · Grandcabin er markert i gull" : "Original trail map from Turufjell · Grandcabin is marked in gold"}</figcaption>
            </figure>
            <div><span>01</span><h3>{language === "nb" ? "Ski fra døren" : "Ski from the doorstep"}</h3><p>{language === "nb" ? "Langrennsløypa går rett utenfor Grandcabin. Etter omtrent 150 meter på ski kommer dere til alpinanlegget, slik at hele gruppen kan starte dagen uten bil eller transport." : "The cross-country trail begins right outside Grandcabin. Follow it for approximately 150 metres to reach the alpine area, allowing the whole group to begin the day without a car or transfer."}</p><a href="https://www.turufjell.no/skisenter/" target="_blank" rel="noreferrer">{language === "nb" ? "SE SKITILBUDET PÅ TURUFJELL" : "SEE THE SKI AREA AT TURUFJELL"} ↗</a></div>
          </article>
          <article><div className="retreat-turufjell-future-image retreat-turutunet-image"><Image src="/images/turutunet-fjellandsby.jpg" alt={language === "nb" ? "Arkitekturillustrasjon av det planlagte Turutunet" : "Architectural visualisation of the planned Turutunet village"} fill sizes="(max-width: 900px) 100vw, 50vw" /><small>{language === "nb" ? "Illustrasjon: Reiulf Ramstad Arkitekter · endringer kan forekomme" : "Visualisation: Reiulf Ramstad Architects · plans may change"}</small></div><div><span>02</span><h3>Turutunet</h3><p>{language === "nb" ? "Turutunet er planlagt som Turufjells nye hjerte – et bilfritt fjelltun der tradisjonell byggeskikk møter moderne arkitektur av Reiulf Ramstad Arkitekter. Den nye Låven skal romme en lys og romslig restaurant med peis, utsikt og solrike uteplasser, mens Hallingstua, Stabburet og aktivitetstunet skal samle gjester til mat, kultur og gode øyeblikk gjennom hele året." : "Turutunet is planned as the new heart of Turufjell – a car-free mountain village where traditional craft meets contemporary architecture by Reiulf Ramstad Architects. The new barn will offer a bright, generous restaurant with a fireplace, panoramic views and sunny terraces, while Hallingstua, the storehouse and the activity courtyard will bring guests together for food, culture and memorable moments throughout the year."}</p><a href="https://eiendom.turufjell.no/no/hvorfor-turufjell/fremtidsplaner/turutunet-fjellandsby" target="_blank" rel="noreferrer">{language === "nb" ? "SE PLANENE FOR TURUTUNET" : "VIEW THE TURUTUNET PLANS"} ↗</a></div></article>
        </div>
      </section>
    </>
  );

  if (page === "tour") {
    return (
      <div className="concept-page retreat-page retreat-detail-page">
        <RetreatNav language={language} setLanguage={setLanguage} page={page} />
        <main className="retreat-tour-page">
          <section className="retreat-tour-intro">
            <div><p>08 · GRANDCABIN</p><h1>{language === "nb" ? <>Gå gjennom<br />Grandcabin.</> : <>Walk through<br />Grandcabin.</>}</h1></div>
            <div><p>{language === "nb" ? "Utforsk rommene, planløsningen og utsikten i en interaktiv 3D-visning. Beveg deg mellom alle tre nivåer og opplev hvordan hytta henger sammen før dere kommer." : "Explore the rooms, layout and views in an interactive 3D experience. Move through all three levels and discover how the cabin connects before you arrive."}</p><span>{language === "nb" ? "Klikk i visningen og bruk musen eller fingeren for å bevege deg." : "Click inside the tour and use your mouse or finger to move around."}</span></div>
          </section>
          <section className="retreat-tour-stage">
            <div className="retreat-tour-frame"><iframe title={language === "nb" ? "Interaktiv 3D-visning av Grandcabin" : "Interactive 3D tour of Grandcabin"} src="https://my.matterport.com/show/?m=Cni4Ctd7QSV" allow="autoplay; fullscreen; web-share; xr-spatial-tracking" allowFullScreen /></div>
            <div className="retreat-tour-caption"><div><span>360°</span><p>{language === "nb" ? "Hele hytta, rom for rom" : "The entire cabin, room by room"}</p></div><a href="https://my.matterport.com/show/?m=Cni4Ctd7QSV" target="_blank" rel="noreferrer">{language === "nb" ? "ÅPNE 3D-VISNING I FULLSKJERM" : "OPEN 3D TOUR FULL SCREEN"} ↗</a></div>
          </section>
        </main>
        <RetreatBookingFooter language={language} />
      </div>
    );
  }

  if (page === "gallery") {
    return (
      <div className="concept-page retreat-page retreat-detail-page">
        <RetreatNav language={language} setLanguage={setLanguage} page={page} />
        <main className="retreat-gallery-all">
          <div className="retreat-gallery-all-title"><p>{t.number} · GRANDCABIN</p><h1>{t.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h1><span>{language === "nb" ? "Den oppdaterte bildesamlingen fra hytta og Turufjell." : "The updated photo collection from the cabin and Turufjell."}</span><b>74</b></div>
          <div className="retreat-gallery-all-grid">{galleryPhotos.map((photo, index) => <figure className={index % 13 === 0 ? "wide" : index % 9 === 0 ? "tall" : ""} key={photo}><Image src={photo} alt={`${language === "nb" ? "Grandcabin bilde" : "Grandcabin photo"} ${index + 1}`} fill sizes="(max-width: 700px) 50vw, 33vw" /><span>{(index + 1).toString().padStart(2, "0")}</span></figure>)}</div>
        </main>
        {moreSections}
      </div>
    );
  }

  return (
    <div className="concept-page retreat-page retreat-detail-page">
      <RetreatNav language={language} setLanguage={setLanguage} page={page} />
      {page === "cabin" && detailBanner}
      <main className="retreat-detail">
        <div className="retreat-detail-image"><Image src={image(t.photo)} alt={t.alt} fill priority sizes="(max-width: 900px) 100vw, 58vw" /></div>
        <div className="retreat-detail-copy"><p>{t.number}</p><h1>{t.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h1><div className="retreat-detail-text"><span>{t.text}</span>{page === "cabin" && <span className="retreat-detail-intro-addendum">{more.bannerText}</span>}<ul>{t.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul></div></div>
      </main>
      {locationDirections}
      {locationDistances}
      {locationArrival}
      {bedroomBreakdown}
      {gatheringTypes}
      {turufjellDetails}
      {moreSections}
    </div>
  );
}
