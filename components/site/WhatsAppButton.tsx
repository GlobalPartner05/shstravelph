import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink, buildBookingInquiryMessage } from "@/lib/whatsapp";
import { getSetting, SETTING_KEYS } from "@/lib/settings";

export default async function WhatsAppButton() {
  const setting = await getSetting(SETTING_KEYS.whatsappNumber).catch(() => null);
  if (!setting?.isConfirmed || !setting.value) {
    // No confirmed WhatsApp number yet — don't show a dead/placeholder link to real visitors.
    return null;
  }

  const href = buildWhatsAppLink(setting.value, buildBookingInquiryMessage({}));

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Sakura Hire Services on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105"
    >
      <MessageCircle className="h-7 w-7" fill="white" strokeWidth={0} />
    </a>
  );
}
