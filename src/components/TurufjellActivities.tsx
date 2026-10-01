import Link from "next/link";
import type { Language } from "@/components/useSiteLanguage";

type ActivityIcon = "ski" | "alpine" | "tour" | "hike" | "fishing" | "cycling" | "family" | "village" | "calm";

const activities: { icon: ActivityIcon; nb: { title: string; text: string }; en: { title: string; text: string } }[] = [
  {
    icon: "ski",
    nb: { title: "Langrenn", text: "Start turen rett utenfor hytta i Turufjells preparerte spor. Rundløyper passer både små og store, mens den 125 km lange Eventyrløypa leder via Nesbyen og Golsfjellet til Hemsedals løypenett på rundt 250 km." },
    en: { title: "Cross-country skiing", text: "Set out from the cabin onto Turufjell’s groomed trails. Sheltered loops suit children and adults, while the 125 km Eventyrløypa leads via Nesbyen and Golsfjellet towards Hemsedal’s network of around 250 km of trails." },
  },
  {
    icon: "alpine",
    nb: { title: "Alpint", text: "Turufjell Skisenter ligger nær hytta. Her kan de minste finne skiglede i barnebakken, mens grønne løyper og mer utfordrende nedfarter gir hele gruppen mulighet til å finne sin egen rytme." },
    en: { title: "Alpine skiing", text: "Turufjell Ski Centre is close to the cabin. Children can find their confidence on the beginner slopes, while gentle green runs and more challenging descents let everyone ski at their own pace." },
  },
  {
    icon: "tour",
    nb: { title: "Toppturer", text: "Turufjell er et fint utgangspunkt for toppturer på ski. Topper som Kristnatten og Skarsvarden byr på åpne fjellandskap og utsikt over Hallingdal. Velg rute etter erfaring og dagens forhold." },
    en: { title: "Ski touring", text: "Turufjell is a fine starting point for ski touring. Peaks such as Kristnatten and Skarsvarden offer open mountain scenery and wide views over Hallingdal. Choose a route that suits your experience and the day’s conditions." },
  },
  {
    icon: "hike",
    nb: { title: "Fjellturer for alle", text: "Velg en liten tur med barna, eller la stiene føre dere videre mot utsikt og åpne fjellvidder. Turufjell og fjellene rundt Flå gir rom for både rolige ettermiddager og hele dager ute." },
    en: { title: "Mountain walks for all", text: "Choose a gentle walk with the children or follow the trails towards wide mountain views. Turufjell and the mountains around Flå invite both easy afternoons and full days outdoors." },
  },
  {
    icon: "fishing",
    nb: { title: "Fiske & jakt", text: "Mer enn 30 fiskevann gjør det lett å finne et stille sted ved vannet. Det finnes også mulighet for jakt i Flå-området. Jakt- og Fiskesenteret i Flå tilbyr kurs og opplevelser." },
    en: { title: "Fishing & hunting", text: "More than 30 fishing lakes make it easy to find a quiet spot by the water. Hunting is also possible in the Flå area. The Hunting and Fishing Centre in Flå offers courses and experiences." },
  },
  {
    icon: "cycling",
    nb: { title: "Sykkel & pumptrack", text: "Turufjells pumptrack og sykkelpark byr på lek og mestring for flere nivåer. Ta en runde i ferdighetsparken, prøv flytstien, eller finn deres eget tempo på stiene rundt fjellet." },
    en: { title: "Cycling & pump track", text: "Turufjell’s pump track and cycling park offer fun for different ages and abilities. Explore the skills park, try the flow trail or set your own pace on the mountain paths." },
  },
  {
    icon: "family",
    nb: { title: "Opplevelser med barna", text: "Ta en pause ved Istjern, finn frem badetøyet på varme dager, eller legg turen til Bjørneparken i Flå. Små eventyr er aldri langt unna når hele familien er samlet." },
    en: { title: "Days with the family", text: "Spend an afternoon by Istjern, enjoy a swim on warm days or visit Bjørneparken in Flå. Little adventures are always close when the whole family is together." },
  },
  {
    icon: "village",
    nb: { title: "Flå, mat & handel", text: "En kort kjøretur fra fjellet finner dere Flå sentrum, med kjøpesenter, spisesteder og mulighet til å handle det dere trenger til oppholdet. Turufjell Kafé er et hyggelig stopp mellom aktivitetene." },
    en: { title: "Flå, dining & shopping", text: "A short drive from the mountain brings you to Flå village, with a shopping centre, places to eat and everything you need for your stay. Turufjell Café is a welcoming stop between activities." },
  },
  {
    icon: "calm",
    nb: { title: "Ro i fjellet", text: "Legg skjermene bort og senk tempoet. Stille stier, frisk fjelluft og utsikten over Hallingdal gir rom for ro og nærvær i den norske fjellnaturen." },
    en: { title: "Mindful Escape", text: "Leave the screens behind and slow down. Quiet trails, crisp mountain air and sweeping Hallingdal views invite you to reconnect with yourself in Norway’s mountains." },
  },
];

function ActivityIcon({ name }: { name: ActivityIcon }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  return (
    <svg viewBox="0 0 64 64" role="presentation" aria-hidden="true" {...common}>
      {name === "ski" && <><path d="m13 47 37-36M16 21l29 28M9 54c15 4 30 3 46-3M44 11l7 7M13 19l9 1" /><circle cx="31" cy="17" r="3" /></>}
      {name === "alpine" && <><path d="M8 51 28 17l8 12 5-8 15 30H8ZM17 51l12-19 12 19M9 57h46" /><path d="m38 17 5-6m7 8 4-3" /></>}
      {name === "tour" && <><path d="M6 50 24 22l8 12 8-17 18 33H6ZM20 50l13-17 12 17M13 56h38" /><circle cx="48" cy="11" r="4" /></>}
      {name === "hike" && <><path d="M5 49 25 17l10 15 7-10 17 27H5ZM18 49l12-19 12 19M9 55h46" /><path d="M43 13h.1" strokeWidth="4" /></>}
      {name === "fishing" && <><path d="M5 34c13-13 30-13 43 0-13 13-30 13-43 0ZM48 34l11-10v20L48 34ZM19 28l5 6-5 6M12 53c7-3 13-3 20 0s13 3 20 0" /><circle cx="39" cy="31" r="1.5" fill="currentColor" stroke="none" /></>}
      {name === "cycling" && <><circle cx="14" cy="44" r="10" /><circle cx="50" cy="44" r="10" /><path d="m14 44 13-20 10 20H14Zm36 0L39 20h-9m-6 4h6m-1-10h7" /></>}
      {name === "family" && <><path d="M13 48c0-13 9-22 19-22s19 9 19 22H13ZM22 27c-4-5-3-11 2-13 4-1 7 1 8 4 1-3 4-5 8-4 5 2 6 8 2 13M7 54h50" /><circle cx="25" cy="40" r="1.5" fill="currentColor" stroke="none" /><circle cx="39" cy="40" r="1.5" fill="currentColor" stroke="none" /></>}
      {name === "village" && <><path d="M9 53V26l23-15 23 15v27H9ZM9 28h46M20 53V37h11v16m9-16h7v8h-7zm-21-9h7v6h-7z" /></>}
      {name === "calm" && <><circle cx="32" cy="23" r="8" /><path d="M7 43c8-8 15-8 25 0s17 8 25 0M7 53c8-8 15-8 25 0s17 8 25 0M32 7v4M12 23h4m32 0h4M18 9l3 3m22 0 3-3" /></>}
    </svg>
  );
}

export function TurufjellActivities({ language }: { language: Language }) {
  return (
    <section className="retreat-turufjell-activities" aria-labelledby="turufjell-activities-title">
      <div className="retreat-turufjell-activities-intro">
        <p>{language === "nb" ? "OPPLEVELSER HELE ÅRET" : "EXPERIENCES THROUGH THE SEASONS"}</p>
        <h2 id="turufjell-activities-title">{language === "nb" ? "Hva kan dere gjøre?" : "What is there to do?"}</h2>
        <span>{language === "nb" ? "Fra aktive dager på fjellet til gode pauser sammen – Turufjell og Flå gir dere friheten til å fylle oppholdet på deres egen måte." : "From active days in the mountains to unhurried moments together, Turufjell and Flå let you shape the stay your way."}</span>
      </div>
      <div className="retreat-turufjell-activities-grid">
        {activities.map((activity) => {
          const copy = activity[language];
          return <article className={activity.icon === "calm" ? "retreat-turufjell-activity-calm" : undefined} key={activity.icon}><ActivityIcon name={activity.icon} /><h3>{copy.title}</h3><p>{copy.text}</p></article>;
        })}
      </div>
      <div className="retreat-turufjell-activities-links"><Link className="retreat-turufjell-activities-link" href="/concepts/retreat/turufjell/activities">{language === "nb" ? "SE ALLE VINTER- OG SOMMERAKTIVITETER" : "SEE ALL WINTER AND SUMMER ACTIVITIES"} →</Link></div>
    </section>
  );
}
