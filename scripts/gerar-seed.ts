import { writeFileSync } from "node:fs";
import { CATEGORIAS } from "../src/data/categorias";
import { NEGOCIOS_MOCK } from "../src/data/negocios-mock";

function sqlStr(value: string | null | undefined): string {
  if (value === null || value === undefined) return "null";
  return `'${value.replace(/'/g, "''")}'`;
}

function sqlArr(arr: string[]): string {
  if (arr.length === 0) return `'{}'::text[]`;
  return `ARRAY[${arr.map(sqlStr).join(", ")}]::text[]`;
}

const catSql = CATEGORIAS.map(
  (c) =>
    `  (${sqlStr(c.id)}, ${sqlStr(c.slug)}, ${sqlStr(c.nome)}, ${sqlStr(c.descricao)}, ${sqlStr(c.icone)}, ${c.ordem})`,
).join(",\n");

const negSql = NEGOCIOS_MOCK.map((n) => {
  const cols = [
    sqlStr(n.id),
    sqlStr(n.slug),
    sqlStr(n.nome),
    sqlStr(n.nome_fantasia),
    sqlStr(n.descricao),
    sqlStr(n.descricao_seo),
    sqlStr(n.categoria_id),
    sqlArr(n.tags),
    sqlStr(n.cep),
    sqlStr(n.logradouro),
    sqlStr(n.numero),
    sqlStr(n.complemento),
    sqlStr(n.bairro),
    sqlStr(n.cidade),
    sqlStr(n.uf),
    sqlStr(n.ponto_referencia),
    n.lat ?? "null",
    n.lng ?? "null",
    sqlStr(n.whatsapp),
    sqlStr(n.telefone),
    sqlStr(n.instagram),
    sqlStr(n.site_url),
    sqlStr(n.email),
    sqlStr(n.cnpj),
    `'${JSON.stringify(n.horarios).replace(/'/g, "''")}'::jsonb`,
    n.aberto_feriado === null ? "null" : n.aberto_feriado ? "true" : "false",
    sqlArr(n.fotos),
    sqlStr(n.logo_url),
    sqlStr(n.capa_url),
    sqlStr(n.plano),
    sqlStr(n.status),
    sqlStr(n.fonte_dados),
    n.aceita_whatsapp_comercial ? "true" : "false",
  ];
  return `  (${cols.join(", ")})`;
}).join(",\n");

const sql = `-- Seed Serra Negra (gerado de src/data)
insert into public.categorias (id, slug, nome, descricao, icone, ordem) values
${catSql};

insert into public.negocios (
  id, slug, nome, nome_fantasia, descricao, descricao_seo, categoria_id, tags,
  cep, logradouro, numero, complemento, bairro, cidade, uf, ponto_referencia,
  lat, lng, whatsapp, telefone, instagram, site_url, email, cnpj, horarios,
  aberto_feriado, fotos, logo_url, capa_url, plano, status, fonte_dados,
  aceita_whatsapp_comercial
) values
${negSql};
`;

writeFileSync("supabase/seed.sql", sql);
console.log(`seed.sql: ${CATEGORIAS.length} categorias, ${NEGOCIOS_MOCK.length} negócios`);
