export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { usuarioAdmin } from "@/lib/admin";
import { criarClienteServidor } from "@/lib/supabase/server";
import { supabaseConfigurado } from "@/lib/supabase/env";

export default async function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!supabaseConfigurado()) redirect("/entrar?aviso=supabase");

  const supabase = await criarClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/entrar");
  const admin = await usuarioAdmin();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase">
            Painel do lojista
          </p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <nav className="flex gap-3 text-sm font-semibold">
          <Link href="/painel" className="hover:underline">
            Resumo
          </Link>
          <Link href="/painel/negocio" className="hover:underline">
            Editar ficha
          </Link>
          {admin ? (
            <Link href="/admin" className="hover:underline">
              Admin
            </Link>
          ) : null}
          <Link href="/sair" className="text-muted-foreground hover:text-foreground">
            Sair
          </Link>
        </nav>
      </div>
      {children}
    </div>
  );
}
