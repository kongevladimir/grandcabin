import { stat } from "node:fs/promises";
import path from "node:path";

const ENV_FILES = [
  ".env",
  ".env.local",
  ".env.production",
  ".env.production.local",
  ".env.development",
  ".env.development.local",
  ".env.test",
  ".env.test.local",
];

const found = [];
for (const name of ENV_FILES) {
  try {
    if ((await stat(path.join(process.cwd(), name))).isFile()) found.push(name);
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}

if (found.length > 0) {
  throw new Error(
    `Refusing to build a Cloudflare package because OpenNext would embed local environment files: ${found.join(", ")}. `
      + "Build from a clean checkout and keep production values in Cloudflare bindings/secrets.",
  );
}

console.log("Cloudflare build input safety check passed.");
