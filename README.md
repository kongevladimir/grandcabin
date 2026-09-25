# Grandcabin

A Norwegian and English presentation website for the Grandcabin rental property
on Turufjell. The direct booking preview lets guests request dates and extras,
then discuss their stay with the owner in a private conversation. The owner
approves reservations manually; there is no payment collection.
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

- `/concepts/retreat` — the main entrance.
- `/concepts/retreat/cabin` — cabin story and guest reviews.
- `/concepts/retreat/materials` — wood, surface treatment, and interior material story.
- `/concepts/retreat/location` — maps, driving distances, public transport, and arrival guidance.
- `/concepts/retreat/3d-tour` — interactive Matterport walkthrough of the cabin.
- `/booking` — calendar, combined linen and towels, price breakdown and direct enquiry.
- `/booking/owner` — private price calendar, owner inbox, approval and date blocking.

After signing in, the owner can select one night or a range (both dates included)
and save a nightly price for up to 24 guests, or restore the original prices.
Changes are stored in booking storage and require no website edit or deployment.
Guest totals use these prices plus the existing extra-person and extras charges;
already submitted enquiries keep their quoted prices. Production use still needs
the storage and account setup described below.

Real online enquiries still require permanent storage and email delivery to be
connected. See [booking setup](docs/booking-setup.md) for local preview credentials,
production setup and tests. The booking preview does not synchronize with FINN.
The owner-provided FINN reservations for November and December 2026 and January
2027 are recorded as unavailable nights in the booking calendar. New FINN
reservations must still be added manually.

## Commands

- `npm run dev` — local development with live updates.
- `npm run build` — production build.
- `npm start` — serve the production build after building.
- `npm run lint` — ESLint.
- `npm run typecheck` — generate route types and check TypeScript.
- `npm run test:booking` — date validation and reservation conflict tests.
- `npm run check` — lint, booking tests, typecheck, and production build.

## Files

- `src/app/` — pages, layout, global styles, and a 404 page.
- `src/content/site.ts` — Norwegian and English property content.
- `public/images/` — photographs from the property listing.
- `AGENTS.md` — guidance for the owner's agent.

Search indexing is disabled in `src/app/layout.tsx` until the owner is ready to
launch.

## Cloudflare deployment

Cloudflare currently generates the Next.js deployment configuration during its
build. Keep the package name `grandcabin` aligned with the Cloudflare Worker name:
the generated `WORKER_SELF_REFERENCE` binding derives from this package name.
