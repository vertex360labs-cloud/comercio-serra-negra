import type { Bairro } from "@/types/negocio";

export const BAIRROS: Bairro[] = [
  {
    slug: "centro",
    nome: "Centro",
    descricao: "Comércio de malha, couro, restaurantes e o calçadão.",
  },
  {
    slug: "estancia-suica",
    nome: "Estância Suíça",
    descricao: "Pousadas, cafés e o clima de montanha perto do centro.",
  },
  {
    slug: "alto-da-serra",
    nome: "Alto da Serra",
    descricao: "Vista, hospedagem e um pouco mais de silêncio.",
  },
  {
    slug: "zona-rural",
    nome: "Zona rural",
    descricao: "Sítios, experiências e turismo fora do centro comercial.",
  },
];

export function getBairroBySlug(slug: string): Bairro | undefined {
  return BAIRROS.find((b) => b.slug === slug);
}

export function slugBairro(nome: string): string {
  const mapa: Record<string, string> = {
    Centro: "centro",
    "Estância Suíça": "estancia-suica",
    "Alto da Serra": "alto-da-serra",
    "Zona rural": "zona-rural",
  };
  return mapa[nome] ?? nome.toLowerCase();
}
