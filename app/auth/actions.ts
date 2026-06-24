"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

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

export async function signUpAction(
  _prev: Result,
  formData: FormData
): Promise<Result> {
  const fullName = String(formData.get("full_name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const agreedTerms = formData.get("agreed_terms") === "on";
  const marketing = formData.get("marketing_opt_in") === "on";

  if (!fullName || !email || !password)
    return { error: "Please fill in all fields" };
  if (password.length < 8)
    return { error: "Password must be at least 8 characters" };
  if (!agreedTerms)
    return { error: "You must accept the Terms to sign up" };

  const meta = {
    full_name: fullName,
    agreed_terms: agreedTerms,
    marketing_opt_in: marketing,
  };

  // If a service-role key is configured, create a pre-confirmed user so the
  // member is logged in immediately (no email-confirmation round trip).
  const hasService = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (hasService) {
    const admin = createServiceClient();
    const { error: createErr } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: meta,
    });
    if (createErr) {
      if (createErr.message.toLowerCase().includes("already"))
        return { error: "This email is already registered. Try signing in." };
      return { error: "Sign-up failed. Please try again." };
    }
    const supabase = await createClient();
    await supabase.auth.signInWithPassword({ email, password });
    revalidatePath("/", "layout");
    return { ok: true };
  }

  // Fallback: standard sign-up (requires email confirmation to be disabled
  // in Supabase Auth settings for instant login).
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: meta },
  });
  if (error) {
    if (error.message.toLowerCase().includes("registered") || error.message.toLowerCase().includes("already"))
      return { error: "This email is already registered. Try signing in." };
    return { error: "Sign-up failed. Please try again." };
  }
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
}

export async function signInWithGoogleAction() {
  const supabase = await createClient();
  const h = await headers();
  const origin = h.get("origin") ?? `https://${h.get("host")}`;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${origin}/auth/callback` },
  });
  if (error || !data?.url) redirect("/?auth_error=1");
  redirect(data.url);
}
