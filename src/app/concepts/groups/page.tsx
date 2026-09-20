import type { Metadata } from "next";
import { GroupsConcept } from "@/components/ConceptPages";

export const metadata: Metadata = { title: "Store grupper · Grandcabin" };

export default function GroupsPage() {
  return <GroupsConcept />;
}
