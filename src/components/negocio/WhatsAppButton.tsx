import { MessageCircle } from "lucide-react";
import { linkWhatsApp, mensagemWhatsAppLoja } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type Props = {
  whatsapp: string | null;
  nome: string;
  className?: string;
  sticky?: boolean;
};

export function WhatsAppButton({ whatsapp, nome, className, sticky }: Props) {
  if (!whatsapp) return null;

  return (
    <a
      href={linkWhatsApp(whatsapp, mensagemWhatsAppLoja(nome))}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#1EBE57]",
        sticky &&
          "fixed inset-x-4 bottom-4 z-50 h-12 shadow-lg md:static md:inset-auto md:bottom-auto md:h-11 md:shadow-sm",
        className,
      )}
    >
      <MessageCircle className="size-4" />
      WhatsApp
    </a>
  );
}
