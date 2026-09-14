# Next.js starter

A plain Next.js App Router boilerplate with TypeScript, CSS, and instructions for
helping a non-technical owner in [AGENTS.md](AGENTS.md). No hosting is configured.

## Get started

Use Node.js 24 and npm. From the project folder:

```sh
npm ci
npm run dev
```

Open http://localhost:3000 (or the address printed by Next.js).
On Windows, use `npm.cmd` if PowerShell blocks `npm.ps1`.

## Commands

- `npm run dev` — local development with live updates.
- `npm run build` — production build.
- `npm start` — serve the production build after building.
- `npm run lint` — ESLint.
- `npm run typecheck` — generate route types and check TypeScript.
- `npm run check` — lint, typecheck, and production build.

## Files

- `src/app/` — pages, layout, global styles, and a 404 page.
- `src/content/site.ts` — placeholder text and website language.
- `public/images/` — photographs added later.
- `AGENTS.md` — guidance for the owner's agent.

The page is a neutral placeholder, not a finished villa website. Search indexing
is disabled in `src/app/layout.tsx` until the owner is ready to launch.
