import { randomBytes } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

const file = new URL('../.env.local', import.meta.url);
let existing = await readFile(file, 'utf8').catch(error => { if (error.code === 'ENOENT') return ''; throw error; });
if (/^BOOKING_/m.test(existing)) {
  console.log('Booking settings already exist. Left them unchanged.');
} else {
  const password = randomBytes(18).toString('base64url');
  const secret = randomBytes(48).toString('base64url');
  existing += `\n# Local booking preview only. Never copy these credentials to production.\nBOOKING_LOCAL_PREVIEW=true\nBOOKING_SESSION_SECRET=${secret}\nBOOKING_OWNER_PASSWORD=${password}\n`;
  await writeFile(file, existing, { mode: 0o600 });
  await writeFile(new URL('../.booking-owner-access.txt', import.meta.url), `Grandcabin — local owner inbox\n\nOpen: http://localhost:3000/booking/owner\nOwner password: ${password}\n\nThis password is for this computer's preview only.\nEnquiries are stored locally. No email is sent.\nKeep this file private. It is excluded from Git.\n`, { mode: 0o600 });
  console.log('Local preview configured. Owner sign-in details saved in .booking-owner-access.txt (excluded from Git).');
}
