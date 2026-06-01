"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
type Account = { id: string; name: string; type: string; holdings: Holding[] };

const ASSET_LABEL: Record<string, string> = Object.fromEntries(
  ASSET_TYPES.map((a) => [a.value, a.label])
);

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
  const rate = fxFromUsd[cur] ?? 1;
  const sym = CURRENCIES.find((c) => c.code === cur)?.symbol ?? "$";

  const fmt = (usd: number) =>
    `${sym}${(usd * rate).toLocaleString("he-IL", { maximumFractionDigits: 0 })}`;

  function pickCurrency(code: string) {
    setCur(code);
    const fd = new FormData();
    fd.set("currency", code);
    setBaseCurrency(fd);
  }

  // change vs previous snapshot
  const prev = snapshots.length > 1 ? snapshots[snapshots.length - 2].usd : null;
  const change = prev !== null ? totalUsd - prev : null;
  const changePct = prev && prev > 0 ? ((totalUsd - prev) / prev) * 100 : null;

  return (
    <main className="page">
      <h1>מרכז הנכסים{userName ? `, ${userName.split(" ")[0]}` : ""}</h1>
      <p className="sub">כל ההשקעות שלך במקום אחד — מניות, קרנות, מטבעות ועוד.</p>

      {/* Total + Graph */}
      <div className="hub-top">
        <div className="hub-total">
          <span className="lbl">שווי כולל</span>
          <span className="val">{fmt(totalUsd)}</span>
          {change !== null && (
            <span className={`chg ${change >= 0 ? "up" : "down"}`}>
              {change >= 0 ? "▲" : "▼"} {sym}
              {Math.abs(change * rate).toLocaleString("he-IL", { maximumFractionDigits: 0 })}
              {changePct !== null && ` (${changePct.toFixed(1)}%)`} מהביקור הקודם
            </span>
          )}
          <div className="cur-switch" role="group" aria-label="מטבע תצוגה">
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                className={cur === c.code ? "active" : ""}
                onClick={() => pickCurrency(c.code)}
              >
                {c.code}
              </button>
            ))}
          </div>
        </div>

        <div className="hub-graph">
          <h3>היסטוריית שווי</h3>
          <Graph snapshots={snapshots} rate={rate} sym={sym} />
        </div>
      </div>

      {/* Summary by type */}
      <div className="hub-summary">
        {ASSET_TYPES.map((t) => (
          <div className="sum-box" key={t.value}>
            <div className="t">{t.label}</div>
            <div className="v">{fmt(byType[t.value] || 0)}</div>
          </div>
        ))}
      </div>

      {/* Accounts */}
      {accounts.length === 0 ? (
        <div className="card empty-state" style={{ padding: 48 }}>
          <p>עדיין לא הוספת חשבונות. התחל בהוספת בית השקעות, ארנק או קרן למטה.</p>
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
                <button className="icon-btn danger" type="submit">מחק חשבון</button>
              </form>
            </div>

            {acc.holdings.length > 0 && (
              <table className="tbl">
                <thead>
                  <tr>
                    <th>נכס</th>
                    <th>סוג</th>
                    <th>כמות</th>
                    <th>שווי ({cur})</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {acc.holdings.map((h) => (
                    <tr key={h.id}>
                      <td style={{ fontWeight: 600 }}>
                        {h.symbol || h.name || "—"}
                        {h.name && h.symbol && <span className="muted"> · {h.name}</span>}
                      </td>
                      <td>{ASSET_LABEL[h.asset_type] ?? h.asset_type}</td>
                      <td>
                        {h.asset_type === "manual"
                          ? "—"
                          : Number(h.quantity).toLocaleString("he-IL")}
                      </td>
                      <td style={{ fontWeight: 700 }}>{fmt(h.usdValue)}</td>
                      <td>
                        <form action={deleteHolding}>
                          <input type="hidden" name="id" value={h.id} />
                          <button className="icon-btn danger" type="submit">מחק</button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <AddHoldingForm accountId={acc.id} onDone={() => router.refresh()} />
          </div>
        ))
      )}

      {/* Add account */}
      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ marginTop: 0 }}>הוספת חשבון / בית השקעות / ארנק</h3>
        <form action={addAccount} className="add-row">
          <div className="lfg">
            <label>שם החשבון</label>
            <input name="name" list="preset-accounts" placeholder="לדוגמה: מיטב טרייד" required />
            <datalist id="preset-accounts">
              {PRESET_ACCOUNTS.map((p) => (
                <option value={p} key={p} />
              ))}
            </datalist>
          </div>
          <div className="lfg">
            <label>סוג</label>
            <select name="type" defaultValue="broker">
              {ACCOUNT_TYPES.map((t) => (
                <option value={t.value} key={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <button className="btn-blk" type="submit">הוספה</button>
        </form>
      </div>
    </main>
  );
}

function AddHoldingForm({
  accountId,
  onDone,
}: {
  accountId: string;
  onDone: () => void;
}) {
  const [type, setType] = useState("stock_us");
  const [cryptoId, setCryptoId] = useState("bitcoin");
  const needsSymbol = type === "stock_us" || type === "stock_il" || type === "etf";
  const isCash = type === "cash";
  const isManual = type === "manual";
  const isCrypto = type === "crypto";

  return (
    <form
      action={async (fd) => {
        // For crypto: store coingecko id as symbol, coin symbol as name
        if (type === "crypto") {
          const coin = CRYPTO_COINS.find((c) => c.id === cryptoId);
          fd.set("symbol", cryptoId);
          if (coin && !fd.get("name")) fd.set("name", `${coin.symbol} – ${coin.name}`);
        }
        await addHolding(fd);
        onDone();
      }}
      className="add-row"
      style={{ marginTop: 16 }}
    >
      <input type="hidden" name="account_id" value={accountId} />
      <div className="lfg">
        <label>סוג נכס</label>
        <select name="asset_type" value={type} onChange={(e) => setType(e.target.value)}>
          {ASSET_TYPES.map((t) => (
            <option value={t.value} key={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {isCrypto && (
        <div className="lfg">
          <label>מטבע קריפטו</label>
          <select
            name="_crypto_select"
            value={cryptoId}
            onChange={(e) => setCryptoId(e.target.value)}
          >
            {CRYPTO_COINS.map((c) => (
              <option value={c.id} key={c.id}>
                {c.symbol} – {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {needsSymbol && (
        <div className="lfg">
          <label>סימול</label>
          <input name="symbol" placeholder={type === "stock_il" ? "TEVA" : "AAPL"} dir="ltr" required />
        </div>
      )}
      {isManual && (
        <div className="lfg">
          <label>שם הנכס</label>
          <input name="name" placeholder="קרן השתלמות" required />
        </div>
      )}

      {!isManual && (
        <div className="lfg">
          <label>{isCash ? "סכום" : "כמות"}</label>
          <input name="quantity" type="number" step="any" min="0" placeholder="0" required />
        </div>
      )}
      {isManual && (
        <div className="lfg">
          <label>שווי נוכחי</label>
          <input name="manual_value" type="number" step="any" min="0" placeholder="0" required />
        </div>
      )}

      {!isCrypto && (
        <div className="lfg">
          <label>מטבע</label>
          <select name="currency" defaultValue={type === "stock_il" ? "ILS" : "USD"}>
            {CURRENCIES.map((c) => (
              <option value={c.code} key={c.code}>{c.code}</option>
            ))}
          </select>
        </div>
      )}
      {isCrypto && <input type="hidden" name="currency" value="USD" />}

      <button className="btn-blk" type="submit">+ הוסף נכס</button>
    </form>
  );
}

function Graph({
  snapshots,
  rate,
  sym,
}: {
  snapshots: { date: string; usd: number }[];
  rate: number;
  sym: string;
}) {
  if (snapshots.length < 2) {
    return (
      <p className="muted" style={{ fontSize: 14 }}>
        הגרף יתחיל להצטייר ככל שתחזור לאתר — כל יום נשמרת נקודה חדשה.
      </p>
    );
  }
  const W = 520, H = 180, pad = 8;
  const vals = snapshots.map((s) => s.usd * rate);
  const min = Math.min(...vals), max = Math.max(...vals);
  const range = max - min || 1;
  const pts = vals.map((v, i) => {
    const x = pad + (i / (vals.length - 1)) * (W - pad * 2);
    const y = H - pad - ((v - min) / range) * (H - pad * 2);
    return [x, y];
  });
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)},${H - pad} L${pts[0][0].toFixed(1)},${H - pad} Z`;
  const last = vals[vals.length - 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img" aria-label="גרף שווי לאורך זמן">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(10,10,10,0.12)" />
          <stop offset="100%" stopColor="rgba(10,10,10,0)" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#g)" />
      <path d={line} fill="none" stroke="#0a0a0a" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="3.5" fill="#0a0a0a" />
      <text x={pad} y={14} fontSize="12" fill="#9a9a9a">
        {sym}{last.toLocaleString("he-IL", { maximumFractionDigits: 0 })}
      </text>
    </svg>
  );
}
