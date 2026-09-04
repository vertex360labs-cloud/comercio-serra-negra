"use client";

import { createBrowserClient } from "@supabase/ssr";
import { supabaseConfigurado } from "@/lib/supabase/env";

export function criarClienteBrowser() {
  if (!supabaseConfigurado()) {
    throw new Error("Supabase não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
