import { NextResponse, type NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { SD, SD_ACCESS_COOKIE } from "@/lib/sd";

const YEAR = 60 * 60 * 24 * 365;

// Magic link target: confirms the address AND unlocks access on any device.
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") || "";
  const supabase = createServiceClient();

  if (token) {
    await supabase
      .from("subscribers")
      .update({ confirmed: true, confirmed_at: new Date().toISOString() })
      .eq("token", token);
  }

  const res = NextResponse.redirect(`${SD.url}/?confirmed=1`);
  res.cookies.set(SD_ACCESS_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    maxAge: YEAR,
    path: "/",
  });
  return res;
}
