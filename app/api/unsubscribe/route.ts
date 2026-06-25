import { NextResponse, type NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { SD } from "@/lib/sd";

// GET  → show a confirmation page (safe — link-prefetch in email clients can't
//         silently unsubscribe someone by hitting a bare GET that mutates state).
// POST → actually unsubscribe (called by the confirm button + RFC 8058 one-click).
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") || "";
  const url = `${SD.url}/api/unsubscribe?token=${encodeURIComponent(token)}`;
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Unsubscribe — SharpenDaily</title>
  <style>
    *{box-sizing:border-box}
    body{margin:0;padding:0;background:#0f0d0b;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh}
    .card{background:#16120f;border:1px solid rgba(244,241,234,.08);border-radius:18px;padding:36px 32px;max-width:400px;width:90%;text-align:center}
    h1{margin:0 0 10px;font-size:22px;color:#F4F1EA;font-weight:700}
    p{margin:0 0 24px;font-size:15px;color:rgba(244,241,234,.6);line-height:1.6}
    button{background:#C8862B;color:#14110F;border:none;border-radius:100px;padding:13px 28px;font-size:15px;font-weight:700;cursor:pointer;width:100%}
    a{color:rgba(244,241,234,.4);font-size:13px;text-decoration:none;display:block;margin-top:14px}
  </style>
</head>
<body>
  <div class="card">
    <h1>Unsubscribe from SharpenDaily?</h1>
    <p>You'll stop receiving how-to emails. You can resubscribe any time for free.</p>
    <form method="POST" action="${url}">
      <button type="submit">Yes, unsubscribe me</button>
    </form>
    <a href="${SD.url}">Never mind — take me back</a>
  </div>
</body>
</html>`;
  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") || "";
  if (token) {
    const supabase = createServiceClient();
    await supabase
      .from("subscribers")
      .update({ unsubscribed: true })
      .eq("token", token);
  }
  return NextResponse.redirect(`${SD.url}/?unsub=1`);
}
