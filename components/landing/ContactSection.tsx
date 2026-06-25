"use client";

import { useActionState } from "react";
import { BRAND } from "@/lib/constants";
import { submitContactAction } from "@/app/contact/actions";
import { PhoneInput } from "./PhoneInput";

const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL;

export function ContactSection() {
  const [state, submit, pending] = useActionState(submitContactAction, {});

  return (
    <section className="section" id="contact" aria-label="Contact">
      <div className="section-inner">
        <div className="section-head center fade-up">
          <span className="kicker">LET&apos;S TALK</span>
          <h2>
            Let&apos;s find what you can <span className="serif-accent">make automatic.</span>
          </h2>
          <p>One short conversation is enough to spot the first agent your business needs.</p>
        </div>

        <div className="contact-layout">
          <div className="contact-cards fade-up">
            <a href={`mailto:${BRAND.email}`} className="citem">
              <span className="ic" aria-hidden="true">✉️</span>
              <span className="citem-txt">
                <span className="main">{BRAND.email}</span>
                <span className="detail">Reply within 24 hours</span>
              </span>
            </a>
            {BOOKING_URL ? (
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="citem">
                <span className="ic" aria-hidden="true">📅</span>
                <span className="citem-txt">
                  <span className="main">Book a free intro call</span>
                  <span className="detail">15 min — no prep needed</span>
                </span>
              </a>
            ) : (
              <a href={`mailto:${BRAND.email}?subject=${encodeURIComponent("Intro call request")}`} className="citem">
                <span className="ic" aria-hidden="true">📅</span>
                <span className="citem-txt">
                  <span className="main">Book a free intro call</span>
                  <span className="detail">Email me to schedule — 15 min</span>
                </span>
              </a>
            )}
          </div>

          <div className="contact-form-panel glass-panel fade-up d1">
            {state.ok ? (
              <div className="form-success">
                <div className="ck" aria-hidden="true">✓</div>
                <h3>Message received!</h3>
                <p>I&apos;ll get back to you shortly — usually the same day.</p>
              </div>
            ) : (
              <form action={submit} className="form" aria-label="Contact form">
                {/* honeypot */}
                <input
                  type="text" name="website" tabIndex={-1} autoComplete="off"
                  style={{ position: "absolute", opacity: 0, height: 0, width: 0, pointerEvents: "none" }}
                  aria-hidden="true"
                />
                <div className="form-row">
                  <div className="fg">
                    <label htmlFor="c-name">Full name *</label>
                    <input id="c-name" name="name" type="text" placeholder="Jane Doe" required autoComplete="name" />
                  </div>
                  <div className="fg">
                    <label htmlFor="c-phone">Phone</label>
                    <PhoneInput />
                  </div>
                </div>
                <div className="form-row">
                  <div className="fg">
                    <label htmlFor="c-email">Email *</label>
                    <input id="c-email" name="email" type="email" placeholder="you@example.com" required autoComplete="email" dir="ltr" />
                  </div>
                  <div className="fg">
                    <label htmlFor="c-company">Business name</label>
                    <input id="c-company" name="company" type="text" placeholder="My Business Ltd." autoComplete="organization" />
                  </div>
                </div>
                <div className="fg">
                  <label htmlFor="c-msg">What would you like to make automatic? *</label>
                  <textarea
                    id="c-msg" name="message" required
                    placeholder="e.g. we miss WhatsApp inquiries after hours…"
                  />
                </div>
                {state.error && <div className="form-error">{state.error}</div>}
                <button type="submit" className="form-submit" disabled={pending}>
                  {pending ? "Sending…" : "Send message →"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
