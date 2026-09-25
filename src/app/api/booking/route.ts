import { randomUUID } from "node:crypto";
import { NextRequest } from "next/server";
import { BookingError, assertAvailable, changeStatus, finnReservations, osloToday, rentalQuote, unavailable, validateRequest, validateStay, type Booking, type BookingStatus } from "@/lib/booking/model";
import { configured, isLocalPreview, mutate, readState } from "@/lib/booking/store";
import { body, cookieName, deliverNotices, equal, failure, guard, guestOrOwner, guestToken, notify, ownerOnly, publicBooking, rateLimit, reply, session, withSession } from "@/lib/booking/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
  try {
    const view = request.nextUrl.searchParams.get("view") ?? "availability";
    if (view === "availability" && !configured()) return reply({ ready: false, preview: false, unavailable: [], today: osloToday() });
    guard(request);
    if (view === "owner") { ownerOnly(request); await deliverNotices(); }
    const id = request.nextUrl.searchParams.get("id") ?? "";
    if (view === "conversation") guestOrOwner(request, id);
    if (!["availability", "owner", "conversation"].includes(view)) throw new BookingError("missing", 404);
    const { state } = await readState();
    if (view === "owner") return reply({ bookings: state.bookings.map(publicBooking).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)), blocks: [...finnReservations, ...state.blocks], pendingEmails: state.notices.length, preview: isLocalPreview() });
    if (view === "conversation") {
      const booking = state.bookings.find(b => b.id === id);
      if (!booking) throw new BookingError("missing", 404);
      return reply({ booking: publicBooking(booking), preview: isLocalPreview(), isOwner: !!session(request, "owner"), token: session(request, "guest") === id ? guestToken(id) : undefined });
    }
    return reply({ ready: true, preview: isLocalPreview(), unavailable: unavailable(state), today: osloToday() });
  } catch (error) { return failure(error); }
}

export async function POST(request: NextRequest) {
  try {
    guard(request);
    const data = await body(request);
    const action = data.action;
    if (action === "login") {
      await rateLimit(request, "login", 10, 15 * 60000);
      await rateLimit(request, "login-global", 50, 15 * 60000, "owner");
      if (typeof data.password !== "string" || !equal(data.password, process.env.BOOKING_OWNER_PASSWORD!)) throw new BookingError("login", 401);
      return withSession(reply({ ok: true }), "owner", "owner");
    }
    if (action === "logout") { const result = reply({ ok: true }); result.cookies.delete(cookieName("owner")); return result; }
    if (action === "access") {
      await rateLimit(request, "access", 30, 15 * 60000);
      const id = String(data.id ?? "");
      if (typeof data.token !== "string" || !equal(data.token, guestToken(id)) || !(await readState()).state.bookings.some(b => b.id === id)) throw new BookingError("access", 401);
      return withSession(reply({ ok: true }), "guest", id);
    }
    if (action === "enquire") {
      const details = validateRequest(data);
      // The same submission nonce safely retries a lost response without duplicate enquiries.
      const existing = (await readState()).state.bookings.find(b => b.requestKey === details.requestKey);
      if (existing) {
        if (existing.email !== details.email) throw new BookingError("details");
        return withSession(reply({ id: existing.id, token: guestToken(existing.id), preview: isLocalPreview() }), "guest", existing.id);
      }
      await rateLimit(request, "enquire", 5, 3600000);
      await rateLimit(request, "email", 3, 86400000, details.email);
      const id = randomUUID(), now = new Date().toISOString();
      const saved = await mutate(state => {
        const duplicate = state.bookings.find(b => b.requestKey === details.requestKey);
        if (duplicate) { if (duplicate.email !== details.email) throw new BookingError("details"); return duplicate; }
        assertAvailable(state, details);
        const { message, ...fields } = details;
        const booking: Booking = { ...fields, id, pricing: rentalQuote(fields, fields.linenTowels, fields.guests), status: "pending", createdAt: now, updatedAt: now, messages: message ? [{ id: randomUUID(), author: "guest", text: message, createdAt: now }] : [] };
        state.bookings.push(booking); notify(state, id, "owner"); notify(state, id, "guest");
        return booking;
      });
      await deliverNotices();
      return withSession(reply({ id: saved.id, token: guestToken(saved.id), preview: isLocalPreview() }, 201), "guest", saved.id);
    }
    if (action === "message") {
      const id = String(data.id ?? ""); guestOrOwner(request, id);
      const author = session(request, "owner") ? "owner" : "guest";
      await rateLimit(request, "message", 30, 10 * 60000, `${author}:${id}`);
      const text = typeof data.text === "string" ? data.text.trim() : "";
      const messageId = typeof data.messageId === "string" && /^[a-f0-9-]{36}$/.test(data.messageId) ? data.messageId : "";
      if (!text || text.length > 5000 || !messageId) throw new BookingError("message");
      await mutate(state => {
        const booking = state.bookings.find(b => b.id === id);
        if (!booking) throw new BookingError("missing", 404);
        if (booking.messages.some(m => m.id === messageId)) return;
        if (booking.messages.length >= 1000) throw new BookingError("rate", 429);
        booking.updatedAt = new Date().toISOString();
        booking.messages.push({ id: messageId, author, text, createdAt: booking.updatedAt }); notify(state, id, author === "owner" ? "guest" : "owner");
      });
      await deliverNotices(); return reply({ ok: true });
    }
    ownerOnly(request);
    if (action === "status") {
      if (!["accepted", "declined", "cancelled"].includes(String(data.status))) throw new BookingError("status");
      await mutate(state => {
        const booking = state.bookings.find(b => b.id === data.id);
        if (!booking) throw new BookingError("missing", 404);
        if (booking.status === data.status) return;
        changeStatus(state, booking, data.status as BookingStatus);
        booking.messages.push({ id: randomUUID(), author: "system", text: booking.status, createdAt: booking.updatedAt });
        notify(state, booking.id, "guest");
      });
      await deliverNotices(); return reply({ ok: true });
    }
    if (action === "block") {
      const stay = { arrival: String(data.arrival ?? ""), departure: String(data.departure ?? "") }; validateStay(stay);
      const note = typeof data.note === "string" ? data.note.trim() : "";
      if (note.length > 300) throw new BookingError("details");
      await mutate(state => { assertAvailable(state, stay); state.blocks.push({ ...stay, id: randomUUID(), note }); }); return reply({ ok: true });
    }
    if (action === "unblock") { await mutate(state => { state.blocks = state.blocks.filter(b => b.id !== data.id); }); return reply({ ok: true }); }
    if (action === "delete") {
      await mutate(state => {
        const booking = state.bookings.find(b => b.id === data.id);
        if (booking?.status === "accepted") throw new BookingError("status", 409);
        state.bookings = state.bookings.filter(b => b.id !== data.id); state.notices = state.notices.filter(n => n.bookingId !== data.id);
      }); return reply({ ok: true });
    }
    if (action === "retry") { await deliverNotices(); return reply({ ok: true }); }
    throw new BookingError("missing", 404);
  } catch (error) { return failure(error); }
}
