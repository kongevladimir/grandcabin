"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSiteLanguage } from "@/components/useSiteLanguage";
import { applyChoice, eligiblePage, getChoice, saveChoice, serverChoice, subscribeChoice, trackPage } from "@/lib/analytics/google";

export function GoogleAnalytics() {
  const path = usePathname();
  const search = useSearchParams().toString();
  const choice = useSyncExternalStore(subscribeChoice, getChoice, serverChoice);
  useEffect(() => {
    applyChoice();
    trackPage(path);
  }, [path, search, choice]);
  useEffect(() => {
    window.addEventListener("hashchange", applyChoice);
    return () => window.removeEventListener("hashchange", applyChoice);
  }, []);
  return null;
}

export function ConsentSettingsButton({ language }: { language: "nb" | "en" }) {
  return <button type="button" className="consent-settings-link" onClick={() => window.dispatchEvent(new Event("turu-consent-open"))}>{language === "nb" ? "Personverninnstillinger" : "Privacy settings"}</button>;
}

export function ConsentBanner() {
  const path = usePathname();
  const [language] = useSiteLanguage();
  const nb = language === "nb";
  const choice = useSyncExternalStore(subscribeChoice, getChoice, serverChoice);
  const [open, setOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  useEffect(() => {
    const show = () => { const current = getChoice(); setAnalytics(current.startsWith("a1")); setMarketing(current.endsWith("m1")); setOpen(true); };
    window.addEventListener("turu-consent-open", show);
    return () => window.removeEventListener("turu-consent-open", show);
  }, []);
  const visible = choice === "unset" || open;
  function choose(a: boolean, m: boolean) { saveChoice(a, m); setOpen(false); }
  if (!visible || (!eligiblePage(path) && path !== "/booking/privacy")) return null;
  return <section className="consent-banner" aria-label={nb ? "Personverninnstillinger" : "Privacy settings"}>
    <div><strong>{nb ? "Ditt personvern" : "Your privacy"}</strong><p>{nb ? "Vi ønsker å bruke Google Analytics til å forstå bruken av nettsiden og Google Ads til å måle annonser. Du velger selv, og kan endre valget senere." : "We would like to use Google Analytics to understand website usage and Google Ads to measure advertising. The choice is yours and you can change it later."} <Link href="/booking/privacy">{nb ? "Les om personvern" : "Privacy details"}</Link></p></div>
    {open && <fieldset><legend>{nb ? "Velg formål" : "Choose purposes"}</legend><label><input type="checkbox" checked={analytics} onChange={e => setAnalytics(e.target.checked)} /> {nb ? "Analyse" : "Analytics"}</label><label><input type="checkbox" checked={marketing} onChange={e => setMarketing(e.target.checked)} /> {nb ? "Markedsføring" : "Marketing"}</label><p>{nb ? "Annonsemåling via Google Analytics krever også analyse." : "Ad measurement through Google Analytics also requires analytics."}</p></fieldset>}
    <div className="consent-actions"><button type="button" onClick={() => choose(true, true)}>{nb ? "Godta alle" : "Accept all"}</button><button type="button" onClick={() => choose(false, false)}>{nb ? "Avslå alle" : "Reject all"}</button>{open ? <button type="button" onClick={() => choose(analytics, marketing)}>{nb ? "Lagre valg" : "Save choices"}</button> : <button type="button" onClick={() => setOpen(true)}>{nb ? "Tilpass" : "Customize"}</button>}</div>
  </section>;
}
