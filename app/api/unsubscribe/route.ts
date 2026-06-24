import { NextResponse, type NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { SD } from "@/lib/sd";

export async function GET(req: NextRequest) {
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
