import { test } from 'node:test';
import assert from 'node:assert/strict';
import { backup } from '../backup/worker.mjs';

test('backup stores an intact snapshot in private chunks and applies retention', async () => {
  const oldFetch = globalThis.fetch;
  const row = { version: 7, state: { bookings: [{ message: 'ø'.repeat(220000) }] } };
  let statements;
  const db = { prepare: sql => ({ bind: (...values) => ({ sql, values }) }), batch: async batch => { statements = batch; } };
  globalThis.fetch = async () => new Response(JSON.stringify([row]), { status: 200 });
  try {
    await backup({ BOOKING_SUPABASE_URL: 'https://example.invalid', BOOKING_SUPABASE_SERVICE_KEY: 'test', BACKUP_DB: db }, new Date('2026-11-06T02:00:00Z'));
    const parts = statements.filter(x => x.sql.startsWith('INSERT INTO snapshot_chunks'));
    assert.equal(parts.length, 2);
    assert.deepEqual(JSON.parse(parts.map(p => p.values[2]).join('')), row);
    assert.equal(statements.at(-1).values[0], '2026-10-07T02:00:00.000Z');
  } finally { globalThis.fetch = oldFetch; }
});

test('backup fails without writing when storage is unavailable', async () => {
  const oldFetch = globalThis.fetch; let wrote = false;
  globalThis.fetch = async () => new Response('', { status: 503 });
  try {
    await assert.rejects(backup({ BOOKING_SUPABASE_URL: 'https://example.invalid', BOOKING_SUPABASE_SERVICE_KEY: 'test', BACKUP_DB: { batch: () => { wrote = true; } } }));
    assert.equal(wrote, false);
  } finally { globalThis.fetch = oldFetch; }
});
