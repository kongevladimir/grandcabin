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
export async function ownerSession(request: NextRequest) {
  const id = session(request, "owner");
  if (!id) return false;
  return id === ((await readState()).state.ownerAuth?.sessionVersion ?? "owner");
}
export async function ownerOnly(request: NextRequest) { if (!(await ownerSession(request))) throw new BookingError("login", 401); }
export async function guestOrOwner(request: NextRequest, id: string) { if (session(request, "guest") !== id && !(await ownerSession(request))) throw new BookingError("access", 401); }
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
  if (!isLocalPreview() && recipient === "owner") state.notices.push({ id: randomUUID(), bookingId, recipient, attempts: 0, lastAttempt: 0 });
}
// Zoho Mail EU uses OAuth. Secrets stay server-side and are never sent to guests.
export async function sendOwnerMail(subject: string, content: string, mailFormat: "plaintext" | "html" = "plaintext") {
  const form = new URLSearchParams({ grant_type: "refresh_token", client_id: process.env.ZOHO_CLIENT_ID!, client_secret: process.env.ZOHO_CLIENT_SECRET!, refresh_token: process.env.ZOHO_REFRESH_TOKEN! });
  const refreshed = await fetch("https://accounts.zoho.eu/oauth/v2/token", { method: "POST", body: form, signal: AbortSignal.timeout(12000) });
  if (!refreshed.ok) throw new Error("mail authentication");
  const auth = await refreshed.json() as { access_token?: string };
  if (!auth.access_token) throw new Error("mail authentication");
  const sent = await fetch(`https://mail.zoho.eu/api/accounts/${encodeURIComponent(process.env.ZOHO_ACCOUNT_ID!)}/messages`, { method: "POST", headers: { Authorization: `Zoho-oauthtoken ${auth.access_token}`, "Content-Type": "application/json" }, body: JSON.stringify({ fromAddress: process.env.BOOKING_EMAIL_FROM, toAddress: process.env.BOOKING_OWNER_EMAIL, subject, content, mailFormat }), signal: AbortSignal.timeout(12000) });
  if (!sent.ok) throw new Error("mail delivery");
  const result = await sent.json() as { status?: { code?: number } };
  if (result.status?.code !== 200) throw new Error("mail delivery");
}
export async function deliverNotices() {
  if (isLocalPreview()) return;
  const notices = (await readState()).state.notices.filter(n => n.recipient === "owner" && Date.now() - n.lastAttempt > 60000).slice(0, 4);
  for (const notice of notices) {
    const claimed = await mutate(state => {
      const current = state.notices.find(n => n.id === notice.id);
      if (!current || Date.now() - current.lastAttempt <= 60000) return null;
      current.lastAttempt = Date.now(); current.attempts++;
      return state.bookings.find(b => b.id === current.bookingId) ?? null;
    });
    if (!claimed) continue;
    const base = process.env.BOOKING_SITE_URL!.replace(/\/$/, "");
    const url = `${base}/booking/owner`;
    try {
      const date = (day: string) => new Date(`${day}T12:00:00Z`).toLocaleDateString("nb-NO", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" });
      const total = claimed.pricing && "total" in claimed.pricing ? claimed.pricing.total : null;
      const price = total === null || total === undefined ? "pris ikke tilgjengelig" : `${new Intl.NumberFormat("nb-NO", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(total)} kr`;
      const escape = (value: string | number) => String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
      const message = claimed.messages.filter(m => m.author === "guest").map(m => m.text).join("\n\n") || "—";
      const content = `<div style="font-family:Arial,sans-serif;color:#17212c;max-width:640px;margin:auto;line-height:1.5"><h2 style="text-align:center">Du har fått en ny forespørsel</h2><p style="font-size:18px;text-align:center">${escape(claimed.name)} ønsker å leie Turu Crown i perioden ${escape(date(claimed.arrival))} – ${escape(date(claimed.departure))} for ${escape(price)}.</p><p>Forespørselen er ikke en bekreftet reservasjon. Kontakt gjesten direkte for å avtale oppholdet.</p><hr><p><strong>E-post:</strong> ${escape(claimed.email)}<br><strong>Telefon:</strong> ${escape(claimed.phone || "—")}<br><strong>Antall gjester:</strong> ${escape(claimed.guests)}<br><strong>Sengetøy og håndklær:</strong> ${escape(claimed.linenTowels ?? 0)}<br><strong>Anledning:</strong> ${escape(claimed.occasion)}</p><p><strong>Melding:</strong><br>${escape(message).replace(/\n/g, "<br>")}</p><p><a href="${escape(url)}">Åpne administrasjonen</a></p></div>`;
      await sendOwnerMail("Du har fått en ny forespørsel · Turu Crown", content, "html");
      await mutate(state => { state.notices = state.notices.filter(n => n.id !== notice.id); });
    } catch { /* The saved outbox is retried on the next owner visit or retry action. */ }
  }
}
export function failure(error: unknown) {
  if (error instanceof BookingError) return reply({ error: error.message }, error.status);
  console.error("Booking request failed:", error instanceof Error ? error.name : "UnknownError");
  return reply({ error: "storage" }, 503);
}
