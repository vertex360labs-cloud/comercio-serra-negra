import { redirect } from "next/navigation";
import { EntrarForm } from "@/app/entrar/EntrarForm";
import { criarClienteServidor } from "@/lib/supabase/server";
import { supabaseConfigurado } from "@/lib/supabase/env";
import { metadataPagina } from "@/lib/seo";

export const metadata = metadataPagina({
  title: "Entrar no painel",
  description: "Acesso do lojista ao Comércio Serra Negra com link mágico no e-mail.",
  path: "/entrar",
});

type Props = {
  searchParams: Promise<{ next?: string; erro?: string; aviso?: string }>;
};

export default async function EntrarPage({ searchParams }: Props) {
  const params = await searchParams;
  const configurado = supabaseConfigurado();
  if (configurado) {
    const supabase = await criarClienteServidor();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) redirect(params.next || "/painel");
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-12">
      <p className="text-xs font-semibold tracking-widest uppercase">Lojista</p>
      <h1 className="mt-2 font-sans text-3xl font-bold tracking-tight">
        Entrar no painel
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Sem senha. Você recebe um link no e-mail e cai direto na ficha da loja.
      </p>

      {params.aviso === "supabase" ? (
        <p className="mt-4 rounded-xl bg-card p-4 text-sm shadow-sm">
          O painel precisa do Supabase ligado. Rode <code>supabase start</code> e
          copie as chaves para o <code>.env.local</code>.
        </p>
      ) : null}
      {params.erro ? (
        <p className="mt-4 text-sm text-destructive">
          Não deu para entrar. Peça um link novo.
        </p>
      ) : null}

      <div className="mt-8">
        {configurado ? (
          <EntrarForm next={params.next || "/painel"} />
        ) : (
          <p className="rounded-xl bg-card p-4 text-sm shadow-sm">
            Supabase ainda não está configurado neste ambiente.
          </p>
        )}
      </div>
    </div>
  );
}
