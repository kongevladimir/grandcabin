import type { Metadata } from "next";
import { PanoramaConcept } from "@/components/ConceptPages";

export const metadata: Metadata = { title: "Panorama 04 · Grandcabin" };

export default function PanoramaFourPage() {
  return <PanoramaConcept variant={4} />;
}
