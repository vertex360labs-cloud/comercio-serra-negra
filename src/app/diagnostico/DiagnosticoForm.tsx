"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { linkWhatsApp } from "@/lib/whatsapp";

const PERGUNTAS = [
  { id: "site", label: "A loja tem site próprio (não só Instagram)?" },
  { id: "google", label: "O Google está com horário e foto certos?" },
  { id: "whatsapp", label: "Tem WhatsApp comercial, não o número pessoal da família?" },
  { id: "foto", label: "Tem foto recente da fachada ou da vitrine?" },
] as const;

export function DiagnosticoForm({ whatsappComercial }: { whatsappComercial: string | null }) {
  const [resultado, setResultado] = useState<{
    nome: string;
    faltas: string[];
  } | null>(null);

  if (resultado) {
    const texto = `Olá! Fiz o diagnóstico da ${resultado.nome} no Comércio Serra Negra. ${
      resultado.faltas.length
        ? `Falta: ${resultado.faltas.join(", ")}.`
        : "A ficha básica está ok."
    } Queria ver como destacar no fim de semana.`;
    return (
      <div className="space-y-4 rounded-2xl bg-card p-6 shadow-sm">
        <h2 className="font-sans text-xl font-bold">{resultado.nome}</h2>
        {resultado.faltas.length === 0 ? (
          <p className="text-sm">
            O básico está em pé. O passo seguinte é aparecer na home no sábado.
          </p>
        ) : (
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {resultado.faltas.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
        {whatsappComercial ? (
          <a
            href={linkWhatsApp(whatsappComercial, texto)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center rounded-lg bg-[#25D366] px-4 text-sm font-semibold text-white"
          >
            Falar no WhatsApp
          </a>
        ) : (
          <p className="text-sm text-muted-foreground">
            Deixe o número comercial no ambiente para o botão de WhatsApp aparecer.
          </p>
        )}
      </div>
    );
  }

  return (
    <form
      className="space-y-4 rounded-2xl bg-card p-6 shadow-sm"
      onSubmit={async (evento) => {
        evento.preventDefault();
        const dados = new FormData(evento.currentTarget);
        const nome = String(dados.get("nome") ?? "").trim();
        const faltas = PERGUNTAS.filter((p) => dados.get(p.id) !== "sim").map((p) => p.label);
        await fetch("/api/diagnostico", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome, faltas }),
        });
        setResultado({ nome, faltas });
      }}
    >
      <div>
        <label htmlFor="nome" className="mb-1 block text-sm font-medium">
          Nome da loja
        </label>
        <Input id="nome" name="nome" required className="h-11 bg-white" placeholder="Malharia da Serra" />
      </div>
      {PERGUNTAS.map((p) => (
        <fieldset key={p.id} className="rounded-xl bg-muted/70 p-3">
          <legend className="text-sm font-medium">{p.label}</legend>
          <div className="mt-2 flex gap-4 text-sm">
            <label className="flex items-center gap-1">
              <input type="radio" name={p.id} value="sim" />
              Sim
            </label>
            <label className="flex items-center gap-1">
              <input type="radio" name={p.id} value="nao" defaultChecked />
              Não / não sei
            </label>
          </div>
        </fieldset>
      ))}
      <Button type="submit" className="h-11 font-semibold">
        Ver diagnóstico
      </Button>
    </form>
  );
}
