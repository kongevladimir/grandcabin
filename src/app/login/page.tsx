import { OwnerLogin } from "@/components/booking/OwnerLogin";

export const metadata = { title: "Logg inn · Grandcabin", robots: { index: false, follow: false }, referrer: "no-referrer" as const };

export default function Page() { return <OwnerLogin />; }
