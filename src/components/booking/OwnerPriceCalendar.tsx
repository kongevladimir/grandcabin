"use client";
import { useState } from "react";
import { dateValue, isDate, nightlyPrice, type NightlyPrices, type Stay } from "@/lib/booking/model";
import { bookingApi, errorText, formatDay, money, words, type Lang } from "./shared";

export function OwnerPriceCalendar({ prices, occupied, today, lang, onSaved }: { prices: NightlyPrices; occupied: Stay[]; today: string; lang: Lang; onSaved: () => Promise<void> }) {
  const w = (nb: string, en: string) => words(lang, nb, en);
  const [offset, setOffset] = useState(0);
  const [from, setFrom] = useState("");
  const [through, setThrough] = useState("");
  const [choosingEnd, setChoosingEnd] = useState(false);
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const base = new Date(`${today.slice(0, 7)}-01T12:00:00Z`);
  const month = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth() + offset, 1, 12));
  const leading = (month.getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + 1, 0)).getUTCDate();
  const lastDay = new Date(dateValue(today) + 729 * 86400000).toISOString().slice(0, 10);
  const validRange = isDate(from) && isDate(through) && from >= today && through >= from && through <= lastDay;
  const count = validRange ? Math.round((dateValue(through) - dateValue(from)) / 86400000) + 1 : 0;
  const validAmount = /^\d+$/.test(amount) && Number(amount) >= 1 && Number(amount) <= 1000000;
  const hasCustom = validRange && Object.keys(prices).some(day => day >= from && day <= through);
  function select(day: string) {
    setSaved(""); setError("");
    if (choosingEnd && day >= from) { setThrough(day); setChoosingEnd(false); }
    else { setFrom(day); setThrough(day); setAmount(String(nightlyPrice(day, prices) ?? "")); setChoosingEnd(true); }
  }
  async function save(reset = false) {
    if (busy || !validRange || (!reset && !validAmount)) return;
    setBusy(true); setError(""); setSaved("");
    try {
      await bookingApi("", { action: "set-prices", from, through, amount: reset ? null : Number(amount) });
      await onSaved();
      setChoosingEnd(false);
      setSaved(reset
        ? w(`Standardprisene er gjenopprettet for ${formatDay(from, lang)}–${formatDay(through, lang)}.`, `Default prices restored for ${formatDay(from, lang)}–${formatDay(through, lang)}.`)
        : w(`${money(Number(amount), lang)} per natt er lagret for ${formatDay(from, lang)}–${formatDay(through, lang)}.`, `${money(Number(amount), lang)} per night saved for ${formatDay(from, lang)}–${formatDay(through, lang)}.`));
      if (reset) setAmount("");
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }
  return <section className="bk-panel bk-prices" aria-labelledby="price-calendar-title">
    <p className="bk-kicker">{w("BARE FOR ADMINISTRATOR", "ADMINISTRATOR ONLY")}</p>
    <h2 id="price-calendar-title">{w("Deres kalender. Deres priser.", "Your calendar. Your prices.")}</h2>
    <p>{w("Velg én natt eller klikk på første og siste natt i en periode. Skriv inn nattprisen og lagre. Ingen publisering av nettsiden er nødvendig.", "Choose one night or click the first and last nights of a date range. Enter the nightly price and save. No website publication is needed.")}</p>
    <div className="bk-price-layout">
      <div>
        <div className="bk-calendar-toolbar"><h3>{month.toLocaleDateString(lang === "nb" ? "nb-NO" : "en-GB", { month: "long", year: "numeric", timeZone: "UTC" })}</h3><div><button type="button" disabled={busy || offset === 0} onClick={() => setOffset(offset - 1)} aria-label={w("Forrige måned", "Previous month")}>←</button><button type="button" disabled={busy || offset >= 23} onClick={() => setOffset(offset + 1)} aria-label={w("Neste måned", "Next month")}>→</button></div></div>
        <div className="bk-price-days" role="group" aria-label={w("Velg netter for prisendring", "Choose nights to change prices")}>
          {(lang === "nb" ? ["M", "T", "O", "T", "F", "L", "S"] : ["M", "T", "W", "T", "F", "S", "S"]).map((day, i) => <span className="bk-weekday" key={i} aria-hidden="true">{day}</span>)}
          {Array.from({ length: leading }, (_, i) => <span key={`blank-${i}`} />)}
          {Array.from({ length: days }, (_, i) => {
            const day = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth(), i + 1, 12)).toISOString().slice(0, 10);
            const rate = nightlyPrice(day, prices);
            const selected = validRange && day >= from && day <= through;
            const reserved = occupied.some(stay => day >= stay.arrival && day < stay.departure);
            const custom = Object.hasOwn(prices, day);
            return <button type="button" key={day} data-date={day} disabled={busy || day < today || day > lastDay} aria-pressed={selected} aria-label={`${formatDay(day, lang)}, ${rate === null ? w("pris mangler", "price not set") : money(rate, lang)}${custom ? w(", egen pris", ", custom price") : ""}${reserved ? w(", reservert", ", reserved") : ""}`} className={`${custom ? "custom" : ""} ${selected ? "selected" : ""} ${reserved ? "reserved" : ""}`} onClick={() => select(day)}><span>{i + 1}</span><small>{rate === null ? "—" : new Intl.NumberFormat(lang === "nb" ? "nb-NO" : "en-GB").format(rate)}</small></button>;
          })}
        </div>
        <p className="bk-price-hint">{w("Pris i NOK per natt for inntil 24 gjester. Gullfarge = egen pris. Rød strek = reservert.", "NOK per night for up to 24 guests. Gold = custom price. Red line = reserved.")}</p>
      </div>
      <form className="bk-price-editor" onSubmit={e => { e.preventDefault(); void save(); }}>
        <h3>{w("Endre nattpris", "Change nightly price")}</h3>
        <p className="bk-price-hint" aria-live="polite">{count ? w(`${count} ${count === 1 ? "natt valgt" : "netter valgt"}. Begge datoene er inkludert.`, `${count} ${count === 1 ? "night" : "nights"} selected. Both dates are included.`) : w("Velg netter i kalenderen eller skriv datoene her.", "Select nights in the calendar or enter dates here.")}</p>
        <fieldset disabled={busy}>
          <label>{w("Første natt", "First night")}<input type="date" required min={today} max={lastDay} value={from} onChange={e => { setFrom(e.target.value); setThrough(e.target.value); setChoosingEnd(false); setSaved(""); }} /></label>
          <label>{w("Siste natt (inkludert)", "Last night (included)")}<input type="date" required min={from || today} max={lastDay} value={through} onChange={e => { setThrough(e.target.value); setChoosingEnd(false); setSaved(""); }} /></label>
          <label>{w("Pris per natt (NOK)", "Price per night (NOK)")}<input type="number" required min={1} max={1000000} step={1} inputMode="numeric" value={amount} onChange={e => { setAmount(e.target.value); setSaved(""); }} /></label>
          <p className="bk-price-hint">{w("Prisen gjelder inntil 24 gjester. 750 kr per ekstra gjest, utvask og sengetøy/håndklær legges til som før. Allerede innsendte forespørsler beholder sin pris.", "This price covers up to 24 guests. The NOK 750 extra-guest charge, cleaning and linen/towels are added as before. Enquiries already submitted keep their quoted price.")}</p>
          <button type="submit" className="bk-primary" disabled={!validRange || !validAmount}>{busy ? w("Lagrer …", "Saving …") : w("Lagre pris", "Save price")}</button>
          <button type="button" className="bk-secondary" disabled={!hasCustom} onClick={() => void save(true)}>{w("Bruk standardpris igjen", "Restore default prices")}</button>
        </fieldset>
        {error && <p role="alert" className="bk-error">{errorText(error, lang)}</p>}
        {saved && <p role="status" className="bk-price-saved">{saved}</p>}
      </form>
    </div>
  </section>;
}
