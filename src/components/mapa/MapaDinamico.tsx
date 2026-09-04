"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, ZoomControl, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css";
import { MarcadorLoja } from "@/components/mapa/MarcadorLoja";
import { CENTRO_SERRA_NEGRA } from "@/lib/constantes";
import type { Negocio } from "@/types/negocio";

function AjustarTamanho() {
  const map = useMap();
  useEffect(() => {
    const id = window.setTimeout(() => map.invalidateSize(), 80);
    return () => window.clearTimeout(id);
  }, [map]);
  return null;
}

type Props = {
  negocios: Negocio[];
  zoom?: number;
  centro?: { lat: number; lng: number };
  className?: string;
};

export default function MapaDinamico({
  negocios,
  zoom = CENTRO_SERRA_NEGRA.zoom,
  centro = CENTRO_SERRA_NEGRA,
  className,
}: Props) {
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    setMontado(true);
  }, []);

  if (!montado) {
    return (
      <div className={className ?? "flex h-full min-h-[320px] items-center justify-center bg-muted text-sm text-muted-foreground"}>
        Carregando mapa de Serra Negra…
      </div>
    );
  }

  return (
    <MapContainer
      center={[centro.lat, centro.lng]}
      zoom={zoom}
      scrollWheelZoom={false}
      className={className ?? "z-0 h-full w-full"}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="bottomright" />
      <AjustarTamanho />
      <MarkerClusterGroup chunkedLoading>
        {negocios.map((negocio) => (
          <MarcadorLoja key={negocio.id} negocio={negocio} />
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
