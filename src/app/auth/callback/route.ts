import { NextResponse } from "next/server";
import { promoverAdminSePreciso } from "@/lib/admin";
import { criarClienteServidor } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/supabase/env";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/painel";
  const reivindicar = searchParams.get("reivindicar");
  const origem = new URL(request.url).origin || siteUrl();

  if (!code) {
    return NextResponse.redirect(`${origem}/entrar?erro=codigo`);
  }

  const supabase = await criarClienteServidor();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${origem}/entrar?erro=sessao`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) await promoverAdminSePreciso(user);

  if (reivindicar) {
    const { error: rpcErro } = await supabase.rpc("aprovar_reivindicacao", {
      p_id: reivindicar,
    });
    if (rpcErro) {
      return NextResponse.redirect(
        `${origem}/painel?aviso=${encodeURIComponent(rpcErro.message)}`,
      );
    }
  }

  return NextResponse.redirect(`${origem}${next.startsWith("/") ? next : "/painel"}`);
}
