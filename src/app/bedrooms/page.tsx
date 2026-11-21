import { RetreatDetailPage } from "@/components/ConceptPages";
import { bedroomMetadata } from "@/content/bedroom-metadata";
import type { Metadata } from "next";

export const metadata: Metadata = {
  ...bedroomMetadata.nb,
  alternates: { canonical: "/bedrooms" },
};

export default function Page() { return <RetreatDetailPage page="bedrooms" />; }
