import { getCloudflareContext } from "@opennextjs/cloudflare";
import { isLocalPreview } from "@/lib/booking/store";
import { analyticsDay, analyticsFrom, type DailyStat, type VisitEvent } from "./model";

interface Statement { bind(...values: (string | number)[]): Statement; run(): Promise<unknown>; all<T>(): Promise<{ results: T[] }> }
interface Database { prepare(sql: string): Statement; batch(statements: Statement[]): Promise<unknown> }
const localEvents = new Map<string, VisitEvent & { day: string }>();
function database(): Database | null {
  try { return (getCloudflareContext().env as unknown as { ANALYTICS_DB?: Database }).ANALYTICS_DB ?? null; }
  catch { return null; }
}
export async function recordVisit(event: VisitEvent) {
  const day = analyticsDay();
  if (isLocalPreview()) { localEvents.set(event.id, { ...event, day }); return true; }
  const db = database(); if (!db) return false;
  await db.batch([
    db.prepare("INSERT OR IGNORE INTO analytics_events (id,day,path,kind,visit) VALUES (?,?,?,?,?)").bind(event.id, day, event.path, event.kind, Number(event.visit)),
    db.prepare("DELETE FROM analytics_events WHERE day < ?").bind(analyticsFrom(365, day)),
  ]);
  return true;
}
export async function readVisitStats(days: number): Promise<{ ready: boolean; rows: DailyStat[] }> {
  const from = analyticsFrom(days);
  if (isLocalPreview()) {
    const rows = new Map<string, DailyStat>();
    for (const event of localEvents.values()) {
      if (event.day < from) continue;
      const key = `${event.day}:${event.path}`;
      const row = rows.get(key) ?? { day: event.day, path: event.path, views: 0, visits: 0, booking: 0, phone: 0, email: 0, navigation: 0 };
      if (event.kind === "view") { row.views++; if (event.visit) row.visits++; } else row[event.kind]++;
      rows.set(key, row);
    }
    return { ready: true, rows: [...rows.values()] };
  }
  const db = database(); if (!db) return { ready: false, rows: [] };
  const result = await db.prepare(`SELECT day,path,
    SUM(kind='view') AS views, SUM(visit) AS visits,
    SUM(kind='booking') AS booking, SUM(kind='phone') AS phone,
    SUM(kind='email') AS email, SUM(kind='navigation') AS navigation
    FROM analytics_events WHERE day >= ? GROUP BY day,path ORDER BY day`).bind(from).all<DailyStat>();
  return { ready: true, rows: result.results };
}
