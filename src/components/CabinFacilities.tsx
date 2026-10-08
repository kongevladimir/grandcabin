import type { Language } from "@/components/useSiteLanguage";

const facilities = {
  nb: [
    { title: "Kjøkken", items: ["4 oppvaskmaskiner · 2 på hvert kjøkken", "2 stekeovner", "2 kjøleskap", "2 frysere", "Vinskap"] },
    { title: "Bad & velvære", items: ["4 bad med dusj", "3 toaletter", "2 badstuer", "2 doble servanter · én i hver av to etasjer"] },
    { title: "Stuer & uteområder", items: ["3 stuer", "TV", "2 peiser", "2 terrasser", "Ski inn / ski ut", "Utvendig kameraovervåking"] },
    { title: "Komfort & teknologi", items: ["Fiberoptisk internett med Wi-Fi", "Vaskemaskin", "Integrert støvsuger", "Vannbåren gulvvarme", "Balansert ventilasjon", "Smart strømstyring", "Nøkkelfri adgang"] },
  ],
  en: [
    { title: "Kitchens", items: ["4 dishwashers · 2 in each kitchen", "2 ovens", "2 refrigerators", "2 freezers", "Wine cabinet"] },
    { title: "Bathrooms & wellness", items: ["4 bathrooms with showers", "3 toilets", "2 saunas", "2 double washbasins · one on each of two floors"] },
    { title: "Living spaces & outdoors", items: ["3 living rooms", "TV", "2 fireplaces", "2 terraces", "Ski-in / ski-out", "Exterior security cameras"] },
    { title: "Comfort & technology", items: ["Fibre-optic internet with Wi-Fi", "Washing machine", "Built-in vacuum system", "Underfloor heating", "Balanced ventilation", "Smart energy management", "Keyless entry"] },
  ],
};

export function CabinFacilities({ language }: { language: Language }) {
  return (
    <section className="retreat-cabin-facilities" aria-labelledby="cabin-facilities-title">
      <header>
        <p>GRANDCABIN · {language === "nb" ? "EN PRAKTISK OVERSIKT" : "AT A GLANCE"}</p>
        <h2 id="cabin-facilities-title">{language === "nb" ? "Fasiliteter" : "Facilities"}</h2>
      </header>
      <dl className="retreat-cabin-facilities-stats">
        <div><dt>{language === "nb" ? "Areal" : "Floor area"}</dt><dd>340 <span>m²</span></dd></div>
        <div><dt>{language === "nb" ? "Gjester" : "Guests"}</dt><dd>29</dd></div>
        <div><dt>{language === "nb" ? "Rom for overnatting" : "Sleeping areas"}</dt><dd>10</dd><small>{language === "nb" ? "9 soverom og en sovealkove" : "9 bedrooms and a sleeping alcove"}</small></div>
      </dl>
      <div className="retreat-cabin-facilities-groups">
        {facilities[language].map((group) => (
          <div key={group.title}>
            <h3>{group.title}</h3>
            <ul>{group.items.map((item) => <li key={item} className={item.includes("Wi-Fi") ? "retreat-facility-internet" : undefined}>{item}</li>)}</ul>
          </div>
        ))}
      </div>
    </section>
  );
}
