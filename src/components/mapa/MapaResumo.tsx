"use client";

import dynamic from "next/dynamic";
import type { Negocio } from "@/types/negocio";

const MapaDinamico = dynamic(() => import("@/components/mapa/MapaDinamico"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[320px] items-center justify-center bg-muted text-sm text-muted-foreground">
      Carregando mapa de Serra Negra…
    </div>
  ),
});

type Props = {
  negocios: Negocio[];
  altura?: string;
  zoom?: number;
  centro?: { lat: number; lng: number };
};

export function MapaResumo({
  negocios,
  altura = "h-[320px] md:h-[420px]",
  zoom,
  centro,
}: Props) {
  return (
    <div
      className={`overflow-hidden rounded-xl ring-1 ring-foreground/10 ${altura}`}
    >
      <MapaDinamico negocios={negocios} zoom={zoom} centro={centro} />
    </div>
  );
}
