import { BarraBusca } from "@/components/busca/BarraBusca";
import { Filtros } from "@/components/busca/Filtros";
import { MapaResumo } from "@/components/mapa/MapaResumo";
import { NegocioCard } from "@/components/negocio/NegocioCard";
import {
  carregarNegociosPublicados,
  filtrarNegocios,
  negociosComCoordenada,
} from "@/lib/negocios";
import { metadataPagina } from "@/lib/seo";

export const metadata = metadataPagina({
  title: "Negócios em Serra Negra",
  description:
    "Listagem do guia comercial de Serra Negra/SP com filtro por categoria, bairro, aberto agora e WhatsApp.",
  path: "/negocios",
});

type Props = {
  searchParams: Promise<{
    q?: string;
    categoria?: string;
    bairro?: string;
    aberto?: string;
    whatsapp?: string;
  }>;
};

export default async function NegociosPage({ searchParams }: Props) {
  const params = await searchParams;
  const filtros = {
    q: params.q,
    categoria: params.categoria,
    bairro: params.bairro,
    abertoAgora: params.aberto === "1",
    temWhatsapp: params.whatsapp === "1",
  };
  const publicados = await carregarNegociosPublicados();
  const lista = filtrarNegocios(filtros, publicados);
  const noMapa = negociosComCoordenada(lista);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <h1 className="font-heading text-3xl font-medium tracking-tight">
        Negócios em Serra Negra
      </h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Filtre por categoria, bairro, quem está aberto agora e quem tem
        WhatsApp. Os dados ainda são de vitrine — confirme na ficha.
      </p>

      <div className="mt-6 max-w-xl">
        <BarraBusca valorInicial={params.q} />
      </div>
      <div className="mt-4">
        <Filtros {...filtros} />
      </div>

      <div className="mt-8">
        <MapaResumo negocios={noMapa} altura="h-[280px] md:h-[360px]" />
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        {lista.length === 1 ? "1 negócio" : `${lista.length} negócios`}
      </p>
      {lista.length === 0 ? (
        <p className="mt-4 rounded-xl bg-muted px-4 py-6 text-sm">
          Nada com esse filtro. Tente outra categoria ou limpe a busca.
        </p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((negocio) => (
            <NegocioCard key={negocio.id} negocio={negocio} />
          ))}
        </div>
      )}
    </div>
  );
}
