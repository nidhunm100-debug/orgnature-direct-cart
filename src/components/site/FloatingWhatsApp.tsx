import { WhatsAppIcon } from "@/components/site/WhatsAppButton";
import { useSettings } from "@/hooks/use-settings";
import { CHAT_MESSAGE, whatsappLink } from "@/lib/whatsapp";

export function FloatingWhatsApp() {
  const { contact } = useSettings();

  return (
    <a
      href={whatsappLink(CHAT_MESSAGE, contact.whatsapp)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with AnKura on WhatsApp"
      className="fixed right-4 bottom-20 z-40 inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-3 text-sm font-semibold text-whatsapp-foreground shadow-lift transition-transform hover:scale-[1.03] sm:bottom-6"
    >
      <WhatsAppIcon className="h-5 w-5" />
      <span className="hidden sm:inline">Chat with us</span>
    </a>
  );
}
