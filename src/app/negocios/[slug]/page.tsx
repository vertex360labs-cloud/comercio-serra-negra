import { notFound } from "next/navigation";
import { NegocioFicha } from "@/components/negocio/NegocioFicha";
import { JsonLd } from "@/components/seo/JsonLd";
import { buscarNegocioPorSlug, negociosPublicados } from "@/lib/negocios";
import { jsonLdNegocio, metadataPagina } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return negociosPublicados().map((negocio) => ({ slug: negocio.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const negocio = await buscarNegocioPorSlug(slug);
  if (!negocio) return {};
  return metadataPagina({
    title: `${negocio.nome} em Serra Negra`,
    description:
      negocio.descricao_seo ??
      negocio.descricao ??
      `${negocio.nome} em Serra Negra/SP.`,
    path: `/negocios/${negocio.slug}`,
  });
}

export default async function NegocioPage({ params }: Props) {
  const { slug } = await params;
  const negocio = await buscarNegocioPorSlug(slug);
  if (!negocio) notFound();

  return (
    <>
      <JsonLd
        data={jsonLdNegocio({
          nome: negocio.nome,
          descricao: negocio.descricao,
          slug: negocio.slug,
          bairro: negocio.bairro,
          logradouro: negocio.logradouro,
          numero: negocio.numero,
          cep: negocio.cep,
          lat: negocio.lat,
          lng: negocio.lng,
          whatsapp: negocio.whatsapp,
          telefone: negocio.telefone,
        })}
      />
      <NegocioFicha negocio={negocio} />
    </>
  );
}
