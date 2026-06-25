import { NextResponse, type NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { SD, SD_ACCESS_COOKIE } from "@/lib/sd";

const YEAR = 60 * 60 * 24 * 365;

// Magic-link target: confirms a REAL subscriber token, then unlocks access.
// A missing/garbage token must NOT set the access cookie — otherwise the email
// gate is trivially bypassable by hitting /api/confirm?token=anything.
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") || "";

  let confirmed = false;
  if (token) {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("subscribers")
      .update({ confirmed: true, confirmed_at: new Date().toISOString() })
      .eq("token", token)
      .select("id")
      .maybeSingle();
    confirmed = !!data;
  }

  const res = NextResponse.redirect(`${SD.url}/?confirmed=${confirmed ? 1 : 0}`);
  if (confirmed) {
    res.cookies.set(SD_ACCESS_COOKIE, "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: YEAR,
      path: "/",
    });
  }
  return res;
}
