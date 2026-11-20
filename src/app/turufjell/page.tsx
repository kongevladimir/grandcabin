import { RetreatDetailPage } from "@/components/ConceptPages";
import type { Metadata } from "next";

export const metadata: Metadata = { alternates: { canonical: "/turufjell" } };
export default function Page() { return <RetreatDetailPage page="turufjell" />; }
