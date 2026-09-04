import { NextResponse } from "next/server";
import { supabaseConfigurado } from "@/lib/supabase/env";
import { criarClienteAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const corpo = (await request.json().catch(() => null)) as {
    nome?: string;
    faltas?: string[];
  } | null;
  if (!corpo?.nome) {
    return NextResponse.json({ erro: "Nome obrigatório." }, { status: 400 });
  }

  if (supabaseConfigurado() && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const admin = criarClienteAdmin();
    await admin.from("leads_agencia").insert({
      origem: "diagnostico",
      mensagem: `${corpo.nome}: ${(corpo.faltas ?? []).join(" | ") || "checklist ok"}`,
    });
  }

  return NextResponse.json({ ok: true });
}
