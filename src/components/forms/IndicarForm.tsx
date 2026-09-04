"use client";

import { useState } from "react";
import { CepFields } from "@/components/forms/CepFields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORIAS } from "@/data/categorias";

export function IndicarForm() {
  const [enviado, setEnviado] = useState(false);

  if (enviado) {
    return (
      <div className="rounded-xl bg-secondary p-6 text-sm">
        <p className="font-medium">Recebemos a indicação.</p>
        <p className="mt-2 text-muted-foreground">
          Vamos conferir os dados públicos e publicar a ficha quando estiver
          redonda. Obrigado por ajudar a vitrine da cidade.
        </p>
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={async (evento) => {
        evento.preventDefault();
        const dados = new FormData(evento.currentTarget);
        const categoriaSlug = String(dados.get("categoria") ?? "");
        const categoria = CATEGORIAS.find((item) => item.slug === categoriaSlug);
        await fetch("/api/indicar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: dados.get("nome"),
            categoria_id: categoria?.id ?? "cat-servicos",
            whatsapp: dados.get("whatsapp"),
            cep: dados.get("cep"),
            logradouro: dados.get("logradouro"),
            bairro: dados.get("bairro"),
            numero: dados.get("numero"),
          }),
        });
        setEnviado(true);
      }}
    >
      <div>
        <label htmlFor="nome" className="mb-1 block text-sm font-medium">
          Nome do negócio
        </label>
        <Input id="nome" name="nome" required className="h-10" placeholder="Ex.: Malharia da Serra" />
      </div>
      <div>
        <label htmlFor="categoria" className="mb-1 block text-sm font-medium">
          Categoria
        </label>
        <select
          id="categoria"
          name="categoria"
          required
          className="h-10 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
        >
          <option value="">Escolha</option>
          {CATEGORIAS.map((categoria) => (
            <option key={categoria.id} value={categoria.slug}>
              {categoria.nome}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="whatsapp" className="mb-1 block text-sm font-medium">
          WhatsApp (com DDD 19)
        </label>
        <Input
          id="whatsapp"
          name="whatsapp"
          inputMode="tel"
          placeholder="19 99999-0000"
          className="h-10"
        />
      </div>
      <CepFields />
      <div>
        <label htmlFor="numero" className="mb-1 block text-sm font-medium">
          Número
        </label>
        <Input id="numero" name="numero" className="h-10" placeholder="123" />
      </div>
      <Button type="submit" className="h-11 w-full sm:w-auto">
        Enviar indicação
      </Button>
      <p className="text-xs text-muted-foreground">
        Usamos dados públicos para montar a ficha. Sem CNPJ obrigatório.
      </p>
    </form>
  );
}
