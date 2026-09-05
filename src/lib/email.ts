export type EmailMessage = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export function emailAprovacaoLojista(opts: {
  nome: string;
  negocioNome: string;
  painelUrl: string;
  paraEmpresasUrl: string;
}): EmailMessage {
  const { nome, negocioNome, painelUrl, paraEmpresasUrl } = opts;
  const subject = `Ficha aprovada — ${negocioNome} · Comércio Serra Negra`;
  const text = [
    `Olá, ${nome}!`,
    "",
    `Sua reivindicação de ${negocioNome} foi aprovada. Você já pode completar a ficha no painel:`,
    painelUrl,
    "",
    "Aproveite para conhecer nossos serviços para o comércio local:",
    "- Site Express (sua loja no ar rápido)",
    "- Agentes de automação para negócios locais (WhatsApp, agenda, follow-up)",
    "",
    `Saiba mais: ${paraEmpresasUrl}`,
    "",
    "Comércio Serra Negra · Vertex 360",
  ].join("\n");

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<body style="margin:0;padding:0;background:#f6f1ea;font-family:Georgia,serif;color:#1c1917">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f1ea;padding:24px 12px">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:560px;background:#fff;border-radius:16px;padding:28px 24px">
        <tr><td>
          <p style="margin:0 0 8px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#a16207">Comércio Serra Negra</p>
          <h1 style="margin:0 0 16px;font-size:24px;line-height:1.25">Olá, ${escapeHtml(nome)} — sua ficha foi aprovada</h1>
          <p style="margin:0 0 16px;font-size:16px;line-height:1.5;color:#44403c">
            A reivindicação de <strong>${escapeHtml(negocioNome)}</strong> está liberada.
            Complete WhatsApp, horário e foto no painel.
          </p>
          <p style="margin:0 0 24px">
            <a href="${painelUrl}" style="display:inline-block;background:#ca8a04;color:#1c1917;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:999px">
              Abrir painel do lojista
            </a>
          </p>
          <hr style="border:none;border-top:1px solid #e7e5e4;margin:8px 0 20px" />
          <p style="margin:0 0 8px;font-size:15px;font-weight:700">Aproveite para conhecer nossos serviços</p>
          <ul style="margin:0 0 16px;padding-left:18px;color:#44403c;line-height:1.6">
            <li><strong>Site Express</strong> — sua loja no ar rápido, no ritmo da serra</li>
            <li><strong>Agentes de automação</strong> — WhatsApp, agenda e follow-up para negócios locais</li>
          </ul>
          <p style="margin:0 0 8px">
            <a href="${paraEmpresasUrl}" style="color:#a16207;font-weight:700">Ver serviços para empresas</a>
          </p>
          <p style="margin:24px 0 0;font-size:12px;color:#a8a29e">Vertex 360 · Comércio Serra Negra</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return { to: "", subject, html, text };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** Envia e-mail via Resend se RESEND_API_KEY estiver setada. */
export async function enviarEmail(
  message: EmailMessage,
): Promise<{ ok: true } | { ok: false; erro: string; skipped?: boolean }> {
  const key = process.env.RESEND_API_KEY?.trim();
  const from =
    process.env.EMAIL_FROM?.trim() ||
    "Comércio Serra Negra <onboarding@resend.dev>";
  if (!key) {
    return {
      ok: false,
      skipped: true,
      erro: "RESEND_API_KEY não configurada — aprovação ok, e-mail não enviado.",
    };
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [message.to],
      subject: message.subject,
      html: message.html,
      text: message.text,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    return { ok: false, erro: `Resend ${res.status}: ${body.slice(0, 200)}` };
  }
  return { ok: true };
}
