import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
const source = await readFile(new URL('../src/lib/booking/origins.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText;
const {allowedBookingOrigin} = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
test('booking submissions work on both public addresses regardless of which is canonical', () => {
  for (const canonical of ['https://turucrown.no', 'https://www.turucrown.no/booking']) {
    assert.equal(allowedBookingOrigin('https://turucrown.no',canonical),true);
    assert.equal(allowedBookingOrigin('https://www.turucrown.no',canonical),true);
  }
});
test('booking origin checks reject foreign sites, subdomains, opaque origins and protocol/port changes', () => {
  for (const origin of [null,'null','https://other.example','https://turucrown.no.evil.example','https://admin.turucrown.no','http://turucrown.no','https://www.turucrown.no:8443']) {
    assert.equal(allowedBookingOrigin(origin,'https://turucrown.no'),false,origin);
  }
  assert.equal(allowedBookingOrigin('http://localhost:3000','http://localhost:3000'),true);
  assert.equal(allowedBookingOrigin('http://www.localhost:3000','http://localhost:3000'),false);
});
