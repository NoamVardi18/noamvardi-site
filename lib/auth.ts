import { createClient } from "@/lib/supabase/server";
import type { SessionUser } from "@/components/SiteHeader";

export async function getSessionUser(): Promise<SessionUser> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, is_admin")
    .eq("id", user.id)
    .single();

  return {
    name: profile?.full_name ?? null,
    email: user.email ?? "",
    isAdmin: profile?.is_admin ?? false,
  };
}
