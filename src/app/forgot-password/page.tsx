import { ForgotPassword } from "@/components/booking/OwnerRecovery";
import { configured, isLocalPreview } from "@/lib/booking/store";

export const metadata = { title: "Glemt passord · Grandcabin", robots: { index: false, follow: false }, referrer: "no-referrer" as const };
export const dynamic = "force-dynamic";

export default function Page() { return <ForgotPassword emailReady={configured() && !isLocalPreview()} />; }
