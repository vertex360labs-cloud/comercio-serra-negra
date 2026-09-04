export type Uf = "SP"; // v1 só SP

export type PlanoNegocio = "gratis" | "destaque" | "vitrine_plus";

export type StatusNegocio =
  | "rascunho"
  | "publicado"
  | "pendente_verificacao"
  | "reivindicado"
  | "oculto";

export interface Categoria {
  id: string;
  slug: string;
  nome: string;
  descricao: string;
  icone: string;
  ordem: number;
}

export interface HorarioFuncionamento {
  dia: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = domingo
  abre: string | null; // "09:00"
  fecha: string | null; // "18:00"
  fechado: boolean;
}

export interface Negocio {
  id: string;
  slug: string;
  nome: string;
  nome_fantasia: string | null;
  descricao: string | null;
  descricao_seo: string | null;

  categoria_id: string;
  tags: string[];

  cep: string; // 13930000 ou 13930-000
  logradouro: string;
  numero: string | null;
  complemento: string | null;
  bairro: string;
  cidade: string; // "Serra Negra"
  uf: Uf;
  ponto_referencia: string | null;

  lat: number | null;
  lng: number | null;

  whatsapp: string | null; // só dígitos com DDI 55
  telefone: string | null;
  instagram: string | null;
  site_url: string | null;
  email: string | null;

  cnpj: string | null;

  horarios: HorarioFuncionamento[];
  aberto_feriado: boolean | null;

  fotos: string[];
  logo_url: string | null;
  capa_url: string | null;

  plano: PlanoNegocio;
  status: StatusNegocio;
  fonte_dados: "manual" | "import_csv" | "google" | "dono" | "indicacao";
  reivindicado_em: string | null;
  verificado_em: string | null;

  aceita_whatsapp_comercial: boolean;
  dono_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Bairro {
  slug: string;
  nome: string;
  descricao: string;
}

export interface EnderecoViaCep {
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: Uf;
  lat: number | null;
  lng: number | null;
}
