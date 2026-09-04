import Link from "next/link";

export function FaixaDono() {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <div className="flex flex-col justify-between rounded-2xl bg-foreground px-6 py-8 text-white md:px-8">
        <div>
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">
            Para quem tem loja
          </p>
          <h2 className="mt-2 font-sans text-2xl font-bold">
            É dono de um negócio? Veja sua vitrine
          </h2>
          <p className="mt-2 text-sm text-white/70">
            Confirme WhatsApp e horário. A ficha já está no mapa da cidade.
          </p>
        </div>
        <Link
          href="/para-empresas"
          className="mt-6 inline-flex h-10 w-fit items-center rounded-full bg-white px-4 text-sm font-semibold text-foreground transition-transform hover:scale-[1.03]"
        >
          Sou o dono
        </Link>
      </div>
      <div className="flex flex-col justify-between rounded-2xl bg-primary px-6 py-8 text-foreground md:px-8">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase">
            Falta alguém na lista?
          </p>
          <h2 className="mt-2 font-sans text-2xl font-bold">
            Indique um comércio de Serra Negra
          </h2>
          <p className="mt-2 text-sm text-foreground/70">
            Nome, categoria e CEP. Sem CNPJ obrigatório, sem enrolação.
          </p>
        </div>
        <Link
          href="/indicar"
          className="mt-6 inline-flex h-10 w-fit items-center rounded-full bg-foreground px-4 text-sm font-semibold text-primary transition-transform hover:scale-[1.03]"
        >
          Indicar um negócio
        </Link>
      </div>
    </section>
  );
}
