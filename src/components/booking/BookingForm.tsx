"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { RetreatNav, RetreatBookingFooter } from "@/components/ConceptPages";
import { useSiteLanguage } from "@/components/useSiteLanguage";
import { CLEANING_FEE_NOK, DAILY_RATE_NOK, EXTRA_GUEST_RATE_NOK, INCLUDED_GUESTS, LINEN_TOWELS_RATE_NOK, dateValue, nights, osloToday, overlaps, rentalQuote, validateStay, type Stay, type NightlyPrices } from "@/lib/booking/model";
import { bookingApi, errorText, formatDay, money, priceSeasonLabel, words, type Lang } from "./shared";

type Availability = { ready: boolean; preview: boolean; unavailable: Stay[]; today: string; nightlyPrices?: NightlyPrices };
function Calendar({ stay, onChange, occupied, lang, onError, today }: { stay: Stay; onChange: (stay: Stay) => void; occupied: Stay[]; lang: Lang; onError: (code: string) => void; today: string }) {
  const [offset, setOffset] = useState(0);
  const base = new Date(`${today.slice(0, 7)}-01T12:00:00Z`);
  const select = (day: string) => {
    onError("");
    if (!stay.arrival || stay.departure || day <= stay.arrival) { onChange({ arrival: day, departure: "" }); return; }
    const next = { arrival: stay.arrival, departure: day };
    if (occupied.some(b => overlaps(next, b))) { onError("unavailable"); return; }
    onChange(next);
  };
  const selectionStatus = stay.departure
    ? words(lang, `Ankomst ${formatDay(stay.arrival, lang)} · Avreise ${formatDay(stay.departure, lang)}`, `Arrival ${formatDay(stay.arrival, lang)} · Departure ${formatDay(stay.departure, lang)}`)
    : stay.arrival
      ? words(lang, `Ankomst ${formatDay(stay.arrival, lang)} · Velg avreise`, `Arrival ${formatDay(stay.arrival, lang)} · Choose departure`)
      : words(lang, "Velg ankomst", "Choose arrival");
  return <div className="bk-calendar">
    <div className="bk-calendar-toolbar"><span aria-live="polite">{selectionStatus}</span><div><button type="button" disabled={offset === 0} onClick={() => setOffset(offset - 1)} aria-label={words(lang, "Forrige måned", "Previous month")}>←</button><button type="button" disabled={offset >= 23} onClick={() => setOffset(offset + 1)} aria-label={words(lang, "Neste måned", "Next month")}>→</button></div></div>
    <div className="bk-months">{[0, 1].map(monthOffset => {
      const month = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth() + offset + monthOffset, 1, 12));
      const leading = (month.getUTCDay() + 6) % 7;
      const days = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + 1, 0)).getUTCDate();
      return <section key={monthOffset} aria-label={month.toLocaleDateString(lang === "nb" ? "nb-NO" : "en-GB", { month: "long", year: "numeric", timeZone: "UTC" })}>
        <h3>{month.toLocaleDateString(lang === "nb" ? "nb-NO" : "en-GB", { month: "long", year: "numeric", timeZone: "UTC" })}</h3>
        <div className="bk-days">{(lang === "nb" ? ["M", "T", "O", "T", "F", "L", "S"] : ["M", "T", "W", "T", "F", "S", "S"]).map((day, i) => <span className="bk-weekday" key={i} aria-hidden="true">{day}</span>)}{Array.from({ length: leading }, (_, i) => <span key={`blank-${i}`} />)}{Array.from({ length: days }, (_, i) => {
          const day = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth(), i + 1, 12)).toISOString().slice(0, 10);
          const choosingEnd = !!stay.arrival && !stay.departure && day > stay.arrival;
          const occupiedDay = occupied.some(b => day >= b.arrival && day < b.departure);
          const blocked = occupied.some(b => choosingEnd ? overlaps({ arrival: stay.arrival, departure: day }, b) : day >= b.arrival && day < b.departure);
          const disabled = day < today || blocked || dateValue(day) > dateValue(today) + 730 * 86400000 || (choosingEnd && nights({ arrival: stay.arrival, departure: day }) > 365);
          const selected = day === stay.arrival || day === stay.departure;
          const between = stay.arrival && stay.departure && day > stay.arrival && day < stay.departure;
          return <button type="button" key={day} data-date={day} disabled={disabled} aria-label={`${formatDay(day, lang)}${occupiedDay ? words(lang, ", reservert", ", reserved") : ""}`} aria-pressed={selected} className={`${occupiedDay ? "occupied" : ""} ${selected ? "selected" : ""} ${between ? "between" : ""} ${day === today ? "today" : ""}`} onClick={() => select(day)}>{i + 1}</button>;
        })}</div>
      </section>;
    })}</div>
    <div className="bk-legend"><span><i />{words(lang, "Kan forespørres", "Open for enquiries")}</span><span><i className="selected" />{words(lang, "Valgte datoer", "Selected dates")}</span><span><i className="blocked" />{words(lang, "Reservert / opptatt", "Reserved / unavailable")}</span></div>
  </div>;
}

export function BookingForm() {
  const router = useRouter();
  const [lang, setLang] = useSiteLanguage();
  const w = (nb: string, en: string) => words(lang, nb, en);
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [error, setError] = useState("");
  const [step, setStep] = useState(0);
  const [stay, setStay] = useState<Stay>({ arrival: "", departure: "" });
  const [guests, setGuests] = useState(2);
  const [linenTowels, setLinenTowels] = useState(0);
  const quote = rentalQuote(stay, linenTowels, guests, availability?.nightlyPrices);
  const [name, setName] = useState(""), [email, setEmail] = useState(""), [phone, setPhone] = useState("");
  const [occasion, setOccasion] = useState("private"), [message, setMessage] = useState(""), [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const submissionKey = useRef("");
  const formHeading = useRef<HTMLHeadingElement>(null);
  const load = () => bookingApi<Availability>().then(setAvailability).catch(e => setError(e.message));
  useEffect(() => {
    let active = true;
    const refresh = () => bookingApi<Availability>().then(data => { if (active) setAvailability(data); }).catch(e => { if (active) setError(e.message); });
    void refresh();
    const onFocus = () => { void refresh(); };
    window.addEventListener("focus", onFocus);
    const timer = setInterval(() => { if (document.visibilityState === "visible") void refresh(); }, 30000);
    return () => { active = false; window.removeEventListener("focus", onFocus); clearInterval(timer); };
  }, []);
  const changeStep = (next: number) => { setStep(next); setError(""); requestAnimationFrame(() => formHeading.current?.focus()); };
  function datesValid() {
    try { validateStay(stay); if (availability?.unavailable.some(b => overlaps(b, stay))) throw new Error("unavailable"); if (quote.total === null) throw new Error("pricing"); return true; }
    catch (e) { setError((e as Error).message); return false; }
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return;
    if (!datesValid()) { setStep(0); return; }
    if (step < 2) { changeStep(step + 1); return; }
    setBusy(true); setError("");
    try {
      if (!submissionKey.current) submissionKey.current = crypto.randomUUID();
      const website = new FormData(event.currentTarget).get("website") ?? "";
      const result = await bookingApi<{ id: string; token: string }>("", { action: "enquire", expectedTotal: quote.total, ...stay, guests, linenTowels, name, email, phone, occasion, message, consent, language: lang, website, requestKey: submissionKey.current });
      router.push(`/booking/conversation/${result.id}#access=${result.token}`);
    } catch (e) { setError((e as Error).message); if (["unavailable", "priceChanged", "pricing"].includes((e as Error).message)) { setStep(0); await load(); } }
    finally { setBusy(false); }
  }
  return <div className="concept-page retreat-page bk-page">
    <RetreatNav language={lang} setLanguage={setLang} />
    <main className="bk-main">
      <div className="bk-heading"><div><p className="bk-kicker">GRANDCABIN · {w("ET OPPHOLD BARE FOR DERE", "A STAY OF YOUR OWN")}</p><h1>{w("Deres neste", "Your next")}<br /><em>{w("fjelløyeblikk.", "mountain moment.")}</em></h1></div><p>{w("Samle menneskene som betyr noe. Velg når dere vil komme, så planlegger vi resten sammen.", "Bring your favourite people together. Choose when you’d like to visit, and we’ll plan the rest together.")}</p></div>
      {availability?.preview && <p className="bk-preview">{w("Forhåndsvisning · Forespørsler og meldinger lagres bare på denne datamaskinen. E-post sendes ikke.", "Preview · Enquiries and messages are saved only on this computer. No email is sent.")}</p>}
      <div className="bk-layout"><form onSubmit={submit} className="bk-panel">
        <ol className="bk-steps" aria-label={w("Forespørsel, steg", "Enquiry steps")}>{[w("Opphold", "Your stay"), w("Det lille ekstra", "The little extras"), w("Forespørsel", "Your enquiry")].map((label, i) => <li key={label} aria-current={step === i ? "step" : undefined}><button type="button" disabled={i > step} onClick={() => changeStep(i)}><span>{`0${i + 1}`}</span>{label}</button></li>)}</ol>
        <h2 ref={formHeading} tabIndex={-1}>{[w("Når vil dere komme?", "When will you visit?"), w("Gjør oppholdet deres.", "Make yourselves at home."), w("Fortell oss litt om dere.", "Tell us a little about yourselves.")][step]}</h2>
        {!availability && !error && <p role="status">{w("Henter kalender …", "Loading calendar …")}</p>}
        {availability && !availability.ready && <p role="status" className="bk-error">{errorText("setup", lang)}</p>}
        {step === 0 && <>
          <p>{w("Velg ankomst og avreise. Datoene reserveres først når vi har godkjent forespørselen.", "Choose arrival and departure. Dates are reserved only after we approve your enquiry.")}</p>
          <div className="bk-invitation"><strong>{w("La fjelldrømmen bli virkelighet.", "Make your mountain escape a reality.")}</strong><span>{w("Velg datoene som passer, og planlegg et opphold skapt for dere.", "Choose your dates and plan a stay made for you.")}</span></div><div className="bk-fields bk-dates"><label>{w("Ankomst", "Arrival")}<input type="date" required min={availability?.today ?? osloToday()} value={stay.arrival} onChange={e => { setError(""); setStay({ arrival: e.target.value, departure: "" }); }} /></label><label>{w("Avreise", "Departure")}<input type="date" required min={stay.arrival || availability?.today || osloToday()} value={stay.departure} onChange={e => { setError(""); setStay({ ...stay, departure: e.target.value }); }} /></label></div>
          {availability?.ready && <Calendar stay={stay} onChange={setStay} occupied={availability.unavailable} today={availability.today} lang={lang} onError={setError} />}
          <div className="bk-fields"><div className="bk-guest-field"><label>{w("Antall gjester", "Number of guests")}<select value={guests} onChange={e => { const value = Number(e.target.value); setGuests(value); setLinenTowels(Math.min(linenTowels, value)); }}>{Array.from({ length: 29 }, (_, i) => <option key={i} value={i + 1}>{i + 1} {i === 0 ? w("gjest", "guest") : w("gjester", "guests")}</option>)}</select></label><small className="bk-guest-note">{w(`Ordinær pris: ${money(DAILY_RATE_NOK, lang)} per natt for inntil ${INCLUDED_GUESTS} gjester. Deretter +${money(EXTRA_GUEST_RATE_NOK, lang)} per ekstra gjest per natt.`, `Standard rate: ${money(DAILY_RATE_NOK, lang)} per night for up to ${INCLUDED_GUESTS} guests. Each extra guest adds ${money(EXTRA_GUEST_RATE_NOK, lang)} per night.`)}</small></div><label>{w("Anledning", "Occasion")}<select value={occasion} onChange={e => setOccasion(e.target.value)}><option value="private">{w("Familie og venner", "Family and friends")}</option><option value="company">{w("Firma / samling", "Company retreat")}</option><option value="celebration">{w("En spesiell anledning", "A special occasion")}</option></select></label></div>
        </>}
        {step === 1 && <><p>{w("Velg hvor mange gjester som ønsker sengetøy og håndklær samlet. Én pakke koster 350 kr per person.", "Choose how many guests would like the combined bed linen and towel package. It costs NOK 350 per person.")}</p>
          <div className="bk-extra"><span className="bk-extra-icon" aria-hidden="true">▤</span><div><h3>{w("Sengetøy og håndklær", "Bed linen and towels")}</h3><p>{w(`${money(LINEN_TOWELS_RATE_NOK, lang)} per person · én samlet pakke`, `${money(LINEN_TOWELS_RATE_NOK, lang)} per person · one combined package`)}</p></div><label>{w("Antall personer", "Number of people")}<select aria-label={w("Antall personer med sengetøy og håndklær", "People with bed linen and towels")} value={linenTowels} onChange={e => setLinenTowels(Number(e.target.value))}>{Array.from({ length: guests + 1 }, (_, i) => <option key={i} value={i}>{i}</option>)}</select></label></div>
          <p className="bk-note">{w("Velg 0 dersom dere tar med eget. Dere kan også avklare ønskene i samtalen etterpå.", "Choose 0 if you are bringing your own. You can also discuss your preferences in the conversation afterwards.")}</p>
        </>}
        {step === 2 && <><p>{w("Forespørselen går direkte til oss. Dere får en privat samtale for spørsmål og praktiske detaljer om oppholdet.", "Your enquiry goes directly to us. Your private conversation is the place for questions and practical details about your stay.")}</p>
          <div className="bk-fields"><label>{w("Fullt navn", "Full name")}<input autoComplete="name" required maxLength={120} value={name} onChange={e => setName(e.target.value)} /></label><label>{w("E-post", "Email")}<input type="email" autoComplete="email" required maxLength={254} value={email} onChange={e => setEmail(e.target.value)} /></label><label>{w("Telefon (valgfritt)", "Phone (optional)")}<input type="tel" autoComplete="tel" maxLength={40} value={phone} onChange={e => setPhone(e.target.value)} /></label></div>
          <label className="bk-message-label">{w("Ønsker for oppholdet (valgfritt)", "Your plans for the stay (optional)")}<textarea rows={5} maxLength={5000} value={message} onChange={e => setMessage(e.target.value)} placeholder={w("En helg med storfamilien, kick-off med kollegaer eller noe helt annet …", "A weekend with family, a team retreat or something else entirely …")} /></label>
          <div className="bk-trap" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
          <label className="bk-consent"><input type="checkbox" checked={consent} required onChange={e => setConsent(e.target.checked)} /><span>{w("Jeg godtar at kontaktopplysninger og meldinger lagres for å behandle forespørselen og at jeg kontaktes om oppholdet.", "I agree that my contact details and messages will be stored to handle this enquiry and that I may be contacted about the stay.")} <Link href="/booking/privacy">{w("Om personvern", "Privacy details")}</Link></span></label>
        </>}
        {error && <p role="alert" className="bk-error">{errorText(error, lang)}{!availability && <button type="button" onClick={() => { setError(""); void load(); }}>{w("Prøv igjen", "Retry")}</button>}</p>}
        <div className="bk-controls">{step > 0 ? <button type="button" className="bk-secondary" disabled={busy} onClick={() => changeStep(step - 1)}>← {w("Tilbake", "Back")}</button> : <span />}
          <button className="bk-primary" type="submit" disabled={!availability?.ready || busy}>{busy ? w("Sender …", "Sending …") : step === 2 ? w("Send forespørsel", "Send enquiry") : w("Fortsett", "Continue")} <span aria-hidden="true">→</span></button></div>
        <p className="bk-no-payment">{w("Uforpliktende forespørsel · Ingen betaling nå", "No-obligation enquiry · No payment now")}</p>
      </form><aside className="bk-summary"><div className="bk-summary-photo"><Image src="/images/exterior.avif" alt={w("Grandcabin i vinterlandskap", "Grandcabin in the winter landscape")} fill sizes="(max-width: 1000px) 100vw, 380px" /></div><div className="bk-summary-copy"><p className="bk-kicker">{w("HELE HYTTA. BARE DERE.", "THE WHOLE CABIN. ALL YOURS.")}</p><h2>Grandcabin</h2><p>Turufjell · Flå · {w("Under to timer fra Oslo", "Under two hours from Oslo")}</p><div className="bk-summary-facts"><span>29 {w("gjester", "guests")}</span><span>9 {w("soverom", "bedrooms")}</span><span>360 m²</span></div><dl><div><dt>{w("Ankomst", "Arrival")}</dt><dd>{formatDay(stay.arrival, lang)}</dd></div><div><dt>{w("Avreise", "Departure")}</dt><dd>{formatDay(stay.departure, lang)}</dd></div>{stay.arrival && stay.departure && nights(stay) > 0 && <div><dt>{w("Netter", "Nights")}</dt><dd>{nights(stay)}</dd></div>}<div><dt>{w("Gjester", "Guests")}</dt><dd>{guests}</dd></div><div><dt>{w("Sengetøy og håndklær", "Bed linen and towels")}</dt><dd>{linenTowels} × {money(LINEN_TOWELS_RATE_NOK, lang)}</dd></div></dl><div className="bk-total"><span>{w("Prisoversikt", "Price breakdown")}</span>{quote.extraGuests > 0 && <small className="bk-guest-surcharge">{w(`${quote.extraGuests} ekstra ${quote.extraGuests === 1 ? "gjest" : "gjester"} × ${money(EXTRA_GUEST_RATE_NOK, lang)} per døgn er inkludert i døgnprisene under.`, `${quote.extraGuests} extra ${quote.extraGuests === 1 ? "guest" : "guests"} × ${money(EXTRA_GUEST_RATE_NOK, lang)} per day are included in the nightly rates below.`)}</small>}{quote.lines.length ? quote.lines.map(line => <div className="bk-price-row" key={`${line.season}-${line.rate}`}><span>{priceSeasonLabel(lang, line.season)} · {line.days} {w("døgn", "days")} × {line.rate === null ? "—" : money(line.rate, lang)}</span><b>{line.subtotal === null ? "—" : money(line.subtotal, lang)}</b></div>) : <div className="bk-price-row"><span>{w("Leiepris fra", "Rental price from")}</span><b>{money(DAILY_RATE_NOK + quote.guestSurchargePerNight, lang)} {w("per døgn", "per day")}</b></div>}<div className="bk-price-row"><span>{w("Obligatorisk utvask", "Mandatory final cleaning")}</span><b>{money(CLEANING_FEE_NOK, lang)}</b></div><div className="bk-price-row"><span>{w("Sengetøy og håndklær", "Bed linen and towels")} · {linenTowels} × {money(LINEN_TOWELS_RATE_NOK, lang)}</span><b>{money(quote.linenTowelsTotal, lang)}</b></div>{quote.total !== null && <div className="bk-price-row grand"><span>{w("Totalpris", "Total price")}</span><strong>{money(quote.total, lang)}</strong></div>}{quote.lines.some(line => line.rate === null) && <small className="bk-pricing-pending">{errorText("pricing", lang)}</small>}</div><section className="bk-deposit"><h3>{w("Depositum", "Deposit")}</h3><p>{w("Informasjon om beløp og vilkår legges inn før bestilling åpnes.", "The deposit amount and terms will be added before bookings open.")}</p></section></div><div className="bk-contact"><span>{w("Vi hjelper dere gjerne", "We’re happy to help")}</span><a href="tel:+4797816981">+47 978 16 981</a><a href="tel:+4796878888">+47 968 78 888</a></div></aside></div>
      <div className="bk-how">{[["01", w("Send oss ønskene", "Share your plans"), w("Velg datoer, gjester og det lille ekstra.", "Choose dates, guests and your extras.")], ["02", w("Planlegg sammen", "Plan together"), w("Still spørsmål og planlegg detaljene i deres private samtale.", "Ask questions and plan the details in your private conversation.")], ["03", w("Velkommen til fjells", "See you in the mountains"), w("Vi bekrefter reservasjonen når alt er avklart.", "We confirm your reservation once everything is agreed.")]].map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
    </main><RetreatBookingFooter language={lang} />
  </div>;
}
