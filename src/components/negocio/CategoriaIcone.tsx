import {
  BedDouble,
  Coffee,
  Gift,
  HeartPulse,
  PartyPopper,
  Shirt,
  ShoppingBag,
  Trees,
  UtensilsCrossed,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const ICONES: Record<string, LucideIcon> = {
  Shirt,
  ShoppingBag,
  Gift,
  BedDouble,
  UtensilsCrossed,
  Coffee,
  Trees,
  HeartPulse,
  Wrench,
  PartyPopper,
};

export function CategoriaIcone({
  nome,
  className,
}: {
  nome: string;
  className?: string;
}) {
  const Icone = ICONES[nome] ?? Shirt;
  return <Icone className={className} aria-hidden="true" />;
}
