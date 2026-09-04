import Link from "next/link";
import { criarClienteServidor } from "@/lib/supabase/server";
import { checklistFicha } from "@/lib/negocios";
import { mapearNegocio } from "@/lib/negocios-map";
import { metadataPagina } from "@/lib/seo";

export const metadata = metadataPagina({
  title: "Painel do lojista",
  description: "Complete a ficha da sua loja no Comércio Serra Negra.",
  path: "/painel",
});

type Props = { searchParams: Promise<{ aviso?: string }> };

export default async function PainelPage({ searchParams }: Props) {
  const { aviso } = await searchParams;
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

  const negocio = data ? mapearNegocio(data) : null;
  const itens = negocio ? checklistFicha(negocio) : [];
  const faltando = itens.filter((i) => !i.ok).length;

  return (
    <div className="space-y-6">
      {aviso ? (
        <p className="rounded-xl bg-card px-4 py-3 text-sm shadow-sm">{aviso}</p>
      ) : null}

      {!negocio ? (
        <section className="rounded-2xl bg-card p-6 shadow-sm">
          <h1 className="font-sans text-2xl font-bold">Você ainda não tem ficha</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Procure o negócio no guia e clique em “Sou o dono”, ou indique um
            comércio novo.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/negocios"
              className="inline-flex h-10 items-center rounded-lg bg-foreground px-4 text-sm font-semibold text-primary"
            >
              Procurar minha ficha
            </Link>
            <Link
              href="/indicar"
              className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold"
            >
              Indicar um negócio
            </Link>
          </div>
        </section>
      ) : (
        <>
          <section className="rounded-2xl bg-card p-6 shadow-sm">
            <p className="text-xs font-semibold tracking-widest uppercase">
              {negocio.plano === "gratis" ? "Versão básica" : "Destaque"}
            </p>
            <h1 className="mt-1 font-sans text-2xl font-bold">{negocio.nome}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {negocio.bairro}, Serra Negra/SP
            </p>
            <p className="mt-4 text-sm">
              {faltando === 0
                ? "Ficha redonda. O fim de semana agradece."
                : `${faltando} ${faltando === 1 ? "item falta" : "itens faltam"} para a ficha ficar completa.`}
            </p>
            <ul className="mt-4 space-y-2">
              {itens.map((item) => (
                <li key={item.id} className="flex items-center justify-between text-sm">
                  <span>{item.label}</span>
                  <span className={item.ok ? "font-semibold" : "text-muted-foreground"}>
                    {item.ok ? "Pronto" : "Falta"}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href="/painel/negocio"
              className="mt-6 inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold"
            >
              Completar ficha
            </Link>
          </section>

          {negocio.plano === "gratis" ? (
            <section className="rounded-2xl bg-foreground p-6 text-white">
              <h2 className="font-sans text-xl font-bold">
                Versão básica. Quer destaque na vitrine do fim de semana?
              </h2>
              <p className="mt-2 text-sm text-white/70">
                A cidade enche sexta a domingo. Destaque coloca a loja na home
                — fechamento humano, sem cartão no site.
              </p>
              <form action="/painel/destaque" method="post" className="mt-5">
                <button
                  type="submit"
                  className="inline-flex h-10 items-center rounded-full bg-primary px-4 text-sm font-semibold text-foreground"
                >
                  Quero conversar sobre destaque
                </button>
              </form>
            </section>
          ) : null}

          <p className="text-sm">
            <Link href={`/negocios/${negocio.slug}`} className="font-semibold underline">
              Ver ficha pública
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
