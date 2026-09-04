"use client";

import { useRouter } from "next/navigation";
import { CATEGORIAS } from "@/data/categorias";
import { BAIRROS } from "@/data/bairros";
import { Button } from "@/components/ui/button";

type Props = {
  q?: string;
  categoria?: string;
  bairro?: string;
  abertoAgora?: boolean;
  temWhatsapp?: boolean;
};

function montarQuery(filtros: Props): string {
  const params = new URLSearchParams();
  if (filtros.q) params.set("q", filtros.q);
  if (filtros.categoria) params.set("categoria", filtros.categoria);
  if (filtros.bairro) params.set("bairro", filtros.bairro);
  if (filtros.abertoAgora) params.set("aberto", "1");
  if (filtros.temWhatsapp) params.set("whatsapp", "1");
  const qs = params.toString();
  return qs ? `/negocios?${qs}` : "/negocios";
}

export function Filtros({ q, categoria, bairro, abertoAgora, temWhatsapp }: Props) {
  const router = useRouter();

  function ir(proximo: Props) {
    router.push(montarQuery(proximo));
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {CATEGORIAS.map((item) => {
          const ativo = categoria === item.slug;
          return (
            <Button
              key={item.slug}
              type="button"
              size="sm"
              variant={ativo ? "default" : "outline"}
              onClick={() =>
                ir({
                  q,
                  bairro,
                  abertoAgora,
                  temWhatsapp,
                  categoria: ativo ? undefined : item.slug,
                })
              }
            >
              {item.nome}
            </Button>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-2">
        {BAIRROS.map((item) => {
          const ativo = bairro === item.slug;
          return (
            <Button
              key={item.slug}
              type="button"
              size="sm"
              variant={ativo ? "secondary" : "ghost"}
              onClick={() =>
                ir({
                  q,
                  categoria,
                  abertoAgora,
                  temWhatsapp,
                  bairro: ativo ? undefined : item.slug,
                })
              }
            >
              {item.nome}
            </Button>
          );
        })}
        <Button
          type="button"
          size="sm"
          variant={abertoAgora ? "default" : "outline"}
          onClick={() =>
            ir({ q, categoria, bairro, temWhatsapp, abertoAgora: !abertoAgora })
          }
        >
          Aberto agora
        </Button>
        <Button
          type="button"
          size="sm"
          variant={temWhatsapp ? "default" : "outline"}
          onClick={() =>
            ir({ q, categoria, bairro, abertoAgora, temWhatsapp: !temWhatsapp })
          }
        >
          Tem WhatsApp
        </Button>
      </div>
    </div>
  );
}
