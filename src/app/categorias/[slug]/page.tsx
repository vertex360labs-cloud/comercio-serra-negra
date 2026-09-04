import { notFound } from "next/navigation";
import { MapaResumo } from "@/components/mapa/MapaResumo";
import { NegocioCard } from "@/components/negocio/NegocioCard";
import { CATEGORIAS, getCategoriaBySlug } from "@/data/categorias";
import {
  carregarNegociosPublicados,
  negociosComCoordenada,
  negociosPorCategoria,
} from "@/lib/negocios";
import { metadataPagina } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CATEGORIAS.map((categoria) => ({ slug: categoria.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const categoria = getCategoriaBySlug(slug);
  if (!categoria) return {};
  return metadataPagina({
    title: `${categoria.nome} em Serra Negra`,
    description: `${categoria.descricao} Guia comercial de Serra Negra/SP.`,
    path: `/categorias/${categoria.slug}`,
  });
}

export default async function CategoriaPage({ params }: Props) {
  const { slug } = await params;
  const categoria = getCategoriaBySlug(slug);
  if (!categoria) notFound();

  const publicados = await carregarNegociosPublicados();
  const lista = negociosPorCategoria(categoria.id, publicados);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <p className="text-sm text-muted-foreground">Guia comercial Serra Negra</p>
      <h1 className="mt-2 font-heading text-3xl font-medium tracking-tight">
        {categoria.nome} em Serra Negra
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{categoria.descricao}</p>

      <div className="mt-8">
        <MapaResumo negocios={negociosComCoordenada(lista)} altura="h-[260px] md:h-[340px]" />
      </div>

      {lista.length === 0 ? (
        <p className="mt-8 rounded-xl bg-muted px-4 py-6 text-sm">
          Ainda não publicamos fichas nesta categoria. Indique um negócio se
          você conhece.
        </p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((negocio) => (
            <NegocioCard key={negocio.id} negocio={negocio} />
          ))}
        </div>
      )}
    </div>
  );
}
