import type { Metadata } from "next";
import { ChaletConcept } from "@/components/ConceptPages";

export const metadata: Metadata = { title: "Alpine suites · Grandcabin" };

export default function ChaletPage() {
  return <ChaletConcept />;
}
