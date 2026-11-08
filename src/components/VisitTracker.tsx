"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { publicPages, type AnalyticsKind } from "@/lib/analytics/model";

export function VisitTracker() {
  const path = usePathname();
  const previous = useRef("");
  useEffect(() => {
    if (!publicPages.includes(path) || !["turucrown.no", "www.turucrown.no", "localhost", "127.0.0.1"].includes(location.hostname)) { previous.current = ""; return; }
    function send(kind: AnalyticsKind, visit = false) {
      void fetch("/api/analytics", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: crypto.randomUUID(), path, kind, visit }), keepalive: true }).catch(() => {});
    }
    function touch() {
      const now = Date.now(); let visit = false;
      try { const last = Number(sessionStorage.getItem("turu-last-visit") ?? 0); visit = now - last > 30 * 60000; sessionStorage.setItem("turu-last-visit", String(now)); } catch { /* Page views still work without browser storage. */ }
      return visit;
    }
    if (previous.current !== path) { previous.current = path; send("view", touch()); }
    function click(event: MouseEvent) {
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      if (href.startsWith("tel:")) send("phone");
      else if (href.startsWith("mailto:")) send("email");
      else {
        try { const url = new URL(href, location.href); if (url.origin === location.origin && publicPages.includes(url.pathname)) send(url.pathname === "/booking" ? "booking" : "navigation"); } catch {}
      }
      touch();
    }
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, [path]);
  return null;
}
