"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { criarClienteBrowser } from "@/lib/supabase/client";
import { normalizarWhatsApp } from "@/lib/whatsapp";

function soDigitosCnpj(valor: string) {
  return valor.replace(/\D/g, "").slice(0, 14);
}

export function ReivindicarForm({
  negocioId,
  negocioNome,
  enderecoResumo,
}: {
  negocioId: string;
  negocioNome: string;
  enderecoResumo: string;
}) {
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, setPendente] = useState(false);

  if (enviado) {
    return (
      <div className="rounded-xl bg-card p-6 shadow-sm">
        <p className="font-semibold">Pedido enviado — confirme o e-mail</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Abre o e-mail, clica no link e aguarde a <strong>aprovação manual</strong>.
          Sem CNPJ e WhatsApp do proprietário a gente não libera a ficha — evita
          golpe.
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
        const cnpj = soDigitosCnpj(String(dados.get("cnpj") ?? ""));
        const whatsappProp = normalizarWhatsApp(
          String(dados.get("whatsapp_proprietario") ?? ""),
        );
        const localizacao = dados.get("localizacao_confirmada") === "on";
        const qtdRaw = String(dados.get("qtd_funcionarios") ?? "").trim();
        const qtd_funcionarios = qtdRaw ? Number(qtdRaw) : null;

        if (cnpj.length !== 14) {
          setErro("Informe um CNPJ com 14 dígitos.");
          setPendente(false);
          return;
        }
        if (!whatsappProp || whatsappProp.length < 12) {
          setErro("Informe o WhatsApp do proprietário com DDD (ex.: 19 99999-0000).");
          setPendente(false);
          return;
        }
        if (!localizacao) {
          setErro("Confirme a localização da ficha para continuar.");
          setPendente(false);
          return;
        }
        if (qtd_funcionarios != null && (!Number.isFinite(qtd_funcionarios) || qtd_funcionarios < 0)) {
          setErro("Quantidade de funcionários inválida.");
          setPendente(false);
          return;
        }

        try {
          const supabase = criarClienteBrowser();
          const reivindicacaoId = crypto.randomUUID();
          const { error } = await supabase.from("reivindicacoes").insert({
            id: reivindicacaoId,
            negocio_id: negocioId,
            nome,
            email,
            cnpj,
            whatsapp: whatsappProp,
            whatsapp_proprietario: whatsappProp,
            localizacao_confirmada: true,
            qtd_funcionarios,
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
              data: { nome, whatsapp: whatsappProp },
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
        <label htmlFor="cnpj" className="mb-1 block text-sm font-medium">
          CNPJ
        </label>
        <Input
          id="cnpj"
          name="cnpj"
          required
          inputMode="numeric"
          placeholder="00.000.000/0000-00"
          className="h-11 bg-white"
        />
      </div>
      <div>
        <label htmlFor="whatsapp_proprietario" className="mb-1 block text-sm font-medium">
          WhatsApp do proprietário (DDD 19)
        </label>
        <Input
          id="whatsapp_proprietario"
          name="whatsapp_proprietario"
          required
          inputMode="tel"
          placeholder="19 99999-0000"
          className="h-11 bg-white"
        />
      </div>
      <div>
        <label htmlFor="qtd_funcionarios" className="mb-1 block text-sm font-medium">
          Qtd. de funcionários <span className="text-muted-foreground">(opcional)</span>
        </label>
        <Input
          id="qtd_funcionarios"
          name="qtd_funcionarios"
          type="number"
          min={0}
          className="h-11 bg-white"
          placeholder="Ex.: 3"
        />
      </div>
      <label className="flex items-start gap-2 rounded-xl bg-muted/50 p-3 text-sm">
        <input
          type="checkbox"
          name="localizacao_confirmada"
          className="mt-1"
          required
        />
        <span>
          Confirmo a localização da ficha: <strong>{enderecoResumo}</strong>
        </span>
      </label>
      {erro ? <p className="text-sm text-destructive">{erro}</p> : null}
      <Button type="submit" className="h-11 w-full font-semibold" disabled={pendente}>
        {pendente ? "Enviando…" : "Enviar para aprovação"}
      </Button>
      <p className="text-xs text-muted-foreground">
        O link no e-mail só confirma seu contato. A ficha só libera depois da
        nossa aprovação (anti-golpe).
      </p>
    </form>
  );
}
