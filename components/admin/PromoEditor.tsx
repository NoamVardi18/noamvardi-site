"use client";

import { useState } from "react";
import { PromoSection } from "@/components/landing/PromoSection";
import { savePromoAction } from "@/app/admin/promo/actions";
import type { Promo } from "@/lib/promo";

export function PromoEditor({ promo }: { promo: Promo }) {
  const [draft, setDraft] = useState({
    enabled: promo.enabled,
    badge_text: promo.badge_text ?? "",
    title: promo.title ?? "",
    subtitle: promo.subtitle ?? "",
    price_text: promo.price_text ?? "",
    features: (promo.features ?? []).join("\n"),
    cta_text: promo.cta_text ?? "",
    cta_link: promo.cta_link ?? "",
  });
  const [saved, setSaved] = useState(false);

  const set = (k: keyof typeof draft) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setSaved(false);
      setDraft((d) => ({
        ...d,
        [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value,
      }));
    };

  const previewPromo: Promo = {
    ...promo,
    enabled: draft.enabled,
    badge_text: draft.badge_text || null,
    title: draft.title || "Your offer title appears here",
    subtitle: draft.subtitle || null,
    price_text: draft.price_text || null,
    features: draft.features.split("\n").map((f) => f.trim()).filter(Boolean),
    cta_text: draft.cta_text || null,
    cta_link: draft.cta_link || null,
  };

  return (
    <>
      <div className="card">
        <form
          action={async (fd) => {
            await savePromoAction(fd);
            setSaved(true);
          }}
          className="lform"
        >
          <input type="hidden" name="id" value={promo.id} />

          <label className="toggle" style={{ marginBottom: 4 }}>
            <input
              type="checkbox" name="enabled"
              checked={draft.enabled} onChange={set("enabled")}
            />
            <span className="knob" aria-hidden="true" />
            <span className="tl">
              {draft.enabled ? "Offer is live — shown on the homepage" : "Offer is off — hidden from the site"}
            </span>
          </label>

          <div className="form-row">
            <div className="lfg">
              <label htmlFor="p-badge">Badge</label>
              <input id="p-badge" name="badge_text" value={draft.badge_text} onChange={set("badge_text")} placeholder="Launch offer" />
            </div>
            <div className="lfg">
              <label htmlFor="p-price">Price (free text)</label>
              <input id="p-price" name="price_text" value={draft.price_text} onChange={set("price_text")} placeholder="$1,500 / month" />
            </div>
          </div>

          <div className="lfg">
            <label htmlFor="p-title">Title *</label>
            <input id="p-title" name="title" value={draft.title} onChange={set("title")} placeholder="Your first business agent — starter package" />
          </div>

          <div className="lfg">
            <label htmlFor="p-sub">Short description</label>
            <input id="p-sub" name="subtitle" value={draft.subtitle} onChange={set("subtitle")} placeholder="A line or two explaining the offer" />
          </div>

          <div className="lfg">
            <label htmlFor="p-feat">What's included (one line per item)</label>
            <textarea id="p-feat" name="features" rows={5} value={draft.features} onChange={set("features")} placeholder={"24/7 support agent\nBusiness WhatsApp connection\nMonthly support"} />
          </div>

          <div className="form-row">
            <div className="lfg">
              <label htmlFor="p-cta">Button text</label>
              <input id="p-cta" name="cta_text" value={draft.cta_text} onChange={set("cta_text")} placeholder="I want this" />
            </div>
            <div className="lfg">
              <label htmlFor="p-link">Button link</label>
              <input id="p-link" name="cta_link" value={draft.cta_link} onChange={set("cta_link")} placeholder="#contact" dir="ltr" />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button className="btn-blk" type="submit">Save & publish</button>
            {saved && <span style={{ color: "var(--good)", fontSize: 14 }}>✓ Saved</span>}
          </div>
        </form>
      </div>

      <div style={{ marginTop: 36 }}>
        <h3 style={{ fontSize: 15, color: "var(--text-dim)", marginBottom: 0 }}>
          Preview — how it looks on the homepage:
        </h3>
        <div style={{ margin: "0 -32px" }}>
          <PromoSection promo={previewPromo} preview />
        </div>
      </div>
    </>
  );
}
