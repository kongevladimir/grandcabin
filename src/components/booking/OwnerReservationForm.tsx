"use client";
import { useState } from "react";
import { osloToday } from "@/lib/booking/model";
import { words, type Lang } from "./shared";

export function OwnerReservationForm({ lang, busy, save }: { lang: Lang; busy: boolean; save: (values: Record<string, unknown>) => Promise<boolean> }) {
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [guests, setGuests] = useState("2");
  const [saved, setSaved] = useState(false);
  const w = (nb: string, en: string) => words(lang, nb, en);
  return <section className="bk-panel bk-blocks"><div><h2>{w("Registrer avtalt opphold", "Record a confirmed stay")}</h2><p>{w("Registrer gjest, avtalt totalpris og datoer. Datoene blokkeres i kalenderen; avreisedagen er ledig for neste gjest.", "Enter the guest, agreed total price and dates. The dates are blocked on the calendar; checkout day remains available for the next guest.")}</p></div>
    <form onSubmit={async event => { event.preventDefault(); setSaved(false); const ok = await save({ action: "block", arrival, departure, guestName: name.trim(), agreedPrice: Number(price), guestCount: Number(guests), note: `${name.trim()} · ${price} NOK` }); if (ok) { setArrival(""); setDeparture(""); setName(""); setPrice(""); setGuests("2"); setSaved(true); } }}>
      <div className="bk-fields"><label>{w("Gjestens navn", "Guest name")}<input required maxLength={120} value={name} onChange={e => setName(e.target.value)} /></label><label>{w("Avtalt totalpris (NOK)", "Agreed total price (NOK)")}<input type="number" min="0" max="10000000" step="1" required value={price} onChange={e => setPrice(e.target.value)} /></label><label>{w("Ankomst", "Arrival")}<input type="date" required min={osloToday()} value={arrival} onChange={e => setArrival(e.target.value)} /></label><label>{w("Avreise", "Departure")}<input type="date" required min={arrival || osloToday()} value={departure} onChange={e => setDeparture(e.target.value)} /></label></div>
      <label>{w("Antall gjester", "Number of guests")}<input type="number" min="1" max="29" step="1" required value={guests} onChange={e => setGuests(e.target.value)} /></label><button className="bk-primary" disabled={busy}>{w("Registrer og blokker datoer", "Save and block dates")}</button>{saved && <p role="status">{w("Oppholdet er registrert og datoene er blokkert.", "The stay is saved and the dates are blocked.")}</p>}
    </form>
  </section>;
}
