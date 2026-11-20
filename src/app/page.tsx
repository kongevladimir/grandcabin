import type { Metadata } from "next";
import { RetreatConcept } from "@/components/ConceptPages";

export const metadata: Metadata = { title: "Mountain retreat · Turu Crown", alternates: { canonical: "/" } };

export default function RetreatPage() {
  return <RetreatConcept />;
}
