import Link from "next/link";
import { GradeCategorias } from "@/components/home/GradeCategorias";
import { FaixaDono } from "@/components/home/FaixaDono";
import { Videowall } from "@/components/home/Videowall";
import { MapaResumo } from "@/components/mapa/MapaResumo";
import { NegocioCard } from "@/components/negocio/NegocioCard";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  carregarNegociosPublicados,
  negociosAbertosAgora,
  negociosComCoordenada,
  negociosDestaque,
} from "@/lib/negocios";
import { jsonLdHome, metadataPagina } from "@/lib/seo";

export const metadata = metadataPagina({
  description:
    "Encontre lojas de malha, couro, restaurantes, pousadas e serviços em Serra Negra/SP. Guia comercial local com WhatsApp e mapa.",
});

export default async function Home() {
  const publicados = await carregarNegociosPublicados();
  const destaques = negociosDestaque(8, publicados);
  const abertos = negociosAbertosAgora(publicados).slice(0, 6);
  const noMapa = negociosComCoordenada(publicados);

  return (
    <>
      <JsonLd data={jsonLdHome()} />
      <Videowall />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:gap-10 md:py-10">
        <section className="rounded-2xl bg-card p-5 shadow-sm md:p-6">
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2 className="font-sans text-2xl font-bold">Categorias</h2>
            <Link
              href="/categorias"
              className="text-sm font-semibold text-foreground underline-offset-4 hover:underline"
            >
              Mostrar todas
            </Link>
          </div>
          <GradeCategorias />
        </section>

        <section>
          <div className="mb-5">
            <h2 className="font-sans text-2xl font-bold">Abertos agora</h2>
            <p className="text-sm text-muted-foreground">
              Horário de Serra Negra, não de shopping da capital.
            </p>
          </div>
          {abertos.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {abertos.map((negocio) => (
                <NegocioCard key={negocio.id} negocio={negocio} />
              ))}
            </div>
          ) : (
            <p className="rounded-2xl bg-card px-4 py-6 text-sm shadow-sm">
              Neste horário a vitrine está quieta. De manhã o centro volta a
              abrir — inclusive no domingo.
            </p>
          )}
        </section>

        <section className="rounded-2xl bg-card p-5 shadow-sm md:p-6">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-sans text-2xl font-bold">Mapa do centro</h2>
              <p className="text-sm text-muted-foreground">
                Pins das fichas publicadas. Mapa livre, sem ficha paga de mapa.
              </p>
            </div>
            <Link
              href="/negocios"
              className="text-sm font-semibold underline-offset-4 hover:underline"
            >
              Abrir listagem
            </Link>
          </div>
          <MapaResumo negocios={noMapa} />
        </section>

        <section>
          <div className="mb-5">
            <h2 className="font-sans text-2xl font-bold">Destaques da vitrine</h2>
            <p className="text-sm text-muted-foreground">
              Lojas e pousadas em evidência no fim de semana.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {destaques.map((negocio) => (
              <NegocioCard key={negocio.id} negocio={negocio} />
            ))}
          </div>
        </section>

        <FaixaDono />
      </div>
    </>
  );
}
