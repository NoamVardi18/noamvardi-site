import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { HubClient } from "@/components/HubClient";
import { getSessionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getFxMatrix, getQuotes, holdingNativeValue, convert } from "@/lib/prices";
import { saveSnapshot } from "./actions";

export const metadata = { title: "Asset hub | SharpenDaily" };
export const dynamic = "force-dynamic";

type Holding = {
  id: string;
  account_id: string;
  asset_type: string;
  symbol: string | null;
  name: string | null;
  quantity: number;
  currency: string;
  manual_value: number | null;
};

export default async function HubPage() {
  const user = await getSessionUser();
  if (!user) redirect("/");

  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const userId = authData.user!.id;

  const { data: profile } = await supabase
    .from("profiles")
    .select("base_currency")
    .eq("id", userId)
    .single();
  const baseCurrency = profile?.base_currency || "USD";

  const { data: accountsData } = await supabase
    .from("accounts")
    .select("id, name, type")
    .order("created_at");
  const { data: holdingsData } = await supabase
    .from("holdings")
    .select("id, account_id, asset_type, symbol, name, quantity, currency, manual_value")
    .order("created_at");

  const accounts = accountsData ?? [];
  const holdings = (holdingsData ?? []) as Holding[];

  const [fx, quotes] = await Promise.all([
    getFxMatrix(),
    getQuotes(holdings.map((h) => ({ asset_type: h.asset_type, symbol: h.symbol }))),
  ]);

  // Value each holding in USD.
  const byType: Record<string, number> = {};
  let totalUsd = 0;
  const valued = holdings.map((h) => {
    const native = holdingNativeValue(h, quotes);
    const usd = convert(native.value, native.currency, "USD", fx);
    totalUsd += usd;
    byType[h.asset_type] = (byType[h.asset_type] || 0) + usd;
    return { ...h, usdValue: usd, nativeValue: native.value, nativeCurrency: native.currency };
  });

  // Persist today's snapshot (canonical USD) so history accumulates.
  if (holdings.length > 0) {
    try { await saveSnapshot(totalUsd); } catch { /* non-fatal */ }
  }

  const { data: snapsData } = await supabase
    .from("portfolio_snapshots")
    .select("snapshot_date, total_value")
    .eq("currency", "USD")
    .order("snapshot_date", { ascending: true })
    .limit(120);
  const snapshots = (snapsData ?? []).map((s) => ({
    date: s.snapshot_date as string,
    usd: Number(s.total_value),
  }));

  const accountsWithHoldings = accounts.map((acc) => ({
    ...acc,
    holdings: valued.filter((h) => h.account_id === acc.id),
  }));

  return (
    <>
      <SiteHeader user={user} />
      <HubClient
        userName={user.name}
        baseCurrency={baseCurrency}
        fxFromUsd={fx["USD"]}
        totalUsd={totalUsd}
        byType={byType}
        accounts={accountsWithHoldings}
        snapshots={snapshots}
      />
      <SiteFooter />
    </>
  );
}
