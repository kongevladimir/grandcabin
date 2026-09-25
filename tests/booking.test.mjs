import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

// Load the same dependency-free domain code as the app, without a second ruleset.
const source = await readFile(new URL('../src/lib/booking/model.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const m = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
const day = offset => new Date(m.dateValue(m.osloToday()) + offset * 86400000).toISOString().slice(0, 10);
const stay = { arrival: day(10), departure: day(15) };
const booking = (id, status = 'pending') => ({ id, ...stay, status, messages: [], updatedAt: '' });
const request = () => ({ ...stay, guests: 8, linenTowels: 3, email: 'Guest@Example.com', name: ' Guest Name ', phone: '', occasion: 'private', language: 'en', message: '', consent: true, website: '', requestKey: 'a12a2c73-fd88-43ce-bd3a-d57333bd2e6e' });

test('valid dates and leap days are round-tripped, impossible dates rejected', () => {
  assert.equal(m.isDate('2028-02-29'), true);
  for (const date of ['2027-02-29', '2026-04-31', '2026-13-01', '2026-1-01', '', null, {}]) assert.equal(m.isDate(date), false);
});
test('local date follows Oslo, including midnight and daylight saving boundaries', () => {
  assert.equal(m.osloToday(new Date('2026-09-24T22:30:00Z')), '2026-09-25');
  assert.equal(m.osloToday(new Date('2026-12-24T22:30:00Z')), '2026-12-24');
  assert.equal(m.nights({ arrival: '2027-03-27', departure: '2027-03-29' }), 2);
});
test('stay validation rejects past, reversed, equal, excessively long and distant dates', () => {
  assert.doesNotThrow(() => m.validateStay(stay));
  for (const invalid of [{ arrival: day(-1), departure: day(1) }, { arrival: day(15), departure: day(10) }, { arrival: day(10), departure: day(10) }, { arrival: day(1), departure: day(367) }, { arrival: day(729), departure: day(731) }]) assert.throws(() => m.validateStay(invalid), /dates/);
});
test('checkout is exclusive; adjacent stays are allowed, enclosed overlaps are not', () => {
  assert.equal(m.overlaps(stay, { arrival: day(15), departure: day(18) }), false);
  assert.equal(m.overlaps(stay, { arrival: day(8), departure: day(10) }), false);
  assert.equal(m.overlaps(stay, { arrival: day(11), departure: day(12) }), true);
  assert.equal(m.overlaps(stay, { arrival: day(9), departure: day(17) }), true);
});
test('FINN reservations, confirmed stays and manual blocks occupy the public calendar', () => {
  const state = m.emptyState();
  state.bookings = [booking('one'), booking('two', 'declined'), booking('three', 'cancelled')];
  const finnDates = m.finnReservations.map(({ arrival, departure }) => ({ arrival, departure }));
  assert.deepEqual(m.unavailable(state), finnDates);
  state.bookings.push({ ...booking('four', 'accepted'), name: 'PRIVATE', email: 'PRIVATE' });
  state.blocks.push({ id: 'block', arrival: day(20), departure: day(22), note: 'PRIVATE' });
  assert.deepEqual(m.unavailable(state), [ ...finnDates, { arrival: day(20), departure: day(22) }, stay ]);
});
test('all listed FINN nights are unavailable and the following checkout day is open', () => {
  const expected = [
    ['2026-11-13', '2026-11-15'], ['2026-11-27', '2026-11-29'],
    ['2026-12-04', '2026-12-06'], ['2026-12-18', '2026-12-20'],
    ['2026-12-23', '2026-12-26'], ['2026-12-30', '2027-01-01'],
    ['2027-01-22', '2027-01-24'],
  ];
  assert.deepEqual(m.finnReservations.map(({ arrival, departure }) => [arrival, departure]), expected);
  const state = m.emptyState();
  for (const [arrival, departure] of expected) {
    assert.throws(() => m.assertAvailable(state, { arrival, departure }), /unavailable/);
    const nextDay = new Date(m.dateValue(departure) + 86400000).toISOString().slice(0, 10);
    assert.doesNotThrow(() => m.assertAvailable(state, { arrival: departure, departure: nextDay }));
  }
});
test('accepting one request rejects overlapping acceptance without changing the second', () => {
  const state = m.emptyState(); const a = booking('a'), b = booking('b'); state.bookings.push(a, b);
  m.changeStatus(state, a, 'accepted');
  assert.throws(() => m.changeStatus(state, b, 'accepted'), /unavailable/);
  assert.equal(b.status, 'pending');
  m.changeStatus(state, a, 'cancelled');
  m.changeStatus(state, b, 'accepted');
  assert.equal(b.status, 'accepted');
});
test('owner blocks prevent confirmation, while pending enquiries do not hold dates', () => {
  const state = m.emptyState(); const b = booking('a'); state.bookings.push(b);
  assert.doesNotThrow(() => m.assertAvailable(state, stay));
  state.blocks.push({ ...stay, id: 'block', note: '' });
  assert.throws(() => m.changeStatus(state, b, 'accepted'), /unavailable/);
});
test('status transitions cannot silently reactivate cancelled or declined stays', () => {
  const state = m.emptyState(); const b = booking('b'); state.bookings.push(b);
  m.changeStatus(state, b, 'declined');
  assert.throws(() => m.changeStatus(state, b, 'accepted'), /status/);
  assert.doesNotThrow(() => m.changeStatus(state, b, 'declined'));
  assert.throws(() => m.changeStatus(state, booking('c', 'accepted'), 'declined'), /status/);
});
test('request normalizes contact details and preserves chosen extras', () => {
  const clean = m.validateRequest(request());
  assert.equal(clean.name, 'Guest Name'); assert.equal(clean.email, 'guest@example.com');
  assert.equal(clean.guests, 8); assert.equal(clean.linenTowels, 3);
});
test('standard price includes mandatory cleaning and one combined package per selected person', () => {
  const quote = m.rentalQuote({ arrival: day(10), departure: day(12) }, 3);
  assert.deepEqual(quote.lines, [{ season: 'standard', days: 2, rate: 15000, subtotal: 30000 }]);
  assert.equal(quote.cleaningFee, 5000);
  assert.equal(quote.linenTowelsUnitPrice, 350);
  assert.equal(quote.linenTowelsTotal, 1050);
  assert.equal(quote.total, 36050);
  assert.equal(m.rentalQuote({ arrival: '', departure: '' }).total, null);
});
test('guests above 24 add NOK 750 per person to every night', () => {
  const twoNights = { arrival: day(10), departure: day(12) };
  assert.equal(m.rentalQuote(twoNights, 0, 24).rentalTotal, 30000);
  assert.equal(m.rentalQuote(twoNights, 0, 25).lines[0].rate, 15750);
  const quote = m.rentalQuote(twoNights, 0, 28);
  assert.equal(quote.extraGuests, 4);
  assert.equal(quote.guestSurchargePerNight, 3000);
  assert.equal(quote.lines[0].rate, 18000);
  assert.equal(quote.rentalTotal, 36000);
  assert.equal(quote.total, 41000);
  const fullGroup = m.rentalQuote(twoNights, 29, 29);
  assert.equal(fullGroup.lines[0].rate, 18750);
  assert.equal(fullGroup.linenTowelsTotal, 10150);
  assert.equal(fullGroup.total, 52650);
});
test('Easter rate covers 22–30 March 2027, inclusive, without charging checkout day', () => {
  assert.deepEqual(m.rentalQuote({ arrival: '2027-03-22', departure: '2027-03-31' }).lines, [{ season: 'easter', days: 9, rate: 16000, subtotal: 144000 }]);
  assert.equal(m.rentalQuote({ arrival: '2027-03-22', departure: '2027-03-31' }).total, 149000);
  assert.deepEqual(m.rentalQuote({ arrival: '2027-03-30', departure: '2027-03-31' }).lines, [{ season: 'easter', days: 1, rate: 16000, subtotal: 16000 }]);
  assert.deepEqual(m.rentalQuote({ arrival: '2027-03-31', departure: '2027-04-01' }).lines, [{ season: 'standard', days: 1, rate: 15000, subtotal: 15000 }]);
});
test('mixed-rate stay itemizes normal and Easter nights with one cleaning fee', () => {
  const quote = m.rentalQuote({ arrival: '2027-03-21', departure: '2027-03-24' }, 2);
  assert.deepEqual(quote.lines, [{ season: 'standard', days: 1, rate: 15000, subtotal: 15000 }, { season: 'easter', days: 2, rate: 16000, subtotal: 32000 }]);
  assert.equal(quote.total, 52700);
  const largeGroup = m.rentalQuote({ arrival: '2027-03-21', departure: '2027-03-24' }, 0, 28);
  assert.deepEqual(largeGroup.lines, [{ season: 'standard', days: 1, rate: 18000, subtotal: 18000 }, { season: 'easter', days: 2, rate: 19000, subtotal: 38000 }]);
  assert.equal(largeGroup.total, 61000);
});
test('winter holiday dates are classified but cannot be quoted until the owner sets the rate', () => {
  assert.equal(m.priceSeason('2027-02-21'), 'standard');
  assert.equal(m.priceSeason('2027-02-22'), 'winter');
  assert.equal(m.priceSeason('2027-02-26'), 'winter');
  assert.equal(m.priceSeason('2027-02-27'), 'standard');
  const winter = { arrival: '2027-02-22', departure: '2027-02-27' };
  assert.equal(m.rentalQuote(winter).total, null);
  assert.throws(() => m.validateRequest({ ...request(), ...winter }), /pricing/);
});
test('guest and extras validation includes lower, upper and integer bounds', () => {
  for (const patch of [{ guests: 0 }, { guests: 30 }, { guests: 2.5 }, { guests: '8' }, { linenTowels: 9 }, { linenTowels: -1 }, { linenTowels: 0.5 }]) assert.throws(() => m.validateRequest({ ...request(), ...patch }), /guests/);
  assert.doesNotThrow(() => m.validateRequest({ ...request(), guests: 29, linenTowels: 29 }));
});
test('request requires consent, valid email and name and rejects honeypot spam', () => {
  for (const patch of [{ name: '' }, { consent: false }, { email: 'invalid' }, { website: 'spam' }, { name: ['object'] }, { message: 'x'.repeat(5001) }, { requestKey: '' }]) assert.throws(() => m.validateRequest({ ...request(), ...patch }), /details/);
});

test('owner prices cover both selected nights, can overlap, and persist alongside legacy state', () => {
  const state = { bookings: [], blocks: [], limits: {}, notices: [] };
  m.setNightlyPrices(state, day(10), day(12), 17000);
  m.setNightlyPrices(state, day(12), day(13), 18000);
  assert.deepEqual(state.nightlyPrices, { [day(10)]: 17000, [day(11)]: 17000, [day(12)]: 18000, [day(13)]: 18000 });
  assert.equal(m.nightlyPrice(day(9), state.nightlyPrices), 15000);
  assert.equal(m.nightlyPrice(day(14), state.nightlyPrices), 15000);
  const restored = JSON.parse(JSON.stringify(state));
  assert.equal(m.rentalQuote({ arrival: day(10), departure: day(14) }, 0, 24, restored.nightlyPrices).rentalTotal, 70000);
});

test('custom rates group different prices correctly and add extra guests, linen and cleaning once', () => {
  const prices = { [day(11)]: 17000, [day(12)]: 18000 };
  const quote = m.rentalQuote({ arrival: day(10), departure: day(13) }, 2, 25, prices);
  assert.deepEqual(quote.lines, [
    { season: 'standard', days: 1, rate: 15750, subtotal: 15750 },
    { season: 'custom', days: 1, rate: 17750, subtotal: 17750 },
    { season: 'custom', days: 1, rate: 18750, subtotal: 18750 },
  ]);
  assert.equal(quote.total, 57950);
});

test('owner can set missing winter prices and override Easter; restoring removes only selected overrides', () => {
  const state = m.emptyState();
  m.setNightlyPrices(state, '2027-02-22', '2027-02-26', 19000);
  const winter = { arrival: '2027-02-22', departure: '2027-02-27' };
  assert.doesNotThrow(() => m.validateRequest({ ...request(), ...winter }, state.nightlyPrices));
  assert.equal(m.rentalQuote(winter, 0, 24, state.nightlyPrices).rentalTotal, 95000);
  m.setNightlyPrices(state, '2027-03-22', '2027-03-22', 20000);
  assert.equal(m.nightlyPrice('2027-03-22', state.nightlyPrices), 20000);
  m.setNightlyPrices(state, '2027-03-22', '2027-03-22', null);
  assert.equal(m.nightlyPrice('2027-03-22', state.nightlyPrices), 16000);
  assert.equal(m.nightlyPrice('2027-02-22', state.nightlyPrices), 19000);
  m.setNightlyPrices(state, '2027-02-22', '2027-02-22', null);
  assert.equal(m.nightlyPrice('2027-02-22', state.nightlyPrices), null);
  assert.equal(m.nightlyPrice('2027-02-23', state.nightlyPrices), 19000);
});

test('invalid admin price or range cannot change stored data', () => {
  const state = m.emptyState();
  for (const amount of [0, -1, 1.2, '17000', undefined, {}, NaN, Infinity, 1000001]) {
    assert.throws(() => m.setNightlyPrices(state, day(10), day(12), amount), /priceAmount/);
  }
  for (const [from, through] of [[day(-1), day(2)], [day(12), day(10)], [day(1), day(730)], ['', day(10)], ['2027-02-30', day(200)]]) {
    assert.throws(() => m.setNightlyPrices(state, from, through, 17000), /priceDates/);
  }
  assert.deepEqual(state.nightlyPrices, {});
  assert.doesNotThrow(() => m.setNightlyPrices(state, day(729), day(729), 1));
});

test('editing rates leaves previously submitted and accepted quotes unchanged', () => {
  const state = m.emptyState();
  state.bookings.push({ ...booking('quoted'), pricing: m.rentalQuote(stay) });
  const original = structuredClone(state.bookings[0].pricing);
  m.setNightlyPrices(state, stay.arrival, stay.departure, 22000);
  m.changeStatus(state, state.bookings[0], 'accepted');
  assert.deepEqual(state.bookings[0].pricing, original);
  assert.equal(m.rentalQuote(stay, 0, 2, state.nightlyPrices).rentalTotal, 110000);
});
