"use server";

import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function toggleAdminAction(formData: FormData) {
  const user = await getSessionUser();
  if (!user?.isAdmin) throw new Error("גישה נדחתה");

  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const targetId = String(formData.get("user_id"));
  const newValue = formData.get("is_admin") === "true";

  // Prevent self-demotion — throw so future UI can surface this
  if (authData.user?.id === targetId && !newValue)
    throw new Error("אי אפשר להסיר הרשאות אדמין מעצמך");

  await supabase.from("profiles").update({ is_admin: newValue }).eq("id", targetId);
  revalidatePath("/admin/users");
}
