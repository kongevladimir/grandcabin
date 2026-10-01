"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RetreatNav } from "@/components/ConceptPages";
import { useSiteLanguage } from "@/components/useSiteLanguage";
import { bookingApi, errorText, words } from "./shared";

export function ForgotPassword({ emailReady }: { emailReady: boolean }) {
  const [lang, setLang] = useSiteLanguage();
  const w = (nb: string, en: string) => words(lang, nb, en);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function requestReset(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setError("");
    try { await bookingApi("", { action: "request-reset", email }); setSent(true); }
    catch (caught) { setError((caught as Error).message); }
    finally { setBusy(false); }
  }

  return <div className="concept-page retreat-page bk-page"><RetreatNav language={lang} setLanguage={setLang} /><main className="bk-main bk-owner">
    <p className="bk-kicker">GRANDCABIN · {w("EIER", "OWNER")}</p>
    <h1>{w("Glemt passord", "Forgot password")}</h1>
    <form className="bk-panel bk-login" onSubmit={requestReset}>
      <h2>{w("Tilbakestill passord", "Reset your password")}</h2>
      <p>{w("Oppgi e-postadressen knyttet til eierkontoen. Lenken er gyldig i 30 minutter.", "Enter the email address for the owner account. The link is valid for 30 minutes.")}</p>
      {!emailReady && <p className="bk-preview">{w("Tilbakestilling via e-post er ikke aktivert ennå. E-postlevering må kobles til før denne funksjonen kan brukes.", "Email password reset is not active yet. Email delivery must be connected before this feature can be used.")}</p>}
      {sent ? <p role="status">{w("Hvis adressen stemmer med eierkontoen, sender vi en lenke for tilbakestilling.", "If the address matches the owner account, we will send a reset link.")}</p> : <>
        {error && <p className="bk-error" role="alert">{errorText(error, lang)}</p>}
        <label>{w("E-postadresse", "Email address")}<input type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} /></label>
        <button className="bk-primary" disabled={busy || !emailReady}>{busy ? w("Sender …", "Sending …") : w("Send lenke", "Send link")} →</button>
      </>}
      <p className="bk-login-help"><Link href="/login">← {w("Tilbake til innlogging", "Back to sign in")}</Link></p>
    </form>
  </main></div>;
}

export function ResetPassword() {
  const [lang, setLang] = useSiteLanguage();
  const w = (nb: string, en: string) => words(lang, nb, en);
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const value = new URLSearchParams(window.location.hash.slice(1)).get("token") ?? "";
    const timer = window.setTimeout(() => {
      setToken(value);
      window.history.replaceState(null, "", window.location.pathname);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function reset(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setError("");
    try { await bookingApi("", { action: "reset-password", token, password }); setDone(true); setPassword(""); setToken(""); }
    catch (caught) { setError((caught as Error).message); }
    finally { setBusy(false); }
  }

  return <div className="concept-page retreat-page bk-page"><RetreatNav language={lang} setLanguage={setLang} /><main className="bk-main bk-owner">
    <p className="bk-kicker">GRANDCABIN · {w("EIER", "OWNER")}</p>
    <h1>{w("Nytt passord", "New password")}</h1>
    <div className="bk-panel bk-login">
      {done ? <><h2>{w("Passordet er oppdatert", "Password updated")}</h2><p>{w("Du kan nå logge inn med det nye passordet.", "You can now sign in with your new password.")}</p><Link className="bk-primary" href="/login">{w("Gå til innlogging", "Go to sign in")} →</Link></> : token ? <form onSubmit={reset}>
        <h2>{w("Velg et nytt passord", "Choose a new password")}</h2>
        <p>{w("Bruk minst 16 tegn. Lenken kan bare brukes én gang.", "Use at least 16 characters. The link can only be used once.")}</p>
        {error && <p className="bk-error" role="alert">{errorText(error, lang)}</p>}
        <label>{w("Nytt passord", "New password")}<input type="password" autoComplete="new-password" minLength={16} required value={password} onChange={event => setPassword(event.target.value)} /></label>
        <button className="bk-primary" disabled={busy}>{busy ? w("Lagrer …", "Saving …") : w("Lagre passord", "Save password")} →</button>
      </form> : <><h2>{w("Lenken er ikke gyldig", "The link is invalid")}</h2><p>{w("Be om en ny lenke for tilbakestilling.", "Request a new reset link.")}</p><Link className="bk-primary" href="/forgot-password">{w("Glemt passord", "Forgot password")} →</Link></>}
    </div>
  </main></div>;
}
