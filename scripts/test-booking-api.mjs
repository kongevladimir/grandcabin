import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const origin = 'http://localhost:3000';
const env = await readFile(new URL('../.env.local', import.meta.url), 'utf8');
assert.match(env, /^BOOKING_LOCAL_PREVIEW=true$/m, 'Only run against the explicit local preview.');
const password = env.match(/^BOOKING_OWNER_PASSWORD=(.+)$/m)?.[1].trim();
assert.ok(password, 'Local preview password is missing.');
const prefix = `Booking test ${randomUUID().slice(0, 8)}`;
const ids = []; let ownerCookie = '', blockId = '';
const ip = `192.0.2.${Math.floor(Math.random() * 250) + 1}`;
async function api(data, cookie = '', query = '', headers = {}) {
  const res = await fetch(`${origin}/api/booking${query}`, { method: data ? 'POST' : 'GET', headers: { Origin: origin, 'Content-Type': 'application/json', 'X-Forwarded-For': ip, Cookie: cookie, ...headers }, ...(data ? { body: JSON.stringify(data) } : {}) });
  return { status: res.status, body: await res.json(), cookie: res.headers.get('set-cookie')?.split(';')[0] ?? '', headers: res.headers };
}
async function expect(data, status = 200, cookie = '', query = '', headers = {}) {
  const result = await api(data, cookie, query, headers);
  assert.equal(result.status, status, `${data?.action ?? query}: ${JSON.stringify(result.body)}`); return result;
}
const availability = await expect();
assert.equal(availability.body.preview, true, 'Refusing to test a non-preview server.');
assert.equal(availability.body.ready, true);
assert.match(availability.headers.get('cache-control'), /no-store/);
assert.ok(availability.body.unavailable.some(b => b.arrival === '2026-12-23' && b.departure === '2026-12-26'), 'Known FINN reservations must appear as occupied nights.');
const day = n => new Date(Date.parse(`${availability.body.today}T12:00:00Z`) + n * 86400000).toISOString().slice(0, 10);
let offset = 40;
while (availability.body.unavailable.some(b => day(offset) < b.departure && b.arrival < day(offset + 10))) offset += 12;
assert.ok(offset < 650, 'No safe empty range to test.');
const stay = { arrival: day(offset), departure: day(offset + 3) };
const request = () => ({ action: 'enquire', ...stay, guests: 6, linenTowels: 3, name: prefix, email: `test-${randomUUID()}@example.com`, phone: '', message: 'Local automated test only.', occasion: 'company', language: 'en', consent: true, website: '', requestKey: randomUUID() });
try {
  await expect(undefined, 401, '', '?view=owner');
  await expect({ action: 'login', password: 'wrong' }, 401);
  await expect({ action: 'login', password }, 403, '', '', { Origin: 'https://other.example' });
  const login = await expect({ action: 'login', password }); ownerCookie = login.cookie;
  assert.match(login.headers.get('set-cookie'), /HttpOnly/i);
  const firstInput = { ...request(), pricing: { dailyRate: 1, rentalTotal: 1 } };
  const first = await expect(firstInput, 201); ids.push(first.body.id);
  const second = await expect(request(), 201); ids.push(second.body.id);
  const duplicate = await expect(firstInput);
  assert.equal(duplicate.body.id, first.body.id, 'Retries must return the same request.');
  const availPending = await expect();
  assert.equal(availPending.body.unavailable.some(b => b.arrival === stay.arrival), false);
  await expect(undefined, 401, '', `?view=conversation&id=${first.body.id}`);
  await expect(undefined, 401, second.cookie, `?view=conversation&id=${first.body.id}`);
  await expect({ action: 'access', id: first.body.id, token: 'bad' }, 401);
  const access = await expect({ action: 'access', id: first.body.id, token: first.body.token });
  const guest = await expect(undefined, 200, access.cookie, `?view=conversation&id=${first.body.id}`);
  assert.equal(guest.body.booking.name, prefix); assert.equal(guest.body.booking.requestKey, undefined);
  assert.equal(guest.body.booking.pricing.rentalTotal, 45000, 'The server calculates rent and ignores client-supplied prices.');
  assert.equal(guest.body.booking.pricing.cleaningFee, 5000);
  assert.equal(guest.body.booking.pricing.linenTowelsTotal, 1050);
  assert.equal(guest.body.booking.pricing.total, 51050);
  const guestMessage = { action: 'message', id: first.body.id, text: 'Can we discuss the stay?', messageId: randomUUID() };
  await expect(guestMessage, 200, access.cookie);
  await expect(guestMessage, 200, access.cookie);
  await expect({ action: 'message', id: first.body.id, text: 'Of course. Let us agree the details.', messageId: randomUUID() }, 200, ownerCookie);
  const chat = await expect(undefined, 200, access.cookie, `?view=conversation&id=${first.body.id}`);
  assert.equal(chat.body.booking.messages.length, 3, 'Retried messages must not duplicate.');
  assert.equal(chat.body.booking.messages.at(-1).author, 'owner');
  await expect({ action: 'status', id: first.body.id, status: 'accepted' }, 401, access.cookie);
  const race = await Promise.all(ids.map(id => api({ action: 'status', id, status: 'accepted' }, ownerCookie)));
  assert.deepEqual(race.map(r => r.status).sort(), [200, 409], 'Exactly one overlapping approval can succeed.');
  const acceptedId = ids[race.findIndex(r => r.status === 200)];
  const occupied = await expect();
  assert.ok(occupied.body.unavailable.some(b => b.arrival === stay.arrival && b.departure === stay.departure));
  for (const range of occupied.body.unavailable) assert.deepEqual(Object.keys(range).sort(), ['arrival', 'departure']);
  await expect(request(), 409);
  await expect({ action: 'delete', id: acceptedId }, 409, ownerCookie);
  const adjacent = await expect({ ...request(), arrival: stay.departure, departure: day(offset + 5) }, 201); ids.push(adjacent.body.id);
  await expect({ action: 'status', id: adjacent.body.id, status: 'accepted' }, 200, ownerCookie);
  await expect({ action: 'block', ...stay, note: prefix }, 409, ownerCookie);
  const block = { arrival: day(offset + 7), departure: day(offset + 9) };
  await expect({ action: 'block', ...block, note: prefix }, 200, ownerCookie);
  let inbox = await expect(undefined, 200, ownerCookie, '?view=owner');
  blockId = inbox.body.blocks.find(b => b.note === prefix).id;
  assert.equal(inbox.body.pendingEmails, 0, 'Local preview never queues email.');
  await expect({ action: 'status', id: acceptedId, status: 'cancelled' }, 200, ownerCookie);
  const released = await expect();
  assert.equal(released.body.unavailable.some(b => b.arrival === stay.arrival), false);
  const largeGroup = await expect({ ...request(), guests: 29, linenTowels: 29, departure: day(offset + 2), pricing: { rentalTotal: 1 } }, 201);
  ids.push(largeGroup.body.id);
  const largeAccess = await expect({ action: 'access', id: largeGroup.body.id, token: largeGroup.body.token });
  const largeBooking = await expect(undefined, 200, largeAccess.cookie, `?view=conversation&id=${largeGroup.body.id}`);
  assert.equal(largeBooking.body.booking.pricing.rentalTotal, 37500);
  assert.equal(largeBooking.body.booking.pricing.linenTowelsTotal, 10150);
  assert.equal(largeBooking.body.booking.pricing.total, 52650);
  await expect({ action: 'unblock', id: blockId }, 200, ownerCookie); blockId = '';
  await expect({ ...request(), guests: 30 }, 400);
  console.log('PASS: private access, owner login, request/message retries, two-way chat, concurrent approval, checkout boundaries, blocking, cancellation, and preview email isolation.');
} finally {
  if (ownerCookie) {
    const inbox = await api(undefined, ownerCookie, '?view=owner');
    for (const b of inbox.body.bookings ?? []) {
      if (!ids.includes(b.id) && b.name !== prefix) continue;
      if (b.status === 'accepted') await expect({ action: 'status', id: b.id, status: 'cancelled' }, 200, ownerCookie);
      await expect({ action: 'delete', id: b.id }, 200, ownerCookie);
    }
    for (const b of inbox.body.blocks ?? []) if (b.id === blockId || b.note === prefix) await expect({ action: 'unblock', id: b.id }, 200, ownerCookie);
    await expect({ action: 'logout' }, 200, ownerCookie);
    console.log('Removed only this test run’s enquiries and blocks.');
  }
}
