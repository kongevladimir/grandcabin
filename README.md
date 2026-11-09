# Turu Crown

A Norwegian and English presentation website for the Turu Crown rental property
on Turufjell. The direct booking form lets guests request dates and extras,
then receive a personal reply from the owner by email or phone. Guest name,
email and phone number are required when submitting an enquiry. Only the owner
receives an automated email notification. The owner records agreed stays and
blocks their dates manually; there is no payment collection.
The last enquiry step displays a compact, sentence-case cancellation-policy section and
one required checkbox accepting both the terms and contact/message processing.
New enquiries retain the accepted terms version. Check-in is from 16:00 and
checkout by 12:00. Owner-supplied cancellation terms are full refund more than
60 days before check-in, 50% at 30–60 days, and none below 30 days.
The shared footer lists both phone numbers and info@turucrown.no under Contact us,
with compact labelled phone and email links in both languages.
Rent starts at NOK 15,000 per day for up to 24 guests. Each guest above 24
adds NOK 750 per day, up to 29 guests. Easter 22–30 March 2027 starts at
NOK 16,000 per day with the same extra-guest rule. Mandatory final cleaning is
NOK 5,000 per stay, and the combined bed linen and towel package is NOK 350
per person for up to 29 people. The selected stay shows a full price breakdown.
The owner still needs to specify the winter holiday rate and deposit terms.

## Get started

Use Node.js 24 and npm. From the project folder:

```sh
npm ci
npm run dev
```

Open http://localhost:3000 (or the address printed by Next.js).
On Windows, use `npm.cmd` if PowerShell blocks `npm.ps1`.

The selected website design is the multi-page mountain-retreat presentation:

- `/` — the main entrance. The background film uses a preloaded still extracted
  from its first frame, so loading does not briefly show the living-room photo.
  The cabin page uses the same opening still; the video files are unchanged.
- `/cabin` — cabin story, room photo gallery with full-screen viewing, FINN and Airbnb review carousels, and facilities overview.
- `/bedrooms` — Rom in Norwegian and Rooms in English, with bedroom photos and room details.
- `/materials` — wood, surface treatment, and interior material story.
- `/gallery` — 67 photos filtered by Alle, Hytta, Oppholdsrom and Soverom (All, Cabin, Living space and Bedrooms in English), with full-screen viewing. Source originals are unchanged, except for the requested sunny ski photo edit. See `docs/organized-gallery.md` for source folders and original-photo hosting requirements.
- `/location` — maps, driving distances, public transport, and arrival guidance.
- `/3d-tour` — three floor plans in a shared natural-material style, with Norwegian/English labels inside the drawings, floor selection and full-image viewing first, followed by the walkthrough introduction and interactive Matterport tour. See `docs/floor-plans.md` for sources and rendering notes.
- `/meetings` — company retreats and meeting facilities.
- `/turufjell` — outdoor experiences, with an activity guide at `/turufjell/activities`.
- `/booking` — calendar, combined linen and towels, price breakdown and direct enquiry.
- `/booking/owner` — private price calendar, owner inbox, approval and date blocking.
- The owner's **Statistikk / Statistics** tab shows approximate browser sessions,
  page views, daily totals, popular pages and booking/phone/email/navigation clicks
  for the last 7, 30, 90 or 365 days. Only the authenticated owner can read it.
- `/admin` — owner sign-in with username and password, accessed directly without a public navigation link. The old `/login` address redirects here.
- `/forgot-password` — request an owner password reset by email when production email delivery is configured.

Legacy `/concepts/retreat` addresses permanently redirect to the corresponding short addresses. Other retired concept addresses redirect to the homepage.

After signing in, the owner can select one night or a range (both dates included)
and save a nightly price for up to 24 guests, or restore the original prices.
Changes are stored in booking storage and require no website edit or deployment.
Guest totals use these prices plus the existing extra-person and extras charges;
already submitted enquiries keep their quoted prices. Production use still needs
the storage and account setup described below.

Online enquiries use private Supabase storage and Zoho Mail EU notifications to
info@turucrown.no. Storage, owner email delivery, manual reservations and a private
Cloudflare backup/isolated restore were verified on 7 November 2026.
See [booking setup](docs/booking-setup.md) for local preview, production maintenance
and tests. The booking calendar does not synchronize with FINN.
The owner-provided FINN reservations for November and December 2026 and owner
holds for 12–14 January and 11–12 March 2027 are recorded as unavailable nights
in the booking calendar, including the last listed night. The former 22–23
January hold has been removed. New reservations must still be added manually.

## Private statistics

Visitor statistics start when tracking is published; previous visits cannot be
reconstructed. The separate private Cloudflare D1 database is configured through
the `ANALYTICS_DB` binding in `wrangler.jsonc`; initialize it with
`analytics/schema.sql`. It stores only a random per-event retry ID, Norwegian
calendar date, allowlisted public page, click category and session-start flag.
No names, emails, IP addresses, query strings or referrers are stored. Events are
kept for up to 365 days and older events are removed on the next recorded visit.
A browser-tab timestamp estimates sessions with a 30-minute inactivity boundary;
it is not a count of unique people. New tabs can count separately. Signed-in owner
traffic and known bot user agents are excluded, while blocked tracking can cause
undercounting. Local preview data stays in memory and clears on server restart.
The statistics database is independent of booking records and backup storage.

## Commands

- `npm run dev` — local development with live updates.
- `npm run build` — production build.
- `npm start` — serve the production build after building.
- `npm run lint` — ESLint.
- `npm run typecheck` — generate route types and check TypeScript.
- `npm run test:booking` — date validation and reservation conflict tests.
- `npm run check` — lint, booking tests, typecheck, and production build.

The regional location map uses MapLibre with an OpenFreeMap road style. The
`predev` and `prebuild` hooks copy its worker and shared module from the installed
package into `public/maplibre/`; these generated files are not committed. Road
and place styling lives in `public/maps/regional-style.json`. To regenerate that
style from its public base, run `node scripts/generate-regional-map-style.mjs`.

## Files

- `src/app/` — pages, layout, global styles, and a 404 page.
- `src/content/site.ts` — Norwegian and English property content.
- `public/images/` — photographs from the property listing.
- `AGENTS.md` — guidance for the owner's agent.

Search indexing is disabled in `src/app/layout.tsx` until the owner is ready to
launch.

## Cloudflare deployment

Cloudflare deployment uses the committed `wrangler.jsonc`, `open-next.config.ts`
and exact OpenNext/Wrangler versions in `package-lock.json`. This avoids running
an automatic migration and downloading an unpinned adapter during deployment.
OpenNext 1.20.6 supports this project's Next.js 16.3.5; update and verify them
together when changing versions.

Workers Builds settings for the connected repository:

- Build command: `npm run build:cloudflare`
- Deploy command: `npm run deploy`
- Non-production version command: `npm run upload`
- Root directory: `/`

`npm ci` installs the locked dependencies. The Cloudflare build command runs the
normal Next.js build and packages its output into `.open-next/`; deploy and
upload use that prepared output. `npm run preview:cloudflare` previews the
prepared Worker locally. Generated Worker output is excluded from Git, lint
and TypeScript source checks. Keep `grandcabin` as both the Worker name and
`WORKER_SELF_REFERENCE` service; the existing Images binding is retained.
`public/.assetsignore` also excludes the local-only, oversized source photos
from direct uploads; tracked previews and byte-preserving original pieces stay
available as described in `docs/organized-gallery.md`.

Do not add preview credentials to Wrangler or enable real booking as part of
deployment maintenance. Production booking still needs the setup above.
