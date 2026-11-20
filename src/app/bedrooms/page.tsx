import { RetreatDetailPage } from "@/components/ConceptPages";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Rom | Turu Crown", alternates: { canonical: "/bedrooms" } };

export default function Page() { return <RetreatDetailPage page="bedrooms" />; }
