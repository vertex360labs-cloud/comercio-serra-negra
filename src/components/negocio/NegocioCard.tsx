import Link from "next/link";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CategoriaIcone } from "@/components/negocio/CategoriaIcone";
import { WhatsAppButton } from "@/components/negocio/WhatsAppButton";
import { getCategoriaById } from "@/data/categorias";
import { negocioAbertoAgora } from "@/lib/horario";
import { cn } from "@/lib/utils";
import type { Negocio } from "@/types/negocio";

const PLANO_ROTULO: Record<Negocio["plano"], string | null> = {
  gratis: null,
  destaque: "Destaque",
  vitrine_plus: "Vitrine",
};

export function NegocioCard({ negocio }: { negocio: Negocio }) {
  const categoria = getCategoriaById(negocio.categoria_id);
  const aberto = negocioAbertoAgora(negocio.horarios);
  const plano = PLANO_ROTULO[negocio.plano];

  return (
    <Card className="card-lift h-full gap-0 py-0 ring-0 shadow-sm">
      <Link href={`/negocios/${negocio.slug}`} className="block">
        <div className="relative flex h-28 items-end overflow-hidden bg-foreground px-4 py-3 text-white">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1 bg-primary"
          />
          <div className="absolute -right-8 -top-10 size-28 rounded-full bg-primary/20" />
          <div className="relative flex items-center gap-2">
            {categoria ? (
              <span className="flex size-9 items-center justify-center rounded-full bg-primary text-foreground">
                <CategoriaIcone nome={categoria.icone} className="size-4" />
              </span>
            ) : null}
            <span className="text-xs font-semibold tracking-wide uppercase">
              {categoria?.nome ?? "Negócio"}
            </span>
          </div>
        </div>
        <CardContent className="space-y-2 pt-4">
          <div className="flex flex-wrap gap-1.5">
            {aberto ? (
              <Badge className="bg-primary text-foreground">Aberto agora</Badge>
            ) : (
              <Badge variant="secondary">Horário no perfil</Badge>
            )}
            {plano ? (
              <Badge variant="outline" className="border-foreground/20">
                {plano}
              </Badge>
            ) : null}
          </div>
          <h3 className="font-sans text-lg leading-snug font-bold">
            {negocio.nome}
          </h3>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" />
            {negocio.bairro}, Serra Negra/SP
          </p>
          {negocio.descricao ? (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {negocio.descricao}
            </p>
          ) : null}
        </CardContent>
      </Link>
      <CardFooter
        className={cn("mt-auto justify-between gap-2 border-t-0 bg-transparent")}
      >
        <Link
          href={`/negocios/${negocio.slug}`}
          className="text-sm font-semibold underline-offset-4 hover:underline"
        >
          Ver ficha
        </Link>
        <WhatsAppButton
          whatsapp={negocio.whatsapp}
          nome={negocio.nome}
          className="h-8 px-3 text-xs"
        />
      </CardFooter>
    </Card>
  );
}
