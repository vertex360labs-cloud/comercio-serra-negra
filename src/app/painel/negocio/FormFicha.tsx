"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CepFields } from "@/components/forms/CepFields";
import { HorariosFields } from "@/components/forms/HorariosFields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { criarClienteBrowser } from "@/lib/supabase/client";
import { formatarCep } from "@/lib/cep";
import { normalizarWhatsApp } from "@/lib/whatsapp";
import type { HorarioFuncionamento, Negocio } from "@/types/negocio";

export function FormFicha({ negocio }: { negocio: Negocio }) {
  const router = useRouter();
  const [horarios, setHorarios] = useState<HorarioFuncionamento[]>(negocio.horarios);
  const [capa, setCapa] = useState(negocio.capa_url);
  const [erro, setErro] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [pendente, setPendente] = useState(false);

  async function enviarCapa(arquivo: File) {
    setErro(null);
    const supabase = criarClienteBrowser();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setErro("Sessão expirada. Entre de novo.");
      return;
    }
    const ext = arquivo.name.split(".").pop()?.toLowerCase() || "jpg";
    const caminho = `${user.id}/${negocio.id}/capa.${ext}`;
    const { error: upErro } = await supabase.storage
      .from("fichas")
      .upload(caminho, arquivo, { upsert: true, contentType: arquivo.type });
    if (upErro) {
      setErro(upErro.message);
      return;
    }
    const { data } = supabase.storage.from("fichas").getPublicUrl(caminho);
    const url = `${data.publicUrl}?t=${Date.now()}`;
    const { error } = await supabase
      .from("negocios")
      .update({ capa_url: data.publicUrl })
      .eq("id", negocio.id);
    if (error) setErro(error.message);
    else {
      setCapa(url);
      setOk(true);
    }
  }

  return (
    <form
      className="space-y-5 rounded-2xl bg-card p-6 shadow-sm"
      onSubmit={async (evento) => {
        evento.preventDefault();
        setErro(null);
        setOk(false);
        setPendente(true);
        const dados = new FormData(evento.currentTarget);
        const whatsappRaw = String(dados.get("whatsapp") ?? "").trim();
        const payload = {
          descricao: String(dados.get("descricao") ?? "").trim() || null,
          whatsapp: whatsappRaw ? normalizarWhatsApp(whatsappRaw) : null,
          telefone: String(dados.get("telefone") ?? "").trim() || null,
          instagram: String(dados.get("instagram") ?? "").replace("@", "").trim() || null,
          site_url: String(dados.get("site_url") ?? "").trim() || null,
          ponto_referencia: String(dados.get("ponto_referencia") ?? "").trim() || null,
          numero: String(dados.get("numero") ?? "").trim() || null,
          cep: formatarCep(String(dados.get("cep") ?? negocio.cep)),
          logradouro: String(dados.get("logradouro") ?? negocio.logradouro),
          bairro: String(dados.get("bairro") ?? negocio.bairro),
          cidade: "Serra Negra",
          uf: "SP",
          horarios,
          aberto_feriado: dados.get("aberto_feriado") === "on",
        };

        try {
          const supabase = criarClienteBrowser();
          const { error } = await supabase.from("negocios").update(payload).eq("id", negocio.id);
          if (error) setErro(error.message);
          else {
            setOk(true);
            router.push("/painel");
          }
        } catch (e) {
          setErro(e instanceof Error ? e.message : "Não salvou.");
        } finally {
          setPendente(false);
        }
      }}
    >
      <h1 className="font-sans text-2xl font-bold">Editar {negocio.nome}</h1>

      <div>
        <p className="mb-1 text-sm font-medium">Foto da vitrine</p>
        {capa ? (
          <img src={capa} alt="Capa da ficha" className="mb-2 h-32 w-full rounded-lg object-cover" />
        ) : null}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="block text-sm"
          onChange={(evento) => {
            const arquivo = evento.target.files?.[0];
            if (arquivo) void enviarCapa(arquivo);
          }}
        />
      </div>

      <div>
        <label htmlFor="descricao" className="mb-1 block text-sm font-medium">
          Descrição
        </label>
        <textarea
          id="descricao"
          name="descricao"
          defaultValue={negocio.descricao ?? ""}
          rows={4}
          className="w-full rounded-lg border border-input bg-white px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor="whatsapp" className="mb-1 block text-sm font-medium">
          WhatsApp
        </label>
        <Input
          id="whatsapp"
          name="whatsapp"
          defaultValue={negocio.whatsapp ?? ""}
          className="h-11 bg-white"
          placeholder="5519999999999"
        />
      </div>
      <div>
        <label htmlFor="instagram" className="mb-1 block text-sm font-medium">
          Instagram
        </label>
        <Input
          id="instagram"
          name="instagram"
          defaultValue={negocio.instagram ?? ""}
          className="h-11 bg-white"
          placeholder="minhaloja"
        />
      </div>
      <div>
        <label htmlFor="site_url" className="mb-1 block text-sm font-medium">
          Site
        </label>
        <Input
          id="site_url"
          name="site_url"
          defaultValue={negocio.site_url ?? ""}
          className="h-11 bg-white"
        />
      </div>
      <div>
        <label htmlFor="telefone" className="mb-1 block text-sm font-medium">
          Telefone
        </label>
        <Input
          id="telefone"
          name="telefone"
          defaultValue={negocio.telefone ?? ""}
          className="h-11 bg-white"
        />
      </div>

      <CepFields
        cepInicial={negocio.cep}
        logradouroInicial={negocio.logradouro}
        bairroInicial={negocio.bairro}
      />
      <div>
        <label htmlFor="numero" className="mb-1 block text-sm font-medium">
          Número
        </label>
        <Input id="numero" name="numero" defaultValue={negocio.numero ?? ""} className="h-11 bg-white" />
      </div>
      <div>
        <label htmlFor="ponto_referencia" className="mb-1 block text-sm font-medium">
          Ponto de referência
        </label>
        <Input
          id="ponto_referencia"
          name="ponto_referencia"
          defaultValue={negocio.ponto_referencia ?? ""}
          className="h-11 bg-white"
        />
      </div>

      <HorariosFields valor={horarios} onChange={setHorarios} />

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="aberto_feriado" defaultChecked={Boolean(negocio.aberto_feriado)} />
        Costuma abrir em feriado
      </label>

      {erro ? <p className="text-sm text-destructive">{erro}</p> : null}
      {ok ? <p className="text-sm font-medium">Salvo. A ficha pública já reflete isso.</p> : null}

      <Button type="submit" className="h-11 font-semibold" disabled={pendente}>
        {pendente ? "Salvando…" : "Salvar ficha"}
      </Button>
    </form>
  );
}
