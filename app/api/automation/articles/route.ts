import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

function slugify(s: string) {
  const base = s
    .trim()
    .toLowerCase()
    .replace(/[^֐-׿a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60);
  return `${base || "article"}-${Math.random().toString(36).slice(2, 7)}`;
}

const VALID_CATEGORIES = ["ai_tech", "web_design", "finance"];

// POST /api/automation/articles
// Headers: x-automation-secret: <AUTOMATION_SECRET>
// Body: { title, body, category?, excerpt?, cover_image?, status? }
export async function POST(req: Request) {
  const secret = req.headers.get("x-automation-secret");
  if (!process.env.AUTOMATION_SECRET || secret !== process.env.AUTOMATION_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "service key not configured" }, { status: 500 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const title = String(payload.title || "").trim();
  const body = String(payload.body || "");
  if (!title || !body) {
    return NextResponse.json({ error: "title and body required" }, { status: 400 });
  }
  const category = VALID_CATEGORIES.includes(String(payload.category))
    ? String(payload.category)
    : "ai_tech";
  const status = payload.status === "draft" ? "draft" : "published";

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("articles")
    .insert({
      title,
      slug: slugify(title),
      body,
      category,
      excerpt: payload.excerpt ? String(payload.excerpt) : null,
      cover_image: payload.cover_image ? String(payload.cover_image) : null,
      status,
      source: "automation",
      published_at: status === "published" ? new Date().toISOString() : null,
    })
    .select("id, slug")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, article: data });
}
