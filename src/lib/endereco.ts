import { formatarCep } from "@/lib/cep";
import type { Negocio } from "@/types/negocio";

export function linhaEndereco(negocio: Pick<
  Negocio,
  "logradouro" | "numero" | "complemento" | "bairro" | "cidade" | "uf"
>): string {
  const numero = negocio.numero ? `, ${negocio.numero}` : "";
  const complemento = negocio.complemento ? ` · ${negocio.complemento}` : "";
  return `${negocio.logradouro}${numero}${complemento} — ${negocio.bairro}, ${negocio.cidade}/${negocio.uf}`;
}

export function enderecoComCep(negocio: Negocio): string {
  return `${linhaEndereco(negocio)} · CEP ${formatarCep(negocio.cep)}`;
}

export function linkComoChegar(negocio: Pick<Negocio, "lat" | "lng" | "logradouro" | "numero" | "cidade" | "uf">): string | null {
  if (negocio.lat != null && negocio.lng != null) {
    return `https://www.openstreetmap.org/directions?from=&to=${negocio.lat}%2C${negocio.lng}#map=18/${negocio.lat}/${negocio.lng}`;
  }
  const q = encodeURIComponent(
    `${negocio.logradouro}${negocio.numero ? `, ${negocio.numero}` : ""}, ${negocio.cidade} ${negocio.uf}`,
  );
  return `https://www.openstreetmap.org/search?query=${q}`;
}
