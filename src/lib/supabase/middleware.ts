import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseConfigurado } from "@/lib/supabase/env";

export async function atualizarSessao(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!supabaseConfigurado()) {
    if (
      request.nextUrl.pathname.startsWith("/painel") ||
      request.nextUrl.pathname.startsWith("/admin")
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/entrar";
      url.searchParams.set("aviso", "supabase");
      return NextResponse.redirect(url);
    }
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect em Server Action quebra o POST com "An unexpected response was received from the server."
  const ehServerAction = request.headers.has("next-action");

  if (
    !ehServerAction &&
    (request.nextUrl.pathname.startsWith("/painel") ||
      request.nextUrl.pathname.startsWith("/admin")) &&
    !user
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/entrar";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return response;
}
