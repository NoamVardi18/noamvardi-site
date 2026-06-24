"use server";

import { createClient } from "@/lib/supabase/server";

type Result = { error?: string; ok?: boolean };

export async function submitContactAction(
  _prev: Result,
  formData: FormData
): Promise<Result> {
  // Honeypot — bots fill every field; humans never see this one.
  if (String(formData.get("website") || "")) return { ok: true };

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const company = String(formData.get("company") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !email || !message) return { error: "Please fill in name, email and a message" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Invalid email address" };
  if (message.length > 4000) return { error: "Message is too long" };

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({
    name: name.slice(0, 200),
    email: email.slice(0, 200),
    phone: phone.slice(0, 50) || null,
    company: company.slice(0, 200) || null,
    message,
  });
  if (error) return { error: "Something went wrong. Try again or message me on WhatsApp." };
  return { ok: true };
}
