"use server";

import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const user = await getSessionUser();
  if (!user?.isAdmin) throw new Error("גישה נדחתה");
}

export async function savePromoAction(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const id = String(formData.get("id"));
  const features = String(formData.get("features") || "")
    .split("\n")
    .map((f) => f.trim())
    .filter(Boolean)
    .slice(0, 10);

  const { error } = await supabase
    .from("promos")
    .update({
      enabled: formData.get("enabled") === "on",
      badge_text: String(formData.get("badge_text") || "").trim() || null,
      title: String(formData.get("title") || "").trim() || null,
      subtitle: String(formData.get("subtitle") || "").trim() || null,
      price_text: String(formData.get("price_text") || "").trim() || null,
      features,
      cta_text: String(formData.get("cta_text") || "").trim() || null,
      cta_link: String(formData.get("cta_link") || "").trim() || null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/promo");
}
