export function somenteDigitosCep(cep: string): string {
  return cep.replace(/\D/g, "").slice(0, 8);
}

export function formatarCep(cep: string): string {
  const digitos = somenteDigitosCep(cep);
  if (digitos.length <= 5) return digitos;
  return `${digitos.slice(0, 5)}-${digitos.slice(5)}`;
}

export function cepValido(cep: string): boolean {
  return somenteDigitosCep(cep).length === 8;
}
