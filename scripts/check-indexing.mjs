import assert from 'node:assert/strict';

// Inspect the actual server output, including headers that can override HTML.
const origin = new URL(process.argv[2] || 'http://localhost:3001').origin;
const canonicalOrigin = 'https://turucrown.no';
const publicPages = ['/', '/cabin', '/bedrooms', '/materials', '/gallery', '/location', '/3d-tour', '/meetings', '/turufjell', '/turufjell/activities', '/booking', '/booking/privacy'];
const privatePages = ['/admin', '/booking/owner', '/forgot-password', '/reset-password', '/booking/conversation/indexing-check'];
const attributes = tag => Object.fromEntries([...tag.matchAll(/([\w-]+)\s*=\s*["']([^"']*)["']/g)].map(([, key, value]) => [key.toLowerCase(), value]));

for (const path of [...publicPages, ...privatePages, '/indexing-check-not-found']) {
  const response = await fetch(new URL(path, origin), { headers: { 'User-Agent': 'Googlebot' }, redirect: 'manual' });
  const html = await response.text();
  const missing = path === '/indexing-check-not-found';
  assert.equal(response.status, missing ? 404 : 200, path);
  const meta = [...html.matchAll(/<meta\b[^>]*>/gi)].map(([tag]) => attributes(tag));
  const directives = meta.filter(tag => ['robots', 'googlebot'].includes(tag.name?.toLowerCase())).map(tag => tag.content.toLowerCase());
  const canonical = [...html.matchAll(/<link\b[^>]*>/gi)].map(([tag]) => attributes(tag)).filter(tag => tag.rel === 'canonical');
  const header = response.headers.get('x-robots-tag')?.toLowerCase() || '';
  if (publicPages.includes(path)) {
    assert.ok(directives.some(value => /\bindex\b/.test(value) && /\bfollow\b/.test(value)), `${path}: index, follow missing`);
    assert.ok(![...directives, header].some(value => /\b(noindex|nofollow|none)\b/.test(value)), `${path}: restrictive indexing directive`);
    assert.equal(canonical.length, 1, `${path}: expected one canonical`);
    assert.equal(new URL(canonical[0].href).href, new URL(path, canonicalOrigin).href, `${path}: incorrect canonical`);
  } else {
    assert.ok(directives.some(value => /\bnoindex\b/.test(value)), `${path}: noindex missing`);
    assert.equal(canonical.length, 0, `${path}: inherited public canonical`);
    if (!missing) assert.ok(directives.some(value => /\bnofollow\b/.test(value)), `${path}: nofollow missing`);
  }
}

for (const [from, to] of [['/login', '/admin'], ['/concepts/retreat/cabin', '/cabin'], ['/concepts/old', '/']]) {
  const response = await fetch(new URL(from, origin), { redirect: 'manual' });
  assert.ok([301, 308].includes(response.status), `${from}: permanent redirect missing`);
  assert.equal(new URL(response.headers.get('location'), origin).pathname, to);
}

const robots = await fetch(new URL('/robots.txt', origin));
assert.equal(robots.status, 200, 'robots.txt');
const rules = (await robots.text()).replace(/#.*$/gm, '');
assert.match(rules, /^Sitemap:\s*https:\/\/turucrown\.no\/sitemap\.xml\s*$/m, 'robots.txt sitemap declaration');
// Check rules applicable to Google, ignoring separate AI crawler policies.
let agents = [], directivesStarted = false;
for (const line of rules.split(/\r?\n/)) {
  const [, key, raw] = line.match(/^\s*([\w-]+)\s*:\s*(.*?)\s*$/) || [];
  if (!key) continue;
  const value = raw.toLowerCase();
  if (key.toLowerCase() === 'user-agent') {
    if (directivesStarted) agents = [];
    agents.push(value);
    directivesStarted = false;
  } else {
    directivesStarted = true;
    if (key.toLowerCase() === 'disallow' && raw && agents.some(agent => agent === '*' || agent === 'googlebot')) {
      assert.ok(!publicPages.some(path => path.startsWith(raw.replace(/\*.*$/, ''))), `robots.txt disallows public path: ${raw}`);
    }
  }
}
const sitemap = await fetch(new URL('/sitemap.xml', origin), { redirect: 'manual' });
assert.equal(sitemap.status, 200, 'sitemap.xml');
assert.match(sitemap.headers.get('content-type') || '', /^(application|text)\/xml\b/i, 'sitemap XML content type');
const xml = await sitemap.text();
assert.match(xml, /^<\?xml\s/);
assert.match(xml, /<urlset\s+xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
assert.match(xml, /<\/urlset>\s*$/);
const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url);
const expected = publicPages.map(path => new URL(path, canonicalOrigin).href);
assert.deepEqual(locations.toSorted(), expected.toSorted(), 'sitemap must list all public canonicals exactly once and no private URLs');
console.log(`PASS: ${publicPages.length} public pages allow indexing with correct canonicals; ${privatePages.length} private pages and 404 remain excluded; redirects, robots.txt and sitemap XML checked on ${origin}.`);
