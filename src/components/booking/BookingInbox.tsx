"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { RetreatNav } from "@/components/ConceptPages";
import { useSiteLanguage } from "@/components/useSiteLanguage";
import { dateValue, nights, osloToday, rentalQuote, type Block, type Booking, type BookingStatus } from "@/lib/booking/model";
import { bookingApi, errorText, formatDay, money, priceSeasonLabel, statusLabel, words, type Lang } from "./shared";

type VisibleBooking = Omit<Booking, "requestKey">;
type OwnerData = { bookings: VisibleBooking[]; blocks: Block[]; pendingEmails: number; preview: boolean };
const lastReservedNight = (departure: string) => new Date(dateValue(departure) - 86400000).toISOString().slice(0, 10);
function Conversation({ booking, lang, owner, reload }: { booking: VisibleBooking; lang: Lang; owner: boolean; reload: () => Promise<void> }) {
  const [text, setText] = useState(""); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  const messageId = useRef("");
  const messageList = useRef<HTMLDivElement>(null);
  const followMessages = useRef(true);
  useEffect(() => {
    const list = messageList.current;
    if (list && followMessages.current) list.scrollTop = list.scrollHeight;
  }, [booking.messages.length]);
  const w = (nb: string, en: string) => words(lang, nb, en);
  const price = booking.pricing ?? rentalQuote(booking, booking.linenTowels ?? 0, booking.guests);
  async function send(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return;
    setBusy(true); setError("");
    if (!messageId.current) messageId.current = crypto.randomUUID();
    try { await bookingApi("", { action: "message", id: booking.id, text, messageId: messageId.current }); setText(""); messageId.current = ""; await reload(); }
    catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  }
  return <section className="bk-conversation" aria-label={w("Privat samtale", "Private conversation")}><header><div><p className="bk-kicker">{w("PRIVAT SAMTALE", "PRIVATE CONVERSATION")}</p><h2>{owner ? booking.name : "Grandcabin"}</h2></div><span className={`bk-status ${booking.status}`}>{statusLabel(lang, booking.status)}</span></header>
    <div className="bk-request-details"><span>{formatDay(booking.arrival, lang)} → {formatDay(booking.departure, lang)}</span><span>{nights(booking)} {w("netter", "nights")} · {booking.guests} {w("gjester", "guests")}</span>{"total" in price ? <><span>{w("Leiepris", "Rental price")}: {price.lines.map(line => `${line.days} × ${line.rate === null ? "—" : money(line.rate, lang)} (${priceSeasonLabel(lang, line.season)})`).join(" + ")} = {money(price.rentalTotal ?? 0, lang)}</span><span>{w("Obligatorisk utvask", "Mandatory final cleaning")}: {money(price.cleaningFee, lang)} · {w("Sengetøy og håndklær", "Bed linen and towels")}: {price.linenTowelsCount} × {money(price.linenTowelsUnitPrice, lang)} = {money(price.linenTowelsTotal, lang)}</span><strong>{w("Totalpris", "Total price")}: {money(price.total ?? 0, lang)}</strong></> : <span>{w("Leiepris", "Rental price")}: {money(price.rentalTotal, lang)}</span>}<span>{w("Anledning", "Occasion")}: {booking.occasion === "company" ? w("Firma / samling", "Company retreat") : booking.occasion === "celebration" ? w("Spesiell anledning", "Special occasion") : w("Familie og venner", "Family and friends")}</span>{owner && <span><a href={`mailto:${booking.email}`}>{booking.email}</a>{booking.phone && <> · <a href={`tel:${booking.phone.replace(/[^+\d]/g, "")}`}>{booking.phone}</a></>}</span>}</div>
    <div className="bk-messages" ref={messageList} onScroll={e => { const list = e.currentTarget; followMessages.current = list.scrollHeight - list.scrollTop - list.clientHeight < 80; }} role="log" aria-live="polite" aria-relevant="additions text">{!booking.messages.length && <p>{w("Samtalen starter her. Fortell oss gjerne om planene deres.", "Your conversation starts here. Tell us about your plans.")}</p>}{booking.messages.map(message => message.author === "system" ? <p className="bk-system" key={message.id}>{statusLabel(lang, message.text as BookingStatus)}</p> : <article key={message.id} className={`bk-bubble ${message.author === (owner ? "owner" : "guest") ? "mine" : ""}`}><div><strong>{message.author === "owner" ? "Grandcabin" : booking.name}</strong><time dateTime={message.createdAt}>{new Date(message.createdAt).toLocaleString(lang === "nb" ? "nb-NO" : "en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</time></div><p>{message.text}</p></article>)}</div>
    <form className="bk-compose" onSubmit={send}><label>{w("Din melding", "Your message")}<textarea required maxLength={5000} rows={3} value={text} onChange={e => setText(e.target.value)} placeholder={w("Skriv en melding …", "Write a message …")} /></label>{error && <p className="bk-error" role="alert">{errorText(error, lang)}</p>}<div><small>{w("Samtalen oppdateres automatisk.", "The conversation updates automatically.")}</small><button className="bk-primary" disabled={busy || !text.trim()}>{busy ? w("Sender …", "Sending …") : w("Send melding", "Send message")} →</button></div></form>
  </section>;
}

export function GuestConversation({ id }: { id: string }) {
  const [lang, setLang] = useSiteLanguage();
  const w = (nb: string, en: string) => words(lang, nb, en);
  const [data, setData] = useState<{ booking: VisibleBooking; preview: boolean; isOwner: boolean; token?: string } | null>(null);
  const [error, setError] = useState(""); const [copied, setCopied] = useState(false);
  const reload = useCallback(async () => { const result = await bookingApi<NonNullable<typeof data>>(`?view=conversation&id=${encodeURIComponent(id)}`); setData(result); setError(""); }, [id]);
  useEffect(() => {
    let alive = true;
    async function start() {
      try {
        const token = new URLSearchParams(window.location.hash.slice(1)).get("access");
        if (token) { await bookingApi("", { action: "access", id, token }); window.history.replaceState(null, "", window.location.pathname); }
        if (alive) await reload();
      } catch (e) { if (alive) setError((e as Error).message); }
    }
    void start();
    const interval = setInterval(() => { if (document.visibilityState === "visible") void reload().catch(e => { if (alive) setError(e.message); }); }, 10000);
    return () => { alive = false; clearInterval(interval); };
  }, [id, reload]);
  return <div className="concept-page retreat-page bk-page"><RetreatNav language={lang} setLanguage={setLang} /><main className="bk-main bk-guest">
    <p className="bk-kicker">GRANDCABIN · {w("DERES OPPHOLD", "YOUR STAY")}</p><h1>{w("La oss planlegge", "Let’s plan")}<br /><em>{w("noe fint sammen.", "something special.")}</em></h1>
    {data?.preview && <p className="bk-preview">{w("Forhåndsvisning · Lagret på denne datamaskinen. Ingen e-post er sendt.", "Preview · Saved on this computer. No email has been sent.")}</p>}
    {data && <><p className="bk-receipt">{data.booking.status === "pending" ? w("Forespørselen er registrert. Du får svar fra oss her. Datoene reserveres når vi bekrefter oppholdet.", "Your enquiry is saved. We will reply here. Your dates are reserved when we confirm your stay.") : statusLabel(lang, data.booking.status)}</p><div className="bk-share"><span>{w("Ta vare på din private samtale. Ikke del lenken med andre.", "Keep your private conversation link. Do not share it with others.")}</span><button type="button" className="bk-secondary" onClick={async () => { try { await navigator.clipboard.writeText(`${window.location.origin}/booking/conversation/${id}#access=${data.token ?? ""}`); setCopied(true); } catch { setError("access"); } }} disabled={!data.token}>{copied ? w("Lenken er kopiert", "Link copied") : w("Kopier privat lenke", "Copy private link")}</button></div><Conversation booking={data.booking} lang={lang} owner={data.isOwner} reload={reload} /></>}
    {error && <p className="bk-error" role="alert">{errorText(error, lang)} <button type="button" onClick={() => void reload().catch(e => setError(e.message))}>{w("Prøv igjen", "Retry")}</button></p>}{!data && !error && <p role="status">{w("Åpner samtalen …", "Opening conversation …")}</p>}
    <p className="bk-note"><Link href="/booking">← {w("Planlegg et annet opphold", "Plan another stay")}</Link> · <Link href="/booking/privacy">{w("Personvern", "Privacy")}</Link></p>
  </main></div>;
}

export function OwnerInbox() {
  const [lang, setLang] = useSiteLanguage(); const w = (nb: string, en: string) => words(lang, nb, en);
  const [data, setData] = useState<OwnerData | null>(null), [error, setError] = useState("");
  const [password, setPassword] = useState(""), [selected, setSelected] = useState("");
  const [busy, setBusy] = useState(false), [loading, setLoading] = useState(true), [filter, setFilter] = useState("all");
  const [arrival, setArrival] = useState(""), [departure, setDeparture] = useState(""), [note, setNote] = useState("");
  const reload = useCallback(() => bookingApi<OwnerData>("?view=owner")
    .then(result => { setData(result); setError(""); })
    .catch((e: Error) => { if (e.message === "login") setData(null); else setError(e.message); })
    .finally(() => setLoading(false)), []);
  useEffect(() => { void reload(); const timer = setInterval(() => { if (document.visibilityState === "visible") void reload(); }, 12000); return () => clearInterval(timer); }, [reload]);
  const booking = data?.bookings.find(b => b.id === selected);
  async function action(values: Record<string, unknown>) { setBusy(true); setError(""); try { await bookingApi("", values); await reload(); } catch (e) { setError((e as Error).message); } finally { setBusy(false); } }
  async function updateStatus(status: BookingStatus) {
    const question = status === "accepted" ? w("Bekrefte reservasjonen til oppgitt totalpris? Datoene blir markert som reserverte i kalenderen.", "Confirm this reservation at the displayed total price? The dates will be marked as reserved in the calendar.") : status === "cancelled" ? w("Avbestille reservasjonen og gjøre datoene tilgjengelige igjen?", "Cancel this reservation and make the dates available again?") : w("Avslå denne forespørselen?", "Decline this enquiry?");
    if (window.confirm(question)) await action({ action: "status", id: selected, status });
  }
  return <div className="concept-page retreat-page bk-page"><RetreatNav language={lang} setLanguage={setLang} /><main className="bk-main bk-owner"><div className="bk-owner-heading"><div><p className="bk-kicker">GRANDCABIN · {w("EIER", "OWNER")}</p><h1>{w("Forespørsler & samtaler", "Enquiries & conversations")}</h1></div>{data && <button className="bk-secondary" onClick={async () => { await bookingApi("", { action: "logout" }); setData(null); setPassword(""); }}>{w("Logg ut", "Sign out")}</button>}</div>
    {error && <p role="alert" className="bk-error">{errorText(error, lang)}</p>}
    {!data ? loading ? <p role="status">{w("Laster inn …", "Loading …")}</p> : <form className="bk-panel bk-login" onSubmit={async e => { e.preventDefault(); await action({ action: "login", password }); setPassword(""); }}><h2>{w("Velkommen tilbake.", "Welcome back.")}</h2><p>{w("Logg inn for å svare gjester og administrere kalenderen.", "Sign in to reply to guests and manage the calendar.")}</p><label>{w("Eierpassord", "Owner password")}<input type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} /></label><button className="bk-primary" disabled={busy}>{w("Logg inn", "Sign in")} →</button></form> : <>
      {data.preview && <p className="bk-preview">{w("Eierforhåndsvisning · Kun lokale testforespørsler. E-post sendes ikke.", "Owner preview · Local test enquiries only. No email is sent.")}</p>}
      {data.pendingEmails > 0 && <p className="bk-error">{w(`${data.pendingEmails} e-postvarsler venter på sending. Forespørslene er lagret.`, `${data.pendingEmails} email notifications are awaiting delivery. The enquiries are saved.`)} <button disabled={busy} onClick={() => void action({ action: "retry" })}>{w("Prøv sending igjen", "Retry delivery")}</button></p>}
      <div className="bk-owner-stats"><span><b>{data.bookings.filter(b => b.status === "pending").length}</b>{w("Nye forespørsler", "Pending enquiries")}</span><span><b>{data.bookings.filter(b => b.status === "accepted").length}</b>{w("Bekreftede opphold", "Confirmed stays")}</span><span><b>{data.blocks.length}</b>{w("Blokkerte perioder", "Blocked periods")}</span></div>
      <div className="bk-inbox-layout"><aside className="bk-enquiries"><label>{w("Vis forespørsler", "Show enquiries")}<select value={filter} onChange={e => setFilter(e.target.value)}><option value="all">{w("Alle", "All")}</option>{(["pending", "accepted", "declined", "cancelled"] as BookingStatus[]).map(s => <option key={s} value={s}>{statusLabel(lang, s)}</option>)}</select></label>{!data.bookings.length && <p>{w("Nye forespørsler kommer hit. Åpne bookingsiden for å teste.", "New enquiries appear here. Open the booking page to test.")}</p>}{data.bookings.filter(b => filter === "all" || b.status === filter).map(b => <button className={`bk-enquiry ${selected === b.id ? "active" : ""}`} key={b.id} onClick={() => setSelected(b.id)}><span className={`bk-status ${b.status}`}>{statusLabel(lang, b.status)}</span><strong>{b.name}</strong><span>{formatDay(b.arrival, lang)} → {formatDay(b.departure, lang)}</span><small>{b.guests} {w("gjester", "guests")} · {b.messages.filter(m => m.author !== "system").length} {w("meldinger", "messages")}</small></button>)}</aside><div>{booking ? <><div className="bk-owner-actions">{booking.status === "pending" && <><button className="bk-primary" disabled={busy} onClick={() => void updateStatus("accepted")}>{w("Bekreft reservasjon", "Confirm reservation")}</button><button className="bk-secondary" disabled={busy} onClick={() => void updateStatus("declined")}>{w("Avslå", "Decline")}</button></>}{booking.status === "accepted" && <button className="bk-secondary" disabled={busy} onClick={() => void updateStatus("cancelled")}>{w("Avbestill reservasjon", "Cancel reservation")}</button>}{booking.status !== "accepted" && <button className="bk-text-button" disabled={busy} onClick={() => { if (window.confirm(w("Slette forespørselen og alle meldingene permanent?", "Permanently delete this enquiry and all messages?"))) void action({ action: "delete", id: selected }); }}>{w("Slett forespørsel", "Delete enquiry")}</button>}</div><Conversation key={booking.id} booking={booking} lang={lang} owner reload={reload} /></> : <div className="bk-panel bk-empty"><h2>{w("En god samtale er starten.", "Every stay starts with a conversation.")}</h2><p>{w("Velg en forespørsel for å lese ønskene, svare og bekrefte et opphold.", "Choose an enquiry to read the plans, reply and confirm a stay.")}</p><Link className="bk-primary" href="/booking">{w("Åpne bookingsiden", "Open booking page")} →</Link></div>}</div></div>
      <section className="bk-panel bk-blocks"><div><p className="bk-kicker">{w("KALENDER", "CALENDAR")}</p><h2>{w("Hold av egne datoer.", "Keep dates for yourselves.")}</h2><p>{w("Legg også inn opphold bestilt andre steder. Kalenderen synkroniseres ikke med FINN. Periodene gjelder ankomstdagen til, men ikke inkludert, avreisedagen.", "Add stays booked elsewhere too. This calendar does not sync with FINN. Blocks include arrival day, up to but excluding departure day.")}</p></div><form onSubmit={async e => { e.preventDefault(); await action({ action: "block", arrival, departure, note }); }}><div className="bk-fields"><label>{w("Fra", "From")}<input type="date" required min={osloToday()} value={arrival} onChange={e => setArrival(e.target.value)} /></label><label>{w("Til", "Until")}<input type="date" required min={arrival || osloToday()} value={departure} onChange={e => setDeparture(e.target.value)} /></label></div><label>{w("Privat notat (valgfritt)", "Private note (optional)")}<input maxLength={300} value={note} onChange={e => setNote(e.target.value)} /></label><button className="bk-primary" disabled={busy}>{w("Blokker datoer", "Block dates")}</button></form><ul>{data.blocks.map(block => <li key={block.id}><span>{formatDay(block.arrival, lang)} → {formatDay(block.external ? lastReservedNight(block.departure) : block.departure, lang)}<small>{block.external ? w("Reservert via FINN", "Reserved on FINN") : block.note}</small></span>{!block.external && <button className="bk-secondary" disabled={busy} onClick={() => { if (window.confirm(w("Gjøre disse datoene tilgjengelige igjen?", "Make these dates available again?"))) void action({ action: "unblock", id: block.id }); }}>{w("Fjern blokkering", "Unblock")}</button>}</li>)}</ul></section>
    </>}
  </main></div>;
}
