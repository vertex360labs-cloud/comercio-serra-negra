import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NaoEncontrado() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-start gap-4 px-4 py-20">
      <h1 className="font-heading text-3xl font-medium">Página não encontrada</h1>
      <p className="text-muted-foreground">
        Esse endereço não está na vitrine. Volte para o guia comercial de Serra
        Negra.
      </p>
      <Button nativeButton={false} render={<Link href="/" />}>
        Ir para a home
      </Button>
    </div>
  );
}
