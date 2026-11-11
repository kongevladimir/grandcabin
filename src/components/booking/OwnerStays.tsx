"use client";
import { useState } from "react";
import { dateValue, type Block, type Booking } from "@/lib/booking/model";
import { formatDay, money, words, type Lang } from "./shared";

type StayRow = { id: string; kind: "block" | "booking" | "external"; arrival: string; departure: string; name: string; guests?: number; price?: number; editable: boolean };

export function OwnerStays({ blocks, bookings, today, lang, busy, save }: { blocks: Block[]; bookings: Omit<Booking, "requestKey">[]; today: string; lang: Lang; busy: boolean; save: (values: Record<string, unknown>) => Promise<boolean> }) {
  const w = (nb: string, en: string) => words(lang, nb, en);
  const [editing, setEditing] = useState<StayRow | null>(null);
  const stays: StayRow[] = [
    ...blocks.map(block => ({ id: block.id, kind: block.external ? "external" as const : "block" as const, arrival: block.arrival, departure: block.departure, name: block.guestName || block.note || w("Reservert periode", "Reserved period"), guests: block.guestCount, price: block.agreedPrice, editable: !block.external && Boolean(block.guestName) })),
    ...bookings.filter(booking => booking.status === "accepted").map(booking => ({ id: booking.id, kind: "booking" as const, arrival: booking.arrival, departure: booking.departure, name: booking.name, guests: booking.guests, price: booking.agreedTotal ?? (booking.pricing && "total" in booking.pricing ? booking.pricing.total ?? 0 : booking.pricing?.rentalTotal ?? 0), editable: true })),
  ];
  const upcoming = stays.filter(stay => stay.departure > today).sort((a, b) => a.arrival.localeCompare(b.arrival));
  const past = stays.filter(stay => stay.departure <= today).sort((a, b) => b.arrival.localeCompare(a.arrival));
  const minimumDeparture = editing ? new Date(dateValue(editing.arrival) + 86400000).toISOString().slice(0, 10) : today;

  function list(items: StayRow[], canEdit: boolean) {
    return items.length ? <ul>{items.map(stay => <li key={stay.id}><span><strong>{stay.name}</strong><small>{formatDay(stay.arrival, lang)} → {formatDay(stay.departure, lang)}{stay.guests ? ` · ${stay.guests} ${w("gjester", "guests")}` : ""}{stay.price !== undefined ? ` · ${money(stay.price, lang)}` : ""}</small></span>{canEdit && stay.editable && <button type="button" className="bk-secondary" disabled={busy} onClick={() => setEditing({ ...stay, guests: stay.guests ?? 2, price: stay.price ?? 0 })}>{w("Rediger", "Edit")}</button>}</li>)}</ul> : <p>{w("Ingen opphold å vise.", "No stays to show.")}</p>;
  }

  return <section className="bk-panel bk-blocks"><div><h2>{w("Kommende leieforhold", "Upcoming stays")}</h2><p>{w("Bekreftede opphold og reserverte perioder.", "Confirmed stays and reserved periods.")}</p></div>
    {list(upcoming, true)}
    {editing && <form className="bk-stay-editor" onSubmit={async event => {
      event.preventDefault();
      const ok = await save({ action: "update-stay", id: editing.id, kind: editing.kind, arrival: editing.arrival, departure: editing.departure, name: editing.name, guests: editing.guests, price: editing.price });
      if (ok) setEditing(null);
    }}>
      <h3>{w("Rediger leieforhold", "Edit stay")}</h3>
      <div className="bk-fields">
        <label>{w("Navn / firma", "Name / company")}<input required maxLength={120} value={editing.name} onChange={event => setEditing({ ...editing, name: event.target.value })} /></label>
        <label>{w("Antall gjester", "Number of guests")}<input type="number" required min="1" max="29" step="1" value={editing.guests} onChange={event => setEditing({ ...editing, guests: Number(event.target.value) })} /></label>
        <label>{w("Ankomst", "Arrival")}<input type="date" required min={today} value={editing.arrival} onChange={event => setEditing({ ...editing, arrival: event.target.value })} /></label>
        <label>{w("Avreise", "Departure")}<input type="date" required min={minimumDeparture} value={editing.departure} onChange={event => setEditing({ ...editing, departure: event.target.value })} /></label>
        <label>{w("Avtalt totalpris (NOK)", "Agreed total price (NOK)")}<input type="number" required min="0" max="10000000" step="1" value={editing.price} onChange={event => setEditing({ ...editing, price: Number(event.target.value) })} /></label>
      </div>
      <div className="bk-controls"><button type="button" className="bk-secondary" disabled={busy} onClick={() => setEditing(null)}>{w("Avbryt", "Cancel")}</button><button className="bk-primary" disabled={busy}>{w("Lagre endringer", "Save changes")}</button></div>
    </form>}
    <details><summary>{w("Tidligere leieforhold", "Past stays")} ({past.length})</summary>{list(past, false)}</details>
  </section>;
}
