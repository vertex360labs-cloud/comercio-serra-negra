"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { CIDADE_MVP, UF_MVP } from "@/lib/constantes";
import { formatarCep, somenteDigitosCep } from "@/lib/cep";
import { useCep } from "@/hooks/useCep";

type Props = {
  cepInicial?: string;
  logradouroInicial?: string;
  bairroInicial?: string;
  onPreenchido?: (campos: {
    cep: string;
    logradouro: string;
    bairro: string;
    cidade: string;
    uf: "SP";
  }) => void;
};

export function CepFields({
  cepInicial = "",
  logradouroInicial = "",
  bairroInicial = "",
  onPreenchido,
}: Props) {
  const { buscar, carregando, erro, avisoCidade } = useCep();
  const [cep, setCep] = useState(cepInicial);
  const [logradouro, setLogradouro] = useState(logradouroInicial);
  const [bairro, setBairro] = useState(bairroInicial);

  async function aoSairDoCep() {
    const endereco = await buscar(cep);
    if (!endereco) return;
    setLogradouro(endereco.logradouro);
    setBairro(endereco.bairro);
    onPreenchido?.({
      cep: formatarCep(endereco.cep),
      logradouro: endereco.logradouro,
      bairro: endereco.bairro,
      cidade: CIDADE_MVP,
      uf: UF_MVP,
    });
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="sm:col-span-1">
        <label htmlFor="cep" className="mb-1 block text-sm font-medium">
          CEP
        </label>
        <Input
          id="cep"
          name="cep"
          inputMode="numeric"
          autoComplete="postal-code"
          placeholder="13930-000"
          value={cep}
          onChange={(evento) => setCep(formatarCep(somenteDigitosCep(evento.target.value)))}
          onBlur={aoSairDoCep}
          maxLength={9}
          className="h-10"
        />
        {carregando ? (
          <p className="mt-1 text-xs text-muted-foreground">Consultando CEP…</p>
        ) : null}
        {erro ? <p className="mt-1 text-xs text-destructive">{erro}</p> : null}
        {avisoCidade ? (
          <p className="mt-1 text-xs text-amber-800">{avisoCidade}</p>
        ) : null}
      </div>
      <div>
        <label htmlFor="bairro" className="mb-1 block text-sm font-medium">
          Bairro
        </label>
        <Input
          id="bairro"
          name="bairro"
          value={bairro}
          onChange={(evento) => setBairro(evento.target.value)}
          className="h-10"
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="logradouro" className="mb-1 block text-sm font-medium">
          Logradouro
        </label>
        <Input
          id="logradouro"
          name="logradouro"
          value={logradouro}
          onChange={(evento) => setLogradouro(evento.target.value)}
          className="h-10"
        />
      </div>
      <div>
        <label htmlFor="cidade" className="mb-1 block text-sm font-medium">
          Cidade
        </label>
        <Input id="cidade" name="cidade" value={CIDADE_MVP} readOnly className="h-10 bg-muted" />
      </div>
      <div>
        <label htmlFor="uf" className="mb-1 block text-sm font-medium">
          UF
        </label>
        <Input id="uf" name="uf" value={UF_MVP} readOnly className="h-10 bg-muted" />
      </div>
    </div>
  );
}
