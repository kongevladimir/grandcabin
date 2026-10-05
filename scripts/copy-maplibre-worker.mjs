import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const packageRoot = path.dirname(createRequire(import.meta.url).resolve("maplibre-gl/package.json"));
const target = path.join(process.cwd(), "public", "maplibre");
mkdirSync(target, { recursive: true });
for (const file of ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"]) {
  copyFileSync(path.join(packageRoot, "dist", file), path.join(target, file));
}
copyFileSync(path.join(packageRoot, "LICENSE.txt"), path.join(target, "LICENSE.txt"));
