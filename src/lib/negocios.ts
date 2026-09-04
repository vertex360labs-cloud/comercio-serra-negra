import { NEGOCIOS_MOCK } from "@/data/negocios-mock";
import { getCategoriaById, getCategoriaBySlug } from "@/data/categorias";
import { negocioAbertoAgora } from "@/lib/horario";
import { mapearNegocio } from "@/lib/negocios-map";
import { slugify } from "@/lib/slug";
import { supabaseConfigurado } from "@/lib/supabase/env";
import type { Negocio } from "@/types/negocio";

export type FiltrosNegocio = {
  q?: string;
  categoria?: string;
  bairro?: string;
  abertoAgora?: boolean;
  temWhatsapp?: boolean;
};

function mockPublicados(): Negocio[] {
  return NEGOCIOS_MOCK.filter((n) => n.status === "publicado");
}

export async function carregarNegociosPublicados(): Promise<Negocio[]> {
  if (!supabaseConfigurado()) return mockPublicados();

  try {
    const { criarClienteServidor } = await import("@/lib/supabase/server");
    const supabase = await criarClienteServidor();
    const { data, error } = await supabase
      .from("negocios")
      .select("*")
      .in("status", ["publicado", "reivindicado"])
      .order("nome");
    if (error || !data) return mockPublicados();
    return data.map(mapearNegocio);
  } catch {
    return mockPublicados();
  }
}

export function negociosPublicados(): Negocio[] {
  return mockPublicados();
}

export function getNegocioBySlug(slug: string): Negocio | undefined {
  return mockPublicados().find((n) => n.slug === slug);
}

export async function buscarNegocioPorSlug(slug: string): Promise<Negocio | undefined> {
  const lista = await carregarNegociosPublicados();
  return lista.find((n) => n.slug === slug);
}

export function filtrarNegocios(
  filtros: FiltrosNegocio,
  base?: Negocio[],
): Negocio[] {
  const origem = base ?? mockPublicados();
  const termo = filtros.q?.trim().toLowerCase();
  const categoria = filtros.categoria
    ? getCategoriaBySlug(filtros.categoria)
    : undefined;
  const bairroSlug = filtros.bairro ? slugify(filtros.bairro) : undefined;

  return origem.filter((negocio) => {
    if (categoria && negocio.categoria_id !== categoria.id) return false;
    if (bairroSlug && slugify(negocio.bairro) !== bairroSlug) return false;
    if (filtros.temWhatsapp && !negocio.whatsapp) return false;
    if (filtros.abertoAgora && !negocioAbertoAgora(negocio.horarios)) return false;

    if (termo) {
      const categoriaNome = getCategoriaById(negocio.categoria_id)?.nome ?? "";
      const haystack = [
        negocio.nome,
        negocio.nome_fantasia ?? "",
        negocio.descricao ?? "",
        negocio.bairro,
        categoriaNome,
        ...negocio.tags,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(termo)) return false;
    }

    return true;
  });
}

export function negociosDestaque(limite = 12, base?: Negocio[]): Negocio[] {
  return (base ?? mockPublicados())
    .filter((n) => n.plano !== "gratis")
    .slice(0, limite);
}

export function negociosAbertosAgora(base?: Negocio[]): Negocio[] {
  return (base ?? mockPublicados()).filter((n) => negocioAbertoAgora(n.horarios));
}

export function negociosPorCategoria(categoriaId: string, base?: Negocio[]): Negocio[] {
  return (base ?? mockPublicados()).filter((n) => n.categoria_id === categoriaId);
}

export function negociosPorBairro(nomeBairro: string, base?: Negocio[]): Negocio[] {
  const alvo = slugify(nomeBairro);
  return (base ?? mockPublicados()).filter((n) => slugify(n.bairro) === alvo);
}

export function negociosProximos(negocio: Negocio, limite = 3, base?: Negocio[]): Negocio[] {
  return (base ?? mockPublicados())
    .filter((n) => n.id !== negocio.id && n.bairro === negocio.bairro)
    .slice(0, limite);
}

export function negociosComCoordenada(lista?: Negocio[]): Negocio[] {
  return (lista ?? mockPublicados()).filter((n) => n.lat != null && n.lng != null);
}

export function checklistFicha(negocio: Negocio) {
  return [
    { id: "whatsapp", label: "WhatsApp comercial", ok: Boolean(negocio.whatsapp) },
    {
      id: "horario",
      label: "Horário de funcionamento",
      ok: negocio.horarios.some((h) => !h.fechado && h.abre && h.fecha),
    },
    { id: "instagram", label: "Instagram", ok: Boolean(negocio.instagram) },
    {
      id: "foto",
      label: "Foto ou logo",
      ok: Boolean(negocio.capa_url || negocio.logo_url || negocio.fotos.length > 0),
    },
    { id: "descricao", label: "Descrição", ok: Boolean(negocio.descricao) },
  ];
}
