import { CIDADE_MVP, SITE_NOME, SITE_URL, UF_MVP } from "@/lib/constantes";
import type { Metadata } from "next";

export function tituloSeo(pagina?: string): string {
  if (!pagina) {
    return `Guia Comercial ${CIDADE_MVP} | ${SITE_NOME}`;
  }
  return `${pagina} | ${SITE_NOME}`;
}

export function metadataPagina({
  title,
  description,
  path = "/",
}: {
  title?: string;
  description: string;
  path?: string;
}): Metadata {
  const titulo = tituloSeo(title);
  const url = new URL(path, SITE_URL).toString();

  return {
    title: title ? titulo : tituloSeo(),
    description,
    alternates: { canonical: url },
    openGraph: {
      title: titulo,
      description,
      url,
      locale: "pt_BR",
      siteName: SITE_NOME,
      type: "website",
    },
  };
}

export function jsonLdHome() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: SITE_NOME,
        url: SITE_URL,
        inLanguage: "pt-BR",
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}/negocios?q={busca}`,
          "query-input": "required name=busca",
        },
      },
      {
        "@type": "TouristDestination",
        name: `${CIDADE_MVP}, ${UF_MVP}`,
        description:
          "Serra Negra, no Circuito das Águas Paulista, próxima a Socorro, Amparo, Lindóia e Águas de Lindóia.",
        url: SITE_URL,
        address: {
          "@type": "PostalAddress",
          addressLocality: CIDADE_MVP,
          addressRegion: UF_MVP,
          addressCountry: "BR",
        },
      },
    ],
  };
}

export function jsonLdNegocio(input: {
  nome: string;
  descricao: string | null;
  slug: string;
  bairro: string;
  logradouro: string;
  numero: string | null;
  cep: string;
  lat: number | null;
  lng: number | null;
  whatsapp: string | null;
  telefone: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: input.nome,
    description: input.descricao,
    url: `${SITE_URL}/negocios/${input.slug}`,
    telephone: input.whatsapp ?? input.telefone ?? undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${input.logradouro}${input.numero ? `, ${input.numero}` : ""}`,
      addressLocality: CIDADE_MVP,
      addressRegion: UF_MVP,
      postalCode: input.cep,
      addressCountry: "BR",
      addressNeighborhood: input.bairro,
    },
    geo:
      input.lat != null && input.lng != null
        ? {
            "@type": "GeoCoordinates",
            latitude: input.lat,
            longitude: input.lng,
          }
        : undefined,
  };
}
