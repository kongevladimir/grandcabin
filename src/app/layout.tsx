import { VisitTracker } from "@/components/VisitTracker";
import type { Metadata } from "next";
import { site } from "@/content/site";
import "./globals.css";
import "./booking.css";
import "./mobile.css";

export const metadata: Metadata = {
  title: "Turu Crown · Sammen på Turufjell",
  description: site.description,
  // Remove this restriction when the owner is ready to launch.
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang={site.language}><body><VisitTracker />{children}</body></html>;
}
