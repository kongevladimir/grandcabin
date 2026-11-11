import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const source = (await readFile(new URL('../src/lib/analytics/google.ts', import.meta.url), 'utf8'))
  .replace('import { publicPages } from "./model";', 'const publicPages = ["/", "/cabin", "/booking"];');
function compiled(source) {
  return ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
}
const js = compiled(source);
async function setup() {
  const storage = new Map(), scripts = [], replacements = [];
  let address = new URL('https://turucrown.no/booking');
  globalThis.location = address;
  globalThis.localStorage = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) };
  globalThis.window = {
    addEventListener() {}, removeEventListener() {},
    history: { state: { next: 'preserved' }, replaceState(state, title, url) { assert.deepEqual(state, { next: 'preserved' }); replacements.push(url); address = new URL(url); globalThis.location = address; } },
  };
  globalThis.document = { referrer: 'https://example.org/path?email=private@example.org', cookie: '', createElement: () => ({}), head: { appendChild: script => scripts.push({ ...script, address: location.href }) } };
  const google = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}#${Math.random()}`);
  return { google, scripts, storage, replacements, navigate: path => { globalThis.location = new URL(path, 'https://turucrown.no'); }, events: () => (window.dataLayer ?? []).filter(c => c[0] === 'event').map(c => Array.from(c)) };
}
test('Google is blocked before analytics consent, after rejection and with marketing-only consent', async () => {
  const { google: ga, scripts, replacements, navigate } = await setup();
  navigate('/?email=private@example.com');
  assert.equal(ga.trackPage('/'), false);
  assert.equal(ga.trackBooking('booking_step_1'), false);
  ga.saveChoice(false, true);
  assert.equal(ga.trackBooking('booking_step_1'), false);
  ga.saveChoice(false, false);
  assert.equal(ga.trackPage('/'), false);
  assert.equal(scripts.length, 0);
  assert.equal(replacements.length, 0, 'No address change before consent.');
});
test('one manual page view per route, including Strict Mode/remounts, query changes, consent updates and back navigation', async () => {
  const { google: ga, scripts, events, navigate } = await setup();
  ga.saveChoice(true, false);
  assert.equal(ga.trackPage('/booking'), true);
  assert.equal(ga.trackPage('/booking'), false);
  navigate('/booking?utm_source=google&utm_medium=cpc');
  assert.equal(ga.trackPage('/booking'), false);
  ga.saveChoice(true, true);
  assert.equal(ga.trackPage('/booking'), false);
  navigate('/cabin'); assert.equal(ga.trackPage('/cabin'), true);
  navigate('/booking'); assert.equal(ga.trackPage('/booking'), true);
  assert.equal(scripts.length, 1);
  assert.deepEqual(events().map(c => c[1]), ['page_view', 'page_view', 'page_view']);
  assert.equal(window.dataLayer.filter(c=>c[0]==='config').length, 1);
  assert.equal(window.dataLayer.find(c=>c[0]==='config')[2].send_page_view, false);
});
test('Google click IDs and reviewed UTMs survive; arbitrary personal fields are removed BEFORE loading Google', async () => {
  const { google: ga, scripts, events, navigate } = await setup();
  const click = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const query = `gclid=${click}&gbraid=${click}&wbraid=${click}&utm_source=google&utm_medium=cpc&utm_campaign=winter_2027&utm_content=hero&utm_term=hytte+turufjell&utm_id=brand`;
  navigate(`/?${query}&email=private@example.com&name=Private+Person&phone=98769876#private-token`);
  ga.saveChoice(true, true);
  ga.trackPage('/');
  const url = new URL(scripts[0].address);
  for (const key of ['gclid', 'gbraid', 'wbraid']) assert.equal(url.searchParams.get(key), click);
  for (const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_id']) assert.ok(url.searchParams.has(key));
  for (const key of ['name','email','phone']) assert.equal(url.searchParams.has(key), false);
  assert.equal(url.hash, '');
  assert.equal(events()[0][2].page_location, url.href);
  assert.equal(events()[0][2].page_referrer, 'https://example.org/');
  const all = JSON.stringify(window.dataLayer);
  for (const value of ['private@example.com', 'Private', '98769876', 'private-token']) assert.equal(all.includes(value), false);
  const filtered = ga.safeCampaignQuery('?utm_source=person@example.com&utm_medium=cpc&utm_campaign=Jane_Doe&utm_term=12345678&gclid=invalid&email=private', true);
  assert.equal(filtered, 'utm_medium=cpc');
});
test('analytics-only strips ad click IDs, duplicates and private campaign labels; withdrawal stops events', async () => {
  const { google: ga, scripts, navigate, events } = await setup();
  navigate('/?gclid=ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789&utm_source=google&utm_source=Jane&utm_medium=cpc&utm_campaign=Private_Name');
  ga.saveChoice(true, false); ga.trackPage('/');
  assert.equal(new URL(scripts[0].address).search, '?utm_medium=cpc');
  const updates = window.dataLayer.filter(c=>c[0]==='consent' && c[1]==='update');
  assert.equal(updates[0][2].analytics_storage, 'granted');
  for (const field of ['ad_storage','ad_user_data','ad_personalization']) assert.equal(updates[0][2][field], 'denied');
  ga.saveChoice(false, false);
  const count = events().length;
  assert.equal(window[`ga-disable-${ga.GA_ID}`], true);
  assert.equal(ga.trackBooking('booking_step_2'), false);
  navigate('/booking'); assert.equal(ga.trackPage('/booking'), false);
  assert.equal(events().length, count);
});
test('private pages never load Google', async () => {
  const { google: ga, scripts, navigate } = await setup();
  navigate('/admin?email=private@example.com'); ga.saveChoice(true, true);
  assert.equal(ga.trackPage('/admin'), false);
  assert.equal(ga.trackBooking('booking_button_click'), false);
  assert.equal(scripts.length, 0);
});
test('actual bookingApi rejects failures; repeated successful server IDs produce exactly one lead without booking fields', async () => {
  const { google: ga, events } = await setup();
  const shared = await readFile(new URL('../src/components/booking/shared.ts', import.meta.url), 'utf8');
  const { bookingApi } = await import(`data:text/javascript;base64,${Buffer.from(compiled(shared)).toString('base64')}`);
  ga.saveChoice(true, true);
  const id = 'a12a2c73-fd88-43ce-bd3a-d57333bd2e6e';
  globalThis.fetch = async () => ({ ok: false, json: async () => ({ error: 'storage' }) });
  await assert.rejects(bookingApi('', {action:'enquire'}).then(ga.trackLead), /storage/);
  assert.equal(events().length, 0);
  assert.equal(ga.trackLead({ok:false,id}), false);
  assert.equal(ga.trackLead({ok:true,id:'missing'}), false);
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ ok:true,id, name:'Private Person', email:'private@example.com', price:10000 }) });
  const submit = () => bookingApi('', {action:'enquire'}).then(ga.trackLead);
  assert.deepEqual(await Promise.all([submit(), submit(), submit()]), [true, false, false]);
  assert.deepEqual(events().map(c=>c[1]), ['generate_lead']);
  assert.deepEqual(Object.keys(events()[0][2]).sort(), ['page_location','page_referrer','send_to','user_data']);
  assert.deepEqual(events()[0][2].user_data, {});
  const payload = JSON.stringify(window.dataLayer);
  for (const value of [id,'Private Person','private@example.com','10000']) assert.equal(payload.includes(value), false);
});
test('a success without consent is never replayed after consent; blocked analytics cannot break booking', async () => {
  const { google: ga, events } = await setup();
  const result = {ok:true,id:'a12a2c73-fd88-43ce-bd3a-d57333bd2e6e'};
  assert.equal(ga.trackLead(result), false);
  ga.saveChoice(true, true);
  assert.equal(ga.trackLead(result), false);
  document.head.appendChild = () => { throw new Error('Blocked script'); };
  assert.equal(ga.trackLead({...result,id:'b12a2c73-fd88-43ce-bd3a-d57333bd2e6e'}), false);
  assert.equal(events().length, 0);
});
