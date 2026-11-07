// A separate Worker backs up the booking state to a private Cloudflare D1 database.
// It has no HTTP endpoint and therefore cannot expose bookings to visitors.
const CHUNK_SIZE = 200000;
const RETAIN_DAYS = 30;

export async function backup(env, now = new Date()) {
  const response = await fetch(`${env.BOOKING_SUPABASE_URL.replace(/\/$/, "")}/rest/v1/booking_state?id=eq.1&select=version,state`, {
    headers: { apikey: env.BOOKING_SUPABASE_SERVICE_KEY },
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw new Error("Booking storage could not be read");
  const rows = await response.json();
  if (!Array.isArray(rows) || rows.length !== 1 || !rows[0].state || typeof rows[0].version !== "number") throw new Error("Booking storage returned invalid data");
  const content = JSON.stringify(rows[0]);
  const chunks = [];
  for (let i = 0; i < content.length; i += CHUNK_SIZE) chunks.push(content.slice(i, i + CHUNK_SIZE));
  const snapshot = now.toISOString();
  const cutoff = new Date(now.getTime() - RETAIN_DAYS * 86400000).toISOString();
  // A single batch commits the snapshot and cleanup together.
  const statements = [env.BACKUP_DB.prepare("INSERT INTO snapshots (snapshot, chunks) VALUES (?, ?)").bind(snapshot, chunks.length)];
  chunks.forEach((chunk, index) => statements.push(env.BACKUP_DB.prepare("INSERT INTO snapshot_chunks (snapshot, part, content) VALUES (?, ?, ?)").bind(snapshot, index, chunk)));
  statements.push(env.BACKUP_DB.prepare("DELETE FROM snapshot_chunks WHERE snapshot < ?").bind(cutoff));
  statements.push(env.BACKUP_DB.prepare("DELETE FROM snapshots WHERE snapshot < ?").bind(cutoff));
  await env.BACKUP_DB.batch(statements);
}

const worker = {
  async scheduled(_event, env) { await backup(env); },
  async fetch() { return new Response("Not found", { status: 404 }); },
};
export default worker;
