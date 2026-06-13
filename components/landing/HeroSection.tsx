import { BRAND } from "@/lib/constants";

function Ring({ pct, label }: { pct: number; label: string }) {
  const C = 151; // 2πr for r=24
  return (
    <span className="ring">
      <svg viewBox="0 0 56 56" aria-hidden="true">
        <circle className="track" cx="28" cy="28" r="24" fill="none" strokeWidth="4" />
        <circle
          className="bar"
          cx="28" cy="28" r="24" fill="none" strokeWidth="4"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - pct)}
        />
      </svg>
      <span className="ring-txt">{label}</span>
    </span>
  );
}

export function HeroSection() {
  return (
    <section className="hero" id="home" aria-label="כותרת ראשית">
      <div className="hero-inner">
        <div className="hero-text">
          <span className="kicker">AI · INNOVATION · FUTURE</span>
          <h1>
            <span className="line">העסק שלך עובד.</span>
            <span className="line">
              גם כשאתה <span className="serif-accent">ישן.</span>
            </span>
          </h1>
          <p className="hero-sub">
            אני בונה <strong>סוכני בינה מלאכותית</strong> שמבצעים עבודה אמיתית בעסק —
            עונים ללקוחות, מתאמים פגישות, רודפים אחרי לידים ומזינים נתונים.
            כוח עבודה דיגיטלי שלא יוצא להפסקה, לא שוכח, ולא מפספס אף פנייה.
          </p>
          <div className="hero-btns">
            <a
              href={`https://wa.me/${BRAND.phoneIntl}?text=${encodeURIComponent("היי נועם, אשמח לשמוע על סוכני AI לעסק שלי")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary btn-wa"
            >
              דברו איתי בוואטסאפ
            </a>
            <a href="#agents" className="btn-glass">מה הסוכנים יודעים לעשות ←</a>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="stat-card" style={{ top: "4%", insetInlineEnd: "6%" }}>
            <Ring pct={1} label="24/7" />
            <div>
              <div className="num">מענה תמידי</div>
              <div className="lbl">הסוכן לא הולך לישון</div>
            </div>
          </div>
          <div className="stat-card" style={{ top: "38%", insetInlineStart: "0%" }}>
            <Ring pct={0.8} label="80%" />
            <div>
              <div className="num">מהשגרה</div>
              <div className="lbl">עוברת לאוטומציה מלאה</div>
            </div>
          </div>
          <div className="stat-card" style={{ bottom: "6%", insetInlineEnd: "12%" }}>
            <Ring pct={0.95} label="< דק׳" />
            <div>
              <div className="num">זמן תגובה</div>
              <div className="lbl">לכל פנייה, בכל שעה</div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-logo-strip section-inner" style={{ width: "100%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo/logo-dark-bg.jpg" alt="" aria-hidden="true" />
        <span className="sep" aria-hidden="true" />
        <span>סוכנים חכמים · אוטומציות · עתיד העבודה</span>
      </div>
    </section>
  );
}
