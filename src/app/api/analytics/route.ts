import { NextRequest } from "next/server";
import { body, cookieName, failure, guard, ownerOnly, ownerSession, reply } from "@/lib/booking/server";
import { analyticsDay, parseVisitEvent, summarizeStats } from "@/lib/analytics/model";
import { readVisitStats, recordVisit } from "@/lib/analytics/store";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
  try {
    guard(request); await ownerOnly(request);
    const days = Number(request.nextUrl.searchParams.get("days") ?? 30);
    if (![7, 30, 90, 365].includes(days)) return reply({ error: "details" }, 400);
    const { ready, rows } = await readVisitStats(days);
    return reply({ ready, today: analyticsDay(), days, ...summarizeStats(rows, days) });
  } catch (error) { return failure(error); }
}
export async function POST(request: NextRequest) {
  try {
    const event = parseVisitEvent(await body(request));
    if (!event) return reply({ error: "details" }, 400);
    if (/bot|spider|crawler|headless/i.test(request.headers.get("user-agent") ?? "")) return new Response(null, { status: 204 });
    if (request.cookies.has(cookieName("owner")) && await ownerSession(request)) return new Response(null, { status: 204 });
    await recordVisit(event);
    return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  } catch (error) { return failure(error); }
}
