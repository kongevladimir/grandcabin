import { ResetPassword } from "@/components/booking/OwnerRecovery";

export const metadata = { title: "Nytt passord · Grandcabin", robots: { index: false, follow: false }, referrer: "no-referrer" as const };

export default function Page() { return <ResetPassword />; }
