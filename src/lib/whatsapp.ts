import { DDI_BRASIL } from "@/lib/constantes";

export function somenteDigitos(valor: string): string {
  return valor.replace(/\D/g, "");
}

export function normalizarWhatsApp(valor: string): string {
  const digitos = somenteDigitos(valor);
  if (digitos.startsWith(DDI_BRASIL)) return digitos;
  return `${DDI_BRASIL}${digitos}`;
}

export function linkWhatsApp(whatsapp: string, texto?: string): string {
  const numero = normalizarWhatsApp(whatsapp);
  const url = new URL(`https://wa.me/${numero}`);
  if (texto) url.searchParams.set("text", texto);
  return url.toString();
}

export function formatarWhatsApp(whatsapp: string): string {
  const digitos = normalizarWhatsApp(whatsapp);
  const local = digitos.slice(2);
  const ddd = local.slice(0, 2);
  const resto = local.slice(2);
  if (resto.length === 9) {
    return `(${ddd}) ${resto.slice(0, 5)}-${resto.slice(5)}`;
  }
  if (resto.length === 8) {
    return `(${ddd}) ${resto.slice(0, 4)}-${resto.slice(4)}`;
  }
  return digitos;
}

export function mensagemWhatsAppLoja(nome: string): string {
  return `Olá! Vi a ${nome} no Comércio Serra Negra e queria saber mais.`;
}
