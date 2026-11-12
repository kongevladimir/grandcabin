import { opendir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const PRIVATE_NAMES = new Set([".booking-data", ".booking-owner-access.txt"]);
const mode = process.argv[2];

if (mode !== "--next" && mode !== "--cloudflare") {
  throw new Error("Use --next or --cloudflare.");
}

const root = process.cwd();
const outputDirectories = mode === "--next"
  ? [path.join(root, ".next")]
  : [path.join(root, ".open-next")];

function containsPrivateName(value) {
  return value
    .replaceAll("\\", "/")
    .split("/")
    .some((part) => PRIVATE_NAMES.has(part));
}

async function requireDirectory(directory) {
  let details;
  try {
    details = await stat(directory);
  } catch (error) {
    if (error?.code === "ENOENT") {
      throw new Error(`Expected production output is missing: ${path.relative(root, directory)}`);
    }
    throw error;
  }
  if (!details.isDirectory()) {
    throw new Error(`Expected production output is not a directory: ${path.relative(root, directory)}`);
  }
}

async function findPrivatePaths(directory, found = []) {
  for await (const entry of await opendir(directory)) {
    const absolute = path.join(directory, entry.name);
    const relative = path.relative(root, absolute);
    if (PRIVATE_NAMES.has(entry.name)) found.push(relative);
    if (entry.isDirectory() && !PRIVATE_NAMES.has(entry.name)) {
      await findPrivatePaths(absolute, found);
    }
  }
  return found;
}

async function findPrivateTraceReferences(directory, found = []) {
  for await (const entry of await opendir(directory)) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await findPrivateTraceReferences(absolute, found);
      continue;
    }
    if (!entry.name.endsWith(".nft.json")) continue;
    const trace = JSON.parse(await readFile(absolute, "utf8"));
    const privateReferences = Array.isArray(trace.files)
      ? trace.files.filter((file) => typeof file === "string" && containsPrivateName(file))
      : [];
    if (privateReferences.length > 0) {
      found.push(`${path.relative(root, absolute)} (${privateReferences.length} private references)`);
    }
  }
  return found;
}

async function findEmbeddedEnvironmentValues() {
  const file = path.join(root, ".open-next", "cloudflare", "next-env.mjs");
  let source;
  try {
    source = await readFile(file, "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") {
      return [".open-next/cloudflare/next-env.mjs (missing environment manifest)"];
    }
    throw error;
  }

  const exports = [...source.matchAll(/^export const (production|development|test) = (\{.*\});$/gm)];
  if (exports.length !== 3 || new Set(exports.map((match) => match[1])).size !== 3) {
    return [".open-next/cloudflare/next-env.mjs (unrecognized environment manifest)"];
  }
  for (const match of exports) {
    if (Object.keys(JSON.parse(match[2])).length > 0) {
      return [".open-next/cloudflare/next-env.mjs (embedded project environment values)"];
    }
  }
  return [];
}

const failures = [];
for (const directory of outputDirectories) {
  await requireDirectory(directory);
  failures.push(...await findPrivatePaths(directory));
}

if (mode === "--next") {
  const nextDirectory = path.join(root, ".next");
  failures.push(...await findPrivateTraceReferences(nextDirectory));
}

if (mode === "--cloudflare") {
  failures.push(...await findEmbeddedEnvironmentValues());
}

if (failures.length > 0) {
  throw new Error(
    `Production package contains private local booking files:\n${failures.map((file) => `- ${file}`).join("\n")}`,
  );
}

console.log(`Production package safety check passed (${mode.slice(2)}).`);
