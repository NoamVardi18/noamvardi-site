import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendEmail, articleEmail, broadcastEmail } from "@/lib/resend";
import { SD } from "@/lib/sd";

// POST /api/automation/newsletter
// Headers: x-automation-secret: <AUTOMATION_SECRET>
// Body (one of):
//   { articleSlug: string, subject?, dryRun? }   — announce a published how-to
//   { subject: string, html: string, dryRun? }   — custom broadcast (html = inner body)
//
// Sends to confirmed, not-unsubscribed sharpendaily subscribers. dryRun defaults
// to TRUE — nothing is sent unless dryRun is explicitly false. This is the
// after-upload send: publish the article, then call this with its slug.
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

  const isDry = payload.dryRun !== false; // default true — never send unless explicit
  const supabase = createServiceClient();

  // Resolve subject + per-recipient body builder.
  let subject = String(payload.subject || "").trim();
  let buildHtml: (unsubscribeUrl: string) => string;

  if (payload.articleSlug) {
    const slug = String(payload.articleSlug);
    const { data: art } = await supabase
      .from("articles")
      .select("title, excerpt, slug, status")
      .eq("slug", slug)
      .eq("brand", "sharpendaily")
      .single();
    if (!art) {
      return NextResponse.json({ error: "article not found" }, { status: 404 });
    }
    if (art.status !== "published") {
      return NextResponse.json({ error: "article not published" }, { status: 400 });
    }
    subject = subject || `New how-to: ${art.title}`;
    const url = `${SD.url}/articles/${art.slug}`;
    buildHtml = (unsub) =>
      articleEmail({ title: art.title, excerpt: art.excerpt, url }, unsub);
  } else {
    const html = String(payload.html || "");
    if (!subject || !html) {
      return NextResponse.json(
        { error: "provide articleSlug, or subject + html" },
        { status: 400 }
      );
    }
    buildHtml = (unsub) => broadcastEmail(html, unsub);
  }

  // Recipients: confirmed + not unsubscribed. (unsubscribed may be null.)
  const { data: subs, error } = await supabase
    .from("subscribers")
    .select("email, token, unsubscribed")
    .eq("brand", "sharpendaily")
    .eq("confirmed", true);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const recipients = (subs ?? []).filter((s) => !s.unsubscribed && s.email && s.token);

  if (isDry) {
    return NextResponse.json({
      ok: true,
      dryRun: true,
      subject,
      recipients: recipients.length,
      sample: recipients.slice(0, 3).map((r) => r.email),
    });
  }

  let sent = 0;
  let failed = 0;
  for (const r of recipients) {
    const unsub = `${SD.url}/api/unsubscribe?token=${r.token}`;
    const ok = await sendEmail({
      to: r.email,
      subject,
      html: buildHtml(unsub),
      headers: { "List-Unsubscribe": `<${unsub}>` },
    });
    ok ? sent++ : failed++;
  }

  return NextResponse.json({ ok: true, dryRun: false, subject, recipients: recipients.length, sent, failed });
}
