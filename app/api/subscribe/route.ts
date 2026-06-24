import { NextResponse, type NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendEmail, confirmEmail } from "@/lib/resend";
import { SD, SD_ACCESS_COOKIE } from "@/lib/sd";

const YEAR = 60 * 60 * 24 * 365;

export async function POST(req: NextRequest) {
  let body: { email?: string; source_video?: string; consent?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const email = String(body.email || "").trim().toLowerCase();
  const source = String(body.source_video || "").trim().slice(0, 200) || null;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email" }, { status: 422 });
  }

  // Explicit opt-in is required before we store the address or send anything.
  if (body.consent !== true) {
    return NextResponse.json({ error: "Please confirm you want the emails" }, { status: 422 });
  }

  const supabase = createServiceClient();

  // Upsert keeps one row per (email, brand); returns the token for the confirm link.
  const { data, error } = await supabase
    .from("subscribers")
    .upsert(
      { email, brand: SD.brand, source_video: source, consent: true },
      { onConflict: "email,brand", ignoreDuplicates: false }
    )
    .select("token, confirmed")
    .single();

  if (error || !data) {
    console.error("[subscribe] db error", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }

  // Instant unlock (opt 1); confirm email is the real-address check (opt 2).
  if (!data.confirmed) {
    const confirmUrl = `${SD.url}/api/confirm?token=${data.token}`;
    await sendEmail({
      to: email,
      subject: "Confirm your SharpenDaily access",
      html: confirmEmail(confirmUrl),
    });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SD_ACCESS_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    maxAge: YEAR,
    path: "/",
  });
  return res;
}
