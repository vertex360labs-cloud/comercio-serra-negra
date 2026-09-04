import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SITE_NOME, SITE_URL } from "@/lib/constantes";
import { tituloSeo } from "@/lib/seo";
import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin", "latin-ext"],
  variable: "--font-source-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: tituloSeo(),
    template: `%s | ${SITE_NOME}`,
  },
  description:
    "Guia comercial de Serra Negra/SP: lojas de malha, couro, restaurantes, pousadas e serviços. WhatsApp na mão, sem enrolação.",
  applicationName: SITE_NOME,
  openGraph: {
    locale: "pt_BR",
    siteName: SITE_NOME,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${sourceSans.variable} ${fraunces.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
