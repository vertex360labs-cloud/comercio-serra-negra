import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = {
  valorInicial?: string;
  autoFocus?: boolean;
  sobreFoto?: boolean;
};

export function BarraBusca({ valorInicial = "", autoFocus, sobreFoto }: Props) {
  return (
    <form
      action="/negocios"
      method="get"
      className={cn(
        "flex w-full gap-2",
        sobreFoto ? "flex-col sm:flex-row sm:items-stretch" : "flex-col sm:flex-row",
      )}
      role="search"
    >
      <label htmlFor="busca-vitrine" className="sr-only">
        Buscar negócios em Serra Negra
      </label>
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="busca-vitrine"
          name="q"
          defaultValue={valorInicial}
          autoFocus={autoFocus}
          placeholder="Busque por malha, pousada, almoço…"
          className={cn(
            "h-12 bg-white pl-10 text-base text-foreground md:text-base",
            sobreFoto && "h-14 rounded-xl border-0 shadow-lg md:text-base",
          )}
        />
      </div>
      <Button
        type="submit"
        size="lg"
        className={cn(
          "h-12 px-6 font-semibold",
          sobreFoto && "h-14 rounded-xl bg-primary px-8 text-base text-primary-foreground hover:bg-primary/90",
        )}
      >
        Buscar
      </Button>
    </form>
  );
}
