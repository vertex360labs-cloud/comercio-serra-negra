"use server";

import { revalidatePath } from "next/cache";
import { criarClienteServidor } from "@/lib/supabase/server";
import type { HorarioFuncionamento } from "@/types/negocio";

export type SalvarFichaPayload = {
  descricao: string | null;
  whatsapp: string | null;
  telefone: string | null;
  instagram: string | null;
  site_url: string | null;
  ponto_referencia: string | null;
  numero: string | null;
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
  horarios: HorarioFuncionamento[];
  aberto_feriado: boolean;
};

export async function salvarFichaNegocio(
  negocioId: string,
  payload: SalvarFichaPayload,
): Promise<{ ok: true } | { ok: false; erro: string }> {
  const supabase = await criarClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, erro: "Sessão expirada. Entre de novo." };
  }

  const { data: dono, error: donoErro } = await supabase
    .from("negocios")
    .select("id")
    .eq("id", negocioId)
    .eq("dono_id", user.id)
    .maybeSingle();
  if (donoErro) return { ok: false, erro: donoErro.message };
  if (!dono) return { ok: false, erro: "Esta ficha não é sua." };

  const { error } = await supabase
    .from("negocios")
    .update(payload)
    .eq("id", negocioId)
    .eq("dono_id", user.id);
  if (error) return { ok: false, erro: error.message };

  revalidatePath("/painel");
  revalidatePath("/painel/negocio");
  revalidatePath("/negocios");
  return { ok: true };
}
