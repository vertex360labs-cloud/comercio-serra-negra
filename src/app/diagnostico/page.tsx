import { DiagnosticoForm } from "@/app/diagnostico/DiagnosticoForm";
import { metadataPagina } from "@/lib/seo";
import { normalizarWhatsApp } from "@/lib/whatsapp";

export const metadata = metadataPagina({
  title: "Diagnóstico da loja",
  description:
    "Veja em um minuto se a loja em Serra Negra está redonda no Google, no WhatsApp e na vitrine.",
  path: "/diagnostico",
});

export default function DiagnosticoPage() {
  const bruto = process.env.NEXT_PUBLIC_WHATSAPP_COMERCIAL ?? "";
  const whatsapp = bruto ? normalizarWhatsApp(bruto) : null;

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-10">
      <p className="text-xs font-semibold tracking-widest uppercase">Para o dono</p>
      <h1 className="mt-2 font-sans text-3xl font-bold tracking-tight">
        Como está sua loja no Google?
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Quatro perguntas. Sem relatório de 20 páginas. No fim, se fizer sentido,
        a gente conversa no WhatsApp.
      </p>
      <div className="mt-8">
        <DiagnosticoForm whatsappComercial={whatsapp} />
      </div>
    </div>
  );
}
