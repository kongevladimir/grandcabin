# Grandcabin

A Norwegian and English presentation website for the Grandcabin rental property
on Turufjell. Availability, prices and enquiries are handled through FINN.

## Get started

Use Node.js 24 and npm. From the project folder:

```sh
npm ci
npm run dev
```

Open http://localhost:3000 (or the address printed by Next.js).
On Windows, use `npm.cmd` if PowerShell blocks `npm.ps1`.

Four alternate page structures are available for design comparison:

- `/concepts/destination` — destination and activities first.
- `/concepts/editorial` — architecture-led editorial story.
- `/concepts/groups` — practical planning for large groups.
- `/concepts/panorama` — full-screen luxury presentation for groups and retreats.
- `/concepts/panorama-2`, `/concepts/panorama-3`, `/concepts/panorama-4` — alternate full-screen hero directions.
- `/concepts/chalet` — formal alpine-luxury editorial presentation.
- `/concepts/retreat` — contemporary multi-page mountain-retreat presentation.
- `/concepts/retreat/materials` — wood, surface treatment, and interior material story.
- `/concepts/retreat/3d-tour` — interactive Matterport walkthrough of the cabin.

## Commands

- `npm run dev` — local development with live updates.
- `npm run build` — production build.
- `npm start` — serve the production build after building.
- `npm run lint` — ESLint.
- `npm run typecheck` — generate route types and check TypeScript.
- `npm run check` — lint, typecheck, and production build.

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
