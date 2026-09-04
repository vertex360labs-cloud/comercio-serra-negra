import Link from "next/link";
import { metadataPagina } from "@/lib/seo";

export const metadata = metadataPagina({
  title: "Pousadas em Serra Negra",
  description:
    "Coloque a pousada na vitrine de Serra Negra: WhatsApp, horário e ficha para o fim de semana.",
  path: "/para-empresas/pousadas",
});

export default function ParaEmpresasPousadasPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="font-heading text-3xl font-medium tracking-tight">
        Pousadas na vitrine
      </h1>
      <p className="mt-4 text-muted-foreground">
        Fim de semana a cidade enche e o visitante pergunta no WhatsApp se tem
        vaga. A ficha pública já aponta o caminho; o dono confirma os dados.
      </p>
      <p className="mt-6 text-sm">
        <Link href="/para-empresas" className="text-primary underline-offset-4 hover:underline">
          Voltar para empresas
        </Link>
      </p>
    </div>
  );
}
