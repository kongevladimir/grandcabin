"use client";

import { publicPages } from "./model";

export const GA_ID = "G-9LBLJXN92D";
const storageKey = "turu-google-consent-v1";
export type Choice = "unset" | "a0m0" | "a1m0" | "a0m1" | "a1m1";
export type BookingEvent = "booking_button_click" | "booking_step_1" | "booking_step_2" | "booking_step_3" | "booking_terms_accepted";
const validChoices: Choice[] = ["a0m0", "a1m0", "a0m1", "a1m1"];
let fallback: Choice = "unset";
let initialized = false;
let lastConsent: Choice = "unset";
let lastPage = "";
const handledLeads = new Set<string>();
const listeners = new Set<() => void>();

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

export function getChoice(): Choice {
  if (typeof window === "undefined") return "unset";
  try {
    const saved = localStorage.getItem(storageKey) as Choice | null;
    return saved && validChoices.includes(saved) ? saved : fallback;
  } catch { return fallback; }
}
export function serverChoice(): Choice { return "unset"; }
export function subscribeChoice(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === storageKey) {
      fallback = validChoices.includes(event.newValue as Choice) ? event.newValue as Choice : "unset";
      applyChoice();
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(listener); window.removeEventListener("storage", onStorage); };
}
export function saveChoice(analytics: boolean, marketing: boolean) {
  fallback = `a${analytics ? 1 : 0}m${marketing ? 1 : 0}` as Choice;
  try { localStorage.setItem(storageKey, fallback); } catch { /* Remember this choice until the tab closes. */ }
  applyChoice();
  listeners.forEach(fn => fn());
}
export function analyticsAllowed(choice = getChoice()) { return choice.startsWith("a1"); }
function consent(choice: Choice) {
  const marketing = choice.endsWith("m1");
  return { analytics_storage: analyticsAllowed(choice) ? "granted" : "denied", ad_storage: marketing ? "granted" : "denied", ad_user_data: marketing ? "granted" : "denied", ad_personalization: marketing ? "granted" : "denied" };
}
export function eligiblePage(path: string) { return publicPages.includes(path); }
// Only reviewed, public campaign labels may reach Google. A general slug/PII
// regex cannot distinguish a person's name from an ordinary campaign name.
export const campaignValues: Record<string, readonly string[]> = {
  utm_source: ["google", "bing", "facebook", "instagram", "meta", "linkedin", "youtube", "newsletter", "email", "qr", "turucrown"],
  utm_medium: ["cpc", "ppc", "paid_search", "paid_social", "social", "email", "organic", "referral", "display", "video", "qr"],
  utm_campaign: ["brand", "turucrown", "winter_2026", "winter_2027", "summer_2027", "vinter_2026", "vinter_2027", "sommer_2027"],
  utm_id: ["brand", "turucrown", "winter_2026", "winter_2027", "summer_2027"],
  utm_content: ["header", "footer", "hero", "text", "image", "video", "ad_1", "ad_2", "ad_3"],
  utm_term: ["turucrown", "turu crown", "hytte turufjell", "cabin turufjell", "luksushytte"],
};
export function safeCampaignQuery(search: string, marketing: boolean) {
  const incoming = new URLSearchParams(search);
  const safe = new URLSearchParams();
  for (const [key, values] of Object.entries(campaignValues)) {
    const candidates = incoming.getAll(key);
    if (candidates.length === 1 && values.includes(candidates[0].toLowerCase())) safe.set(key, candidates[0].toLowerCase());
  }
  if (marketing) for (const key of ["gclid", "gbraid", "wbraid"]) {
    const candidates = incoming.getAll(key);
    if (candidates.length === 1 && /^[A-Za-z0-9_-]{20,256}$/.test(candidates[0])) safe.set(key, candidates[0]);
  }
  return safe.toString();
}
function safeAddress() {
  const query = safeCampaignQuery(location.search, getChoice().endsWith("m1"));
  return `${location.origin}${location.pathname}${query ? `?${query}` : ""}`;
}
function prepareAddress() {
  const address = safeAddress();
  // Sanitize the actual public address before loading/enabling third-party code,
  // because the Google tag can inspect it independently of page_location.
  if (location.href !== address) window.history.replaceState(window.history.state, "", address);
  return address;
}
function eligibleHost() {
  // Allow only this reviewed branch preview, never arbitrary workers.dev sites.
  return ["https://turucrown.no", "https://www.turucrown.no", "https://feat-ga4-booking-funnel-grandcabin.vladimirk81.workers.dev"].includes(location.origin) || (process.env.NEXT_PUBLIC_GA4_PREVIEW === "true" && ["localhost", "127.0.0.1"].includes(location.hostname));
}
function safeReferrer() {
  try { const url = new URL(document.referrer); return `${url.origin}/`; } catch { return ""; }
}
function cleanCookies(analytics: boolean, marketing: boolean) {
  const host = location.hostname.replace(/^www\./, "");
  for (const item of document.cookie.split(";")) {
    const name = item.trim().split("=")[0];
    if ((!analytics && /^_ga(?:_|$)/.test(name)) || (!marketing && /^_gcl_/.test(name))) {
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
      document.cookie = `${name}=; Max-Age=0; path=/; domain=${host}; SameSite=Lax`;
    }
  }
}
export function applyChoice() {
  if (typeof window === "undefined") return;
  try {
    const choice = getChoice();
    window[`ga-disable-${GA_ID}`] = true;
    const enabled = analyticsAllowed(choice) && eligibleHost() && eligiblePage(location.pathname);
    if (enabled) prepareAddress();
    window[`ga-disable-${GA_ID}`] = !enabled;
    if (initialized && lastConsent !== choice) { window.gtag?.("consent", "update", consent(choice)); lastConsent = choice; }
    if (!analyticsAllowed(choice) || !choice.endsWith("m1")) cleanCookies(analyticsAllowed(choice), choice.endsWith("m1"));
  } catch { /* A blocked analytics or cookie operation must not affect the site. */ }
}
export function startGoogle(): boolean {
  if (typeof window === "undefined" || !analyticsAllowed() || !eligibleHost() || !eligiblePage(location.pathname)) return false;
  const address = prepareAddress();
  window[`ga-disable-${GA_ID}`] = false;
  if (!initialized) {
    window.dataLayer = window.dataLayer || [];
    // Google tag commands use the standard arguments-object dataLayer format.
    // eslint-disable-next-line prefer-rest-params
    window.gtag = function () { window.dataLayer!.push(arguments); };
    window.gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    window.gtag("consent", "update", consent(getChoice()));
    lastConsent = getChoice();
    window.gtag("set", { send_page_view: false, page_location: address, page_referrer: safeReferrer(), ads_data_redaction: true, url_passthrough: false, user_data: {} });
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { send_page_view: false, page_location: address, page_referrer: safeReferrer(), allow_google_signals: false, allow_ad_personalization_signals: false, allow_enhanced_conversions: false, user_data: {} });
    const script = document.createElement("script");
    script.async = true;
    script.referrerPolicy = "no-referrer";
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);
    initialized = true;
  }
  window.gtag?.("set", { page_location: address, page_referrer: safeReferrer() });
  return true;
}
export function trackBooking(name: BookingEvent): boolean {
  try {
    if (!startGoogle()) return false;
    window.gtag?.("event", name, { send_to: GA_ID, page_location: safeAddress(), page_referrer: safeReferrer(), user_data: {} });
    return true;
  } catch { return false; }
}
export function trackPage(path: string): boolean {
  try {
    if (!eligiblePage(path)) { lastPage = ""; return false; }
    if (path !== location.pathname || !startGoogle() || path === lastPage) return false;
    const page_location = safeAddress();
    lastPage = path;
    window.gtag?.("event", "page_view", { send_to: GA_ID, page_location, page_referrer: safeReferrer(), user_data: {} });
    return true;
  } catch { return false; }
}
export function trackLead(result: { ok: boolean; id: string }): boolean {
  // The server returns the same ID for an idempotent retry. Keep IDs in memory
  // only; neither an ID nor any booking response fields are sent to Google.
  if (result.ok !== true || !/^[a-f0-9-]{36}$/i.test(result.id) || handledLeads.has(result.id)) return false;
  handledLeads.add(result.id);
  try {
    if (!startGoogle()) return false;
    window.gtag?.("event", "generate_lead", { send_to: GA_ID, page_location: safeAddress(), page_referrer: safeReferrer(), user_data: {} });
    return true;
  } catch { return false; }
}
