import Link from "next/link";
import { SITE_NOME } from "@/lib/constantes";
import { cn } from "@/lib/utils";

type Props = {
  compacto?: boolean;
  inverso?: boolean;
};

export function Logo({ compacto = false, inverso = false }: Props) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2.5",
        inverso ? "text-white" : "text-foreground",
      )}
    >
      <span
        className={cn(
          "flex size-9 items-center justify-center rounded-md shadow-sm",
          inverso
            ? "bg-primary text-foreground"
            : "bg-foreground text-primary",
        )}
      >
        <svg
          viewBox="0 0 32 32"
          aria-hidden="true"
          className="size-5"
          fill="none"
        >
          <path
            d="M4 22 L16 10 L28 22"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M8 22 V26 H24 V22" stroke="currentColor" strokeWidth="2" />
          <rect
            x="12"
            y="18"
            width="8"
            height="8"
            rx="0.5"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-sans text-base font-bold tracking-tight">
          {compacto ? "Comércio" : SITE_NOME}
        </span>
        {!compacto ? (
          <span
            className={cn(
              "mt-0.5 text-[11px] font-medium",
              inverso ? "text-white/70" : "text-foreground/60",
            )}
          >
            Serra Negra · SP
          </span>
        ) : null}
      </span>
    </Link>
  );
}
