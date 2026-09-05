import Link from "next/link";
import { notFound } from "next/navigation";
import { ReivindicarForm } from "@/app/reivindicar/[slug]/ReivindicarForm";
import { buscarNegocioPorSlug, negociosPublicados } from "@/lib/negocios";
import { supabaseConfigurado } from "@/lib/supabase/env";
import { metadataPagina } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return negociosPublicados().map((negocio) => ({ slug: negocio.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const negocio = await buscarNegocioPorSlug(slug);
  if (!negocio) return {};
  return metadataPagina({
    title: `Reivindicar ${negocio.nome}`,
    description: `Confirme que você é o dono de ${negocio.nome} em Serra Negra.`,
    path: `/reivindicar/${negocio.slug}`,
  });
}

export default async function ReivindicarPage({ params }: Props) {
  const { slug } = await params;
  const negocio = await buscarNegocioPorSlug(slug);
  if (!negocio) notFound();

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-10">
      <p className="text-xs font-semibold tracking-widest uppercase">Lojista</p>
      <h1 className="mt-2 font-sans text-3xl font-bold tracking-tight">
        Sou o dono de {negocio.nome}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Informe CNPJ, WhatsApp do dono e confirme o endereço. Depois do e-mail,
        a gente analisa e libera a ficha — para ninguém se passar por você.
      </p>
      <div className="mt-8">
        {supabaseConfigurado() ? (
          <ReivindicarForm
            negocioId={negocio.id}
            negocioNome={negocio.nome}
            enderecoResumo={`${negocio.logradouro}, ${negocio.numero ?? "s/n"} — ${negocio.bairro}, Serra Negra/SP`}
          />
        ) : (
          <p className="rounded-xl bg-card p-4 text-sm shadow-sm">
            O painel entra quando o Supabase estiver no ar. Enquanto isso, a
            ficha pública continua visível.
          </p>
        )}
      </div>
      <p className="mt-6 text-sm">
        <Link
          href={`/negocios/${negocio.slug}`}
          className="font-semibold underline-offset-4 hover:underline"
        >
          Voltar para a ficha
        </Link>
      </p>
    </div>
  );
}
