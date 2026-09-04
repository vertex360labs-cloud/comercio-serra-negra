import Link from "next/link";
import { GradeCategorias } from "@/components/home/GradeCategorias";
import { metadataPagina } from "@/lib/seo";

export const metadata = metadataPagina({
  title: "Guia Comercial Serra Negra",
  description:
    "Guia comercial de Serra Negra/SP: lojas de malhas, couro, restaurantes, hotéis e serviços no Circuito das Águas Paulista.",
  path: "/guia-comercial",
});

export default function GuiaComercialPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <p className="text-sm font-medium text-primary">Serra Negra · SP</p>
      <h1 className="mt-2 font-heading text-4xl font-medium tracking-tight">
        Guia comercial Serra Negra
      </h1>
      <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
        <p>
          Serra Negra é cidade de compras, fim de semana e comércio de rua. Este
          guia reúne lojas de malha, couro, artesanato, restaurantes, pousadas e
          serviços — com bairro, horário e WhatsApp quando a gente tem o número.
        </p>
        <p>
          A cidade fica no Circuito das Águas Paulista, perto de Socorro, Amparo,
          Lindóia e Águas de Lindóia. O centro enche sexta a domingo; muita loja
          abre no domingo. Não assuma que fecha.
        </p>
        <p>
          O Comércio Serra Negra não substitui o Visit Serra Negra nem a
          prefeitura. É um catálogo local para achar a loja e chamar no
          WhatsApp.
        </p>
      </div>
      <h2 className="mt-10 font-heading text-2xl font-medium">Por categoria</h2>
      <div className="mt-4">
        <GradeCategorias />
      </div>
      <p className="mt-10 text-sm">
        <Link href="/negocios" className="text-primary underline-offset-4 hover:underline">
          Ver todos os negócios
        </Link>
      </p>
    </div>
  );
}
