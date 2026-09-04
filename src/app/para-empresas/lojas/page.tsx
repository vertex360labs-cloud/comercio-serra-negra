import Link from "next/link";
import { metadataPagina } from "@/lib/seo";

export const metadata = metadataPagina({
  title: "Lojas em Serra Negra",
  description:
    "Malha, couro e comércio de rua: complete a ficha da loja no Comércio Serra Negra.",
  path: "/para-empresas/lojas",
});

export default function ParaEmpresasLojasPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="font-heading text-3xl font-medium tracking-tight">
        Lojas na vitrine
      </h1>
      <p className="mt-4 text-muted-foreground">
        Quem compra malha no centro quer horário e WhatsApp, não um site
        institucional. A ficha resolve o primeiro passo.
      </p>
      <p className="mt-6 text-sm">
        <Link href="/para-empresas" className="text-primary underline-offset-4 hover:underline">
          Voltar para empresas
        </Link>
      </p>
    </div>
  );
}
