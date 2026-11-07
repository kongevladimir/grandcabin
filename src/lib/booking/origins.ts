// The public site is served with and without www. Never trust the request Host
// or allow arbitrary subdomains when checking state-changing requests.
export function allowedBookingOrigin(origin: string | null, siteUrl: string) {
  if (!origin) return false;
  const canonical = new URL(siteUrl);
  if (origin === canonical.origin) return true;
  if (canonical.protocol !== "https:") return false;
  const alternate = new URL(canonical.origin);
  alternate.hostname = canonical.hostname.startsWith("www.")
    ? canonical.hostname.slice(4)
    : `www.${canonical.hostname}`;
  return origin === alternate.origin;
}
