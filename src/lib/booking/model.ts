export type BookingStatus = "pending" | "accepted" | "declined" | "cancelled";
export type Stay = { arrival: string; departure: string };
export type Message = { id: string; author: "guest" | "owner" | "system"; text: string; createdAt: string };
export type Booking = Stay & {
  id: string; requestKey: string; name: string; email: string; phone: string;
  guests: number; linenTowels?: number; linen?: number; towels?: number; occasion: string;
  language: "nb" | "en"; status: BookingStatus; createdAt: string; updatedAt: string;
  messages: Message[];
  pricing?: BookingQuote | { dailyRate: number; rentalTotal: number; currency: "NOK" };
};
export type Block = Stay & { id: string; note: string; external?: true };
export type Notice = { id: string; bookingId: string; recipient: "owner" | "guest"; attempts: number; lastAttempt: number };
export type BookingState = { bookings: Booking[]; blocks: Block[]; limits: Record<string, number[]>; notices: Notice[] };
export const emptyState = (): BookingState => ({ bookings: [], blocks: [], limits: {}, notices: [] });
// Existing FINN reservations, recorded as occupied nights. Departure is exclusive.
export const finnReservations: Block[] = [
  { id: "finn-2026-11-13", arrival: "2026-11-13", departure: "2026-11-15", note: "Reservert via FINN", external: true },
  { id: "finn-2026-11-27", arrival: "2026-11-27", departure: "2026-11-29", note: "Reservert via FINN", external: true },
  { id: "finn-2026-12-04", arrival: "2026-12-04", departure: "2026-12-06", note: "Reservert via FINN", external: true },
  { id: "finn-2026-12-18", arrival: "2026-12-18", departure: "2026-12-20", note: "Reservert via FINN", external: true },
  { id: "finn-2026-12-23", arrival: "2026-12-23", departure: "2026-12-26", note: "Reservert via FINN", external: true },
  { id: "finn-2026-12-30", arrival: "2026-12-30", departure: "2027-01-01", note: "Reservert via FINN", external: true },
  { id: "finn-2027-01-22", arrival: "2027-01-22", departure: "2027-01-24", note: "Reservert via FINN", external: true },
];
export class BookingError extends Error {
  status: number;
  constructor(code: string, status = 400) { super(code); this.status = status; }
}
export function osloToday(now = new Date()): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Oslo" }).format(now);
}
export function dateValue(day: string): number { return Date.parse(`${day}T12:00:00Z`); }
export function isDate(day: unknown): day is string {
  if (typeof day !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(day)) return false;
  const value = dateValue(day);
  return Number.isFinite(value) && new Date(value).toISOString().slice(0, 10) === day;
}
export function nights(stay: Stay): number { return Math.round((dateValue(stay.departure) - dateValue(stay.arrival)) / 86400000); }
export const DAILY_RATE_NOK = 15000;
export const EASTER_RATE_NOK = 16000;
export const INCLUDED_GUESTS = 24;
export const EXTRA_GUEST_RATE_NOK = 750;
export const CLEANING_FEE_NOK = 5000;
export const LINEN_TOWELS_RATE_NOK = 350;
// The owner has given winter holiday dates but not its price yet. Never quote a guessed rate.
export const WINTER_RATE_NOK: number | null = null;
export type PriceSeason = "standard" | "winter" | "easter";
export type PriceLine = { season: PriceSeason; days: number; rate: number | null; subtotal: number | null };
export type BookingQuote = {
  currency: "NOK"; lines: PriceLine[]; rentalTotal: number | null;
  extraGuests: number; extraGuestRate: number; guestSurchargePerNight: number;
  cleaningFee: number; linenTowelsCount: number; linenTowelsUnitPrice: number;
  linenTowelsTotal: number; total: number | null;
};
export function priceSeason(day: string): PriceSeason {
  if (day >= "2027-02-22" && day <= "2027-02-26") return "winter";
  if (day >= "2027-03-22" && day <= "2027-03-30") return "easter";
  return "standard";
}
export function rentalQuote(stay: Stay, linenTowelsCount = 0, guests = 2): BookingQuote {
  const count = nights(stay);
  const extraGuests = Math.max(0, guests - INCLUDED_GUESTS);
  const guestSurchargePerNight = extraGuests * EXTRA_GUEST_RATE_NOK;
  const amounts: Record<PriceSeason, number> = { standard: 0, winter: 0, easter: 0 };
  if (isDate(stay.arrival) && isDate(stay.departure) && count > 0 && count <= 365) {
    const first = dateValue(stay.arrival);
    for (let index = 0; index < count; index++) {
      const day = new Date(first + index * 86400000).toISOString().slice(0, 10);
      amounts[priceSeason(day)]++;
    }
  }
  const lines: PriceLine[] = (["standard", "winter", "easter"] as PriceSeason[]).filter(season => amounts[season] > 0).map(season => {
    const baseRate = season === "easter" ? EASTER_RATE_NOK : season === "winter" ? WINTER_RATE_NOK : DAILY_RATE_NOK;
    const rate = baseRate === null ? null : baseRate + guestSurchargePerNight;
    return { season, days: amounts[season], rate, subtotal: rate === null ? null : amounts[season] * rate };
  });
  const complete = lines.length > 0 && lines.every(line => line.subtotal !== null);
  const rentalTotal = complete ? lines.reduce((total, line) => total + line.subtotal!, 0) : null;
  const linenTowelsTotal = linenTowelsCount * LINEN_TOWELS_RATE_NOK;
  return { currency: "NOK", lines, rentalTotal, extraGuests, extraGuestRate: EXTRA_GUEST_RATE_NOK, guestSurchargePerNight, cleaningFee: CLEANING_FEE_NOK, linenTowelsCount, linenTowelsUnitPrice: LINEN_TOWELS_RATE_NOK, linenTowelsTotal, total: rentalTotal === null ? null : rentalTotal + CLEANING_FEE_NOK + linenTowelsTotal };
}
export function overlaps(a: Stay, b: Stay): boolean { return a.arrival < b.departure && b.arrival < a.departure; }
export function validateStay(stay: Stay): void {
  if (!isDate(stay.arrival) || !isDate(stay.departure) || stay.arrival < osloToday() || nights(stay) < 1 || nights(stay) > 365 || dateValue(stay.departure) > dateValue(osloToday()) + 730 * 86400000) throw new BookingError("dates");
}
export function unavailable(state: BookingState): Stay[] {
  return [...finnReservations, ...state.blocks, ...state.bookings.filter(b => b.status === "accepted")].map(({ arrival, departure }) => ({ arrival, departure }));
}
export function assertAvailable(state: BookingState, stay: Stay, exceptId?: string) {
  const occupied = [...finnReservations, ...state.blocks, ...state.bookings.filter(b => b.status === "accepted" && b.id !== exceptId)];
  if (occupied.some(other => overlaps(stay, other))) throw new BookingError("unavailable", 409);
}
export function validateRequest(value: Record<string, unknown>) {
  const text = (key: string, max: number, required = false) => {
    const raw = value[key];
    if (raw !== undefined && typeof raw !== "string") throw new BookingError("details");
    const result = (raw as string | undefined)?.trim() ?? "";
    if (result.length > max || (required && !result)) throw new BookingError("details");
    return result;
  };
  const stay = { arrival: text("arrival", 10, true), departure: text("departure", 10, true) };
  validateStay(stay);
  const guests = value.guests, linenTowels = value.linenTowels;
  if (typeof guests !== "number" || !Number.isInteger(guests) || guests < 1 || guests > 29 || typeof linenTowels !== "number" || !Number.isInteger(linenTowels) || linenTowels < 0 || linenTowels > guests) throw new BookingError("guests");
  if (rentalQuote(stay, linenTowels, guests).total === null) throw new BookingError("pricing");
  const email = text("email", 254, true).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || value.consent !== true || text("website", 200)) throw new BookingError("details");
  const requestKey = text("requestKey", 50, true);
  if (!/^[a-f0-9-]{36}$/.test(requestKey)) throw new BookingError("details");
  return { ...stay, guests, linenTowels, email, requestKey, name: text("name", 120, true), phone: text("phone", 40), occasion: text("occasion", 120), message: text("message", 5000), language: value.language === "en" ? "en" as const : "nb" as const };
}
export function changeStatus(state: BookingState, booking: Booking, status: BookingStatus) {
  if (booking.status === status) return;
  const allowed: Record<BookingStatus, BookingStatus[]> = { pending: ["accepted", "declined"], accepted: ["cancelled"], declined: [], cancelled: [] };
  if (!allowed[booking.status].includes(status)) throw new BookingError("status", 409);
  if (status === "accepted") { validateStay(booking); assertAvailable(state, booking, booking.id); }
  booking.status = status;
  booking.updatedAt = new Date().toISOString();
}
