import Image from "next/image";
import { BarraBusca } from "@/components/busca/BarraBusca";

export function Videowall() {
  return (
    <section className="relative isolate min-h-[70vh] overflow-hidden bg-black text-white md:min-h-[78vh]">
      <Image
        src="/videowall/centro-serra-negra.jpg"
        alt="Centro de Serra Negra ao entardecer: vitrines de malha e couro acesas, calçada e a serra ao fundo"
        fill
        priority
        quality={90}
        sizes="100vw"
        className="videowall-foto object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/25"
      />
      <div className="relative z-10 mx-auto flex min-h-[70vh] w-full max-w-5xl flex-col items-center justify-center px-4 py-16 text-center md:min-h-[78vh] md:py-20">
        <p className="fade-up text-xs font-semibold tracking-[0.22em] text-primary uppercase">
          Serra Negra · Circuito das Águas
        </p>
        <h1
          className="fade-up mt-4 max-w-4xl font-sans text-4xl leading-[1.05] font-extrabold tracking-tight text-balance sm:text-5xl md:text-7xl"
          style={{ animationDelay: "80ms" }}
        >
          Encontre empresas de Serra Negra
        </h1>
        <p
          className="fade-up mt-5 max-w-2xl text-base text-white/85 md:text-lg"
          style={{ animationDelay: "160ms" }}
        >
          Malha, couro, almoço e pousada — busca, WhatsApp e mapa, no ritmo do
          fim de semana.
        </p>
        <div
          className="fade-up mt-8 w-full max-w-2xl"
          style={{ animationDelay: "240ms" }}
        >
          <BarraBusca sobreFoto />
        </div>
      </div>
    </section>
  );
}
