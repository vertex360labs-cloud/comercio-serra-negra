import { CIDADE_MVP } from "@/lib/constantes";
import { consultarCep, cepDaCidadeMvp } from "@/lib/brasilapi";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ cep: string }> },
) {
  const { cep } = await params;

  try {
    const endereco = await consultarCep(cep);
    const daCidade = cepDaCidadeMvp(endereco);

    return NextResponse.json({
      cep: endereco.cep,
      logradouro: endereco.logradouro,
      bairro: endereco.bairro,
      cidade: CIDADE_MVP,
      uf: "SP",
      lat: endereco.lat,
      lng: endereco.lng,
      avisoCidade: daCidade
        ? null
        : `Este CEP é de ${endereco.cidade || "outra cidade"}. No MVP a vitrine é só de ${CIDADE_MVP}/SP.`,
    });
  } catch (erro) {
    const mensagem = erro instanceof Error ? erro.message : "Erro ao consultar CEP.";
    return NextResponse.json({ erro: mensagem }, { status: 400 });
  }
}
