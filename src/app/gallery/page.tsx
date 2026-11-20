import { RetreatDetailPage } from "@/components/ConceptPages";
import type { Metadata } from "next";

export const metadata: Metadata = { alternates: { canonical: "/gallery" } };
export default function Page() { return <RetreatDetailPage page="gallery" />; }
