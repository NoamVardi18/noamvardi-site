"use server";

import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function slugify(s: string) {
  const base = s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60);
  return `${base || "article"}-${Math.random().toString(36).slice(2, 7)}`;
}

async function requireAdmin() {
  const user = await getSessionUser();
  if (!user?.isAdmin) throw new Error("Access denied");
  return user;
}

async function uploadCover(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;
  const supabase = await createClient();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage
    .from("article-images")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error("Image upload failed");
  const { data } = supabase.storage.from("article-images").getPublicUrl(path);
  return data.publicUrl;
}

export async function createArticleAction(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const title = String(formData.get("title") || "").trim();
  const category = String(formData.get("category") || "ai_tech");
  const excerpt = String(formData.get("excerpt") || "").trim();
  const body = String(formData.get("body") || "");
  const status = String(formData.get("status") || "draft");
  if (!title) throw new Error("Title is required");

  const cover = await uploadCover(formData.get("cover") as File | null);
  const { error } = await supabase.from("articles").insert({
    title,
    slug: slugify(title),
    category,
    excerpt: excerpt || null,
    body,
    status,
    cover_image: cover,
    published_at: status === "published" ? new Date().toISOString() : null,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/articles");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateArticleAction(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const id = String(formData.get("id"));
  const title = String(formData.get("title") || "").trim();
  const category = String(formData.get("category") || "ai_tech");
  const excerpt = String(formData.get("excerpt") || "").trim();
  const body = String(formData.get("body") || "");
  const status = String(formData.get("status") || "draft");

  const patch: Record<string, unknown> = {
    title,
    category,
    excerpt: excerpt || null,
    body,
    status,
  };
  const cover = await uploadCover(formData.get("cover") as File | null);
  if (cover) patch.cover_image = cover;

  // Set published_at the first time it goes live.
  const { data: existing } = await supabase
    .from("articles")
    .select("published_at, status")
    .eq("id", id)
    .single();
  if (status === "published" && !existing?.published_at) {
    patch.published_at = new Date().toISOString();
  }

  const { error } = await supabase.from("articles").update(patch).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/articles");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteArticleAction(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const id = String(formData.get("id"));
  await supabase.from("articles").delete().eq("id", id);
  revalidatePath("/articles");
  revalidatePath("/admin");
}
