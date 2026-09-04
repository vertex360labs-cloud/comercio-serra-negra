import type { Categoria } from "@/types/negocio";

export const CATEGORIAS: Categoria[] = [
  {
    id: "cat-malhas",
    slug: "malhas",
    nome: "Malhas e tricô",
    descricao: "Lojas de malha, tricô e moda de inverno no centro.",
    icone: "Shirt",
    ordem: 1,
  },
  {
    id: "cat-couro",
    slug: "couro",
    nome: "Couro e acessórios",
    descricao: "Bolsas, calçados, cinto e peças em couro.",
    icone: "ShoppingBag",
    ordem: 2,
  },
  {
    id: "cat-artesanato",
    slug: "artesanato",
    nome: "Artesanato e presentes",
    descricao: "Ateliês, souvenirs e presentes da serra.",
    icone: "Gift",
    ordem: 3,
  },
  {
    id: "cat-hoteis",
    slug: "hoteis",
    nome: "Hotéis e pousadas",
    descricao: "Onde dormir em Serra Negra no fim de semana.",
    icone: "BedDouble",
    ordem: 4,
  },
  {
    id: "cat-restaurantes",
    slug: "restaurantes",
    nome: "Restaurantes e bares",
    descricao: "Almoço, jantar e happy hour no centro.",
    icone: "UtensilsCrossed",
    ordem: 5,
  },
  {
    id: "cat-cafeterias",
    slug: "cafeterias",
    nome: "Cafeterias e doces",
    descricao: "Café, pão de queijo, chocolate e sobremesa.",
    icone: "Coffee",
    ordem: 6,
  },
  {
    id: "cat-turismo-rural",
    slug: "turismo-rural",
    nome: "Turismo rural e experiências",
    descricao: "Sítios, trilhas, cavalgada e fim de semana no campo.",
    icone: "Trees",
    ordem: 7,
  },
  {
    id: "cat-saude",
    slug: "saude",
    nome: "Saúde e bem-estar",
    descricao: "Clínicas, spa, farmácia de manipulação e terapias.",
    icone: "HeartPulse",
    ordem: 8,
  },
  {
    id: "cat-servicos",
    slug: "servicos",
    nome: "Serviços locais",
    descricao: "Oficina, farmácia, imobiliária, contábil e afins.",
    icone: "Wrench",
    ordem: 9,
  },
  {
    id: "cat-eventos",
    slug: "eventos",
    nome: "Eventos e espaços",
    descricao: "Salões, casas de festa e espaços para evento.",
    icone: "PartyPopper",
    ordem: 10,
  },
];

export function getCategoriaById(id: string): Categoria | undefined {
  return CATEGORIAS.find((c) => c.id === id);
}

export function getCategoriaBySlug(slug: string): Categoria | undefined {
  return CATEGORIAS.find((c) => c.slug === slug);
}
