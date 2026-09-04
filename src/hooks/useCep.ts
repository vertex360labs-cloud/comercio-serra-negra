"use client";

import { useState } from "react";
import { cepValido, formatarCep, somenteDigitosCep } from "@/lib/cep";
import type { EnderecoViaCep } from "@/types/negocio";

type EstadoCep = {
  carregando: boolean;
  erro: string | null;
  avisoCidade: string | null;
  endereco: EnderecoViaCep | null;
};

const inicial: EstadoCep = {
  carregando: false,
  erro: null,
  avisoCidade: null,
  endereco: null,
};

export function useCep() {
  const [estado, setEstado] = useState<EstadoCep>(inicial);

  async function buscar(cep: string) {
    const digitos = somenteDigitosCep(cep);
    if (!cepValido(digitos)) {
      setEstado({
        ...inicial,
        erro: "CEP incompleto. Use o formato 13930-000.",
      });
      return null;
    }

    setEstado({ ...inicial, carregando: true });

    try {
      const resposta = await fetch(`/api/cep/${digitos}`);
      const corpo = (await resposta.json()) as
        | (EnderecoViaCep & { avisoCidade?: string })
        | { erro: string };

      if (!resposta.ok || "erro" in corpo) {
        const mensagem = "erro" in corpo ? corpo.erro : "Não deu para consultar o CEP.";
        setEstado({ ...inicial, erro: mensagem });
        return null;
      }

      setEstado({
        carregando: false,
        erro: null,
        avisoCidade: corpo.avisoCidade ?? null,
        endereco: corpo,
      });
      return corpo;
    } catch {
      setEstado({
        ...inicial,
        erro: "Falha de rede ao consultar o CEP.",
      });
      return null;
    }
  }

  return {
    ...estado,
    buscar,
    formatar: formatarCep,
    limpar: () => setEstado(inicial),
  };
}
