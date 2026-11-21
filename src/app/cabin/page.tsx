import { RetreatDetailPage } from "@/components/ConceptPages";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stor luksushytte med 10 overnattingsrom | Turu Crown",
  description: "Eksklusiv storhytte på Turufjell med 10 separate overnattingsrom og 29 sengeplasser. Perfekt for storfamilier, vennegjenger og bedriftssamlinger.",
  alternates: { canonical: "/cabin" },
};
export default function Page() { return <RetreatDetailPage page="cabin" />; }
