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
  preview with a brief explanation of what changed. Ask whether the change suits
  the owner.
- This repository is connected to Cloudflare through GitHub. When the owner
  approves a change, commit the files belonging to that change and push them to
  GitHub so Cloudflare publishes them. Do not leave approved changes only in the
  local repository or ask a separate publication question.
- After pushing, monitor only the GitHub CI check named `Workers Builds:
  grandcabin` and wait until it completes successfully. Treat that successful
  GitHub check as publication complete and simply say "Published". Do not open
  the Cloudflare dashboard, inspect Cloudflare directly, verify the live website,
  or provide a live link unless the owner explicitly asks for one.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
