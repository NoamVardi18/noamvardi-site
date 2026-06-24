export const BRAND = {
  name: "SharpenDaily",
  tagline: "GET GENUINELY BETTER — DAILY",
  email: "hello@sharpendaily.co",
  phone: "0528369212",
  phoneIntl: "972528369212",
};

export const CURRENCIES = [
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "ILS", symbol: "₪", label: "Israeli Shekel" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]["code"];

export const ASSET_TYPES = [
  { value: "stock_us", label: "US Stock" },
  { value: "stock_il", label: "Israeli Stock (TASE)" },
  { value: "etf", label: "ETF" },
  { value: "crypto", label: "Crypto" },
  { value: "cash", label: "Cash / Currency" },
  { value: "manual", label: "Manual value (fund / pension)" },
] as const;

// CoinGecko IDs for popular coins (symbol → coingecko-id)
export const CRYPTO_COINS: { symbol: string; name: string; id: string }[] = [
  { symbol: "BTC",  name: "Bitcoin",       id: "bitcoin" },
  { symbol: "ETH",  name: "Ethereum",      id: "ethereum" },
  { symbol: "SOL",  name: "Solana",        id: "solana" },
  { symbol: "BNB",  name: "BNB",           id: "binancecoin" },
  { symbol: "XRP",  name: "XRP",           id: "ripple" },
  { symbol: "ADA",  name: "Cardano",       id: "cardano" },
  { symbol: "DOGE", name: "Dogecoin",      id: "dogecoin" },
  { symbol: "MATIC",name: "Polygon",       id: "matic-network" },
  { symbol: "DOT",  name: "Polkadot",      id: "polkadot" },
  { symbol: "AVAX", name: "Avalanche",     id: "avalanche-2" },
  { symbol: "LINK", name: "Chainlink",     id: "chainlink" },
  { symbol: "UNI",  name: "Uniswap",       id: "uniswap" },
  { symbol: "LTC",  name: "Litecoin",      id: "litecoin" },
  { symbol: "ATOM", name: "Cosmos",        id: "cosmos" },
  { symbol: "TRX",  name: "TRON",          id: "tron" },
  { symbol: "USDT", name: "Tether (USDT)", id: "tether" },
  { symbol: "USDC", name: "USD Coin",      id: "usd-coin" },
];

export const ACCOUNT_TYPES = [
  { value: "broker", label: "Brokerage" },
  { value: "bank", label: "Bank" },
  { value: "cold_wallet", label: "Cold wallet" },
  { value: "fund", label: "Fund" },
  { value: "pension", label: "Pension" },
  { value: "other", label: "Other" },
] as const;

// Preset brokers/wallets (user can also add free-text).
export const PRESET_ACCOUNTS = [
  "Bloomberg Trade",
  "Meitav Trade",
  "IBI",
  "Excellence",
  "Psagot",
  "Interactive Brokers",
  "eToro",
  "Plus500",
  "Ledger (cold wallet)",
  "Trezor (cold wallet)",
  "Binance",
  "Coinbase",
  "Altshuler Shaham",
  "More",
  "Harel",
];

export const ARTICLE_CATEGORIES = [
  { value: "ai_tech", label: "AI & Tech" },
  { value: "web_design", label: "Build & Design" },
  { value: "finance", label: "Markets & Investing" },
] as const;
