import { getCategoriaBySlug } from "@/data/categorias";
import { slugify } from "@/lib/slug";
import { normalizarWhatsApp } from "@/lib/whatsapp";
import { formatarCep } from "@/lib/cep";

export type LinhaImportacao = {
  nome: string;
  categoria_id: string;
  whatsapp: string | null;
  cep: string;
  logradouro: string;
  numero: string | null;
  bairro: string;
};

function quebrarLinha(linha: string): string[] {
  const saida: string[] = [];
  let atual = "";
  let aspas = false;
  for (const char of linha) {
    if (char === '"') {
      aspas = !aspas;
      continue;
    }
    if (char === "," && !aspas) {
      saida.push(atual.trim());
      atual = "";
      continue;
    }
    atual += char;
  }
  saida.push(atual.trim());
  return saida;
}

export function parseCsvNegocios(texto: string): { linhas: LinhaImportacao[]; erros: string[] } {
  const linhasTxt = texto
    .replace(/^\uFEFF/, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .filter((l) => l.trim());
  if (linhasTxt.length < 2) {
    return { linhas: [], erros: ["CSV vazio. Precisa do cabeçalho e ao menos uma linha."] };
  }

  const cabecalho = quebrarLinha(linhasTxt[0]).map((c) => slugify(c));
  const idx = (nome: string) => cabecalho.indexOf(nome);

  const iNome = idx("nome");
  const iCat = cabecalho.includes("categoria") ? idx("categoria") : idx("categoria-id");
  const iWhats = idx("whatsapp");
  const iCep = idx("cep");
  const iLog = idx("logradouro");
  const iNum = idx("numero");
  const iBairro = idx("bairro");

  if (iNome < 0 || iCat < 0) {
    return {
      linhas: [],
      erros: ["Cabeçalho precisa ter pelo menos nome e categoria (slug: malhas, couro, hoteis…)."],
    };
  }

  const linhas: LinhaImportacao[] = [];
  const erros: string[] = [];

  linhasTxt.slice(1).forEach((raw, i) => {
    const cols = quebrarLinha(raw);
    const nome = cols[iNome] ?? "";
    const catRaw = cols[iCat] ?? "";
    const categoria = getCategoriaBySlug(slugify(catRaw)) ?? getCategoriaBySlug(catRaw);
    if (!nome) {
      erros.push(`Linha ${i + 2}: nome vazio.`);
      return;
    }
    if (!categoria) {
      erros.push(`Linha ${i + 2}: categoria desconhecida (${catRaw}). Use o slug, ex.: malhas.`);
      return;
    }
    const whatsappRaw = iWhats >= 0 ? cols[iWhats] : "";
    linhas.push({
      nome,
      categoria_id: categoria.id,
      whatsapp: whatsappRaw ? normalizarWhatsApp(whatsappRaw) : null,
      cep: iCep >= 0 ? formatarCep(cols[iCep] ?? "") : "",
      logradouro: iLog >= 0 ? cols[iLog] ?? "" : "",
      numero: iNum >= 0 && cols[iNum] ? cols[iNum] : null,
      bairro: iBairro >= 0 ? cols[iBairro] ?? "" : "",
    });
  });

  return { linhas, erros };
}
