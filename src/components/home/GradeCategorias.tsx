import Link from "next/link";
import { CategoriaIcone } from "@/components/negocio/CategoriaIcone";
import { CATEGORIAS } from "@/data/categorias";
import { carregarNegociosPublicados, negociosPorCategoria } from "@/lib/negocios";

export async function GradeCategorias() {
  const publicados = await carregarNegociosPublicados();
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {CATEGORIAS.map((categoria) => {
        const quantidade = negociosPorCategoria(categoria.id, publicados).length;
        return (
          <Link
            key={categoria.id}
            href={`/categorias/${categoria.slug}`}
            className="card-lift flex items-center gap-3 rounded-xl bg-muted/80 p-3"
          >
            <span className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
              <span className="flex size-10 items-center justify-center rounded-md bg-primary text-foreground">
                <CategoriaIcone nome={categoria.icone} className="size-5" />
              </span>
            </span>
            <span className="min-w-0">
              <span className="block text-sm leading-snug font-semibold">
                {categoria.nome}
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {quantidade === 1 ? "1 negócio" : `${quantidade} negócios`}
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
