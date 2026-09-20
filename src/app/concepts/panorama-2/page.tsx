import type { Metadata } from "next";
import { PanoramaConcept } from "@/components/ConceptPages";

export const metadata: Metadata = { title: "Panorama 02 · Grandcabin" };

export default function PanoramaTwoPage() {
  return <PanoramaConcept variant={2} />;
}
