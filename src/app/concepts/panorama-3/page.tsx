import type { Metadata } from "next";
import { PanoramaConcept } from "@/components/ConceptPages";

export const metadata: Metadata = { title: "Panorama 03 · Grandcabin" };

export default function PanoramaThreePage() {
  return <PanoramaConcept variant={3} />;
}
