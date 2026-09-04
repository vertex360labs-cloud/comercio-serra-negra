"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function FormImportarCsv() {
  const router = useRouter();
  const [resultado, setResultado] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, setPendente] = useState(false);

  return (
    <form
      className="space-y-4 rounded-2xl bg-card p-6 shadow-sm"
      onSubmit={async (evento) => {
        evento.preventDefault();
        setErro(null);
        setResultado(null);
        const arquivo = (evento.currentTarget.elements.namedItem("csv") as HTMLInputElement)
          ?.files?.[0];
        if (!arquivo) {
          setErro("Escolha um arquivo CSV.");
          return;
        }
        setPendente(true);
        const texto = await arquivo.text();
        const resposta = await fetch("/api/admin/importar", {
          method: "POST",
          headers: { "Content-Type": "text/csv; charset=utf-8" },
          body: texto,
        });
        const corpo = await resposta.json();
        setPendente(false);
        if (!resposta.ok) {
          setErro(corpo.erro ?? "Falha na importação.");
          return;
        }
        setResultado(
          `${corpo.inseridos} fichas publicadas.` +
            (corpo.falhas?.length ? ` ${corpo.falhas.length} falha(s).` : ""),
        );
        router.refresh();
      }}
    >
      <input name="csv" type="file" accept=".csv,text/csv" className="block text-sm" />
      {erro ? <p className="text-sm text-destructive">{erro}</p> : null}
      {resultado ? <p className="text-sm font-medium">{resultado}</p> : null}
      <Button type="submit" className="h-11 font-semibold" disabled={pendente}>
        {pendente ? "Importando…" : "Importar e publicar"}
      </Button>
    </form>
  );
}
