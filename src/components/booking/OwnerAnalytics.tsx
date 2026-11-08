"use client";
import { useEffect, useState } from "react";
import type { summarizeStats } from "@/lib/analytics/model";
import { words, type Lang } from "./shared";
type Stats = ReturnType<typeof summarizeStats> & { ready: boolean; today: string; days: number };
const pageNames: Record<string, [string, string]> = { "/": ["Forsiden", "Home"], "/cabin": ["Hytta", "The cabin"], "/bedrooms": ["Rom", "Rooms"], "/materials": ["Håndverk", "Craftsmanship"], "/gallery": ["Galleri", "Gallery"], "/location": ["Beliggenhet", "Location"], "/3d-tour": ["3D-visning", "3D tour"], "/meetings": ["Samlinger", "Gatherings"], "/turufjell": ["Opplevelser", "Experiences"], "/turufjell/activities": ["Aktiviteter", "Activities"], "/booking": ["Booking", "Booking"] };
export function OwnerAnalytics({ lang }: { lang: Lang }) {
  const w = (nb: string, en: string) => words(lang, nb, en);
  const [days, setDays] = useState(30), [refresh, setRefresh] = useState(0);
  const [data, setData] = useState<Stats | null>(null), [error, setError] = useState("");
  useEffect(() => {
    let alive = true;
    void fetch(`/api/analytics?days=${days}`, { cache: "no-store" }).then(async response => {
      if (!response.ok) throw new Error(response.status === 401 ? "login" : "storage");
      return response.json() as Promise<Stats>;
    }).then(result => { if (alive) { setData(result); setError(""); } }).catch(caught => { if (alive) setError(caught.message); });
    return () => { alive = false; };
  }, [days, refresh]);
  const date = (day: string) => new Date(`${day}T12:00:00Z`).toLocaleDateString(lang === "nb" ? "nb-NO" : "en-GB", { day: "2-digit", month: "short" });
  const number = (value: number) => value.toLocaleString(lang === "nb" ? "nb-NO" : "en-GB");
  return <section className="bk-panel bk-analytics">
    <div className="bk-analytics-heading"><div><h2>{w("Besøksstatistikk", "Website statistics")}</h2><p>{w("Kun synlig for deg som er logget inn som eier.", "Visible only when you are signed in as the owner.")}</p></div><div className="bk-analytics-controls"><label>{w("Periode", "Period")}<select value={days} onChange={event => { setDays(Number(event.target.value)); setData(null); setError(""); }}>{[7, 30, 90, 365].map(value => <option key={value} value={value}>{w(`Siste ${value} dager`, `Last ${value} days`)}</option>)}</select></label><button className="bk-secondary" onClick={() => { setData(null); setError(""); setRefresh(value => value + 1); }}>{w("Oppdater", "Refresh")}</button></div></div>
    {error ? <p className="bk-error" role="alert">{error === "login" ? w("Logg inn på nytt for å se statistikken.", "Sign in again to view statistics.") : w("Statistikken kunne ikke lastes. Prøv Oppdater.", "Statistics could not be loaded. Try Refresh.")}</p> : !data ? <p role="status">{w("Laster statistikk …", "Loading statistics …")}</p> : !data.ready ? <p role="status">{w("Statistikklageret er ikke koblet til ennå.", "Statistics storage is not connected yet.")}</p> : <>
      <div className="bk-analytics-totals">{([
        ["visits", w("Besøk (økter)", "Visits (sessions)")], ["views", w("Sidevisninger", "Page views")], ["booking", w("Klikk til booking", "Booking clicks")], ["phone", w("Telefonklikk", "Phone clicks")], ["email", w("E-postklikk", "Email clicks")], ["navigation", w("Andre sideklikk", "Other page clicks")],
      ] as const).map(([key, label]) => <div key={key}><strong>{number(data.totals[key])}</strong><span>{label}</span></div>)}</div>
      <h3>{w("Besøk per dag", "Visits per day")}</h3>
      {!data.totals.views && <p>{w("Ingen besøk registrert i denne perioden ennå. Registreringen starter når funksjonen er aktivert.", "No visits recorded in this period yet. Recording starts when the feature is enabled.")}</p>}
      <div className="bk-analytics-chart" role="img" aria-label={w("Besøk per dag. Nøyaktige tall finnes i tabellen under.", "Daily visits. Exact figures are available in the table below.")}>{data.daily.map(day => <div key={day.day} title={`${date(day.day)}: ${day.visits}`}><span style={{ height: `${Math.max(1, day.visits / Math.max(1, ...data.daily.map(item => item.visits)) * 100)}%` }} /></div>)}</div>
      <div className="bk-analytics-range"><span>{date(data.daily[0].day)}</span><span>{date(data.today)}</span></div>
      <details><summary>{w("Vis dagstall", "Show daily figures")}</summary><div className="bk-analytics-table"><table><thead><tr><th>{w("Dato", "Date")}</th><th>{w("Besøk", "Visits")}</th><th>{w("Sidevisninger", "Page views")}</th></tr></thead><tbody>{[...data.daily].reverse().map(day => <tr key={day.day}><td>{date(day.day)}</td><td>{number(day.visits)}</td><td>{number(day.views)}</td></tr>)}</tbody></table></div></details>
      <h3>{w("Mest viste sider", "Most viewed pages")}</h3>
      <div className="bk-analytics-table"><table><thead><tr><th>{w("Side", "Page")}</th><th>{w("Visninger", "Views")}</th><th>{w("Klikk fra siden", "Clicks from page")}</th></tr></thead><tbody>{data.pages.map(page => <tr key={page.path}><td>{pageNames[page.path]?.[lang === "nb" ? 0 : 1] ?? page.path}</td><td>{number(page.views)}</td><td>{number(page.clicks)}</td></tr>)}</tbody></table></div>
      <p className="bk-price-hint">{w("Besøk er omtrentlige nettleserøkter med 30 minutters inaktivitet som skille, ikke unike personer. Nye faner kan telles som egne besøk. Innelogget eier og kjente roboter telles ikke. Enkelte besøk kan mangle hvis registrering blokkeres. Datoene følger norsk tid.", "Visits are approximate browser sessions separated by 30 minutes of inactivity, not unique people. New tabs can count as separate visits. The signed-in owner and known bots are excluded. Some visits may be missing if recording is blocked. Dates use Norwegian time.")}</p>
    </>}
  </section>;
}
