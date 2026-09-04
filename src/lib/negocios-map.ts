import type { HorarioFuncionamento, Negocio, PlanoNegocio, StatusNegocio, Uf } from "@/types/negocio";

export type NegocioLinha = Record<string, unknown>;

function horariosDe(valor: unknown): HorarioFuncionamento[] {
  if (!Array.isArray(valor)) return [];
  return valor as HorarioFuncionamento[];
}

export function mapearNegocio(linha: NegocioLinha): Negocio {
  return {
    id: String(linha.id),
    slug: String(linha.slug),
    nome: String(linha.nome),
    nome_fantasia: (linha.nome_fantasia as string | null) ?? null,
    descricao: (linha.descricao as string | null) ?? null,
    descricao_seo: (linha.descricao_seo as string | null) ?? null,
    categoria_id: String(linha.categoria_id),
    tags: Array.isArray(linha.tags) ? (linha.tags as string[]) : [],
    cep: String(linha.cep ?? ""),
    logradouro: String(linha.logradouro ?? ""),
    numero: (linha.numero as string | null) ?? null,
    complemento: (linha.complemento as string | null) ?? null,
    bairro: String(linha.bairro ?? ""),
    cidade: String(linha.cidade ?? "Serra Negra"),
    uf: (linha.uf as Uf) ?? "SP",
    ponto_referencia: (linha.ponto_referencia as string | null) ?? null,
    lat: (linha.lat as number | null) ?? null,
    lng: (linha.lng as number | null) ?? null,
    whatsapp: (linha.whatsapp as string | null) ?? null,
    telefone: (linha.telefone as string | null) ?? null,
    instagram: (linha.instagram as string | null) ?? null,
    site_url: (linha.site_url as string | null) ?? null,
    email: (linha.email as string | null) ?? null,
    cnpj: (linha.cnpj as string | null) ?? null,
    horarios: horariosDe(linha.horarios),
    aberto_feriado: (linha.aberto_feriado as boolean | null) ?? null,
    fotos: Array.isArray(linha.fotos) ? (linha.fotos as string[]) : [],
    logo_url: (linha.logo_url as string | null) ?? null,
    capa_url: (linha.capa_url as string | null) ?? null,
    plano: (linha.plano as PlanoNegocio) ?? "gratis",
    status: (linha.status as StatusNegocio) ?? "rascunho",
    fonte_dados: (linha.fonte_dados as Negocio["fonte_dados"]) ?? "manual",
    reivindicado_em: (linha.reivindicado_em as string | null) ?? null,
    verificado_em: (linha.verificado_em as string | null) ?? null,
    aceita_whatsapp_comercial: Boolean(linha.aceita_whatsapp_comercial ?? true),
    dono_id: (linha.dono_id as string | null) ?? null,
    created_at: String(linha.created_at ?? ""),
    updated_at: String(linha.updated_at ?? ""),
  };
}
