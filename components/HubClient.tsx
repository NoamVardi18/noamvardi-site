"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  CURRENCIES,
  ASSET_TYPES,
  ACCOUNT_TYPES,
  PRESET_ACCOUNTS,
  CRYPTO_COINS,
} from "@/lib/constants";
import {
  addAccount,
  deleteAccount,
  addHolding,
  deleteHolding,
  setBaseCurrency,
} from "@/app/hub/actions";

type Holding = {
  id: string;
  asset_type: string;
  symbol: string | null;
  name: string | null;
  quantity: number;
  currency: string;
  manual_value: number | null;
  usdValue: number;
};
type FlatHolding = Holding & { accountName: string };
type Account = { id: string; name: string; type: string; holdings: Holding[] };

const ASSET_LABEL: Record<string, string> = Object.fromEntries(
  ASSET_TYPES.map((a) => [a.value, a.label])
);

const defaultCurrency = (assetType: string) =>
  assetType === "stock_il" ? "ILS" : "USD";

const ACCENT = "#C8862B";

function ChartTooltip({ active, payload, label, sym, showPct, baseVal }: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
  sym: string;
  showPct: boolean;
  baseVal: number;
}) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  const pct = baseVal > 0 ? ((val - baseVal) / baseVal) * 100 : 0;
  return (
    <div style={{
      background: "#0d1219", color: "#f2efe9", padding: "10px 14px",
      borderRadius: 12, fontSize: 13, border: "1px solid rgba(255,255,255,0.12)"
    }}>
      <div style={{ color: "rgba(242,239,233,0.45)", marginBottom: 4, fontSize: 11 }}>{label}</div>
      <div style={{ fontWeight: 700, fontSize: 16, direction: "ltr" }}>
        {showPct
          ? `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%`
          : `${sym}${val.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
        }
      </div>
    </div>
  );
}

export function HubClient({
  userName,
  baseCurrency,
  fxFromUsd,
  totalUsd,
  byType,
  accounts,
  snapshots,
}: {
  userName: string | null;
  baseCurrency: string;
  fxFromUsd: Record<string, number>;
  totalUsd: number;
  byType: Record<string, number>;
  accounts: Account[];
  snapshots: { date: string; usd: number }[];
}) {
  const router = useRouter();
  const [cur, setCur] = useState(baseCurrency);
  const [showPct, setShowPct] = useState(false);
  const [sortBy, setSortBy] = useState<"value" | "name">("value");
  const rate = fxFromUsd[cur] ?? 1;
  const sym = CURRENCIES.find((c) => c.code === cur)?.symbol ?? "$";
  const ilsRate = fxFromUsd["ILS"] ?? 3.7;

  const fmt = (usd: number) =>
    `${sym}${(usd * rate).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

  function pickCurrency(code: string) {
    setCur(code);
    const fd = new FormData();
    fd.set("currency", code);
    setBaseCurrency(fd);
  }

  const prev = snapshots.length > 1 ? snapshots[snapshots.length - 2].usd : null;
  const change = prev !== null ? totalUsd - prev : null;
  const changePct = prev && prev > 0 ? ((totalUsd - prev) / prev) * 100 : null;

  const chartData = useMemo(() => snapshots.map((s) => ({
    date: new Date(s.date).toLocaleDateString("he-IL", { day: "numeric", month: "short" }),
    usd: Math.round(s.usd * rate * 100) / 100,
  })), [snapshots, rate]);

  const baseVal = chartData.length > 0 ? chartData[0].usd : 0;

  const chartPctData = useMemo(() => chartData.map((d) => ({
    ...d,
    pct: baseVal > 0 ? ((d.usd - baseVal) / baseVal) * 100 : 0,
  })), [chartData, baseVal]);

  const allHoldings = useMemo((): FlatHolding[] => {
    const flat: FlatHolding[] = accounts.flatMap((acc) =>
      acc.holdings.map((h) => ({ ...h, accountName: acc.name }))
    );
    if (sortBy === "value") return [...flat].sort((a, b) => b.usdValue - a.usdValue);
    return [...flat].sort((a, b) => (a.symbol || a.name || "").localeCompare(b.symbol || b.name || ""));
  }, [accounts, sortBy]);

  const top3 = useMemo(() =>
    sortBy === "value"
      ? allHoldings.slice(0, 3)
      : [...allHoldings].sort((a, b) => b.usdValue - a.usdValue).slice(0, 3),
    [allHoldings, sortBy]
  );

  return (
    <main className="page">
      <span className="kicker">PRIVATE ASSET HUB</span>
      <h1>Asset hub{userName ? `, ${userName.split(" ")[0]}` : ""}</h1>
      <p className="sub">All your investments in one place — stocks, funds, crypto and more.</p>

      {/* ── Top row: Total + Graph ── */}
      <div className="hub-top">
        <div className="hub-total">
          <span className="lbl">Total value</span>
          <span className="val">{fmt(totalUsd)}</span>
          {change !== null && (
            <span className={`chg ${change >= 0 ? "up" : "down"}`}>
              {change >= 0 ? "▲" : "▼"}{" "}
              {showPct
                ? `${Math.abs(changePct ?? 0).toFixed(2)}%`
                : `${sym}${Math.abs(change * rate).toLocaleString("en-US", { maximumFractionDigits: 0 })}`
              }{" "}
              since last visit
            </span>
          )}
          <div className="cur-switch" role="group" aria-label="Display currency">
            {CURRENCIES.map((c) => (
              <button key={c.code} className={cur === c.code ? "active" : ""} onClick={() => pickCurrency(c.code)}>
                {c.code}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 10, direction: "ltr", textAlign: "right" }}>
            1 ₪ = ${(1 / ilsRate).toFixed(3)}
          </div>
        </div>

        <div className="hub-graph">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3>Value history</h3>
            <div className="seg">
              <button onClick={() => setShowPct(false)} className={!showPct ? "active" : ""}>
                {sym} Value
              </button>
              <button onClick={() => setShowPct(true)} className={showPct ? "active" : ""}>
                % Change
              </button>
            </div>
          </div>

          {chartData.length < 2 ? (
            <p style={{ color: "var(--text-faint)", fontSize: 14, paddingTop: 20 }}>
              The graph appears after 2 visits — a new point is saved each day.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={showPct ? chartPctData : chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="hubGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={ACCENT} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "rgba(242,239,233,0.4)" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "rgba(242,239,233,0.4)" }} tickLine={false} axisLine={false}
                  tickFormatter={(v) => showPct ? `${v.toFixed(1)}%` : `${sym}${Math.round(v).toLocaleString()}`}
                />
                <Tooltip content={
                  <ChartTooltip sym={sym} showPct={showPct} baseVal={baseVal} />
                } />
                <Area
                  type="monotone"
                  dataKey={showPct ? "pct" : "usd"}
                  stroke={ACCENT}
                  strokeWidth={2.5}
                  fill="url(#hubGrad)"
                  dot={false}
                  activeDot={{ r: 5, fill: ACCENT }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── Summary by type ── */}
      <div className="hub-summary">
        {ASSET_TYPES.map((t) => (
          <div className="sum-box" key={t.value}>
            <div className="t">{t.label}</div>
            <div className="v">{fmt(byType[t.value] || 0)}</div>
          </div>
        ))}
      </div>

      {/* ── Top holdings ── */}
      {top3.length > 0 && (
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ marginTop: 0, marginBottom: 16, fontSize: 15 }}>Top holdings</h3>
          <div className="top-holdings">
            {top3.map((h) => {
              const pctOfTotal = totalUsd > 0 ? (h.usdValue / totalUsd) * 100 : 0;
              return (
                <div className="th-box" key={h.id}>
                  <div className="sym">{h.symbol || h.name || "—"}</div>
                  <div className="val">{fmt(h.usdValue)}</div>
                  <div className="pct">{pctOfTotal.toFixed(1)}% of portfolio</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── All holdings table (sortable) ── */}
      {allHoldings.length > 0 && (
        <div className="card" style={{ marginBottom: 20, padding: 0, overflowX: "auto" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--glass-brd)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontSize: 15 }}>All holdings</h3>
            <div className="seg">
              <button onClick={() => setSortBy("value")} className={sortBy === "value" ? "active" : ""}>
                By value
              </button>
              <button onClick={() => setSortBy("name")} className={sortBy === "name" ? "active" : ""}>
                By name
              </button>
            </div>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Type</th>
                <th>Account</th>
                <th>Qty</th>
                <th>Value ({cur})</th>
                <th>% of portfolio</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {allHoldings.map((h) => {
                const pctOfTotal = totalUsd > 0 ? (h.usdValue / totalUsd) * 100 : 0;
                return (
                  <tr key={h.id}>
                    <td style={{ fontWeight: 600 }}>
                      {h.symbol || h.name || "—"}
                      {h.name && h.symbol && <span className="muted" style={{ fontSize: 12 }}> · {h.name}</span>}
                    </td>
                    <td><span className="pill" style={{ fontSize: 11 }}>{ASSET_LABEL[h.asset_type] ?? h.asset_type}</span></td>
                    <td className="muted">{h.accountName}</td>
                    <td>{h.asset_type === "manual" ? "—" : Number(h.quantity).toLocaleString("en-US", { maximumFractionDigits: 6 })}</td>
                    <td style={{ fontWeight: 700 }}>{fmt(h.usdValue)}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span className="mini-track">
                          <span className="mini-fill" style={{ width: `${Math.min(pctOfTotal, 100)}%`, display: "block" }} />
                        </span>
                        <span style={{ fontSize: 12, color: "var(--text-dim)" }}>{pctOfTotal.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td>
                      <form action={deleteHolding}>
                        <input type="hidden" name="id" value={h.id} />
                        <button className="icon-btn danger" type="submit">Delete</button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Accounts with add holding forms ── */}
      {accounts.length === 0 ? (
        <div className="card empty-state" style={{ padding: 48, textAlign: "center" }}>
          <p className="muted">No accounts yet. Start by adding a brokerage, wallet or fund below.</p>
        </div>
      ) : (
        accounts.map((acc) => (
          <div className="card account-block" key={acc.id}>
            <div className="account-head">
              <h3>
                {acc.name}
                <span className="pill">
                  {ACCOUNT_TYPES.find((a) => a.value === acc.type)?.label ?? acc.type}
                </span>
              </h3>
              <form action={deleteAccount}>
                <input type="hidden" name="id" value={acc.id} />
                <button className="icon-btn danger" type="submit">Delete account</button>
              </form>
            </div>
            <AddHoldingForm accountId={acc.id} onDone={() => router.refresh()} />
          </div>
        ))
      )}

      {/* ── Add account ── */}
      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ marginTop: 0 }}>Add account / brokerage / wallet</h3>
        <form action={addAccount} className="add-row">
          <div className="lfg">
            <label>Account name</label>
            <input name="name" list="preset-accounts" placeholder="e.g. Interactive Brokers" required />
            <datalist id="preset-accounts">
              {PRESET_ACCOUNTS.map((p) => <option value={p} key={p} />)}
            </datalist>
          </div>
          <div className="lfg">
            <label>Type</label>
            <select name="type" defaultValue="broker">
              {ACCOUNT_TYPES.map((t) => (
                <option value={t.value} key={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <button className="btn-blk" type="submit">Add</button>
        </form>
      </div>
    </main>
  );
}

// ── Add Holding Form ─────────────────────────────────────────────────────────
function AddHoldingForm({ accountId, onDone }: { accountId: string; onDone: () => void }) {
  const [type, setType] = useState("stock_us");
  const [cryptoId, setCryptoId] = useState("bitcoin");

  const needsSymbol = type === "stock_us" || type === "stock_il" || type === "etf";
  const isCash = type === "cash";
  const isManual = type === "manual";
  const isCrypto = type === "crypto";
  const autoCurrency = defaultCurrency(type);

  return (
    <form
      action={async (fd) => {
        if (isCrypto) {
          const coin = CRYPTO_COINS.find((c) => c.id === cryptoId);
          fd.set("symbol", cryptoId);
          if (coin) fd.set("name", `${coin.symbol} – ${coin.name}`);
        }
        await addHolding(fd);
        onDone();
      }}
      className="add-row"
      style={{ marginTop: 16 }}
    >
      <input type="hidden" name="account_id" value={accountId} />
      {!isCash && !isManual && <input type="hidden" name="currency" value={autoCurrency} />}

      <div className="lfg">
        <label>Asset type</label>
        <select name="asset_type" value={type} onChange={(e) => setType(e.target.value)}>
          {ASSET_TYPES.map((t) => (
            <option value={t.value} key={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {isCrypto && (
        <div className="lfg">
          <label>Crypto coin</label>
          <select value={cryptoId} onChange={(e) => setCryptoId(e.target.value)}>
            {CRYPTO_COINS.map((c) => (
              <option value={c.id} key={c.id}>{c.symbol} – {c.name}</option>
            ))}
          </select>
        </div>
      )}

      {needsSymbol && (
        <div className="lfg">
          <label>Symbol {type === "stock_il" && <span style={{ color: "var(--text-faint)", fontSize: 11 }}>(without .TA)</span>}</label>
          <input name="symbol" placeholder={type === "stock_il" ? "TEVA" : "AAPL"} dir="ltr" required />
        </div>
      )}

      {isManual && (
        <div className="lfg">
          <label>Asset name</label>
          <input name="name" placeholder="e.g. pension fund" required />
        </div>
      )}

      {!isManual && (
        <div className="lfg">
          <label>{isCash ? "Amount" : "Quantity"}</label>
          <input name="quantity" type="number" step="any" min="0" placeholder="0" required />
        </div>
      )}

      {isManual && (
        <div className="lfg">
          <label>Current value</label>
          <input name="manual_value" type="number" step="any" min="0" placeholder="0" required />
        </div>
      )}

      {(isCash || isManual) && (
        <div className="lfg">
          <label>Currency</label>
          <select name="currency" defaultValue="USD">
            {CURRENCIES.map((c) => (
              <option value={c.code} key={c.code}>{c.code} – {c.label}</option>
            ))}
          </select>
        </div>
      )}

      <button className="btn-blk" type="submit">+ Add asset</button>
    </form>
  );
}
