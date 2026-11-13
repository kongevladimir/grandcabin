import { NextRequest } from "next/server";
import { body, cookieName, failure, guard, ownerOnly, ownerSession, reply } from "@/lib/booking/server";
import { analyticsDay, parseAnalyticsPeriod, parseVisitEvent, summarizeStats } from "@/lib/analytics/model";
import { readVisitStats, recordVisit } from "@/lib/analytics/store";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
  try {
    guard(request); await ownerOnly(request);
    const today = analyticsDay();
    const period = parseAnalyticsPeriod(request.nextUrl.searchParams.get("days"), request.nextUrl.searchParams.get("since"), today);
    if (!period) return reply({ error: "details" }, 400);
    const { ready, rows } = await readVisitStats(period.days);
    return reply({ ready, today, ...period, ...summarizeStats(rows, period.days, today) });
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
