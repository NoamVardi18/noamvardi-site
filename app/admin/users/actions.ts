"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function toggleAdminAction(formData: FormData) {
  const user = await getSessionUser();
  if (!user?.isAdmin) throw new Error("Access denied");

  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const targetId = String(formData.get("user_id"));
  const newValue = formData.get("is_admin") === "true";

  // Prevent self-demotion — throw so future UI can surface this
  if (authData.user?.id === targetId && !newValue)
    throw new Error("You can't remove your own admin rights");

  // is_admin is no longer client-writable (column grant revoked) — the change
  // must go through the service role after the admin check above.
  const admin = createServiceClient();
  const { error } = await admin
    .from("profiles")
    .update({ is_admin: newValue })
    .eq("id", targetId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/users");
}
