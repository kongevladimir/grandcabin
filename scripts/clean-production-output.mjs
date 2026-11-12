import { rm } from "node:fs/promises";
import path from "node:path";

const mode = process.argv[2];
if (mode !== "--next" && mode !== "--all") {
  throw new Error("Use --next or --all.");
}

const root = path.resolve(process.cwd());
const names = mode === "--all" ? [".next", ".open-next"] : [".next"];

for (const name of names) {
  const target = path.resolve(root, name);
  if (path.dirname(target) !== root || path.basename(target) !== name) {
    throw new Error(`Refusing to clean unexpected path: ${target}`);
  }
  await rm(target, { recursive: true, force: true });
}

console.log(`Cleaned generated production output (${mode.slice(2)}).`);
