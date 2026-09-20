import type { Metadata } from "next";
import { site } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  title: "Grandcabin · Sammen på Turufjell",
  description: site.description,
  // Remove this restriction when the owner is ready to launch.
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang={site.language}><body>{children}</body></html>;
}
