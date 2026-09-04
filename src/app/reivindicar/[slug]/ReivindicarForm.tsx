"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { criarClienteBrowser } from "@/lib/supabase/client";
import { normalizarWhatsApp } from "@/lib/whatsapp";

export function ReivindicarForm({
  negocioId,
  negocioNome,
}: {
  negocioId: string;
  negocioNome: string;
}) {
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, setPendente] = useState(false);

  if (enviado) {
    return (
      <div className="rounded-xl bg-card p-6 shadow-sm">
        <p className="font-semibold">Link a caminho.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Abre o e-mail, clica no link e a ficha de {negocioNome} cai no seu
          painel para completar WhatsApp e horário.
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
        const nome = String(dados.get("nome") ?? "").trim();
        const email = String(dados.get("email") ?? "").trim();
        const whatsappRaw = String(dados.get("whatsapp") ?? "").trim();
        const whatsapp = whatsappRaw ? normalizarWhatsApp(whatsappRaw) : null;

        try {
          const supabase = criarClienteBrowser();
          const reivindicacaoId = crypto.randomUUID();
          const { error } = await supabase.from("reivindicacoes").insert({
            id: reivindicacaoId,
            negocio_id: negocioId,
            nome,
            email,
            whatsapp,
            status: "pendente",
          });
          if (error) {
            setErro(error.message);
            return;
          }

          const origem = window.location.origin;
          const { error: otpErro } = await supabase.auth.signInWithOtp({
            email,
            options: {
              shouldCreateUser: true,
              data: { nome, whatsapp },
              emailRedirectTo: `${origem}/auth/callback?next=/painel&reivindicar=${reivindicacaoId}`,
            },
          });
          if (otpErro) setErro(otpErro.message);
          else setEnviado(true);
        } catch (e) {
          setErro(e instanceof Error ? e.message : "Falha ao reivindicar.");
        } finally {
          setPendente(false);
        }
      }}
    >
      <div>
        <label htmlFor="nome" className="mb-1 block text-sm font-medium">
          Seu nome
        </label>
        <Input id="nome" name="nome" required className="h-11 bg-white" />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          E-mail
        </label>
        <Input id="email" name="email" type="email" required className="h-11 bg-white" />
      </div>
      <div>
        <label htmlFor="whatsapp" className="mb-1 block text-sm font-medium">
          WhatsApp (DDD 19)
        </label>
        <Input
          id="whatsapp"
          name="whatsapp"
          inputMode="tel"
          placeholder="19 99999-0000"
          className="h-11 bg-white"
        />
      </div>
      {erro ? <p className="text-sm text-destructive">{erro}</p> : null}
      <Button type="submit" className="h-11 w-full font-semibold" disabled={pendente}>
        {pendente ? "Enviando…" : "Sou o dono — receber link"}
      </Button>
      <p className="text-xs text-muted-foreground">
        O link mágico confirma o e-mail. Sem CNPJ obrigatório.
      </p>
    </form>
  );
}
