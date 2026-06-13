import { createClient } from "@/lib/supabase/server";

export type Promo = {
  id: string;
  enabled: boolean;
  badge_text: string | null;
  title: string | null;
  subtitle: string | null;
  price_text: string | null;
  features: string[];
  cta_text: string | null;
  cta_link: string | null;
  updated_at: string;
};

// RLS: anonymous visitors only see the row when enabled; admins always see it.
export async function getPromo(): Promise<Promo | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("promos").select("*").limit(1).maybeSingle();
  return (data as Promo | null) ?? null;
}
