import { CATEGORIAS } from "@/data/categorias";
import { BAIRROS } from "@/data/bairros";
import { SITE_URL } from "@/lib/constantes";
import { carregarNegociosPublicados } from "@/lib/negocios";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const estaticas = [
    "",
    "/negocios",
    "/categorias",
    "/guia-comercial",
    "/o-que-fazer-em-serra-negra",
    "/comercio-local",
    "/para-empresas",
    "/indicar",
    "/diagnostico",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date("2026-09-04"),
  }));

  const categorias = CATEGORIAS.map((categoria) => ({
    url: `${SITE_URL}/categorias/${categoria.slug}`,
    lastModified: new Date("2026-09-04"),
  }));

  const bairros = BAIRROS.map((bairro) => ({
    url: `${SITE_URL}/bairros/${bairro.slug}`,
    lastModified: new Date("2026-09-04"),
  }));

  const publicados = await carregarNegociosPublicados();
  const negocios = publicados.map((negocio) => ({
    url: `${SITE_URL}/negocios/${negocio.slug}`,
    lastModified: new Date(negocio.updated_at),
  }));

  return [...estaticas, ...categorias, ...bairros, ...negocios];
}
