import { NextResponse } from "next/server";
import { usuarioAdmin } from "@/lib/admin";
import { criarClienteAdmin } from "@/lib/supabase/admin";
import { slugify } from "@/lib/slug";

export async function PATCH(request: Request) {
  const user = await usuarioAdmin();
  if (!user) {
    return NextResponse.json({ erro: "Sem permissão de admin." }, { status: 403 });
  }

  const corpo = (await request.json()) as {
    id?: string;
    status?: string;
    plano?: string;
    regenerar_slug?: boolean;
    nome?: string;
  };
  if (!corpo.id) {
    return NextResponse.json({ erro: "id obrigatório." }, { status: 400 });
  }

  const patch: Record<string, unknown> = {};
  if (corpo.status) patch.status = corpo.status;
  if (corpo.plano) patch.plano = corpo.plano;
  if (corpo.regenerar_slug && corpo.nome) {
    patch.slug = `${slugify(corpo.nome)}-${corpo.id.slice(-4)}`;
  }

  const admin = criarClienteAdmin();
  const { error } = await admin.from("negocios").update(patch).eq("id", corpo.id);
  if (error) {
    return NextResponse.json({ erro: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
