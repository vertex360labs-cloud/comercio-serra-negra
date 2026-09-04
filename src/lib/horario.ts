import { TIMEZONE_SP } from "@/lib/constantes";
import type { HorarioFuncionamento } from "@/types/negocio";

export const DIAS_SEMANA = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
] as const;

function agoraEmSaoPaulo(referencia = new Date()): { dia: number; minutos: number } {
  const partes = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE_SP,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(referencia);

  const weekday = partes.find((p) => p.type === "weekday")?.value ?? "Sun";
  const hora = Number(partes.find((p) => p.type === "hour")?.value ?? "0");
  const minuto = Number(partes.find((p) => p.type === "minute")?.value ?? "0");

  const mapa: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  return { dia: mapa[weekday] ?? 0, minutos: hora * 60 + minuto };
}

function horarioParaMinutos(hora: string): number {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

export function negocioAbertoAgora(
  horarios: HorarioFuncionamento[],
  referencia = new Date(),
): boolean {
  const { dia, minutos } = agoraEmSaoPaulo(referencia);
  const deHoje = horarios.find((h) => h.dia === dia);
  if (!deHoje || deHoje.fechado || !deHoje.abre || !deHoje.fecha) return false;

  const abre = horarioParaMinutos(deHoje.abre);
  const fecha = horarioParaMinutos(deHoje.fecha);
  if (fecha < abre) {
    return minutos >= abre || minutos <= fecha;
  }
  return minutos >= abre && minutos < fecha;
}

export function rotuloHorario(horario: HorarioFuncionamento): string {
  const dia = DIAS_SEMANA[horario.dia];
  if (horario.fechado || !horario.abre || !horario.fecha) {
    return `${dia} · fechado`;
  }
  return `${dia} · ${horario.abre}–${horario.fecha}`;
}
