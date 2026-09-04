import Link from "next/link";
import { FormFicha } from "@/app/painel/negocio/FormFicha";
import { criarClienteServidor } from "@/lib/supabase/server";
import { mapearNegocio } from "@/lib/negocios-map";
import { metadataPagina } from "@/lib/seo";

export const metadata = metadataPagina({
  title: "Editar ficha",
  description: "Atualize WhatsApp, horário e endereço da sua loja em Serra Negra.",
  path: "/painel/negocio",
});

export default async function PainelNegocioPage() {
  const supabase = await criarClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("negocios")
    .select("*")
    .eq("dono_id", user!.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) {
    return (
      <div className="rounded-2xl bg-card p-6 shadow-sm">
        <h1 className="font-sans text-2xl font-bold">Nenhuma ficha ainda</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Reivindique um negócio publicado ou indique um novo.
        </p>
        <Link href="/painel" className="mt-4 inline-block text-sm font-semibold underline">
          Voltar ao resumo
        </Link>
      </div>
    );
  }

  return <FormFicha negocio={mapearNegocio(data)} />;
}
