"use client";
import { type Block, type Booking } from "@/lib/booking/model";
import { formatDay, money, words, type Lang } from "./shared";

export function OwnerStays({ blocks, bookings, today, lang }: { blocks: Block[]; bookings: Omit<Booking, "requestKey">[]; today: string; lang: Lang }) {
  const w = (nb: string, en: string) => words(lang, nb, en);
  const stays = [
    ...blocks.map(block => ({ id: block.id, arrival: block.arrival, departure: block.departure, name: block.guestName || block.note || w("Reservert periode", "Reserved period"), guests: block.guestCount, price: block.agreedPrice })),
    ...bookings.filter(booking => booking.status === "accepted").map(booking => ({ id: booking.id, arrival: booking.arrival, departure: booking.departure, name: booking.name, guests: booking.guests, price: booking.pricing && "total" in booking.pricing ? booking.pricing.total : undefined })),
  ];
  const upcoming = stays.filter(stay => stay.departure > today).sort((a, b) => a.arrival.localeCompare(b.arrival));
  const past = stays.filter(stay => stay.departure <= today).sort((a, b) => b.arrival.localeCompare(a.arrival));
  function list(items: typeof stays) { return items.length ? <ul>{items.map(stay => <li key={stay.id}><span><strong>{stay.name}</strong><small>{formatDay(stay.arrival, lang)} → {formatDay(stay.departure, lang)}{stay.guests ? ` · ${stay.guests} ${w("gjester", "guests")}` : ""}{stay.price !== null && stay.price !== undefined ? ` · ${money(stay.price, lang)}` : ""}</small></span></li>)}</ul> : <p>{w("Ingen opphold å vise.", "No stays to show.")}</p>; }
  return <section className="bk-panel bk-blocks"><div><h2>{w("Kommende leieforhold", "Upcoming stays")}</h2><p>{w("Bekreftede opphold og reserverte perioder.", "Confirmed stays and reserved periods.")}</p></div>{list(upcoming)}<details><summary>{w("Tidligere leieforhold", "Past stays")} ({past.length})</summary>{list(past)}</details></section>;
}
