import { NextResponse } from "next/server";
import { usuarioAdmin } from "@/lib/admin";
import { emailAprovacaoLojista, enviarEmail } from "@/lib/email";
import { siteUrl } from "@/lib/supabase/env";
import { criarClienteAdmin } from "@/lib/supabase/admin";

export async function PATCH(request: Request) {
  const user = await usuarioAdmin();
  if (!user) {
    return NextResponse.json({ erro: "Sem permissão de admin." }, { status: 403 });
  }

  const corpo = (await request.json()) as {
    id?: string;
    acao?: "aprovar" | "recusar";
    nota?: string;
  };
  if (!corpo.id || !corpo.acao) {
    return NextResponse.json({ erro: "id e acao obrigatórios." }, { status: 400 });
  }

  const admin = criarClienteAdmin();
  const { data: rec, error: recErro } = await admin
    .from("reivindicacoes")
    .select("*, negocios(nome, slug)")
    .eq("id", corpo.id)
    .maybeSingle();
  if (recErro || !rec) {
    return NextResponse.json({ erro: recErro?.message || "Não encontrada." }, { status: 404 });
  }

  if (corpo.acao === "recusar") {
    const { error } = await admin
      .from("reivindicacoes")
      .update({
        status: "recusada",
        nota_admin: corpo.nota ?? null,
        revisado_em: new Date().toISOString(),
        revisado_por: user.id,
      })
      .eq("id", corpo.id)
      .eq("status", "pendente");
    if (error) return NextResponse.json({ erro: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  }

  // aprovar
  if (rec.status !== "pendente") {
    return NextResponse.json({ erro: "Já resolvida." }, { status: 400 });
  }
  if (!rec.user_id) {
    return NextResponse.json(
      { erro: "Lojista ainda não confirmou o e-mail (magic link)." },
      { status: 400 },
    );
  }
  if (!rec.localizacao_confirmada) {
    return NextResponse.json({ erro: "Localização não confirmada." }, { status: 400 });
  }
  if (!rec.cnpj || String(rec.cnpj).replace(/\D/g, "").length !== 14) {
    return NextResponse.json({ erro: "CNPJ inválido." }, { status: 400 });
  }
  if (!rec.whatsapp_proprietario) {
    return NextResponse.json({ erro: "WhatsApp do proprietário ausente." }, { status: 400 });
  }

  const { data: negocioAtual } = await admin
    .from("negocios")
    .select("dono_id")
    .eq("id", rec.negocio_id)
    .maybeSingle();
  if (negocioAtual?.dono_id && negocioAtual.dono_id !== rec.user_id) {
    return NextResponse.json(
      { erro: "Esta ficha já tem outro dono. Recuse ou resolva manualmente." },
      { status: 400 },
    );
  }

  const { error: negErro } = await admin
    .from("negocios")
    .update({
      dono_id: rec.user_id,
      reivindicado_em: new Date().toISOString(),
      fonte_dados: "dono",
      status: "reivindicado",
      whatsapp: rec.whatsapp_proprietario,
      cnpj: rec.cnpj,
    })
    .eq("id", rec.negocio_id);
  if (negErro) return NextResponse.json({ erro: negErro.message }, { status: 400 });

  const { error: upErro } = await admin
    .from("reivindicacoes")
    .update({
      status: "aprovada",
      revisado_em: new Date().toISOString(),
      revisado_por: user.id,
    })
    .eq("id", corpo.id);
  if (upErro) return NextResponse.json({ erro: upErro.message }, { status: 400 });

  const negocio = Array.isArray(rec.negocios) ? rec.negocios[0] : rec.negocios;
  const nomeNegocio = negocio?.nome ?? "sua loja";
  const baseUrl = siteUrl();
  const msg = emailAprovacaoLojista({
    nome: rec.nome || "lojista",
    negocioNome: nomeNegocio,
    painelUrl: `${baseUrl}/painel`,
    paraEmpresasUrl: `${baseUrl}/para-empresas`,
  });
  msg.to = rec.email;
  const envio = await enviarEmail(msg);

  return NextResponse.json({
    ok: true,
    email: envio.ok
      ? "enviado"
      : envio.skipped
        ? "pulado"
        : `falhou: ${envio.erro}`,
  });
}
