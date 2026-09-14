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
