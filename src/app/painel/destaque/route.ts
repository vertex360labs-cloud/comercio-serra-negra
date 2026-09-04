import { NextResponse } from "next/server";
import { criarClienteServidor } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/supabase/env";

export async function POST(request: Request) {
  const supabase = await criarClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/entrar", siteUrl()));
  }

  const { data: negocio } = await supabase
    .from("negocios")
    .select("id, whatsapp")
    .eq("dono_id", user.id)
    .maybeSingle();

  await supabase.from("leads_agencia").insert({
    origem: "painel_destaque",
    negocio_id: negocio?.id ?? null,
    mensagem: "Quer destaque na vitrine do fim de semana",
    email: user.email,
    whatsapp: negocio?.whatsapp ?? null,
  });

  const origem = new URL(request.url).origin;
  return NextResponse.redirect(
    `${origem}/painel?aviso=${encodeURIComponent("Recebemos o pedido de destaque. A gente fala com você.")}`,
    { status: 302 },
  );
}
