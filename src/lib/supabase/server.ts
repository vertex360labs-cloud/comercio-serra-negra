import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseConfigurado } from "@/lib/supabase/env";

export async function criarClienteServidor() {
  if (!supabaseConfigurado()) {
    throw new Error("Supabase não configurado.");
  }
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Component não consegue setar cookie; o middleware renova a sessão.
          }
        },
      },
    },
  );
}
