"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { criarClienteBrowser } from "@/lib/supabase/client";

export function EntrarForm({ next = "/painel" }: { next?: string }) {
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, setPendente] = useState(false);

  if (enviado) {
    return (
      <div className="rounded-xl bg-card p-6 shadow-sm">
        <p className="font-semibold">Olha a caixa de entrada.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Mandamos um link mágico. Abre o e-mail, clica e você entra no painel
          — sem senha.
        </p>
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={async (evento) => {
        evento.preventDefault();
        setErro(null);
        setPendente(true);
        const dados = new FormData(evento.currentTarget);
        const email = String(dados.get("email") ?? "").trim();
        const nome = String(dados.get("nome") ?? "").trim();
        try {
          const supabase = criarClienteBrowser();
          const origem = window.location.origin;
          const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
              shouldCreateUser: true,
              data: { nome },
              emailRedirectTo: `${origem}/auth/callback?next=${encodeURIComponent(next)}`,
            },
          });
          if (error) setErro(error.message);
          else setEnviado(true);
        } catch (e) {
          setErro(e instanceof Error ? e.message : "Não deu para enviar o link.");
        } finally {
          setPendente(false);
        }
      }}
    >
      <div>
        <label htmlFor="nome" className="mb-1 block text-sm font-medium">
          Seu nome
        </label>
        <Input id="nome" name="nome" className="h-11 bg-white" placeholder="Maria da Malharia" />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          E-mail
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          className="h-11 bg-white"
          placeholder="voce@email.com"
        />
      </div>
      {erro ? <p className="text-sm text-destructive">{erro}</p> : null}
      <Button type="submit" className="h-11 w-full font-semibold" disabled={pendente}>
        {pendente ? "Enviando…" : "Receber link de acesso"}
      </Button>
    </form>
  );
}
