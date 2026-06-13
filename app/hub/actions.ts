"use server";

import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function uid() {
  const user = await getSessionUser();
  if (!user) throw new Error("לא מחובר");
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return { supabase, userId: data.user!.id };
}

export async function addAccount(formData: FormData) {
  const { supabase, userId } = await uid();
  const name = String(formData.get("name") || "").trim();
  const type = String(formData.get("type") || "broker");
  if (!name) throw new Error("חסר שם");
  await supabase.from("accounts").insert({ user_id: userId, name, type });
  revalidatePath("/hub");
}

export async function deleteAccount(formData: FormData) {
  const { supabase, userId } = await uid();
  await supabase
    .from("accounts")
    .delete()
    .eq("id", String(formData.get("id")))
    .eq("user_id", userId);
  revalidatePath("/hub");
}

const VALID_CURRENCIES = ["USD", "ILS", "EUR", "GBP"] as const;

// Derive canonical currency server-side — don't trust client for auto-currency types
function canonicalCurrency(assetType: string, clientCurrency: string): string {
  if (assetType === "stock_il") return "ILS";
  if (assetType === "stock_us" || assetType === "etf" || assetType === "crypto") return "USD";
  // cash / manual: validate client value against allowlist
  const upper = clientCurrency.toUpperCase();
  return (VALID_CURRENCIES as readonly string[]).includes(upper) ? upper : "USD";
}

export async function addHolding(formData: FormData) {
  const { supabase, userId } = await uid();
  const accountId = String(formData.get("account_id"));
  const assetType = String(formData.get("asset_type"));
  const symbolRaw = String(formData.get("symbol") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const quantity = parseFloat(String(formData.get("quantity") || "0")) || 0;
  const clientCurrency = String(formData.get("currency") || "USD");
  const currency = canonicalCurrency(assetType, clientCurrency);
  const manualValue = parseFloat(String(formData.get("manual_value") || "0")) || 0;

  const row: Record<string, unknown> = {
    user_id: userId,
    account_id: accountId,
    asset_type: assetType,
    currency,
  };
  if (assetType === "manual") {
    row.name = name || "נכס ידני";
    row.manual_value = manualValue;
    row.quantity = 0;
  } else if (assetType === "cash") {
    row.symbol = currency;
    row.name = name || null;
    row.quantity = quantity;
  } else {
    row.symbol = symbolRaw.toUpperCase();
    row.name = name || null;
    row.quantity = quantity;
  }

  await supabase.from("holdings").insert(row);
  revalidatePath("/hub");
}

export async function deleteHolding(formData: FormData) {
  const { supabase, userId } = await uid();
  await supabase
    .from("holdings")
    .delete()
    .eq("id", String(formData.get("id")))
    .eq("user_id", userId);
  revalidatePath("/hub");
}

export async function setBaseCurrency(formData: FormData) {
  const { supabase, userId } = await uid();
  const code = String(formData.get("currency") || "USD");
  await supabase.from("profiles").update({ base_currency: code }).eq("id", userId);
  revalidatePath("/hub");
}

// Records (upserts) today's total value snapshot in USD (canonical).
export async function saveSnapshot(totalUsd: number) {
  const { supabase, userId } = await uid();
  const today = new Date().toISOString().slice(0, 10);
  await supabase.from("portfolio_snapshots").upsert(
    {
      user_id: userId,
      snapshot_date: today,
      total_value: Math.round(totalUsd * 100) / 100,
      currency: "USD",
    },
    { onConflict: "user_id,snapshot_date,currency" }
  );
}
