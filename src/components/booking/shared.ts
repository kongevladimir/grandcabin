import type { BookingStatus } from "@/lib/booking/model";
export type Lang = "nb" | "en";
export const words = (lang: Lang, nb: string, en: string) => lang === "nb" ? nb : en;
export const money = (amount: number, lang: Lang) => `${new Intl.NumberFormat(lang === "nb" ? "nb-NO" : "en-GB", { maximumFractionDigits: 0 }).format(amount)} NOK`;
export const priceSeasonLabel = (lang: Lang, season: "standard" | "winter" | "easter" | "custom") => ({
  custom: words(lang, "Nattpris", "Nightly rate"),
  standard: words(lang, "Ordinær pris", "Regular price"),
  winter: words(lang, "Vinterferie", "Winter holiday"),
  easter: words(lang, "Påskeferie", "Easter holiday"),
})[season];
export const statusLabel = (lang: Lang, status: BookingStatus) => ({ pending: words(lang, "Venter på svar", "Awaiting reply"), accepted: words(lang, "Reservasjon bekreftet", "Reservation confirmed"), declined: words(lang, "Avslått", "Declined"), cancelled: words(lang, "Avbestilt", "Cancelled") })[status];
export function formatDay(day: string, lang: Lang) { return day ? new Date(`${day}T12:00:00Z`).toLocaleDateString(lang === "nb" ? "nb-NO" : "en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }) : "—"; }
export function errorText(code: string, lang: Lang) {
  const errors: Record<string, [string, string]> = {
    priceDates: ["Velg første og siste natt innenfor de neste to årene.", "Choose the first and last night within the next two years."],
    priceAmount: ["Skriv en hel nattpris mellom 1 og 1 000 000 kr.", "Enter a whole nightly price between NOK 1 and NOK 1,000,000."],
    priceChanged: ["Prisen er oppdatert. Se gjennom den nye totalprisen før du sender forespørselen igjen.", "The price has changed. Please review the updated total before sending your enquiry again."],
    dates: ["Velg ankomst og avreise, med minst én natt mellom.", "Choose arrival and departure, with at least one night between."],
    guests: ["Velg 1–29 gjester. Antall sett kan ikke være større enn antall gjester.", "Choose 1–29 guests. Extras cannot exceed the number of guests."],
    pricing: ["Prisen for vinterferien er ikke lagt inn ennå. Velg andre datoer foreløpig.", "The winter holiday price is not set yet. Please choose other dates for now."],
    details: ["Kontroller navn, e-post og at du har godkjent behandling av forespørselen.", "Check your name, email and enquiry consent."],
    unavailable: ["Disse datoene er ikke lenger ledige. Velg en annen periode.", "These dates are no longer available. Please choose another stay."],
    login: ["Logg inn med riktig eierpassord.", "Please sign in with the correct owner password."],
    access: ["Åpne den private lenken til samtalen for å få tilgang.", "Open your private conversation link to access this enquiry."],
    rate: ["For mange forsøk. Vent litt før du prøver igjen.", "Too many attempts. Please wait before trying again."],
    setup: ["Nettbestilling er ikke åpnet ennå. Ring oss på 978 16 981 for en forespørsel.", "Online enquiries are not open yet. Call +47 978 16 981 to enquire."],
    storage: ["Vi fikk ikke kontakt med bookingtjenesten. Prøv igjen. Forespørselen er først registrert når du ser samtalen.", "We could not reach the booking service. Please retry. Your enquiry is registered when the conversation appears."],
    busy: ["En annen oppdatering pågår. Prøv igjen.", "Another update is in progress. Please retry."],
    missing: ["Denne forespørselen finnes ikke lenger.", "This enquiry is no longer available."],
    status: ["Statusen har endret seg. Oppdater siden før du prøver igjen.", "The status has changed. Refresh before trying again."],
    message: ["Skriv en melding på opptil 5 000 tegn.", "Write a message of up to 5,000 characters."],
  };
  return (errors[code] ?? errors.storage)[lang === "nb" ? 0 : 1];
}
export async function bookingApi<T>(query = "", data?: Record<string, unknown>): Promise<T> {
  let response;
  try { response = await fetch(`/api/booking${query}`, data ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) } : { cache: "no-store" }); }
  catch { throw new Error("storage"); }
  const result = await response.json();
  if (!response.ok) throw new Error(result.error ?? "storage");
  return result;
}
