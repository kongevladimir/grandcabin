import type { Metadata } from "next";
import { PanoramaConcept } from "@/components/ConceptPages";

export const metadata: Metadata = { title: "Panorama · Grandcabin" };

export default function PanoramaPage() {
  return <PanoramaConcept />;
}
