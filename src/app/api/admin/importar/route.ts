import { NextResponse } from "next/server";
import { usuarioAdmin } from "@/lib/admin";
import { parseCsvNegocios } from "@/lib/csv";
import { consultarCep } from "@/lib/brasilapi";
import { slugify } from "@/lib/slug";
import { CIDADE_MVP, UF_MVP } from "@/lib/constantes";
import { criarClienteAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const user = await usuarioAdmin();
  if (!user) {
    return NextResponse.json({ erro: "Sem permissão de admin." }, { status: 403 });
  }

  const texto = await request.text();
  const { linhas, erros } = parseCsvNegocios(texto);
  if (linhas.length === 0) {
    return NextResponse.json({ erro: erros[0] ?? "Nada para importar.", erros }, { status: 400 });
  }

  const admin = criarClienteAdmin();
  const inseridos: string[] = [];
  const falhas = [...erros];

  for (const linha of linhas) {
    const slugBase = slugify(linha.nome) || "negocio";
    const sufixo = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const id = `neg-${slugBase}-${sufixo}`;
    const slug = `${slugBase}-${sufixo.slice(-4)}`;

    let lat: number | null = null;
    let lng: number | null = null;
    let logradouro = linha.logradouro;
    let bairro = linha.bairro;
    if (linha.cep.replace(/\D/g, "").length === 8) {
      try {
        const end = await consultarCep(linha.cep);
        lat = end.lat;
        lng = end.lng;
        if (!logradouro) logradouro = end.logradouro;
        if (!bairro) bairro = end.bairro;
      } catch {
        // CEP opcional no lote
      }
    }

    const { error } = await admin.from("negocios").insert({
      id,
      slug,
      nome: linha.nome,
      categoria_id: linha.categoria_id,
      whatsapp: linha.whatsapp,
      cep: linha.cep,
      logradouro,
      numero: linha.numero,
      bairro,
      cidade: CIDADE_MVP,
      uf: UF_MVP,
      lat,
      lng,
      status: "publicado",
      fonte_dados: "import_csv",
      plano: "gratis",
    });

    if (error) falhas.push(`${linha.nome}: ${error.message}`);
    else inseridos.push(linha.nome);
  }

  return NextResponse.json({
    ok: true,
    inseridos: inseridos.length,
    nomes: inseridos,
    falhas,
  });
}
