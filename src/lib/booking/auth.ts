import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import type { OwnerAuth } from "./model";

export function tokenHash(token: string) { return createHash("sha256").update(token).digest("base64url"); }

export function ownerPasswordMatches(password: string, auth?: OwnerAuth) {
  if (auth?.passwordHash && auth.passwordSalt) {
    const actual = scryptSync(password, auth.passwordSalt, 64);
    return timingSafeEqual(actual, Buffer.from(auth.passwordHash, "base64url"));
  }
  const expected = process.env.BOOKING_OWNER_PASSWORD;
  return !!expected && timingSafeEqual(createHash("sha256").update(password).digest(), createHash("sha256").update(expected).digest());
}

export function newPasswordAuth(password: string, previous?: OwnerAuth): OwnerAuth {
  const passwordSalt = randomBytes(24).toString("base64url");
  return {
    ...previous,
    passwordHash: scryptSync(password, passwordSalt, 64).toString("base64url"),
    passwordSalt,
    sessionVersion: randomBytes(24).toString("base64url"),
    resetHash: undefined,
    resetExpires: undefined,
  };
}
