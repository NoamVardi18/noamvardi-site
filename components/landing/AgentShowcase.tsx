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
    <div className="demo-shell" dir="ltr">
      <div className="demo-bar">
        <span className="dot" />
        <span className="t">LIVE · 03:12 AM</span>
      </div>
      <div className="chat-feed">
        {step >= 0 && (
          <div className="bubble user" key={`u1-${step === 0}`}>
            <span className="who">Customer · 03:12</span>
            Can I move my booking to tomorrow?
          </div>
        )}
        {step === 1 && <div className="bubble bot"><Typing /></div>}
        {step >= 2 && (
          <div className="bubble bot">
            <span className="who">Business agent</span>
            Done! Moved you to tomorrow at 6:00 PM. Confirmation sent by SMS ✓
          </div>
        )}
        {step >= 3 && (
          <div className="bubble user">
            <span className="who">Customer · 03:13</span>
            Wow, thanks!
          </div>
        )}
        {step === 4 && <div className="bubble bot"><Typing /></div>}
        {step >= 5 && (
          <div className="bubble bot">
            <span className="who">Business agent</span>
            Anytime 🙂 See you tomorrow!
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
    <div className="demo-shell" dir="ltr">
      <div className="demo-bar">
        <span className="dot" />
        <span className="t">Calendar · Tuesday</span>
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
        {phase === 0 && "Today is full. Waitlist: 3 customers."}
        {phase === 1 && <>Last-minute cancellation at <span className="hl">5:00 PM</span></>}
        {phase === 2 && "Agent is working the waitlist…"}
        {phase === 3 && <><span className="hl">Slot refilled</span> from the waitlist ✓</>}
      </div>
    </div>
  );
}

/* ── 3. Lead follow-up pipeline ──────────────────────────────────── */

const PIPE_DURATIONS = [1600, 1600, 1600, 3000];
const LEADS = [
  { name: "Dana", offset: 0 },
  { name: "Yoav", offset: 1 },
  { name: "Michal", offset: 2 },
];
const STAGES = ["New lead", "Message sent", "Smart reminder", "Call booked ✓"];

function LeadFollowupDemo() {
  const tick = useLoop(PIPE_DURATIONS);
  return (
    <div className="demo-shell" dir="ltr">
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
        No lead forgotten — the agent follows up until a call is booked.
      </div>
    </div>
  );
}

/* ── 4. Ops: document → structured data ──────────────────────────── */

const OPS_FIELDS = ["INV-2041", "$ 4,820", "06/12/26", "Approved", "Vendor: J.K", "Entered ✓"];

function OpsDemo() {
  const [run, setRun] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setRun((r) => r + 1), 4200);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="demo-shell" dir="ltr">
      <div className="demo-bar">
        <span className="dot" />
        <span className="t">DATA ENTRY</span>
      </div>
      <div className="ops-wrap">
        <div className="ops-doc" aria-hidden="true">
          <div className="ops-line" /><div className="ops-line" /><div className="ops-line" />
          <div className="ops-line" /><div className="ops-line" />
        </div>
        <span className="ops-arrow" aria-hidden="true">→</span>
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
        Invoices are captured, parsed and entered into your system — no human touch.
      </div>
    </div>
  );
}

/* ── Showcase grid ───────────────────────────────────────────────── */

const AGENTS = [
  {
    tagline: "Support, around the clock",
    title: "24/7 customer support agent",
    desc: "Answers customers on WhatsApp and your site — at 3 AM, on weekends, on holidays. Connected to your systems and actually resolves, not just replies.",
    Demo: SupportAgentDemo,
  },
  {
    tagline: "Never an empty slot",
    title: "Smart scheduling & booking",
    desc: "Last-minute cancellation? The agent already worked the waitlist, booked another customer and sent confirmations. The calendar stays full.",
    Demo: SchedulerDemo,
  },
  {
    tagline: "Every lead, followed",
    title: "Lead follow-up & sales",
    desc: "A lead with no reply within an hour is lost. The agent follows up, reminds and warms every inquiry until a call is booked.",
    Demo: LeadFollowupDemo,
  },
  {
    tagline: "Paperwork that does itself",
    title: "Operations & data entry",
    desc: "Invoices, forms and orders are captured, parsed and entered into your systems — no copy errors, no paperwork pile.",
    Demo: OpsDemo,
  },
];

export function AgentShowcase() {
  return (
    <section className="section" id="agents" aria-label="The agents">
      <div className="section-inner">
        <div className="section-head fade-up">
          <span className="kicker">THE AGENT WORKFORCE</span>
          <h2>
            Not more software. <span className="serif-accent">Digital workers.</span>
          </h2>
          <p>
            Every card here is a real agent you can drop into your business — watch it
            work. The agents connect to your existing systems and do the job end-to-end.
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
