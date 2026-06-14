---
name: nv-motion
description: Recreate the "alive" motion craft Fable 5 built into noamvardi.ai — looping state-machine product demos, cinematic drifting atmosphere + film grain, staggered scroll reveals, self-drawing SVG progress rings, and the show-don't-tell thinking behind them. Use when building animated/interactive UI, "agent demo" cards, hero atmospheres, scroll reveals, or when asked to "make it feel alive", "add the moving stuff", "recreate the motion/animations", "match the Fable feel", or push the site's motion further.
---

# NV Motion Craft — the "alive" layer

Companion to `nv-design` (which owns static tokens/components). This skill owns
**motion**: the looping demos, atmosphere, reveals, and rings that made the site
feel alive instead of like a flat template. Read `nv-design` for color/glass; read
this when anything needs to *move* or *demonstrate*.

The whole philosophy in one line: **don't describe what an AI agent does — make the
visitor watch it happen, on a loop, forever.** Every signature move below serves that.

---

## 0. The five principles (the "thought process")

1. **Show, don't tell.** A headline saying "answers customers 24/7" is a claim. A chat
   window where a customer asks at 03:12 AM and the agent *replies in front of you* is
   proof. Each marketing claim earns a tiny live diorama, not a bullet point.
2. **State machine > video.** Never ship MP4/GIF/Lottie for product demos. A 2–3 KB
   React component driving CSS is sharp at any DPI, themes with CSS vars, edits in
   seconds, has zero network cost, and never looks "embedded". The loop is the medium.
3. **Layered atmosphere, never one flat gradient.** Depth = base radial grade +
   slow-drifting colored blobs (parallax-feel) + a film-grain shimmer on top. Three cheap
   layers stacked read as "cinematic"; one gradient reads as "Tailwind default".
4. **Choreography, not simultaneity.** Things that animate together feel mechanical.
   Stagger everything — reveal delays, float-y offsets, per-row demo timing — so the eye
   always has fresh movement. Negative `animation-delay` desyncs loopers instantly.
5. **Calm, not busy.** Long durations (drift 26–32 s, float 7 s, reveal 0.7 s), gentle
   easings, low opacity (grain 0.055, blobs 0.5). Motion should feel expensive and
   unhurried — the opposite of a flashing landing page. And it all dies under
   `prefers-reduced-motion` (§6) — non-negotiable.

If you only take one thing: **the looping state machine in §2 is the signature.** It's
what people mean when they say the site "feels alive".

---

## 1. Atmosphere — the cinematic backdrop

Two fixed full-bleed layers, injected once in root `layout.tsx` before `{children}`:

```jsx
<div className="atmosphere" aria-hidden="true" />
<div className="grain" aria-hidden="true" />
```

**Drifting blobs** (`z-index:-2`) — two big blurred radial gradients, one bronze one
cool-blue, each drifting on its own long timeline + slight scale so the parallax never
repeats in sync:

```css
.atmosphere::before, .atmosphere::after { content:''; position:absolute; border-radius:50%; filter:blur(110px); opacity:.5; will-change:transform; }
.atmosphere::before { width:60vw; height:60vw; top:-28vw; left:8vw;
  background:radial-gradient(circle, rgba(200,169,106,.16), transparent 65%);
  animation: drift-a 26s ease-in-out infinite alternate; }
.atmosphere::after  { width:52vw; height:52vw; bottom:-30vw; right:-10vw;
  background:radial-gradient(circle, rgba(96,124,178,.15), transparent 65%);
  animation: drift-b 32s ease-in-out infinite alternate; }
@keyframes drift-a { from{transform:translate(0,0) scale(1);}    to{transform:translate(9vw,7vh) scale(1.12);} }
@keyframes drift-b { from{transform:translate(0,0) scale(1.08);} to{transform:translate(-7vw,-6vh) scale(1);} }
```

**Film grain** (`z-index:-1`, `pointer-events:none`) — inline SVG `feTurbulence`, very low
opacity, stepped (not smooth) shimmer so it flickers like real film. `inset:-50%` gives
the shift room to move without exposing edges. This single layer is what kills the "flat"
feel — keep it subtle (≤0.06):

```css
.grain { position:fixed; inset:-50%; z-index:-1; pointer-events:none; opacity:.055;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  animation: grain-shift 1.4s steps(4) infinite; }
@keyframes grain-shift { 0%{transform:translate(0,0);} 25%{transform:translate(-2%,3%);} 50%{transform:translate(3%,-2%);} 75%{transform:translate(-3%,-3%);} 100%{transform:translate(0,0);} }
```

Tuning knobs: blob `opacity`/blur = how present the color wash is; grain `opacity` =
texture; `baseFrequency` = grain coarseness (higher = finer).

---

## 2. The looping state-machine demo (THE signature)

The pattern every "agent" card uses. One hook, one timed sequence, CSS does the visuals.

```jsx
// Advances `step` through a timed sequence, then loops.
function useLoop(durationsMs: number[]) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setStep((s) => (s + 1) % durationsMs.length), durationsMs[step]);
    return () => clearTimeout(t);
  }, [step, durationsMs]);
  return step;
}
```

**Why this shape:** each step holds for its *own* duration (a question beat is short, a
"thinking…" beat is long), so the rhythm feels human, not metronomic. `% length` loops
forever. `clearTimeout` on cleanup = no leaks, no double-fire in StrictMode.

**How to render off it** — gate elements by step with `>=` (cumulative: stays on screen)
vs `===` (transient: typing indicators, mid-states):

```jsx
const step = useLoop([1400, 1300, 2600, 1500, 1300, 2600, 2200]);
// ...
{step >= 0 && <Bubble user>customer question</Bubble>}   {/* persists */}
{step === 1 && <Bubble bot><Typing/></Bubble>}           {/* transient "typing" */}
{step >= 2 && <Bubble bot>agent answer ✓</Bubble>}        {/* persists after */}
```

Each new bubble auto-animates in via CSS (the component just toggles presence):

```css
.bubble { opacity:0; transform:translateY(8px); animation: bubble-in .45s forwards; }
@keyframes bubble-in { to { opacity:1; transform:translateY(0); } }
.typing i { width:5px;height:5px;border-radius:50%; background:var(--accent); animation: blink 1s infinite; }
.typing i:nth-child(2){animation-delay:.2s;} .typing i:nth-child(3){animation-delay:.4s;}
@keyframes blink { 0%,100%{opacity:.25;} 50%{opacity:1;} }
```

**Demo-shell chrome** (sells the "it's a real product" feel): a dark inset panel with a
pulsing status dot + a tiny LTR English label (`LIVE · 03:12 AM`, `PIPELINE`, `DATA ENTRY`).
The pulse + the oddly-specific timestamp are what make it read as *live*, not staged:

```css
.demo-shell { background:rgba(5,7,11,.65); border:1px solid rgba(255,255,255,.07); border-radius:14px; padding:16px; min-height:196px; position:relative; overflow:hidden; }
.demo-bar .dot { width:7px;height:7px;border-radius:50%; background:var(--good); box-shadow:0 0 8px var(--good); animation: pulse 2s infinite; }
@keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:.35;} }
```

### The four reference demos (each = one claim made visible)
- **Support chat** — `useLoop` over a Q → typing → answer → thanks script, `>=`/`===`
  bubble gating. Proves "24/7 answering".
- **Scheduler** — a `repeat(4,1fr)` grid of time slots; one slot transitions
  `busy → cancelled (shake) → refilled (accent)` across phases. Proves "auto-fills
  cancellations".
  ```css
  .cal-slot { transition: all .4s; }
  .cal-slot.cancelled { background:rgba(240,144,126,.12); border-color:rgba(240,144,126,.4); color:var(--bad); animation: shake .5s; }
  .cal-slot.refilled  { background:var(--accent-soft); border-color:var(--accent-brd); color:var(--accent-bright); }
  @keyframes shake { 0%,100%{transform:translateX(0);} 25%{transform:translateX(-3px);} 75%{transform:translateX(3px);} }
  ```
- **Lead pipeline** — N rows, each advances through stages with a per-row `offset` so they
  cascade. Progress bar width is computed, CSS eases the fill:
  ```jsx
  const stage = Math.min(Math.max(tick - lead.offset + 1, 0), STAGES.length - 1);
  <span className="pipe-fill" style={{ width:`${(stage/(STAGES.length-1))*100}%` }} />
  ```
  ```css
  .pipe-fill { transition: width 1s cubic-bezier(.3,.7,.3,1); background:linear-gradient(90deg,var(--accent),var(--accent-bright)); }
  ```
- **Ops / data-entry** — messy doc lines (looping opacity flicker) → arrow nudge →
  structured table cells that pop in staggered. Uses `setInterval` + a `run` counter as
  `key={run}` to **re-trigger** the entry animation each cycle (changing the key remounts):
  ```jsx
  <div className="ops-table" key={run}>
    {[0,1,2].map((row) => (
      <div className="ops-cell" key={row} style={{ animationDelay:`${0.4 + row*0.5}s` }}>…</div>
    ))}
  </div>
  ```

**Recipe to invent a new demo:** (1) pick ONE claim; (2) list 3–6 beats that prove it;
(3) assign each beat a duration (short for actions, long for "thinking" / payoff);
(4) `useLoop` those durations; (5) render with `>=`/`===` gating; (6) wrap in
`.demo-shell` with a pulsing dot + LTR label. Keep it pure-visual, no real data/network.

---

## 3. Self-drawing SVG progress ring

Hero stat cards each have a ring that *draws itself* on load via `stroke-dashoffset`.
Math: `C = 2πr`; offset `C·(1−pct)` leaves `pct` of the circle stroked.

```jsx
function Ring({ pct, label }: { pct:number; label:string }) {
  const C = 151; // 2π·24
  return (
    <span className="ring">
      <svg viewBox="0 0 56 56" aria-hidden="true">
        <circle className="track" cx="28" cy="28" r="24" fill="none" strokeWidth="4" />
        <circle className="bar" cx="28" cy="28" r="24" fill="none" strokeWidth="4"
          strokeDasharray={C} strokeDashoffset={C*(1-pct)} />
      </svg>
      <span className="ring-txt">{label}</span>
    </span>
  );
}
```
```css
.ring svg { transform: rotate(-90deg); }          /* start at 12 o'clock */
.ring .bar { stroke:var(--accent); stroke-linecap:round; animation: ring-fill 2.2s cubic-bezier(.3,.7,.3,1) forwards; }
@keyframes ring-fill { from { stroke-dashoffset: 151; } }  /* from empty → inline offset */
```
The keyframe animates from full-empty (`151`) to whatever inline `strokeDashoffset` the
component set — so one keyframe serves any `pct`. `rotate(-90deg)` makes it fill from top.

**Floating stat cards** — absolutely positioned over the hero visual, bobbing on a 7 s
`float-y`, desynced with negative delays so the three never bob together:
```css
.stat-card { animation: float-y 7s ease-in-out infinite; }
.stat-card:nth-child(2){animation-delay:-2.4s;} .stat-card:nth-child(3){animation-delay:-4.8s;}
@keyframes float-y { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-12px);} }
```

---

## 4. Scroll reveal (staggered)

One tiny client component adds `.visible` as elements enter view, then unobserves
(reveal-once, no thrash):

```jsx
"use client";
export function ScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll(".fade-up").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  return null;
}
```
```css
.fade-up { opacity:0; transform:translateY(28px); transition: opacity .7s ease, transform .7s ease; }
.fade-up.visible { opacity:1; transform:translateY(0); }
.fade-up.d1{transition-delay:.1s;} .fade-up.d2{transition-delay:.2s;} .fade-up.d3{transition-delay:.3s;}
```
Add `fade-up` to any block; add `d1/d2/d3` to siblings for a cascade. Mount `<ScrollReveal/>`
once at the bottom of the page. **The crucial detail:** the reduced-motion fallback (§6)
must force `.fade-up` visible, or content vanishes for those users.

---

## 5. Hover & micro-interaction conventions
- **Cards lift on hover:** `transform: translateY(-6px)`, border → `--accent-brd`,
  `box-shadow: 0 30px 70px rgba(0,0,0,.45)`, transition `.35s`. Consistent across agent
  cards, articles, steps.
- **Looping ambient flickers** (pulse dot, blink typing, fade-line doc, nudge arrow) run
  at 1–3 s — short enough to read as "active", long enough not to nag.
- **Transitions, not jumps:** state changes inside demos (`cal-slot`, `pipe-stage` color,
  `pipe-fill` width) always go through a `transition` so the loop morphs instead of cutting.

---

## 6. Reduced-motion kill-switch — MANDATORY

Every animation above must drop under `prefers-reduced-motion`. Critically, reveals must
flip to *visible* (not just "no transition"), or the page reads blank:

```css
@media (prefers-reduced-motion: reduce) {
  .atmosphere::before, .atmosphere::after, .grain, .stat-card, .ring .bar,
  .ops-arrow, .ops-line, .demo-bar .dot { animation: none !important; }
  .fade-up { opacity:1; transform:none; transition:none; }
  html { scroll-behavior:auto; }
}
```
The JS loopers (`useLoop`, ScrollReveal) keep running but their *visual* output is frozen
by killing the CSS — acceptable. If you add a heavy new looper, also guard it here.

---

## 7. Going BEYOND Fable 5 (push higher)

Fable 5 nailed the foundation. To exceed it without breaking the calm:
1. **Respect the loop, don't pile on.** The temptation is more demos / faster / flashier —
   that breaks principle 5. Add *depth* to existing demos (one more believable beat, a
   sharper payoff) before adding new motion.
2. **Pause loops when off-screen.** Wrap `useLoop` consumers so their interval/timeout only
   runs while an `IntersectionObserver` says the card is visible — saves battery, and
   demos restart fresh when scrolled back to. (Fable 5's loop runs always.)
3. **Honor `prefers-reduced-motion` in JS too.** Read
   `window.matchMedia('(prefers-reduced-motion: reduce)').matches` and have `useLoop`
   jump straight to its most-complete step instead of looping — so reduced-motion users
   see the *finished* proof, not a frozen mid-state.
4. **Pointer parallax on the hero blobs** — translate `.atmosphere` a few px toward the
   cursor (rAF-throttled, tiny amplitude). Adds depth on desktop; gate to
   `(hover:hover)` + reduced-motion off.
5. **One scroll-scrubbed moment, max.** A single hero element tied to scroll progress reads
   as premium; more than one reads as a gimmick.
6. **Always verify motion in the browser, both states.** Use the preview tools: confirm the
   loop advances (`preview_eval` reading the stepped class/state over time), confirm
   `.fade-up` elements gain `.visible`, then emulate reduced-motion and confirm everything
   is static *and content is visible*. Check 375px — demos must not overflow.

---

## 8. Checklist when adding motion
1. New demo? → one claim, 3–6 timed beats, `useLoop`, `>=`/`===` gating, `.demo-shell` +
   pulsing dot + LTR label. Pure visual.
2. New reveal block? → `.fade-up` (+`d1/d2/d3` for cascade); `<ScrollReveal/>` already
   mounted once.
3. New looping flicker/float? → long duration, gentle easing, low opacity; desync siblings
   with negative `animation-delay`.
4. Self-drawing meter? → SVG `stroke-dasharray`/`dashoffset`, one `ring-fill`-style keyframe.
5. **Add it to the reduced-motion block** — animations off, reveals forced visible.
6. Verify in preview: loop advances, reveals fire, reduced-motion freezes + shows content,
   no 375px overflow.
```
