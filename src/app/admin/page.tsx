import Link from "next/link";
import { criarClienteAdmin } from "@/lib/supabase/admin";
import { getCategoriaById } from "@/data/categorias";
import { mapearNegocio } from "@/lib/negocios-map";
import { AcoesAdmin } from "@/app/admin/AcoesAdmin";
import { metadataPagina } from "@/lib/seo";

export const metadata = metadataPagina({
  title: "Admin",
  description: "CRUD interno das fichas do Comércio Serra Negra.",
  path: "/admin",
});

export default async function AdminPage() {
  const admin = criarClienteAdmin();
  const { data } = await admin
    .from("negocios")
    .select("*")
    .order("updated_at", { ascending: false });
  const lista = (data ?? []).map(mapearNegocio);

  return (
    <div className="overflow-x-auto rounded-2xl bg-card shadow-sm">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b bg-muted/60 text-xs tracking-wide uppercase">
          <tr>
            <th className="px-4 py-3">Negócio</th>
            <th className="px-4 py-3">Categoria</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Plano</th>
            <th className="px-4 py-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          {lista.map((negocio) => (
            <tr key={negocio.id} className="border-b last:border-0">
              <td className="px-4 py-3">
                <Link href={`/negocios/${negocio.slug}`} className="font-semibold hover:underline">
                  {negocio.nome}
                </Link>
                <p className="text-xs text-muted-foreground">
                  {negocio.bairro} · {negocio.slug}
                </p>
              </td>
              <td className="px-4 py-3">{getCategoriaById(negocio.categoria_id)?.nome}</td>
              <td className="px-4 py-3">{negocio.status}</td>
              <td className="px-4 py-3">{negocio.plano}</td>
              <td className="px-4 py-3">
                <AcoesAdmin
                  id={negocio.id}
                  nome={negocio.nome}
                  status={negocio.status}
                  plano={negocio.plano}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {lista.length === 0 ? (
        <p className="px-4 py-8 text-sm text-muted-foreground">
          Nenhuma ficha. Importe um CSV para começar o lote.
        </p>
      ) : null}
    </div>
  );
}
