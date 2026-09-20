import type { Metadata } from "next";
import { EditorialConcept } from "@/components/ConceptPages";

export const metadata: Metadata = { title: "Arkitektur · Grandcabin" };

export default function EditorialPage() {
  return <EditorialConcept />;
}
