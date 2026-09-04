import type { User } from "@supabase/supabase-js";
import { criarClienteAdmin } from "@/lib/supabase/admin";
import { criarClienteServidor } from "@/lib/supabase/server";

export function emailAdmin(): string | null {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  return email || null;
}

export async function promoverAdminSePreciso(user: User) {
  const adminEmail = emailAdmin();
  if (!adminEmail || user.email?.toLowerCase() !== adminEmail) return;
  try {
    const admin = criarClienteAdmin();
    await admin.from("perfis").update({ papel: "admin" }).eq("id", user.id);
  } catch {
    // sem service role ainda dá para logar; o e-mail do env já libera o /admin
  }
}

export async function usuarioAdmin(): Promise<User | null> {
  const supabase = await criarClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  await promoverAdminSePreciso(user);

  if (emailAdmin() && user.email?.toLowerCase() === emailAdmin()) return user;

  const { data: perfil } = await supabase
    .from("perfis")
    .select("papel")
    .eq("id", user.id)
    .maybeSingle();
  if (perfil?.papel === "admin") return user;
  return null;
}
