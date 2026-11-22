import { RetreatDetailPage } from "@/components/ConceptPages";
import { turufjellSeo } from "@/content/turufjell-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: turufjellSeo.nb.title,
  // The page renders one localized description with React's metadata hoisting.
  description: null,
  alternates: { canonical: "/turufjell" },
};
export default function Page() { return <RetreatDetailPage page="turufjell" />; }
