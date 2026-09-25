import { GuestConversation } from "@/components/booking/BookingInbox";
export const metadata = { title: "Din samtale · Grandcabin", robots: { index: false, follow: false }, referrer: "no-referrer" as const };
export default async function Page({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <GuestConversation id={id} />; }
