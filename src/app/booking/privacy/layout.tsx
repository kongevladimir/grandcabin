import type { Metadata } from "next";

export const metadata: Metadata = { alternates: { canonical: "/booking/privacy" } };

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
