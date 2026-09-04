import Link from "next/link";
import { Clock, MapPin, Navigation } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MapaResumo } from "@/components/mapa/MapaResumo";
import { NegocioCard } from "@/components/negocio/NegocioCard";
import { WhatsAppButton } from "@/components/negocio/WhatsAppButton";
import { getCategoriaById } from "@/data/categorias";
import { slugBairro } from "@/data/bairros";
import { enderecoComCep, linkComoChegar } from "@/lib/endereco";
import { negocioAbertoAgora, rotuloHorario } from "@/lib/horario";
import {
  carregarNegociosPublicados,
  negociosProximos,
} from "@/lib/negocios";
import { formatarWhatsApp } from "@/lib/whatsapp";
import type { Negocio } from "@/types/negocio";

export async function NegocioFicha({ negocio }: { negocio: Negocio }) {
  const categoria = getCategoriaById(negocio.categoria_id);
  const aberto = negocioAbertoAgora(negocio.horarios);
  const publicados = await carregarNegociosPublicados();
  const proximos = negociosProximos(negocio, 3, publicados);
  const comoChegar = linkComoChegar(negocio);

  return (
    <article className="mx-auto w-full max-w-6xl px-4 py-10">
      <p className="text-sm text-muted-foreground">
        <Link href="/negocios" className="hover:text-foreground">
          Negócios
        </Link>
        {categoria ? (
          <>
            {" · "}
            <Link
              href={`/categorias/${categoria.slug}`}
              className="hover:text-foreground"
            >
              {categoria.nome}
            </Link>
          </>
        ) : null}
      </p>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {aberto ? (
              <Badge className="bg-emerald-700 text-white">Aberto agora</Badge>
            ) : (
              <Badge variant="secondary">Confira o horário</Badge>
            )}
            <Badge variant="outline">{negocio.bairro}</Badge>
          </div>
          <h1 className="mt-3 font-heading text-3xl font-medium tracking-tight md:text-4xl">
            {negocio.nome}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {categoria?.nome} · {negocio.bairro}, Serra Negra/SP
          </p>
          {negocio.descricao ? (
            <p className="mt-5 max-w-2xl text-base leading-relaxed">
              {negocio.descricao}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <WhatsAppButton
              whatsapp={negocio.whatsapp}
              nome={negocio.nome}
              sticky
            />
            {negocio.instagram ? (
              <a
                href={`https://instagram.com/${negocio.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-lg border px-4 text-sm hover:bg-muted"
              >
                Instagram
              </a>
            ) : null}
            {negocio.site_url ? (
              <a
                href={negocio.site_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center rounded-lg border px-4 text-sm hover:bg-muted"
              >
                Site
              </a>
            ) : null}
          </div>
        </div>

        <aside className="space-y-4 rounded-xl bg-card p-5 ring-1 ring-foreground/10">
          <div className="flex gap-2 text-sm">
            <MapPin className="mt-0.5 size-4 shrink-0" />
            <div>
              <p>{enderecoComCep(negocio)}</p>
              {negocio.ponto_referencia ? (
                <p className="text-muted-foreground">
                  {negocio.ponto_referencia}
                </p>
              ) : null}
            </div>
          </div>
          {comoChegar ? (
            <a
              href={comoChegar}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary underline-offset-4 hover:underline"
            >
              <Navigation className="size-4" />
              Como chegar
            </a>
          ) : null}
          {negocio.whatsapp ? (
            <p className="text-sm text-muted-foreground">
              WhatsApp {formatarWhatsApp(negocio.whatsapp)}
            </p>
          ) : null}
          <Link
            href={`/bairros/${slugBairro(negocio.bairro)}`}
            className="block text-sm text-muted-foreground hover:text-foreground"
          >
            Ver mais no bairro {negocio.bairro}
          </Link>
        </aside>
      </div>

      <section className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div>
          <h2 className="flex items-center gap-2 font-heading text-xl font-medium">
            <Clock className="size-4" />
            Horários
          </h2>
          <ul className="mt-4 space-y-1.5 text-sm">
            {negocio.horarios.map((horario) => (
              <li key={horario.dia} className="flex justify-between border-b py-1.5">
                <span>{rotuloHorario(horario)}</span>
              </li>
            ))}
          </ul>
          {negocio.aberto_feriado ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Costuma abrir em feriado — confirme no WhatsApp.
            </p>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              Em feriado, melhor confirmar no WhatsApp.
            </p>
          )}
        </div>
        <MapaResumo
          negocios={[negocio]}
          altura="h-[280px] md:h-[320px]"
          zoom={16}
          centro={
            negocio.lat != null && negocio.lng != null
              ? { lat: negocio.lat, lng: negocio.lng }
              : undefined
          }
        />
      </section>

      {proximos.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-heading text-xl font-medium">Perto daqui</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {proximos.map((item) => (
              <NegocioCard key={item.id} negocio={item} />
            ))}
          </div>
        </section>
      ) : null}

      <p className="mt-12 pb-16 text-xs text-muted-foreground md:pb-0">
        Vitrine mantida como iniciativa local. Achou algum dado errado?{" "}
        <Link href={`/reivindicar/${negocio.slug}`} className="underline">
          Sou o dono
        </Link>
        .
      </p>
    </article>
  );
}
