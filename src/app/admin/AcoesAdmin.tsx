"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  id: string;
  nome: string;
  status: string;
  plano: string;
};

export function AcoesAdmin({ id, nome, status, plano }: Props) {
  const router = useRouter();
  const [pendente, setPendente] = useState(false);

  async function patch(corpo: Record<string, unknown>) {
    setPendente(true);
    await fetch("/api/admin/negocio", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...corpo }),
    });
    setPendente(false);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-1">
      {status !== "publicado" && status !== "reivindicado" ? (
        <button
          type="button"
          disabled={pendente}
          onClick={() => patch({ status: "publicado" })}
          className="rounded-md bg-primary px-2 py-1 text-xs font-semibold"
        >
          Publicar
        </button>
      ) : (
        <button
          type="button"
          disabled={pendente}
          onClick={() => patch({ status: "oculto" })}
          className="rounded-md bg-muted px-2 py-1 text-xs font-semibold"
        >
          Ocultar
        </button>
      )}
      {plano === "gratis" ? (
        <button
          type="button"
          disabled={pendente}
          onClick={() => patch({ plano: "destaque" })}
          className="rounded-md bg-foreground px-2 py-1 text-xs font-semibold text-primary"
        >
          Destacar
        </button>
      ) : (
        <button
          type="button"
          disabled={pendente}
          onClick={() => patch({ plano: "gratis" })}
          className="rounded-md bg-muted px-2 py-1 text-xs font-semibold"
        >
          Tirar destaque
        </button>
      )}
      <button
        type="button"
        disabled={pendente}
        onClick={() => patch({ regenerar_slug: true, nome })}
        className="rounded-md bg-muted px-2 py-1 text-xs font-semibold"
      >
        Gerar slug
      </button>
    </div>
  );
}
