"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { useState } from "react";

const NAV = [
  { href: "/negocios", label: "Negócios" },
  { href: "/categorias", label: "Categorias" },
  { href: "/guia-comercial", label: "Guia comercial" },
  { href: "/o-que-fazer-em-serra-negra", label: "O que fazer" },
];

export function Header() {
  const [aberto, setAberto] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-primary text-primary-foreground shadow-sm">
      <div className="relative mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4">
        <Logo />

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-foreground/80 transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/indicar"
            className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-black/5"
          >
            Indicar negócio
          </Link>
          <Link
            href="/entrar"
            className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-black/5"
          >
            Painel
          </Link>
          <Link
            href="/para-empresas"
            className="rounded-lg bg-foreground px-3 py-2 text-sm font-semibold text-primary transition-transform hover:scale-[1.02]"
          >
            É o dono?
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-foreground text-primary md:hidden"
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={aberto}
          onClick={() => setAberto((valor) => !valor)}
        >
          {aberto ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {aberto ? (
        <nav className="border-t border-black/10 bg-primary px-4 py-3 md:hidden">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setAberto(false)}
                className="rounded-lg px-2 py-2 text-sm font-medium hover:bg-black/5"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/indicar"
              onClick={() => setAberto(false)}
              className="rounded-lg px-2 py-2 text-sm font-medium hover:bg-black/5"
            >
              Indicar negócio
            </Link>
            <Link
              href="/entrar"
              onClick={() => setAberto(false)}
              className="rounded-lg px-2 py-2 text-sm font-medium hover:bg-black/5"
            >
              Painel
            </Link>
            <Link
              href="/para-empresas"
              onClick={() => setAberto(false)}
              className="rounded-lg bg-foreground px-2 py-2 text-sm font-semibold text-primary"
            >
              É o dono?
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
