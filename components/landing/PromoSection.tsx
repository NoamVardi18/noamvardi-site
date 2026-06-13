import type { Promo } from "@/lib/promo";

// Pre-designed promo slot. Rendered only when the admin enables it.
// `preview` forces rendering inside the admin preview pane.
export function PromoSection({ promo, preview = false }: { promo: Promo | null; preview?: boolean }) {
  if (!promo) return null;
  if (!promo.enabled && !preview) return null;

  const features = Array.isArray(promo.features) ? promo.features : [];

  return (
    <section className="section" id="promo" aria-label="הצעה מיוחדת">
      <div className="section-inner">
        <div className={`promo-card ${preview ? "" : "fade-up"}`}>
          {promo.badge_text && <span className="promo-badge">{promo.badge_text}</span>}
          <div>
            <span className="kicker">LIMITED OFFER</span>
            <h2>{promo.title}</h2>
            {promo.subtitle && <p className="promo-sub">{promo.subtitle}</p>}
            {features.length > 0 && (
              <ul className="promo-features">
                {features.map((f) => (
                  <li key={f}>
                    <span className="check" aria-hidden="true">✓</span> {f}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="promo-price-box">
            {promo.price_text && <div className="price">{promo.price_text}</div>}
            <a href={promo.cta_link || "#contact"} className="btn-primary">
              {promo.cta_text || "דברו איתי"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
