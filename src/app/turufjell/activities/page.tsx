import { TurufjellActivityGuide } from "@/components/TurufjellActivityGuide";
import type { Metadata } from "next";

export const metadata: Metadata = { alternates: { canonical: "/turufjell/activities" } };

export default function Page() { return <TurufjellActivityGuide />; }
