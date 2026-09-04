import Link from "next/link";
import { Button } from "@/components/ui/button";
import { metadataPagina } from "@/lib/seo";

export const metadata = metadataPagina({
  title: "Para empresas",
  description:
    "Reivindique a ficha da sua loja, hotel ou restaurante em Serra Negra e complete WhatsApp, horário e fotos.",
  path: "/para-empresas",
});

export default function ParaEmpresasPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="font-heading text-4xl font-medium tracking-tight">
        Sua ficha na vitrine da cidade
      </h1>
      <p className="mt-4 text-muted-foreground">
        O Comércio Serra Negra já lista o comércio com dados públicos. O dono
        entra, confirma WhatsApp e horário, e a página fica redonda para o
        fim de semana.
      </p>
      <ul className="mt-8 space-y-3 text-sm">
        <li className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
          Versão básica: ficha publicada, endereço, categoria, botão de WhatsApp.
        </li>
        <li className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
          Destaque: aparece na home no fim de semana, quando a cidade enche.
        </li>
        <li className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
          Depois, se fizer sentido: site da loja ou atendimento no WhatsApp.
          Isso a gente conversa fora da vitrine.
        </li>
      </ul>
      <div className="mt-8 flex flex-wrap gap-2">
        <Button nativeButton={false} render={<Link href="/entrar" />}>
          Entrar no painel
        </Button>
        <Button
          nativeButton={false}
          variant="outline"
          render={<Link href="/diagnostico" />}
        >
          Diagnóstico da loja
        </Button>
      </div>
    </div>
  );
}
