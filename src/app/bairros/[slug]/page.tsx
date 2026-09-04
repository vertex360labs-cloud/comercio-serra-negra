import { notFound } from "next/navigation";
import { MapaResumo } from "@/components/mapa/MapaResumo";
import { NegocioCard } from "@/components/negocio/NegocioCard";
import { BAIRROS, getBairroBySlug } from "@/data/bairros";
import {
  carregarNegociosPublicados,
  negociosComCoordenada,
  negociosPorBairro,
} from "@/lib/negocios";
import { metadataPagina } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BAIRROS.map((bairro) => ({ slug: bairro.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const bairro = getBairroBySlug(slug);
  if (!bairro) return {};
  return metadataPagina({
    title: `${bairro.nome} · Serra Negra`,
    description: `${bairro.descricao} Guia comercial de Serra Negra/SP.`,
    path: `/bairros/${bairro.slug}`,
  });
}

export default async function BairroPage({ params }: Props) {
  const { slug } = await params;
  const bairro = getBairroBySlug(slug);
  if (!bairro) notFound();

  const publicados = await carregarNegociosPublicados();
  const lista = negociosPorBairro(bairro.nome, publicados);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <p className="text-sm text-muted-foreground">Bairros de Serra Negra</p>
      <h1 className="mt-2 font-heading text-3xl font-medium tracking-tight">
        {bairro.nome}
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{bairro.descricao}</p>
      <div className="mt-8">
        <MapaResumo negocios={negociosComCoordenada(lista)} altura="h-[260px] md:h-[340px]" />
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((negocio) => (
          <NegocioCard key={negocio.id} negocio={negocio} />
        ))}
      </div>
    </div>
  );
}
