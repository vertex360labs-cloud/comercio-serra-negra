import Link from "next/link";
import { Logo } from "@/components/layout/Logo";

const LINKS = [
  { href: "/negocios", label: "Negócios" },
  { href: "/categorias", label: "Categorias" },
  { href: "/guia-comercial", label: "Guia comercial" },
  { href: "/comercio-local", label: "Comércio local" },
  { href: "/o-que-fazer-em-serra-negra", label: "O que fazer" },
  { href: "/indicar", label: "Indicar um negócio" },
  { href: "/para-empresas", label: "Para empresas" },
  { href: "/diagnostico", label: "Diagnóstico da loja" },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-foreground text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 md:grid-cols-[1.2fr_1fr]">
        <div className="space-y-3">
          <Logo inverso />
          <p className="max-w-md text-sm text-white/70">
            Catálogo dos comércios, hotéis, restaurantes e serviços de Serra
            Negra, no Circuito das Águas Paulista. Feito para quem visita e para
            quem mora.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-white/70 transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>Vitrine mantida como iniciativa local. Serra Negra/SP.</p>
          <p>Não é um site da prefeitura.</p>
        </div>
      </div>
    </footer>
  );
}
