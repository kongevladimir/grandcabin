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
client-supplied price. Deposit amount and terms still need the owner's details
before opening real bookings. Pending enquiries do not reserve dates. Confirmed
stays and owner blocks make nights unavailable; checkout day can be another
guest's arrival day. Bookings elsewhere must be blocked manually.
The owner-provided FINN stays on 13–14 and 27–28 November, 4–5, 18–19,
23–25 and 30–31 December 2026, and 22–23 January 2027 are built into the
calendar as unavailable nights. These fixed dates appear in the owner inbox
as read-only FINN reservations. Update them in `src/lib/booking/model.ts` if a
FINN stay changes; new reservations still require a manual block.

## Local preview

Run `node scripts/setup-booking-preview.mjs` once, then restart the local server.
This generates private credentials in `.env.local` and writes the owner's login
details to `.booking-owner-access.txt`. Neither is committed. Open `/booking`
for the guest journey or `/booking/owner` for the password-protected owner inbox.

Preview requests, conversations and date blocks persist across restarts in
`.booking-data/state.json`. Preview mode is restricted to localhost requests and
sends no emails. Never copy this data or these credentials into production.
The inbox allows deleting test enquiries; cancel accepted test stays first.

## Before accepting real requests

Production is **not configured yet**. The page disables submission when required
settings are missing. It must not be advertised as accepting real enquiries until
the following is completed:

1. Confirm the owner's receiving email address and existing reserved dates.
2. Connect a private Supabase project, preferably in an EU region, and run
   `supabase/booking.sql`. Enable suitable database backups. The table and atomic
   update function are accessible only with the server-side service key.
3. Connect Resend with a verified sending domain. Configure the variables shown
   in `booking.env.example` through the deployment environment, keeping all keys
   private. Use the site's canonical HTTPS origin without a path. Generate a new
   session secret (at least 32 characters) and owner password (at least 16).
4. Keep `BOOKING_LOCAL_PREVIEW=false`. Test durable writes against the production
   storage, email delivery to owner and guest, private link access, conversation
   replies, blocking dates and overlapping approvals. Remove only test records.
5. Review the privacy information with the owner, including provider disclosures,
   access and retention arrangements. Add all existing reservations to the inbox.

No deployment account has been changed or connected by the local setup script.
Publishing follows AGENTS.md: use the GitHub check as the deployment signal;
do not inspect Cloudflare or verify the live site without an explicit request.

## Owner workflow

- Sign in at `/booking/owner` with the private owner password.
- Open an enquiry and use its conversation to arrange practical details.
- Confirm at the displayed total price. Dates are blocked atomically; two overlapping
  enquiries cannot both be accepted. Declining leaves dates available.
- Cancel a confirmed reservation to release its dates. Delete obsolete personal
  records from the inbox when no longer needed; deletion is permanent.
- Add blocks for personal use and reservations taken elsewhere. There is no FINN
  synchronization. Never assume an empty local preview calendar is real availability.

## Privacy and delivery

The guest's private link grants access to that enquiry, like a password. Its
token is exchanged for an HTTP-only cookie and removed from the visible URL.
Do not share it. Owner sessions last eight hours; guest cookies last 180 days.
Changing the session secret invalidates all sessions and guest links. Changing
the owner password invalidates owner sessions. Deleting an enquiry revokes its
link. Public availability contains dates only, never guest names or messages.

Email is a notification with a link; conversation replies are made on the site.
Failed emails remain in a saved outbox, retried on the next owner inbox visit or
with its retry button. There is no background mail scheduler yet; the owner must
check the inbox if an email provider is unavailable. Retries use idempotency keys.
The inbox shows pending deliveries. Preview mode does not create email notices.

The data adapter uses one versioned JSON state record for this single property,
with compare-and-swap updates for conflicts. For larger traffic or multiple
properties, move to normalized tables and indexed queries before scaling.

## Verification

`npm run check` includes booking domain tests, lint, types and a production build.
With the local preview server running, `node scripts/test-booking-api.mjs` tests
authentication, private conversations, idempotency, concurrent approvals and date
blocking. It refuses a non-local or non-preview target and deletes its own test
records afterwards. It does not send emails or test remote providers.
