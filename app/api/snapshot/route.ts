import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getFxMatrix, getQuotes, holdingNativeValue, convert } from "@/lib/prices";

// POST/GET /api/snapshot — records today's USD snapshot for every user.
// Auth: header x-automation-secret OR ?secret= matching AUTOMATION_SECRET.
export async function POST(req: Request) {
  return run(req);
}
export async function GET(req: Request) {
  return run(req);
}

async function run(req: Request) {
  const url = new URL(req.url);
  const secret = req.headers.get("x-automation-secret") || url.searchParams.get("secret");
  if (!process.env.AUTOMATION_SECRET || secret !== process.env.AUTOMATION_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "service key not configured" }, { status: 500 });
  }

  const supabase = createServiceClient();
  const { data: holdings } = await supabase
    .from("holdings")
    .select("user_id, asset_type, symbol, quantity, currency, manual_value");
  if (!holdings || holdings.length === 0) {
    return NextResponse.json({ ok: true, snapshots: 0 });
  }

  const [fx, quotes] = await Promise.all([
    getFxMatrix(),
    getQuotes(holdings.map((h) => ({ asset_type: h.asset_type, symbol: h.symbol }))),
  ]);

  const totals = new Map<string, number>();
  for (const h of holdings) {
    const native = holdingNativeValue(h, quotes);
    const usd = convert(native.value, native.currency, "USD", fx);
    totals.set(h.user_id, (totals.get(h.user_id) || 0) + usd);
  }

  const today = new Date().toISOString().slice(0, 10);
  const rows = [...totals.entries()].map(([user_id, total]) => ({
    user_id,
    snapshot_date: today,
    total_value: Math.round(total * 100) / 100,
    currency: "USD",
  }));

  const { error } = await supabase
    .from("portfolio_snapshots")
    .upsert(rows, { onConflict: "user_id,snapshot_date,currency" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, snapshots: rows.length });
}
