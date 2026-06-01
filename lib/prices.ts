// Price & FX providers (all free tiers).
// FX: Frankfurter (ECB).  US stocks/ETF: Finnhub.  IL stocks: Yahoo Finance (.TA).  Crypto: CoinGecko (no key).

export type Quote = { price: number; currency: string };

const SUPPORTED_FX = ["USD", "ILS", "EUR", "GBP"];

// Returns a matrix rate[from][to]. Always includes the 4 core currencies.
export async function getFxMatrix(): Promise<Record<string, Record<string, number>>> {
  const matrix: Record<string, Record<string, number>> = {};
  for (const base of SUPPORTED_FX) {
    matrix[base] = { [base]: 1 };
  }
  try {
    // One call: rates relative to USD.
    const res = await fetch(
      "https://api.frankfurter.dev/v1/latest?base=USD&symbols=ILS,EUR,GBP",
      { next: { revalidate: 3600 } }
    );
    const json = await res.json();
    const usd: Record<string, number> = { USD: 1, ...json.rates };
    // Build full matrix from USD anchor.
    for (const from of SUPPORTED_FX) {
      for (const to of SUPPORTED_FX) {
        // value(1 `from`) in `to` = usd[to] / usd[from]
        matrix[from][to] = usd[to] / usd[from];
      }
    }
  } catch {
    // Fallback static-ish rates if the API is unreachable.
    const usd: Record<string, number> = { USD: 1, ILS: 3.7, EUR: 0.92, GBP: 0.79 };
    for (const from of SUPPORTED_FX)
      for (const to of SUPPORTED_FX) matrix[from][to] = usd[to] / usd[from];
  }
  return matrix;
}

export function convert(
  amount: number,
  from: string,
  to: string,
  fx: Record<string, Record<string, number>>
): number {
  if (from === to) return amount;
  const rate = fx[from]?.[to];
  if (rate) return amount * rate;
  // bridge through USD if direct missing
  const a = fx[from]?.["USD"];
  const b = fx["USD"]?.[to];
  if (a && b) return amount * a * b;
  return amount;
}

async function finnhubQuote(symbol: string): Promise<Quote | null> {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${key}`,
      { next: { revalidate: 300 } }
    );
    const j = await res.json();
    if (typeof j.c === "number" && j.c > 0) return { price: j.c, currency: "USD" };
  } catch {
    /* ignore */
  }
  return null;
}

// CoinGecko – no API key required, 30 req/min free.
async function cryptoQuotes(ids: string[]): Promise<Record<string, Quote>> {
  if (!ids.length) return {};
  try {
    const joined = ids.join(",");
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(joined)}&vs_currencies=usd`,
      { next: { revalidate: 120 } }
    );
    const j = await res.json();
    const out: Record<string, Quote> = {};
    for (const [id, val] of Object.entries(j)) {
      const price = (val as { usd: number }).usd;
      if (typeof price === "number") out[id] = { price, currency: "USD" };
    }
    return out;
  } catch {
    return {};
  }
}

async function yahooQuote(symbol: string): Promise<Quote | null> {
  // TASE symbols use a .TA suffix on Yahoo. Prices may come in agorot (ILA).
  const sym = symbol.toUpperCase().endsWith(".TA") ? symbol : `${symbol}.TA`;
  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}`,
      { next: { revalidate: 300 }, headers: { "User-Agent": "Mozilla/5.0" } }
    );
    const j = await res.json();
    const meta = j?.chart?.result?.[0]?.meta;
    if (meta?.regularMarketPrice) {
      let price = meta.regularMarketPrice as number;
      let currency = (meta.currency as string) || "ILS";
      if (currency === "ILA") {
        price = price / 100; // agorot -> shekel
        currency = "ILS";
      }
      return { price, currency };
    }
  } catch {
    /* ignore */
  }
  return null;
}

// Fetch a single quote for a holding symbol given its asset type.
export async function getQuote(
  assetType: string,
  symbol: string | null
): Promise<Quote | null> {
  if (!symbol) return null;
  if (assetType === "stock_il") return yahooQuote(symbol);
  if (assetType === "crypto") {
    const m = await cryptoQuotes([symbol.toLowerCase()]);
    return m[symbol.toLowerCase()] ?? null;
  }
  // stock_us, etf
  return finnhubQuote(symbol);
}

// Batch unique symbols → quotes.
export async function getQuotes(
  holdings: { asset_type: string; symbol: string | null }[]
): Promise<Record<string, Quote>> {
  const targets = new Map<string, { asset_type: string; symbol: string }>();
  const cryptoIds: string[] = [];

  for (const h of holdings) {
    if (!h.symbol) continue;
    if (h.asset_type === "crypto") {
      // symbol stored as coingecko id (e.g. "bitcoin")
      if (!cryptoIds.includes(h.symbol.toLowerCase())) {
        cryptoIds.push(h.symbol.toLowerCase());
      }
    } else if (
      h.asset_type === "stock_us" ||
      h.asset_type === "etf" ||
      h.asset_type === "stock_il"
    ) {
      targets.set(`${h.asset_type}:${h.symbol.toUpperCase()}`, {
        asset_type: h.asset_type,
        symbol: h.symbol,
      });
    }
  }

  // Fetch crypto in one batch + other quotes in parallel
  const [cryptoMap, ...stockEntries] = await Promise.all([
    cryptoQuotes(cryptoIds),
    ...[...targets.entries()].map(async ([key, t]) => {
      const q = await getQuote(t.asset_type, t.symbol);
      return [key, q] as const;
    }),
  ]);

  const out: Record<string, Quote> = {};
  // Crypto keyed as "crypto:<coingecko-id>"
  for (const [id, q] of Object.entries(cryptoMap)) {
    out[`crypto:${id}`] = q;
  }
  for (const entry of stockEntries) {
    const [key, q] = entry as [string, Quote | null];
    if (q) out[key] = q;
  }
  return out;
}

// Native value of a holding (in the holding's own currency context).
export function holdingNativeValue(
  h: { asset_type: string; symbol: string | null; quantity: number; currency: string; manual_value: number | null },
  quotes: Record<string, Quote>
): { value: number; currency: string } {
  if (h.asset_type === "cash") {
    return { value: Number(h.quantity) || 0, currency: h.currency };
  }
  if (h.asset_type === "manual") {
    return { value: Number(h.manual_value) || 0, currency: h.currency };
  }
  // Crypto keyed lowercase; stocks keyed uppercase
  const key = h.asset_type === "crypto"
    ? `crypto:${(h.symbol || "").toLowerCase()}`
    : `${h.asset_type}:${(h.symbol || "").toUpperCase()}`;
  const q = quotes[key];
  if (!q) return { value: 0, currency: h.currency };
  return { value: (Number(h.quantity) || 0) * q.price, currency: q.currency };
}
