import Link from "next/link";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";

import { usuarioAdmin } from "@/lib/admin";
import { criarClienteServidor } from "@/lib/supabase/server";
import { supabaseConfigurado } from "@/lib/supabase/env";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!supabaseConfigurado()) redirect("/entrar?aviso=supabase");
  const supabase = await criarClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/entrar?next=/admin");
  const admin = await usuarioAdmin();
  if (!admin) redirect("/painel?aviso=Esta área é só de quem publica o guia.");

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase">Admin</p>
          <h1 className="font-sans text-2xl font-bold">Fichas de Serra Negra</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <nav className="flex gap-3 text-sm font-semibold">
          <Link href="/admin" className="hover:underline">
            Lista
          </Link>
          <Link href="/admin/importar" className="hover:underline">
            Importar CSV
          </Link>
          <Link href="/painel" className="text-muted-foreground hover:text-foreground">
            Painel lojista
          </Link>
        </nav>
      </div>
      {children}
    </div>
  );
}
