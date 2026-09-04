import { FormImportarCsv } from "@/app/admin/importar/FormImportarCsv";
import { metadataPagina } from "@/lib/seo";

export const metadata = metadataPagina({
  title: "Importar CSV",
  description: "Importação em lote de fichas de Serra Negra.",
  path: "/admin/importar",
});

export default function AdminImportarPage() {
  return (
    <div className="max-w-2xl space-y-4">
      <p className="text-sm text-muted-foreground">
        Cabeçalho obrigatório:{" "}
        <code className="rounded bg-muted px-1">
          nome,categoria,whatsapp,cep,logradouro,numero,bairro
        </code>
        . Categoria é o slug (malhas, couro, hoteis…). Cidade fica Serra Negra/SP.
        CNPJ não entra.
      </p>
      <a
        href="/modelo-importacao.csv"
        className="inline-block text-sm font-semibold underline"
      >
        Baixar modelo
      </a>
      <FormImportarCsv />
    </div>
  );
}
