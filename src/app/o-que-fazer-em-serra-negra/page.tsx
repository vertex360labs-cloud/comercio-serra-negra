import Link from "next/link";
import { metadataPagina } from "@/lib/seo";

export const metadata = metadataPagina({
  title: "O que fazer em Serra Negra",
  description:
    "Compras de malha e couro, almoço no centro, pousada e um pouco de turismo rural em Serra Negra/SP.",
  path: "/o-que-fazer-em-serra-negra",
});

const BLOCOS = [
  {
    titulo: "Comprar malha e couro",
    texto:
      "O centro é feito para caminhar. Loja de malha e couro uma do lado da outra, vitrine acesa no frio.",
    href: "/categorias/malhas",
    label: "Ver malhas",
  },
  {
    titulo: "Almoçar sem surpresa",
    texto:
      "Fila no domingo é parte do roteiro. Veja quem está aberto e chame no WhatsApp se quiser mesa.",
    href: "/categorias/restaurantes",
    label: "Ver restaurantes",
  },
  {
    titulo: "Dormir na serra",
    texto:
      "Pousada no Alto da Serra ou hotel no centro, perto das lojas. Confirme café da manhã e check-in.",
    href: "/categorias/hoteis",
    label: "Ver hotéis e pousadas",
  },
  {
    titulo: "Sair um pouco do centro",
    texto:
      "Sítio, café colonial e trilha leve na zona rural, ainda em Serra Negra.",
    href: "/categorias/turismo-rural",
    label: "Ver experiências",
  },
];

export default function OQueFazerPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="font-heading text-4xl font-medium tracking-tight">
        O que fazer em Serra Negra
      </h1>
      <p className="mt-4 text-muted-foreground">
        Um fim de semana típico: compras de manhã, almoço no centro, café e, se
        couber, uma pousada com vista. A vitrine aponta o WhatsApp de cada
        parada.
      </p>
      <div className="mt-10 space-y-6">
        {BLOCOS.map((bloco) => (
          <section key={bloco.titulo} className="rounded-xl bg-card p-5 ring-1 ring-foreground/10">
            <h2 className="font-heading text-xl font-medium">{bloco.titulo}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{bloco.texto}</p>
            <Link
              href={bloco.href}
              className="mt-3 inline-block text-sm text-primary underline-offset-4 hover:underline"
            >
              {bloco.label}
            </Link>
          </section>
        ))}
      </div>
    </div>
  );
}
