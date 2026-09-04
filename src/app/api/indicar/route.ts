import { NextResponse } from "next/server";
import { slugify } from "@/lib/slug";
import { supabaseConfigurado } from "@/lib/supabase/env";
import { criarClienteAdmin } from "@/lib/supabase/admin";
import { normalizarWhatsApp } from "@/lib/whatsapp";
import { CIDADE_MVP, UF_MVP } from "@/lib/constantes";

export async function POST(request: Request) {
  const corpo = await request.json().catch(() => null);
  if (!corpo || typeof corpo.nome !== "string") {
    return NextResponse.json({ erro: "Nome obrigatório." }, { status: 400 });
  }

  if (!supabaseConfigurado() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ ok: true, modo: "local" });
  }

  const slugBase = slugify(corpo.nome) || "negocio";
  const id = `neg-${slugBase}-${Date.now().toString(36)}`;
  const whatsapp = corpo.whatsapp ? normalizarWhatsApp(String(corpo.whatsapp)) : null;

  const admin = criarClienteAdmin();
  const { error } = await admin.from("negocios").insert({
    id,
    slug: `${slugBase}-${Date.now().toString(36)}`,
    nome: String(corpo.nome).trim(),
    categoria_id: String(corpo.categoria_id ?? "cat-servicos"),
    cep: String(corpo.cep ?? ""),
    logradouro: String(corpo.logradouro ?? ""),
    numero: corpo.numero ? String(corpo.numero) : null,
    bairro: String(corpo.bairro ?? ""),
    cidade: CIDADE_MVP,
    uf: UF_MVP,
    whatsapp,
    status: "pendente_verificacao",
    fonte_dados: "indicacao",
    plano: "gratis",
  });

  if (error) {
    return NextResponse.json({ erro: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true, id });
}
