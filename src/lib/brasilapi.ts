import { CIDADE_MVP, UF_MVP } from "@/lib/constantes";
import { cepValido, somenteDigitosCep } from "@/lib/cep";
import type { EnderecoViaCep } from "@/types/negocio";

type BrasilApiCep = {
  cep?: string;
  state?: string;
  city?: string;
  neighborhood?: string;
  street?: string;
  location?: {
    coordinates?: {
      latitude?: string | number;
      longitude?: string | number;
    };
  };
};

function numeroOuNulo(valor: string | number | undefined): number | null {
  if (valor === undefined || valor === "") return null;
  const n = typeof valor === "number" ? valor : Number(valor);
  return Number.isFinite(n) ? n : null;
}

export async function consultarCep(cep: string): Promise<EnderecoViaCep> {
  const digitos = somenteDigitosCep(cep);
  if (!cepValido(digitos)) {
    throw new Error("CEP precisa ter 8 dígitos.");
  }

  const resposta = await fetch(`https://brasilapi.com.br/api/cep/v2/${digitos}`, {
    next: { revalidate: 60 * 60 * 24 },
  });

  if (resposta.status === 404) {
    throw new Error("CEP não encontrado.");
  }
  if (!resposta.ok) {
    throw new Error("Não deu para consultar o CEP agora.");
  }

  const bruto = (await resposta.json()) as BrasilApiCep;

  return {
    cep: bruto.cep ?? digitos,
    logradouro: bruto.street ?? "",
    bairro: bruto.neighborhood ?? "",
    cidade: bruto.city ?? "",
    uf: UF_MVP,
    lat: numeroOuNulo(bruto.location?.coordinates?.latitude),
    lng: numeroOuNulo(bruto.location?.coordinates?.longitude),
  };
}

export function cepDaCidadeMvp(endereco: EnderecoViaCep): boolean {
  return endereco.cidade.trim().toLowerCase() === CIDADE_MVP.toLowerCase();
}
