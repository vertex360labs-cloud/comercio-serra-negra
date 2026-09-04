"use client";

import Link from "next/link";
import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { getCategoriaById } from "@/data/categorias";
import type { Negocio } from "@/types/negocio";

const iconeLoja = L.divIcon({
  className: "marcador-loja",
  html: '<span class="marcador-loja__pin"></span>',
  iconSize: [22, 30],
  iconAnchor: [11, 28],
  popupAnchor: [0, -24],
});

export function MarcadorLoja({ negocio }: { negocio: Negocio }) {
  if (negocio.lat == null || negocio.lng == null) return null;

  const categoria = getCategoriaById(negocio.categoria_id);

  return (
    <Marker position={[negocio.lat, negocio.lng]} icon={iconeLoja}>
      <Popup>
        <div className="min-w-40 space-y-1">
          <Link
            href={`/negocios/${negocio.slug}`}
            className="font-medium text-foreground underline-offset-2 hover:underline"
          >
            {negocio.nome}
          </Link>
          <p className="m-0 text-xs text-muted-foreground">
            {categoria?.nome} · {negocio.bairro}
          </p>
        </div>
      </Popup>
    </Marker>
  );
}
