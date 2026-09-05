import { loadEnvConfig } from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { CATEGORIAS } from "../src/data/categorias";
import { NEGOCIOS_MOCK } from "../src/data/negocios-mock";

async function main() {
  loadEnvConfig(process.cwd());
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Faltam SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY");

  const sb = createClient(url, key, { auth: { persistSession: false } });

  const { error: e1 } = await sb.from("categorias").upsert(CATEGORIAS);
  if (e1) throw e1;

  const rows = NEGOCIOS_MOCK.map((n) => ({
    id: n.id,
    slug: n.slug,
    nome: n.nome,
    nome_fantasia: n.nome_fantasia,
    descricao: n.descricao,
    descricao_seo: n.descricao_seo,
    categoria_id: n.categoria_id,
    tags: n.tags,
    cep: n.cep,
    logradouro: n.logradouro,
    numero: n.numero,
    complemento: n.complemento,
    bairro: n.bairro,
    cidade: n.cidade,
    uf: n.uf,
    ponto_referencia: n.ponto_referencia,
    lat: n.lat,
    lng: n.lng,
    whatsapp: n.whatsapp,
    telefone: n.telefone,
    instagram: n.instagram,
    site_url: n.site_url,
    email: n.email,
    cnpj: n.cnpj,
    horarios: n.horarios,
    aberto_feriado: n.aberto_feriado,
    fotos: n.fotos,
    logo_url: n.logo_url,
    capa_url: n.capa_url,
    plano: n.plano,
    status: n.status,
    fonte_dados: n.fonte_dados,
    aceita_whatsapp_comercial: n.aceita_whatsapp_comercial,
  }));

  const { error: e2 } = await sb.from("negocios").upsert(rows);
  if (e2) throw e2;

  const { count: c1 } = await sb.from("categorias").select("*", { count: "exact", head: true });
  const { count: c2 } = await sb.from("negocios").select("*", { count: "exact", head: true });
  console.log(`seed_ok categorias=${c1} negocios=${c2}`);
}

main().catch((erro) => {
  console.error(erro);
  process.exit(1);
});
