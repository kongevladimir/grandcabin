import { RetreatDetailPage } from "@/components/ConceptPages";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Firmatur og bedriftssamling på Turufjell | Turu Crown",
  description: "Arranger firmatur, kick-off eller bedriftssamling på Turufjell. Eksklusiv hytte med 29 sengeplasser, projektor, 100-tommers lerret og raskt internett.",
  alternates: { canonical: "/meetings" },
};
export default function Page() { return <RetreatDetailPage page="meetings" />; }
