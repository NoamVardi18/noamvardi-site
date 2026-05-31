"use client";

import { useEffect, useRef, useState } from "react";
import { BRAND } from "@/lib/constants";

export function Landing() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sent, setSent] = useState(false);

  // Wave canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let W = 0, H = 0, raf = 0, t = 0;

    const resize = () => {
      const r = canvas.parentElement!.getBoundingClientRect();
      W = canvas.width = r.width;
      H = canvas.height = r.height;
    };
    const waves = [
      { amp: 0.18, freq: 0.012, phase: 0, alpha: 0.08, thick: 80 },
      { amp: 0.14, freq: 0.018, phase: 1.2, alpha: 0.06, thick: 60 },
      { amp: 0.1, freq: 0.024, phase: 2.4, alpha: 0.04, thick: 40 },
      { amp: 0.22, freq: 0.009, phase: 0.6, alpha: 0.05, thick: 100 },
    ];
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const w of waves) {
        ctx.beginPath();
        for (let x = 0; x <= W; x++) {
          const y =
            H * 0.5 +
            Math.sin(x * w.freq + t + w.phase) * H * w.amp +
            Math.sin(x * w.freq * 1.7 + t * 1.3 + w.phase) * H * w.amp * 0.4;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        const g = ctx.createLinearGradient(0, 0, W, H);
        g.addColorStop(0, `rgba(20,20,20,${w.alpha * 3})`);
        g.addColorStop(0.5, `rgba(100,100,100,${w.alpha})`);
        g.addColorStop(1, `rgba(20,20,20,${w.alpha * 2})`);
        ctx.strokeStyle = g;
        ctx.lineWidth = w.thick;
        ctx.lineCap = "round";
        ctx.stroke();
      }
      for (let i = 0; i < 30; i++) {
        const x = (Math.sin(i * 2.5 + t * 0.4) * 0.4 + 0.5) * W;
        const y = (Math.cos(i * 1.8 + t * 0.3) * 0.35 + 0.5) * H;
        const r = Math.abs(Math.sin(i + t * 0.5)) * 2.5 + 0.5;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,0,0,${0.12 + Math.sin(i + t) * 0.06})`;
        ctx.fill();
      }
      t += 0.008;
      raf = requestAnimationFrame(draw);
    };
    resize();
    window.addEventListener("resize", resize);
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Scroll fade-in
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll(".fade-up").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  function handleContact(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    const data = new FormData(f);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const msg = String(data.get("message") || "").trim();
    if (!name || !email || !msg) {
      alert("נא למלא את כל שדות החובה");
      return;
    }
    const subject = encodeURIComponent(`פנייה מהאתר - ${name}`);
    const body = encodeURIComponent(
      `שם: ${name}\nאימייל: ${email}\nטלפון: ${data.get("phone")}\nשירות: ${data.get("service")}\n\n${msg}`
    );
    window.location.href = `mailto:${BRAND.email}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <main id="main">
      {/* HERO */}
      <section className="hero" id="home" aria-label="כותרת ראשית">
        <div className="hero-inner">
          <div className="hero-text">
            <h1>
              <span>בינה</span>
              <span>מלאכותית.</span>
              <span>חדשנות.</span>
            </h1>
            <p>
              בניית אתרים ופתרונות דיגיטליים חכמים המשלבים בינה מלאכותית — מהירים,
              יפים, ומותאמים לעתיד.
            </p>
            <div className="hero-btns">
              <a href="#work" className="btn-primary">הצג את העבודות</a>
              <a href="#contact" className="btn-secondary">בואו נדבר</a>
            </div>
            <div className="hero-tags" aria-label="תחומי התמחות">
              <span className="tag">בינה מלאכותית</span>
              <span className="tag">עיצוב UX/UI</span>
              <span className="tag">פיתוח Full-Stack</span>
              <span className="tag">אוטומציה</span>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <canvas className="wave" ref={canvasRef} />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <div className="features" aria-label="ערכי הבסיס">
        <div className="features-grid">
          {[
            { ic: "🤖", h: "AI SOLUTIONS", p: "מערכות חכמות מונעות בינה מלאכותית לפתרונות בעלי השפעה" },
            { ic: "💡", h: "INNOVATION", p: "פריצת גבולות עם רעיונות ופתרונות חדשניים" },
            { ic: "⚙️", h: "AUTOMATION", p: "ייעול תהליכים עסקיים עם AI ואוטומציה חכמה" },
            { ic: "🚀", h: "FUTURE READY", p: "פתרונות מדרגיים שמוכנים למחר" },
          ].map((f, i) => (
            <div className={`feature fade-up ${i ? "d" + i : ""}`} key={f.h}>
              <span className="ic" aria-hidden="true">{f.ic}</span>
              <h3>{f.h}</h3>
              <p>{f.p}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <section className="section" id="about" aria-label="אודות">
        <div className="about-inner">
          <div className="about-text fade-up">
            <p className="section-label">ABOUT</p>
            <h2>בונה את הדיגיטל של מחר, היום.</h2>
            <p>
              אני נועם ורדי — מפתח Full-Stack המתמחה בשילוב בינה מלאכותית בפתרונות
              דיגיטליים. אני בונה אתרים ואפליקציות שלא רק נראים טוב — הם חושבים.
            </p>
            <p>
              כל פרויקט מתחיל בהבנת הצורך האמיתי ומסתיים בפתרון שעובד — מהיר, נגיש
              ומדרגי.
            </p>
            <div style={{ marginTop: 32 }}>
              <a href="#contact" className="btn-primary">בואו נשתף פעולה</a>
            </div>
          </div>
          <div className="stats-grid fade-up d1" aria-label="נתונים">
            {[
              { n: "10+", l: "פרויקטים שנמסרו" },
              { n: "AI", l: "בכל פתרון" },
              { n: "100%", l: "נגישות WCAG" },
              { n: "∞", l: "יצירתיות" },
            ].map((s) => (
              <div className="stat-box" key={s.l}>
                <div className="num">{s.n}</div>
                <div className="label">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WORK */}
      <section className="section work" id="work" aria-label="עבודות">
        <div className="section-header fade-up">
          <p className="section-label">WORK</p>
          <h2>אתרים שבניתי</h2>
          <p>לחצו על הכרטיס לצפייה באתר המלא</p>
        </div>
        <div className="portfolio-grid">
          {[
            { url: "https://avivardi.online", host: "avivardi.online", title: "Aviv Vardi", tags: ["Portfolio", "Design"] },
            { url: "https://talis-flower.vercel.app/", host: "talis-flower.vercel.app", title: "Talis Flower", tags: ["E-Commerce", "Floral"] },
          ].map((s, i) => (
            <article className={`pcard fade-up ${i ? "d1" : ""}`} key={s.host}>
              <div className="chrome" aria-hidden="true">
                <div className="dots"><span /><span /><span /></div>
                <div className="bar">{s.host}</div>
              </div>
              <div className="frame">
                <iframe
                  src={s.url}
                  title={`תצוגה מקדימה של ${s.title}`}
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin"
                />
                <div className="frame-ov" aria-hidden="true">
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="view-btn">פתח אתר ←</a>
                </div>
              </div>
              <div className="pinfo">
                <h3>{s.title}</h3>
                <div className="stags">
                  {s.tags.map((t) => <span className="stag" key={t}>{t}</span>)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="section" id="services" aria-label="שירותים">
        <div className="section-header fade-up" style={{ marginBottom: 0 }}>
          <p className="section-label">SERVICES</p>
          <h2>מה אני מציע</h2>
        </div>
        <div className="services-grid" role="list">
          {[
            { ic: "🌐", h: "בניית אתרים", p: "אתרים מודרניים, מהירים ונגישים עם עיצוב מותאם אישית. מ-Landing page ועד פלטפורמות מורכבות." },
            { ic: "🤖", h: "שילוב AI", p: "אינטגרציה של כלי בינה מלאכותית לאתר שלכם — chatbots, אוטומציה, עיבוד תוכן חכם ועוד." },
            { ic: "⚡", h: "אופטימיזציה", p: "שיפור מהירות, נגישות WCAG, SEO ו-Core Web Vitals לאתרים קיימים." },
            { ic: "🎨", h: "עיצוב UX/UI", p: "ממשקים שנראים מדהים ומרגישים טבעיים — עיצוב שמוביל לתוצאות." },
            { ic: "🔗", h: "Full-Stack פיתוח", p: "API, מסדי נתונים, Supabase, ו-serverless — הכל תחת קורת גג אחת." },
            { ic: "📱", h: "Responsive Design", p: "כל אתר מותאם מושלם למובייל, טאבלט ודסקטופ — ללא פשרות." },
          ].map((s, i) => (
            <div className={`scard fade-up ${i % 3 ? "d" + (i % 3) : ""}`} role="listitem" key={s.h}>
              <span className="sic" aria-hidden="true">{s.ic}</span>
              <h3>{s.h}</h3>
              <p>{s.p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* OFFER */}
      <section className="section offer" id="offer" aria-label="מבצע אתר בלעדי">
        <div className="offer-inner">
          <div className="offer-card fade-up">
            <span className="offer-badge" aria-hidden="true">מבצע מוגבל</span>
            <div>
              <p className="section-label" style={{ color: "rgba(255,255,255,0.4)" }}>חבילת אתר בלעדי</p>
              <h2>אתר מקצועי משלך — ל-3 שנים מלאות</h2>
              <p className="lead">חבילה כוללת הכל: בנייה, העלאה לאוויר, קידום בגוגל ותחזוקה שוטפת — במחיר של שנה אחת.</p>
              <ul className="offer-features">
                {[
                  "אתר בלעדי מעוצב אישית",
                  "העלאה והופעה בגוגל (SEO + אינדוקס)",
                  "קישור (דומיין) יפה ומותאם לעסק",
                  "פרסום קטן להשקה",
                  "חודש שירות תיקונים חופשי",
                  "אחזקה מלאה לכל תקופת ההתקשרות",
                ].map((f) => (
                  <li key={f}><span className="check" aria-hidden="true">✓</span> {f}</li>
                ))}
              </ul>
            </div>
            <div className="price-box">
              <div className="old">במקום 4,500 ₪</div>
              <div className="price">1,500<span> ₪</span></div>
              <div className="term">ל-3 שנים מלאות</div>
              <div className="save">חיסכון של עד 66%</div>
              <a href="#contact" className="btn-offer">אני רוצה את המבצע</a>
              <div className="micro">* בכפוף לתנאי ההתקשרות. ניתן לשדרג בכל עת.</div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="section contact on-dark" id="contact" aria-label="צור קשר">
        <div className="contact-inner">
          <div className="contact-head fade-up">
            <p className="section-label">CONTACT</p>
            <h2>בואו נבנה משהו ביחד</h2>
            <p>רעיון? פרויקט? פשוט שאלה? — אשמח לשמוע.</p>
          </div>
          <div className="contact-layout">
            <div className="contact-info fade-up">
              <h3>פרטי יצירת קשר</h3>
              <a href={`tel:${BRAND.phone}`} className="citem">
                <span className="ic" aria-hidden="true">📞</span>
                <span className="citem-txt"><span>052-836-9212</span><span className="detail">זמין א'–ו' 9:00–20:00</span></span>
              </a>
              <a href={`mailto:${BRAND.email}`} className="citem">
                <span className="ic" aria-hidden="true">✉️</span>
                <span className="citem-txt"><span>{BRAND.email}</span><span className="detail">מענה תוך 24 שעות</span></span>
              </a>
              <a href={`https://wa.me/${BRAND.phoneIntl}`} target="_blank" rel="noopener noreferrer" className="citem">
                <span className="ic" aria-hidden="true">💬</span>
                <span className="citem-txt"><span>WhatsApp</span><span className="detail">הדרך המהירה ביותר</span></span>
              </a>
            </div>
            <div className="fade-up d1">
              {sent ? (
                <div className="form-success">
                  <div className="ck" aria-hidden="true">✓</div>
                  <h3>ההודעה נשלחה!</h3>
                  <p>אחזור אליך בהקדם האפשרי, תודה!</p>
                </div>
              ) : (
                <form className="form" onSubmit={handleContact} aria-label="טופס יצירת קשר">
                  <div className="form-row">
                    <div className="fg">
                      <label htmlFor="c-name">שם מלא *</label>
                      <input id="c-name" name="name" type="text" placeholder="ישראל ישראלי" required autoComplete="name" />
                    </div>
                    <div className="fg">
                      <label htmlFor="c-phone">טלפון</label>
                      <input id="c-phone" name="phone" type="tel" placeholder="05X-XXXXXXX" autoComplete="tel" dir="ltr" />
                    </div>
                  </div>
                  <div className="fg">
                    <label htmlFor="c-email">אימייל *</label>
                    <input id="c-email" name="email" type="email" placeholder="you@example.com" required autoComplete="email" dir="ltr" />
                  </div>
                  <div className="fg">
                    <label htmlFor="c-service">סוג שירות</label>
                    <select id="c-service" name="service" defaultValue="">
                      <option value="">בחר שירות...</option>
                      <option value="website">בניית אתר</option>
                      <option value="ai">שילוב AI</option>
                      <option value="design">עיצוב UX/UI</option>
                      <option value="optimization">אופטימיזציה</option>
                      <option value="other">אחר</option>
                    </select>
                  </div>
                  <div className="fg">
                    <label htmlFor="c-msg">ספר לי על הפרויקט *</label>
                    <textarea id="c-msg" name="message" placeholder="מה אתם רוצים לבנות?" required />
                  </div>
                  <button type="submit" className="form-submit">שלח הודעה →</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
