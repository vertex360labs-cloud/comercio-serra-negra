import { NextResponse } from "next/server";
import { criarClienteServidor } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/supabase/env";

export async function GET(request: Request) {
  return POST(request);
}

export async function POST(request: Request) {
  const supabase = await criarClienteServidor();
  await supabase.auth.signOut();
  const origem = new URL(request.url).origin || siteUrl();
  return NextResponse.redirect(`${origem}/`, { status: 302 });
}
