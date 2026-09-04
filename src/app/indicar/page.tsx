import { IndicarForm } from "@/components/forms/IndicarForm";
import { metadataPagina } from "@/lib/seo";

export const metadata = metadataPagina({
  title: "Indicar um negócio",
  description:
    "Indique uma loja, hotel ou serviço de Serra Negra para entrar na vitrine.",
  path: "/indicar",
});

export default function IndicarPage() {
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-10">
      <h1 className="font-heading text-3xl font-medium tracking-tight">
        Indicar um negócio
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Nome, categoria, WhatsApp e CEP. A cidade fica travada em Serra Negra.
        CNPJ é opcional.
      </p>
      <div className="mt-8">
        <IndicarForm />
      </div>
    </div>
  );
}
