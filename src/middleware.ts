import { type NextRequest } from "next/server";
import { atualizarSessao } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return atualizarSessao(request);
}

export const config = {
  // Estreito de propósito: matcher amplo + refresh falho apagava cookies a cada clique.
  matcher: ["/painel/:path*", "/admin/:path*", "/entrar"],
};
