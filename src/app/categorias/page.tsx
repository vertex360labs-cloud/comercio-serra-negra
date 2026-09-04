import { GradeCategorias } from "@/components/home/GradeCategorias";
import { metadataPagina } from "@/lib/seo";

export const metadata = metadataPagina({
  title: "Categorias",
  description:
    "Malhas, couro, pousadas, restaurantes e serviços locais de Serra Negra/SP.",
  path: "/categorias",
});

export default function CategoriasPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <h1 className="font-heading text-3xl font-medium tracking-tight">
        Categorias
      </h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        O comércio da serra separado do jeito que a gente procura: malha, couro,
        almoço, cama e o resto que a cidade resolve.
      </p>
      <div className="mt-8">
        <GradeCategorias />
      </div>
    </div>
  );
}
