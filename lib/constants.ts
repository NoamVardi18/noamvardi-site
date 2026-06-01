export const BRAND = {
  name: "NOAM VARDI",
  tagline: "AI · INNOVATION · FUTURE",
  email: "vardinoam3@gmail.com",
  phone: "0528369212",
  phoneIntl: "972528369212",
};

export const CURRENCIES = [
  { code: "USD", symbol: "$", label: "דולר אמריקאי" },
  { code: "ILS", symbol: "₪", label: "שקל" },
  { code: "EUR", symbol: "€", label: "אירו" },
  { code: "GBP", symbol: "£", label: "פאונד" },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]["code"];

export const ASSET_TYPES = [
  { value: "stock_us", label: "מניה אמריקאית" },
  { value: "stock_il", label: "מניה ישראלית (TASE)" },
  { value: "etf", label: "קרן סל / ETF" },
  { value: "crypto", label: "קריפטו / מטבע דיגיטלי" },
  { value: "cash", label: "מזומן / מטבע" },
  { value: "manual", label: "ערך ידני (קופ\"ג / קרן השתלמות)" },
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
  { value: "broker", label: "בית השקעות" },
  { value: "bank", label: "בנק" },
  { value: "cold_wallet", label: "ארנק קר" },
  { value: "fund", label: "קרן / גמל" },
  { value: "pension", label: "פנסיה / השתלמות" },
  { value: "other", label: "אחר" },
] as const;

// Preset brokers/wallets (user can also add free-text).
export const PRESET_ACCOUNTS = [
  "בלומברג טרייד",
  "מיטב טרייד",
  "IBI",
  "אקסלנס",
  "פסגות",
  "Interactive Brokers",
  "eToro",
  "Plus500",
  "Ledger (ארנק קר)",
  "Trezor (ארנק קר)",
  "Binance",
  "Coinbase",
  "אלטשולר שחם",
  "מור",
  "הראל",
];

export const ARTICLE_CATEGORIES = [
  { value: "ai_tech", label: "AI וטכנולוגיה" },
  { value: "web_design", label: "פיתוח ועיצוב אתרים" },
  { value: "finance", label: "שוק ההון והשקעות" },
] as const;
