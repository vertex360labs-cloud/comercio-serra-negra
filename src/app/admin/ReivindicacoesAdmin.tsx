"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export type ReivindicacaoAdmin = {
  id: string;
  nome: string;
  email: string;
  cnpj: string | null;
  whatsapp_proprietario: string | null;
  qtd_funcionarios: number | null;
  localizacao_confirmada: boolean;
  user_id: string | null;
  created_at: string;
  negocio_id: string;
  negocio_nome: string;
  negocio_slug: string;
};

export function ReivindicacoesAdmin({ itens }: { itens: ReivindicacaoAdmin[] }) {
  const router = useRouter();
  const [pendenteId, setPendenteId] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function acao(id: string, acao: "aprovar" | "recusar") {
    setPendenteId(id);
    setMsg(null);
    const res = await fetch("/api/admin/reivindicacoes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, acao }),
    });
    const json = (await res.json()) as { ok?: boolean; erro?: string; email?: string };
    setPendenteId(null);
    if (!res.ok) {
      setMsg(json.erro || "Falha");
      return;
    }
    setMsg(
      acao === "aprovar"
        ? `Aprovada. E-mail: ${json.email ?? "?"}`
        : "Recusada.",
    );
    router.refresh();
  }

  if (itens.length === 0) {
    return (
      <p className="rounded-2xl bg-card px-4 py-6 text-sm text-muted-foreground shadow-sm">
        Nenhuma reivindicação pendente.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {msg ? <p className="text-sm font-medium">{msg}</p> : null}
      <div className="overflow-x-auto rounded-2xl bg-card shadow-sm">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead className="border-b bg-muted/60 text-xs tracking-wide uppercase">
            <tr>
              <th className="px-4 py-3">Negócio</th>
              <th className="px-4 py-3">Solicitante</th>
              <th className="px-4 py-3">CNPJ / WhatsApp</th>
              <th className="px-4 py-3">E-mail ok?</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {itens.map((item) => (
              <tr key={item.id} className="border-b last:border-0 align-top">
                <td className="px-4 py-3">
                  <a
                    href={`/negocios/${item.negocio_slug}`}
                    className="font-semibold hover:underline"
                  >
                    {item.negocio_nome}
                  </a>
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.created_at).toLocaleString("pt-BR")}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium">{item.nome}</p>
                  <p className="text-xs text-muted-foreground">{item.email}</p>
                  {item.qtd_funcionarios != null ? (
                    <p className="text-xs text-muted-foreground">
                      {item.qtd_funcionarios} funcionário(s)
                    </p>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-xs">
                  <p>CNPJ {item.cnpj}</p>
                  <p>WA {item.whatsapp_proprietario}</p>
                  <p>{item.localizacao_confirmada ? "Local ok" : "Local NÃO"}</p>
                </td>
                <td className="px-4 py-3 text-xs">
                  {item.user_id ? "Confirmou link" : "Ainda não"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    <button
                      type="button"
                      disabled={pendenteId === item.id || !item.user_id}
                      onClick={() => acao(item.id, "aprovar")}
                      className="rounded-md bg-primary px-2 py-1 text-xs font-semibold disabled:opacity-50"
                    >
                      Aprovar + e-mail
                    </button>
                    <button
                      type="button"
                      disabled={pendenteId === item.id}
                      onClick={() => acao(item.id, "recusar")}
                      className="rounded-md bg-muted px-2 py-1 text-xs font-semibold"
                    >
                      Recusar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
