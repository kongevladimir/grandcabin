import type { Metadata } from "next";
import { RetreatConcept } from "@/components/ConceptPages";

export const metadata: Metadata = {
  title: "Stor luksushytte på Turufjell – 29 gjester | Turu Crown",
  description: "Lei en eksklusiv fjellhytte på Turufjell med plass til 29 gjester. Perfekt for storfamilier, vennegjenger og bedriftssamlinger. Opplev luksus og komfort.",
  alternates: { canonical: "/" },
};

export default function RetreatPage() {
  return <RetreatConcept />;
}
