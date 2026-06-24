"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type Result = { error?: string; ok?: boolean };

export async function signInAction(
  _prev: Result,
  formData: FormData
): Promise<Result> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  if (!email || !password) return { error: "Please enter email and password" };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    if (error.message.toLowerCase().includes("invalid"))
      return { error: "Incorrect email or password" };
    return { error: "Sign-in failed. Please try again." };
  }
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
}
