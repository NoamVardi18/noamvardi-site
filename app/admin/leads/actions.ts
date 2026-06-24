"use server";

import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const user = await getSessionUser();
  if (!user?.isAdmin) throw new Error("Access denied");
}

export async function setLeadStatusAction(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const status = formData.get("status") === "handled" ? "handled" : "new";
  await supabase
    .from("contact_messages")
    .update({ status })
    .eq("id", String(formData.get("id")));
  revalidatePath("/admin/leads");
}

export async function deleteLeadAction(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase
    .from("contact_messages")
    .delete()
    .eq("id", String(formData.get("id")));
  revalidatePath("/admin/leads");
}
