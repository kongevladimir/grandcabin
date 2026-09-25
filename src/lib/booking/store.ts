// Imported only by server routes. The service key never reaches the browser.
import { randomUUID } from "node:crypto";
import { mkdir, open, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { BookingError, emptyState, type BookingState } from "./model";

export type Stored = { version: number; state: BookingState };
const localDirectory = () => path.join(process.cwd(), ".booking-data");
export function isLocalPreview() { return process.env.BOOKING_LOCAL_PREVIEW === "true"; }
export function configured() {
  return !!(process.env.BOOKING_SESSION_SECRET && process.env.BOOKING_SESSION_SECRET.length >= 32 && process.env.BOOKING_OWNER_PASSWORD && process.env.BOOKING_OWNER_PASSWORD.length >= 16 && (isLocalPreview() || (process.env.BOOKING_SUPABASE_URL && process.env.BOOKING_SUPABASE_SERVICE_KEY && process.env.BOOKING_SITE_URL && process.env.BOOKING_OWNER_EMAIL && process.env.BOOKING_EMAIL_FROM && process.env.RESEND_API_KEY)));
}
async function database(endpoint: string, init?: RequestInit) {
  const base = process.env.BOOKING_SUPABASE_URL;
  const key = process.env.BOOKING_SUPABASE_SERVICE_KEY;
  if (!base || !key || !base.startsWith("https://")) throw new BookingError("setup", 503);
  const response = await fetch(`${base.replace(/\/$/, "")}/rest/v1/${endpoint}`, { ...init, headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", ...init?.headers }, cache: "no-store", signal: AbortSignal.timeout(12000) });
  if (!response.ok) throw new BookingError("storage", 503);
  return response.json();
}
export async function readState(): Promise<Stored> {
  if (!isLocalPreview()) {
    const rows = await database("booking_state?id=eq.1&select=version,state") as Stored[];
    if (rows.length !== 1) throw new BookingError("storage", 503);
    return rows[0];
  }
  try { return JSON.parse(await readFile(path.join(localDirectory(), "state.json"), "utf8")); }
  catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") return { version: 0, state: emptyState() }; throw error; }
}
async function compareAndSwap(previous: number, state: BookingState): Promise<boolean> {
  if (!isLocalPreview()) return await database("rpc/save_booking_state", { method: "POST", body: JSON.stringify({ expected_version: previous, next_state: state }) }) === true;
  await mkdir(localDirectory(), { recursive: true });
  const lockPath = path.join(localDirectory(), "write.lock");
  let lock;
  try { lock = await open(lockPath, "wx"); }
  catch (error) { if ((error as NodeJS.ErrnoException).code === "EEXIST") return false; throw error; }
  try {
    if ((await readState()).version !== previous) return false;
    const temporary = path.join(localDirectory(), `${randomUUID()}.tmp`);
    await writeFile(temporary, JSON.stringify({ version: previous + 1, state }), { mode: 0o600 });
    await rename(temporary, path.join(localDirectory(), "state.json"));
    return true;
  } finally { await lock.close(); await unlink(lockPath); }
}
// Retried against the latest state; overlap checks and acceptance commit together.
export async function mutate<T>(operation: (state: BookingState) => T): Promise<T> {
  for (let attempt = 0; attempt < 20; attempt++) {
    const current = await readState();
    const result = operation(current.state);
    if (await compareAndSwap(current.version, current.state)) return result;
    await new Promise(resolve => setTimeout(resolve, 25 + Math.random() * 50));
  }
  throw new BookingError("busy", 503);
}
