import Link from "next/link";
import { metadataPagina } from "@/lib/seo";

export const metadata = metadataPagina({
  title: "Comércio local de Serra Negra",
  description:
    "Como funciona o comércio de Serra Negra: horário, bairro, temporada e o que a vitrine cobre.",
  path: "/comercio-local",
});

export default function ComercioLocalPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="font-heading text-4xl font-medium tracking-tight">
        Comércio local de Serra Negra
      </h1>
      <div className="mt-6 space-y-4 text-muted-foreground">
        <p>
          O centro vive de rua: malha, couro, presente, farmácia, oficina. Bairro
          importa — Centro, Estância Suíça, Alto da Serra e zona rural não são o
          mesmo passeio.
        </p>
        <p>
          Na temporada, sexta a domingo e feriado, a cidade triplica. Loja que
          fecha cedo durante a semana pode esticar no fim de semana. Por isso o
          horário entra na ficha, e o WhatsApp é o botão principal.
        </p>
        <p>
          CNPJ não é exigência para aparecer aqui. Muita gente é MEI ou trabalha
          no balcão sem site. A ficha nasce com o que é público; o dono completa
          depois.
        </p>
      </div>
      <p className="mt-8 text-sm">
        <Link href="/negocios" className="text-primary underline-offset-4 hover:underline">
          Abrir o guia
        </Link>
      </p>
    </div>
  );
}
