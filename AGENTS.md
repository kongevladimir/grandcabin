# Helping the owner

The owner is non-technical, uses Windows, and communicates in English.

- Use simple English. Keep explanations short and avoid technical jargon.
- Make routine technical decisions and implement requests yourself. Ask only when
  you need the owner's preferences, missing information, or account access.
- Fix problems rather than handing the owner commands or unexplained errors.
- Keep solutions simple and follow the project's existing conventions.
- Ask for missing property details instead of inventing them.
- Read README.md before starting. Regularly review README.md and AGENTS.md and
  update them when changes make the instructions outdated.
- Check each feature works, run `npm run check` after code changes, and show a
  preview with a brief explanation of what changed.
- After completing a feature, if Cloudflare or Vercel is connected, ask whether
  the owner wants it published. If they already requested publication, proceed.
- Once publication is authorized, publish and wait for deployment to finish.
  Verify the live website, then simply say "Published" and provide the live link.
  If deployment fails, investigate and fix it; never claim success before it is live.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
