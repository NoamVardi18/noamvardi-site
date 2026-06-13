"use client";

import { useEffect, useState } from "react";

/* ── helpers ─────────────────────────────────────────────────────── */

// Advances `step` through a timed sequence, then loops.
function useLoop(durationsMs: number[]) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setTimeout(
      () => setStep((s) => (s + 1) % durationsMs.length),
      durationsMs[step]
    );
    return () => clearTimeout(t);
  }, [step, durationsMs]);
  return step;
}

const Typing = () => (
  <span className="typing" aria-hidden="true"><i /><i /><i /></span>
);

/* ── 1. Support agent: chat at 03:12 ─────────────────────────────── */

const CHAT_DURATIONS = [1400, 1300, 2600, 1500, 1300, 2600, 2200];

function SupportAgentDemo() {
  const step = useLoop(CHAT_DURATIONS);
  return (
    <div className="demo-shell" dir="rtl">
      <div className="demo-bar">
        <span className="dot" />
        <span className="t">LIVE · 03:12 AM</span>
      </div>
      <div className="chat-feed">
        {step >= 0 && (
          <div className="bubble user" key={`u1-${step === 0}`}>
            <span className="who">לקוח · 03:12</span>
            אפשר להזיז את ההזמנה שלי למחר?
          </div>
        )}
        {step === 1 && <div className="bubble bot"><Typing /></div>}
        {step >= 2 && (
          <div className="bubble bot">
            <span className="who">הסוכן של העסק</span>
            בטח! פיניתי לך מקום מחר ב־18:00. שלחתי אישור ב־SMS ✓
          </div>
        )}
        {step >= 3 && (
          <div className="bubble user">
            <span className="who">לקוח · 03:13</span>
            וואו, תודה!
          </div>
        )}
        {step === 4 && <div className="bubble bot"><Typing /></div>}
        {step >= 5 && (
          <div className="bubble bot">
            <span className="who">הסוכן של העסק</span>
            בשמחה 🙂 נתראה מחר!
          </div>
        )}
      </div>
    </div>
  );
}

/* ── 2. Scheduler: cancellation auto-refilled ────────────────────── */

const CAL_DURATIONS = [2200, 1800, 2000, 3200];
const SLOTS = ["09:00", "10:00", "11:00", "12:00", "16:00", "17:00", "18:00", "19:00"];
const BUSY = new Set([0, 1, 3, 4, 5, 7]);

function SchedulerDemo() {
  const phase = useLoop(CAL_DURATIONS);
  const cancelledIdx = 5;
  return (
    <div className="demo-shell" dir="rtl">
      <div className="demo-bar">
        <span className="dot" />
        <span className="t">יומן · יום שלישי</span>
      </div>
      <div className="cal-grid">
        {SLOTS.map((s, i) => {
          let cls = "cal-slot";
          if (BUSY.has(i)) cls += " busy";
          if (i === cancelledIdx) {
            if (phase === 1 || phase === 2) cls = "cal-slot cancelled";
            if (phase === 3) cls = "cal-slot refilled";
          }
          return <div className={cls} key={s}>{s}</div>;
        })}
      </div>
      <div className="cal-note">
        {phase === 0 && "היום מלא. רשימת המתנה: 3 לקוחות."}
        {phase === 1 && <>התקבל ביטול של הרגע האחרון ב־<span className="hl">17:00</span></>}
        {phase === 2 && "הסוכן עובר על רשימת ההמתנה ומתקשר…"}
        {phase === 3 && <><span className="hl">התור שובץ מחדש</span> ללקוח מרשימת ההמתנה ✓</>}
      </div>
    </div>
  );
}

/* ── 3. Lead follow-up pipeline ──────────────────────────────────── */

const PIPE_DURATIONS = [1600, 1600, 1600, 3000];
const LEADS = [
  { name: "דנה", offset: 0 },
  { name: "יואב", offset: 1 },
  { name: "מיכל", offset: 2 },
];
const STAGES = ["ליד חדש", "נשלחה הודעה", "תזכורת חכמה", "נקבעה שיחה ✓"];

function LeadFollowupDemo() {
  const tick = useLoop(PIPE_DURATIONS);
  return (
    <div className="demo-shell" dir="rtl">
      <div className="demo-bar">
        <span className="dot" />
        <span className="t">PIPELINE</span>
      </div>
      <div className="pipe-rows">
        {LEADS.map((l) => {
          const stage = Math.min(Math.max(tick - l.offset + 1, 0), STAGES.length - 1);
          const done = stage === STAGES.length - 1;
          return (
            <div className="pipe-row" key={l.name}>
              <span className="nm">{l.name}</span>
              <span className="pipe-track">
                <span
                  className="pipe-fill"
                  style={{ width: `${(stage / (STAGES.length - 1)) * 100}%` }}
                />
              </span>
              <span className={`pipe-stage ${done ? "done" : ""}`}>{STAGES[stage]}</span>
            </div>
          );
        })}
      </div>
      <div className="cal-note" style={{ marginTop: 14 }}>
        אף ליד לא נשכח — הסוכן עוקב עד שנקבעת שיחה.
      </div>
    </div>
  );
}

/* ── 4. Ops: document → structured data ──────────────────────────── */

const OPS_FIELDS = ["INV-2041", "₪ 4,820", "12/06/26", "אושר", "ספק: י.כ", "הוזן ✓"];

function OpsDemo() {
  const [run, setRun] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setRun((r) => r + 1), 4200);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="demo-shell" dir="rtl">
      <div className="demo-bar">
        <span className="dot" />
        <span className="t">DATA ENTRY</span>
      </div>
      <div className="ops-wrap">
        <div className="ops-doc" aria-hidden="true">
          <div className="ops-line" /><div className="ops-line" /><div className="ops-line" />
          <div className="ops-line" /><div className="ops-line" />
        </div>
        <span className="ops-arrow" aria-hidden="true">←</span>
        <div className="ops-table" key={run}>
          {[0, 1, 2].map((row) => (
            <div className="ops-cell" key={row} style={{ animationDelay: `${0.4 + row * 0.5}s` }}>
              <span>{OPS_FIELDS[row * 2]}</span>
              <span>{OPS_FIELDS[row * 2 + 1]}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="cal-note" style={{ marginTop: 14 }}>
        חשבונית נקלטת, מפוענחת ומוזנת למערכת — בלי יד אדם.
      </div>
    </div>
  );
}

/* ── Showcase grid ───────────────────────────────────────────────── */

const AGENTS = [
  {
    tagline: "Support, around the clock",
    title: "סוכן שירות לקוחות 24/7",
    desc: "עונה ללקוחות בוואטסאפ ובאתר — בשלוש לפנות בוקר, בשבת, בחג. מחובר למערכות שלכם ופותר באמת, לא רק עונה.",
    Demo: SupportAgentDemo,
  },
  {
    tagline: "Never an empty slot",
    title: "תיאום פגישות ושיבוץ חכם",
    desc: "ביטול של הרגע האחרון? הסוכן כבר עבר על רשימת ההמתנה, שיבץ לקוח אחר ושלח אישורים. היומן נשאר מלא.",
    Demo: SchedulerDemo,
  },
  {
    tagline: "Every lead, followed",
    title: "מעקב לידים ומכירות",
    desc: "ליד שלא קיבל מענה תוך שעה — הולך לאיבוד. הסוכן עוקב, מתזכר ומחמם כל פנייה עד שנקבעת שיחה.",
    Demo: LeadFollowupDemo,
  },
  {
    tagline: "Paperwork that does itself",
    title: "תפעול והזנת נתונים",
    desc: "חשבוניות, טפסים והזמנות נקלטים, מפוענחים ומוזנים למערכות — בלי שגיאות העתקה ובלי ערימת ניירת.",
    Demo: OpsDemo,
  },
];

export function AgentShowcase() {
  return (
    <section className="section" id="agents" aria-label="הסוכנים">
      <div className="section-inner">
        <div className="section-head fade-up">
          <span className="kicker">THE AGENT WORKFORCE</span>
          <h2>
            לא עוד תוכנה. <span className="serif-accent">עובדים דיגיטליים.</span>
          </h2>
          <p>
            כל כרטיס כאן הוא סוכן אמיתי שאפשר להכניס לעסק — צפו בו עובד.
            הסוכנים מתחברים למערכות הקיימות שלכם ומבצעים את העבודה מקצה לקצה.
          </p>
        </div>
        <div className="agents-grid">
          {AGENTS.map(({ tagline, title, desc, Demo }, i) => (
            <article className={`agent-card fade-up ${i % 2 ? "d1" : ""}`} key={title}>
              <div className="agent-head">
                <span className="tagline">{tagline}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
              <div className="agent-demo">
                <Demo />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
