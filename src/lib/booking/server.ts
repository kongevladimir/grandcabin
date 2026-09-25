import { createHash, createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { BookingError, type Booking, type BookingState, type Notice } from "./model";
import { configured, isLocalPreview, mutate, readState } from "./store";

export const cookieName = (role: "owner" | "guest") => `grandcabin-${role}`;
export function signature(value: string) { return createHmac("sha256", process.env.BOOKING_SESSION_SECRET!).update(value).digest("base64url"); }
export function equal(a: string, b: string) { return timingSafeEqual(createHash("sha256").update(a).digest(), createHash("sha256").update(b).digest()); }
function signedCookie(role: "owner" | "guest", id: string) {
  const payload = Buffer.from(JSON.stringify({ role, id, expires: Date.now() + (role === "owner" ? 8 * 3600000 : 180 * 86400000) })).toString("base64url");
  return `${payload}.${signature(payload + (role === "owner" ? process.env.BOOKING_OWNER_PASSWORD : ""))}`;
}
export function session(request: NextRequest, role: "owner" | "guest"): string | null {
  try {
    const value = request.cookies.get(cookieName(role))?.value ?? "";
    const [payload, sig] = value.split(".");
    if (!payload || !sig || !equal(sig, signature(payload + (role === "owner" ? process.env.BOOKING_OWNER_PASSWORD : "")))) return null;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return data.role === role && data.expires > Date.now() && typeof data.id === "string" ? data.id : null;
  } catch { return null; }
}
export function withSession(response: NextResponse, role: "owner" | "guest", id: string) {
  response.cookies.set(cookieName(role), signedCookie(role, id), { httpOnly: true, secure: !isLocalPreview(), sameSite: "lax", path: "/", maxAge: role === "owner" ? 8 * 3600 : 180 * 86400 });
  return response;
}
export function reply(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: { "Cache-Control": "no-store, private", "Referrer-Policy": "no-referrer", "X-Content-Type-Options": "nosniff" } });
}
export function guard(request: NextRequest) {
  if (!configured()) throw new BookingError("setup", 503);
  if (isLocalPreview() && !["localhost", "127.0.0.1", "[::1]"].includes(request.nextUrl.hostname)) throw new BookingError("setup", 503);
  if (!isLocalPreview() && new URL(process.env.BOOKING_SITE_URL!).protocol !== "https:") throw new BookingError("setup", 503);
}
export function ownerOnly(request: NextRequest) { if (!session(request, "owner")) throw new BookingError("login", 401); }
export function guestOrOwner(request: NextRequest, id: string) { if (!session(request, "owner") && session(request, "guest") !== id) throw new BookingError("access", 401); }
export async function body(request: NextRequest): Promise<Record<string, unknown>> {
  const expected = isLocalPreview() ? request.nextUrl.origin : new URL(process.env.BOOKING_SITE_URL!).origin;
  if (request.headers.get("origin") !== expected || !request.headers.get("content-type")?.startsWith("application/json")) throw new BookingError("access", 403);
  const reader = request.body?.getReader();
  if (!reader) throw new BookingError("details");
  const chunks: Uint8Array[] = []; let size = 0;
  while (true) {
    const { done, value } = await reader.read(); if (done) break;
    size += value.length;
    if (size > 20000) { await reader.cancel(); throw new BookingError("details", 413); }
    chunks.push(value);
  }
  try { const data = JSON.parse(Buffer.concat(chunks).toString()); if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error(); return data; }
  catch { throw new BookingError("details"); }
}
export async function rateLimit(request: NextRequest, scope: string, count: number, duration: number, identity?: string) {
  const identityHash = signature(`${scope}:${identity ?? request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown"}`);
  await mutate(state => {
    const now = Date.now();
    for (const key of Object.keys(state.limits)) { state.limits[key] = state.limits[key].filter(t => now - t < 86400000); if (!state.limits[key].length) delete state.limits[key]; }
    const hits = (state.limits[identityHash] ?? []).filter(t => now - t < duration);
    if (hits.length >= count) throw new BookingError("rate", 429);
    state.limits[identityHash] = [...hits, now];
  });
}
export const guestToken = (id: string) => signature(`guest-access:${id}`);
export function publicBooking(booking: Booking) {
  const { requestKey: _requestKey, ...safe } = booking;
  void _requestKey;
  return safe;
}
export function notify(state: BookingState, bookingId: string, recipient: Notice["recipient"]) {
  if (!isLocalPreview()) state.notices.push({ id: randomUUID(), bookingId, recipient, attempts: 0, lastAttempt: 0 });
}
export async function deliverNotices() {
  if (isLocalPreview()) return;
  const notices = (await readState()).state.notices.filter(n => Date.now() - n.lastAttempt > 60000).slice(0, 4);
  for (const notice of notices) {
    const claimed = await mutate(state => {
      const current = state.notices.find(n => n.id === notice.id);
      if (!current || Date.now() - current.lastAttempt <= 60000) return null;
      current.lastAttempt = Date.now(); current.attempts++;
      return state.bookings.find(b => b.id === current.bookingId) ?? null;
    });
    if (!claimed) continue;
    const base = process.env.BOOKING_SITE_URL!.replace(/\/$/, "");
    const url = notice.recipient === "owner" ? `${base}/booking/owner` : `${base}/booking/conversation/${claimed.id}#access=${guestToken(claimed.id)}`;
    const nb = notice.recipient === "owner" || claimed.language === "nb";
    try {
      const sent = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": `booking-${notice.id}` }, body: JSON.stringify({ from: process.env.BOOKING_EMAIL_FROM, to: [notice.recipient === "owner" ? process.env.BOOKING_OWNER_EMAIL : claimed.email], subject: nb ? "Grandcabin · Oppdatering på forespørselen" : "Grandcabin · Your enquiry has an update", text: nb ? `Det er en ny forespørsel, melding eller statusoppdatering for ${claimed.arrival}–${claimed.departure}.\n\nÅpne samtalen for detaljer:\n${url}\n\nEn forespørsel er ikke en bekreftet reservasjon. Lenken til gjestesamtalen er privat. Svar i samtalen på nettsiden.` : `There is a new enquiry, message or status update for ${claimed.arrival}–${claimed.departure}.\n\nOpen the conversation for details:\n${url}\n\nAn enquiry is not a confirmed reservation. The guest conversation link is private. Please reply in the conversation on the website.` }), signal: AbortSignal.timeout(8000) });
      if (sent.ok) await mutate(state => { state.notices = state.notices.filter(n => n.id !== notice.id); });
    } catch { /* The saved outbox is retried on the next owner visit or retry action. */ }
  }
}
export function failure(error: unknown) {
  if (error instanceof BookingError) return reply({ error: error.message }, error.status);
  console.error("Booking request failed:", error instanceof Error ? error.name : "UnknownError");
  return reply({ error: "storage" }, 503);
}
