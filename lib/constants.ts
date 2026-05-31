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
  { value: "cash", label: "מזומן / מטבע" },
  { value: "manual", label: "ערך ידני (קופ\"ג / קרן השתלמות)" },
] as const;

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
