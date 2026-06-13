"use client";

import { useActionState } from "react";
import { BRAND } from "@/lib/constants";
import { submitContactAction } from "@/app/contact/actions";

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL;

export function ContactSection() {
  const [state, submit, pending] = useActionState(submitContactAction, {});

  return (
    <section className="section" id="contact" aria-label="צור קשר">
      <div className="section-inner">
        <div className="section-head center fade-up">
          <span className="kicker">LET&apos;S TALK</span>
          <h2>
            בואו נמצא מה אפשר <span className="serif-accent">להפוך לאוטומטי.</span>
          </h2>
          <p>שיחה קצרה אחת מספיקה כדי לזהות את הסוכן הראשון שהעסק שלכם צריך.</p>
        </div>

        <div className="contact-layout">
          <div className="contact-cards fade-up">
            <a
              href={`https://wa.me/${BRAND.phoneIntl}?text=${encodeURIComponent("היי נועם, אשמח לשמוע על סוכני AI לעסק שלי")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="citem wa"
            >
              <span className="ic" aria-hidden="true">💬</span>
              <span className="citem-txt">
                <span className="main">WhatsApp</span>
                <span className="detail">הדרך המהירה ביותר — מענה אישי</span>
              </span>
            </a>
            <a href={`tel:${BRAND.phone}`} className="citem">
              <span className="ic" aria-hidden="true">📞</span>
              <span className="citem-txt">
                <span className="main">052-836-9212</span>
                <span className="detail">זמין א׳–ו׳ 9:00–20:00</span>
              </span>
            </a>
            <a href={`mailto:${BRAND.email}`} className="citem">
              <span className="ic" aria-hidden="true">✉️</span>
              <span className="citem-txt">
                <span className="main">{BRAND.email}</span>
                <span className="detail">מענה תוך 24 שעות</span>
              </span>
            </a>
            {CALENDLY_URL && (
              <div className="calendly-slot">
                <iframe
                  src={`${CALENDLY_URL}?hide_gdpr_banner=1&background_color=0d1219&text_color=f2efe9&primary_color=c8a96a`}
                  title="קביעת שיחת היכרות"
                  loading="lazy"
                />
              </div>
            )}
          </div>

          <div className="contact-form-panel glass-panel fade-up d1">
            {state.ok ? (
              <div className="form-success">
                <div className="ck" aria-hidden="true">✓</div>
                <h3>ההודעה התקבלה!</h3>
                <p>אחזור אליכם בהקדם — בדרך כלל באותו היום.</p>
              </div>
            ) : (
              <form action={submit} className="form" aria-label="טופס יצירת קשר">
                {/* honeypot */}
                <input
                  type="text" name="website" tabIndex={-1} autoComplete="off"
                  style={{ position: "absolute", opacity: 0, height: 0, width: 0, pointerEvents: "none" }}
                  aria-hidden="true"
                />
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
                <div className="form-row">
                  <div className="fg">
                    <label htmlFor="c-email">אימייל *</label>
                    <input id="c-email" name="email" type="email" placeholder="you@example.com" required autoComplete="email" dir="ltr" />
                  </div>
                  <div className="fg">
                    <label htmlFor="c-company">שם העסק</label>
                    <input id="c-company" name="company" type="text" placeholder="העסק שלי בע״מ" autoComplete="organization" />
                  </div>
                </div>
                <div className="fg">
                  <label htmlFor="c-msg">מה הייתם רוצים להפוך לאוטומטי? *</label>
                  <textarea
                    id="c-msg" name="message" required
                    placeholder="לדוגמה: אנחנו מפספסים פניות בוואטסאפ אחרי שעות הפעילות…"
                  />
                </div>
                {state.error && <div className="form-error">{state.error}</div>}
                <button type="submit" className="form-submit" disabled={pending}>
                  {pending ? "שולח…" : "שלחו הודעה ←"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
