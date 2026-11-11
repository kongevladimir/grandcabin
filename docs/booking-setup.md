# Direct booking enquiries

Guests choose dates, guest count and a combined bed linen/towel package, then
submit a request. No money is collected. Standard rent is NOK 15,000 per day
for up to 24 guests; each guest above 24 adds NOK 750 per day, up to 29 guests.
The nights of 22–30 March 2027 start at NOK 16,000 per day with the same
extra-guest rule. The nights of 22–26
February 2027 await the owner's winter holiday rate; enquiries covering them
cannot be submitted until that rate is given. Rates are calculated between
arrival and departure (checkout day is excluded), including mixed-rate stays.
Final cleaning is mandatory at NOK 5,000 per stay. The optional combined bed
linen/towel package costs NOK 350 per person selected. The server saves the
quoted nightly breakdown and full total with each enquiry and ignores any
client-supplied price. Deposit amount and terms remain unspecified; the form only
collects enquiries and does not collect payments or confirm stays. Pending enquiries do not reserve dates. Confirmed
stays and owner blocks make nights unavailable; checkout day can be another
guest's arrival day. Bookings elsewhere must be blocked manually.
The owner-provided FINN stays on 13–14 and 27–28 November, 4–5, 18–19,
23–25 and 30–31 December 2026 are built into the calendar as unavailable nights.
On 30 October 2026 the owner replaced the 22–23 January 2027 reservation with
the nights of 12–14 January and added 11–12 March 2027, explicitly including
the last dates as occupied nights. Their exclusive checkout dates are
15 January and 13 March. These new fixed holds are labelled Reserved by owner;
the earlier FINN stays retain their FINN labels. All appear read-only in the
owner inbox. Update fixed dates in `src/lib/booking/model.ts` when the owner
changes them; other new reservations still require a manual block.

## Local preview

Run `node scripts/setup-booking-preview.mjs` once, then restart the local server.
This generates private credentials in `.env.local` and writes the owner's login
details to `.booking-owner-access.txt`. Neither is committed. Open `/booking`
for the guest journey or `/admin` for the owner sign-in page. The owner area is
at `/booking/owner` after sign-in.

Preview requests and date blocks persist across restarts in
`.booking-data/state.json`. Preview mode is restricted to localhost requests and
sends no emails. Never copy this data or these credentials into production.
The inbox allows deleting test enquiries; cancel accepted test stays first.

## Production setup and verification

Production uses the owner's private Supabase project, Zoho Mail EU and Cloudflare
secrets. On 7 November 2026 the connected setup passed durable writes, stale-write
rejection, owner login, enquiry submission, idempotency, owner-only notification,
manual reservations and overlap checks. Only the generated test enquiry and test
block were removed. The owner confirmed receiving the initial Zoho test email.
The known FINN/owner dates listed above remain in the public availability rules.
No local preview guest records or credentials are copied into production.

Keep these requirements when maintaining or replacing the setup:

1. Confirm the owner's receiving email address and existing reserved dates.
2. Connect a private Supabase project, preferably in an EU region, and run
   `supabase/booking.sql`. Enable suitable database backups. The table and atomic
   update function are accessible only with the server-side service key.
3. Connect the Zoho Mail EU account using its account ID and an OAuth client with the `ZohoMail.messages.CREATE` scope. Store the client ID, client secret and refresh token as private deployment secrets; set `BOOKING_EMAIL_FROM` to an address permitted to send from that account. Configure the variables shown
   in `booking.env.example` through the deployment environment, keeping all keys
   private. Use the site's canonical HTTPS origin without a path. Generate a new
   session secret (at least 32 characters), owner email as the login username,
   and owner password (at least 9 characters).
4. Keep `BOOKING_LOCAL_PREVIEW=false`. Test durable writes against the production
   storage, email delivery to the owner only, manual reservations, blocking dates
   and overlapping approvals. Verify that guests receive no automatic email. Remove only test records.
5. Review the privacy information with the owner, including provider disclosures,
   access and retention arrangements. Add all existing reservations to the inbox.

The localhost preview script does not change deployment accounts. Production
credentials were entered through private loopback forms and installed as
Cloudflare secrets; they are not committed. Local owner access details are kept
in the ignored `.booking-data/owner-production-access.txt` file. Password reset
uses the owner's info@turucrown.no mailbox.
Publishing follows AGENTS.md: use the GitHub check as the deployment signal;
do not inspect Cloudflare or verify the live site without an explicit request.

## Owner workflow

- Sign in at `/admin` with the owner email and private password. The
  "Forgot password?" link sends a one-time reset link to that email address.
  The link expires after 30 minutes and a reset signs out existing owner
  sessions. Email reset is unavailable in the localhost preview because it
  does not send email.
- The **Price calendar / Priskalender** opens first. Click one night, or the first
  and last nights of a range, enter the base price in whole NOK and save. Both
  selected dates are included. These prices cover up to 24 guests; the existing
  extra-person charge, cleaning and linen/towels are added automatically.
- Saved prices take effect for new enquiries without a code change or deployment.
  They override standard and holiday prices, including the unset winter rate.
  **Restore default prices** removes overrides for the selected nights only.
  Earlier enquiries and confirmed reservations keep their saved price. A guest
  submitting an out-of-date total is asked to review the current price first.
- Changes use the same durable booking storage and authenticated owner session.
  Existing storage records without `nightlyPrices` work without a migration;
  local preview changes stay on this computer until production storage is set up.
- Choose **Enquiries & dates / Forespørsler & datoer** to manage requests and blocks.
- Edit an upcoming recorded stay or confirmed booking from the Upcoming stays
  list. The owner can change its name, dates, guest count and agreed total price;
  changes that overlap another reservation are rejected. Past stays and fixed
  external reservations remain read-only.
- Open an enquiry and contact the guest manually using their email address or phone.
- Record an agreed stay using guest name, total price, arrival and checkout; its dates are blocked. Alternatively, confirm an enquiry at its displayed total. Dates are blocked atomically; two overlapping
  enquiries cannot both be accepted. Declining leaves dates available.
- Cancel a confirmed reservation to release its dates. Delete obsolete personal
  records from the inbox when no longer needed; deletion is permanent.
- Add blocks for personal use and reservations taken elsewhere. There is no FINN
  synchronization. Never assume an empty local preview calendar is real availability.

## Privacy and delivery

Production POST requests accept the configured HTTPS website origin and its
exact www/non-www counterpart. Other subdomains, sites, protocols and ports are
rejected. Local preview accepts only its exact origin. An address rejection is
reported separately from access to private enquiry details.

Owner sessions last eight hours. Changing the session secret or owner password invalidates owner sessions. Public availability contains dates only, never guest names, prices or messages.

Each new enquiry queues an email to the owner via Zoho Mail; no automatic email is sent to guests. Failed notifications remain in a saved outbox, retried on the next owner inbox visit or with its retry button. There is no background scheduler, so check the inbox if delivery fails. An ambiguous delivery failure may result in a duplicate notification. Preview mode sends no email.

The data adapter uses one versioned JSON state record for this single property,
with compare-and-swap updates for conflicts. For larger traffic or multiple
properties, move to normalized tables and indexed queries before scaling.

## Separate backup

`backup/worker.mjs` is a separate scheduled Worker. It copies the private booking
state into the `turucrown-booking-backup` D1 database at 02:00 UTC each day, with
30 days of snapshots. The Worker, database, tables and private connection have
been configured. On 7 November 2026 the same backup implementation saved an actual
snapshot into remote D1, read it back and restored the exact state into an isolated
database. The daily schedule remains 02:00 UTC; scheduled execution should still
be monitored independently of this manual backup/restore verification.
Snapshots contain guest information and account authentication data. Keep the D1
database private, grant access only to the owner, and monitor scheduled runs for
failures. A daily snapshot can lose up to a day of changes after a failure; it is
not a real-time replica. The free Supabase project may pause when inactive, so
confirm its availability and suitable monitoring before relying on it.

## Verification

`npm run check` includes booking domain tests, lint, types and a production build.
With the local preview server running, `node scripts/test-booking-api.mjs` tests
authentication, enquiry submission, idempotency, concurrent approvals and date
blocking. It refuses a non-local or non-preview target and deletes its own test
records afterwards. It does not send emails or test remote providers.
