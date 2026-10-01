"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RetreatNav } from "@/components/ConceptPages";
import { useSiteLanguage } from "@/components/useSiteLanguage";
import { bookingApi, errorText, words } from "./shared";

export function OwnerLogin() {
  const router = useRouter();
  const [lang, setLang] = useSiteLanguage();
  const w = (nb: string, en: string) => words(lang, nb, en);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void bookingApi("?view=owner").then(() => router.replace("/booking/owner")).catch(() => {});
  }, [router]);

  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await bookingApi("", { action: "login", username, password });
      setPassword("");
      router.replace("/booking/owner");
    } catch (caught) {
      setError((caught as Error).message);
      setPassword("");
      setBusy(false);
    }
  }

  return <div className="concept-page retreat-page bk-page"><RetreatNav language={lang} setLanguage={setLang} /><main className="bk-main bk-owner">
    <p className="bk-kicker">GRANDCABIN · {w("EIER", "OWNER")}</p>
    <h1>{w("Logg inn", "Sign in")}</h1>
    <form className="bk-panel bk-login" onSubmit={signIn}>
      <h2>{w("Eieradministrasjon", "Owner administration")}</h2>
      {error && <p className="bk-error" role="alert">{errorText(error, lang)}</p>}
      <label>{w("E-postadresse", "Email address")}<input type="email" autoComplete="username" required value={username} onChange={event => setUsername(event.target.value)} /></label>
      <label>{w("Passord", "Password")}<input type="password" autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)} /></label>
      <p className="bk-login-help"><Link href="/forgot-password">{w("Glemt passord?", "Forgot password?")}</Link></p>
      <button className="bk-primary" disabled={busy}>{busy ? w("Logger inn …", "Signing in …") : w("Logg inn", "Sign in")} →</button>
    </form>
  </main></div>;
}
