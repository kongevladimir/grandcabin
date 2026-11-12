import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const verifier = path.resolve("scripts/verify-production-package.mjs");
const inputVerifier = path.resolve("scripts/verify-cloudflare-build-input.mjs");

async function fixture() {
  const directory = await mkdtemp(path.join(tmpdir(), "turu-package-check-"));
  await mkdir(path.join(directory, ".next", "standalone"), { recursive: true });
  await mkdir(path.join(directory, ".next", "server"), { recursive: true });
  await mkdir(path.join(directory, ".open-next"), { recursive: true });
  await mkdir(path.join(directory, ".open-next", "cloudflare"), { recursive: true });
  await writeFile(
    path.join(directory, ".open-next", "cloudflare", "next-env.mjs"),
    "export const production = {};\nexport const development = {};\nexport const test = {};\n",
  );
  return directory;
}

function verify(directory, mode) {
  return spawnSync(process.execPath, [verifier, mode], {
    cwd: directory,
    encoding: "utf8",
  });
}

test("accepts production outputs without private booking files", async () => {
  const directory = await fixture();
  try {
    await writeFile(path.join(directory, ".next", "server", "route.nft.json"), JSON.stringify({ files: ["server.js"] }));
    assert.equal(verify(directory, "--next").status, 0);
    assert.equal(verify(directory, "--cloudflare").status, 0);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("rejects copied booking data and private access files", async () => {
  const directory = await fixture();
  try {
    await mkdir(path.join(directory, ".open-next", "server-functions", "default", ".booking-data"), { recursive: true });
    await writeFile(path.join(directory, ".next", "standalone", ".booking-owner-access.txt"), "fixture");
    assert.notEqual(verify(directory, "--next").status, 0);
    assert.notEqual(verify(directory, "--cloudflare").status, 0);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("rejects private booking references left in Next.js traces", async () => {
  const directory = await fixture();
  try {
    await writeFile(
      path.join(directory, ".next", "server", "route.nft.json"),
      JSON.stringify({ files: ["../../../.booking-data/state.json"] }),
    );
    assert.notEqual(verify(directory, "--next").status, 0);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("rejects local environment files before a Cloudflare build", async () => {
  const directory = await fixture();
  try {
    assert.equal(spawnSync(process.execPath, [inputVerifier], { cwd: directory }).status, 0);
    await writeFile(path.join(directory, ".env.local"), "LOCAL_FIXTURE=true\n");
    assert.notEqual(spawnSync(process.execPath, [inputVerifier], { cwd: directory }).status, 0);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("rejects environment values embedded by OpenNext", async () => {
  const directory = await fixture();
  try {
    await writeFile(
      path.join(directory, ".open-next", "cloudflare", "next-env.mjs"),
      "export const production = {\"LOCAL_FIXTURE\":\"true\"};\n",
    );
    assert.notEqual(verify(directory, "--cloudflare").status, 0);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
