export const publicPages = ["/", "/cabin", "/bedrooms", "/materials", "/gallery", "/location", "/3d-tour", "/meetings", "/turufjell", "/turufjell/activities", "/booking"];
export const analyticsCountingStart = "2026-11-12";
export const analyticsDayPeriods = [7, 30, 90, 365] as const;
export const analyticsKinds = ["view", "booking", "phone", "email", "navigation"] as const;
export type AnalyticsKind = typeof analyticsKinds[number];
export type VisitEvent = { id: string; path: string; kind: AnalyticsKind; visit: boolean };
export type DailyStat = { day: string; path: string; views: number; visits: number; booking: number; phone: number; email: number; navigation: number };
export function parseVisitEvent(value: Record<string, unknown>): VisitEvent | null {
  if (typeof value.id !== "string" || !/^[a-f0-9-]{36}$/.test(value.id) || typeof value.path !== "string" || !publicPages.includes(value.path) || !analyticsKinds.includes(value.kind as AnalyticsKind) || typeof value.visit !== "boolean") return null;
  return { id: value.id, path: value.path, kind: value.kind as AnalyticsKind, visit: value.kind === "view" && value.visit };
}
export function analyticsDay(date = new Date()) { return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Oslo", year: "numeric", month: "2-digit", day: "2-digit" }).format(date); }
export function analyticsFrom(days: number, today = analyticsDay()) { return new Date(Date.parse(`${today}T12:00:00Z`) - (days - 1) * 86400000).toISOString().slice(0, 10); }
export function analyticsDaysFrom(from: string, today = analyticsDay()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(today)) return 0;
  const days = Math.floor((Date.parse(`${today}T12:00:00Z`) - Date.parse(`${from}T12:00:00Z`)) / 86400000) + 1;
  return Number.isFinite(days) && days > 0 ? days : 0;
}
export function parseAnalyticsPeriod(daysValue: string | null, sinceValue: string | null, today = analyticsDay()) {
  if (sinceValue) {
    if (sinceValue !== analyticsCountingStart) return null;
    const days = analyticsDaysFrom(analyticsCountingStart, today);
    return days > 0 ? { days, since: analyticsCountingStart } : null;
  }
  const days = Number(daysValue ?? 30);
  return analyticsDayPeriods.includes(days as typeof analyticsDayPeriods[number]) ? { days, since: null } : null;
}
export function summarizeStats(rows: DailyStat[], days: number, today = analyticsDay()) {
  const totals = { views: 0, visits: 0, booking: 0, phone: 0, email: 0, navigation: 0 };
  const daily = Array.from({ length: days }, (_, index) => ({ day: analyticsFrom(days - index, today), views: 0, visits: 0 }));
  const pages = new Map<string, { path: string; views: number; clicks: number }>();
  for (const row of rows) {
    const day = daily.find(d => d.day === row.day);
    if (!day || !publicPages.includes(row.path)) continue;
    for (const key of Object.keys(totals) as (keyof typeof totals)[]) totals[key] += row[key];
    day.views += row.views; day.visits += row.visits;
    const page = pages.get(row.path) ?? { path: row.path, views: 0, clicks: 0 };
    page.views += row.views; page.clicks += row.booking + row.phone + row.email + row.navigation; pages.set(row.path, page);
  }
  return { totals, daily, pages: [...pages.values()].sort((a, b) => b.views - a.views) };
}
