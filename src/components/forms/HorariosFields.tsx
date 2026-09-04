"use client";

import { DIAS_SEMANA } from "@/lib/horario";
import type { HorarioFuncionamento } from "@/types/negocio";

type Props = {
  valor: HorarioFuncionamento[];
  onChange: (horarios: HorarioFuncionamento[]) => void;
};

function slot(lista: HorarioFuncionamento[], dia: HorarioFuncionamento["dia"]): HorarioFuncionamento {
  return (
    lista.find((h) => h.dia === dia) ?? {
      dia,
      abre: "09:00",
      fecha: "18:00",
      fechado: false,
    }
  );
}

export function HorariosFields({ valor, onChange }: Props) {
  function atualizar(dia: HorarioFuncionamento["dia"], patch: Partial<HorarioFuncionamento>) {
    const proximo = ([0, 1, 2, 3, 4, 5, 6] as const).map((d) => {
      const atual = slot(valor, d);
      return d === dia ? { ...atual, ...patch, dia } : atual;
    });
    onChange(proximo);
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Horário</p>
      <ul className="space-y-2">
        {([0, 1, 2, 3, 4, 5, 6] as const).map((dia) => {
          const item = slot(valor, dia);
          return (
            <li
              key={dia}
              className="grid grid-cols-[7rem_1fr_1fr_auto] items-center gap-2 rounded-lg bg-muted/70 px-3 py-2 text-sm"
            >
              <span className="font-medium">{DIAS_SEMANA[dia]}</span>
              <input
                type="time"
                value={item.abre ?? ""}
                disabled={item.fechado}
                onChange={(e) => atualizar(dia, { abre: e.target.value || null })}
                className="h-9 rounded-md border border-input bg-white px-2"
              />
              <input
                type="time"
                value={item.fecha ?? ""}
                disabled={item.fechado}
                onChange={(e) => atualizar(dia, { fecha: e.target.value || null })}
                className="h-9 rounded-md border border-input bg-white px-2"
              />
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  checked={item.fechado}
                  onChange={(e) => atualizar(dia, { fechado: e.target.checked })}
                />
                Fecha
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
