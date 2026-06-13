---
name: nv-design
description: Recreate the "Night Atelier" design system used on noamvardi.ai — a dark, cinematic, bronze-accented, glass-surface, Hebrew-RTL look for a premium AI-automation agency site. Use when building or restyling any page/component for this project (landing, hub, admin, articles), or when asked to "match the site design", "use the NV design", "recreate the look", or apply the same theme to a new surface.
---

# NV "Night Atelier" Design System

Premium dark site for an AI-automation agency. Cinematic, calm, expensive-feeling.
Hebrew RTL throughout; English only for the logo and short serif-italic micro-labels.
**Anti-goal:** must NOT look like a generic AI-template site (no cyan/purple neon, no
default Tailwind cards). The bronze accent + glass + film-grain is what makes it custom.

## 1. Foundations (CSS tokens)

Define once in `app/globals.css` under `:root`. Everything references these — never
hardcode hex in components.

```css
--bg: #070a0f;          /* page canvas, near-black blue */
--bg-2: #0a0e16;
--surface: #0d1219;     /* raised panels */
--surface-2: #111723;
--glass: rgba(255,255,255,0.045);    /* default glass fill */
--glass-2: rgba(255,255,255,0.08);
--glass-brd: rgba(255,255,255,0.09); /* glass hairline border */
--glass-brd-2: rgba(255,255,255,0.16);
--text: #f2efe9;        /* warm off-white, NOT pure #fff */
--text-dim: rgba(242,239,233,0.64);
--text-faint: rgba(242,239,233,0.38);
--accent: #c8a96a;          /* muted bronze/amber — the signature */
--accent-bright: #e0c389;
--accent-soft: rgba(200,169,106,0.13);
--accent-brd: rgba(200,169,106,0.32);
--good: #86d9a2;  --bad: #f0907e;
--radius: 20px; --radius-sm: 12px; --nav-h: 64px;
```

Rules of thumb:
- Text is warm off-white `--text`, never pure white. Accent is the only chroma.
- Borders are always 1px hairlines in `--glass-brd`; on hover lift to `--accent-brd`.
- Black CTA text on bronze buttons is `#131008` (not pure black) for warmth.

## 2. Typography

Three fonts via `next/font/google`, exposed as CSS vars on `<html>`:
- **Heebo** (`--font-heebo`) — Hebrew + Latin, weights 300–900. Body + bold headlines.
- **Frank Ruhl Libre** (`--font-frank`) — Hebrew serif. Used italic for ONE accent
  word inside an otherwise-sans headline (`.serif-accent`).
- **Instrument Serif** (`--font-instrument`) — Latin serif italic. English micro-labels
  only (`.kicker`, agent taglines, big step numbers).

Headline signature = bold sans + one italic-serif accent word:
```jsx
<h2>לא עוד תוכנה. <span className="serif-accent">עובדים דיגיטליים.</span></h2>
```
Section eyebrow (English, italic serif, bronze, LTR):
```jsx
<span className="kicker">THE AGENT WORKFORCE</span>
```

## 3. Atmosphere (the "cinematic" layer)

Two fixed full-bleed layers behind everything, injected once in root `layout.tsx`
body (before `{children}`):
```jsx
<div className="atmosphere" aria-hidden="true" />
<div className="grain" aria-hidden="true" />
```
- `.atmosphere` — base radial gradients + two big blurred bronze/blue blobs that
  slowly drift (`drift-a` 26s, `drift-b` 32s, `filter: blur(110px)`). `z-index:-2`.
- `.grain` — inline SVG `feTurbulence` fractal noise, `opacity:.055`, stepped shimmer
  animation. `z-index:-1`, `pointer-events:none`. This is what kills the "flat template"
  feel — keep it subtle.
- Always include `@media (prefers-reduced-motion: reduce)` that kills all of the above
  + reveal animations.

## 4. Core components & recipes

**Glass surface** (the universal building block):
```css
background: var(--glass); border: 1px solid var(--glass-brd);
border-radius: var(--radius);
backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
```
Hover interaction for cards: `transform: translateY(-6px)`, border → `--accent-brd`,
add `box-shadow: 0 30px 70px rgba(0,0,0,0.45)`.

**Floating pill nav** — detached from top (`top:16px`), centered, `max-width:1060px`,
`border-radius:100px`, heavy backdrop-blur glass, `box-shadow` drop. Logo on the right
(RTL start), links + CTA on the left. Collapses to a hamburger + full-screen
`.mobile-nav` under 960px.

**Buttons** — all pill-shaped (`border-radius:100px`):
- `.btn-primary` — bronze fill, `#131008` text, bronze glow shadow.
- `.btn-glass` — transparent glass, hairline border, used as secondary.
- `.btn-wa` — WhatsApp green (`#1faa55`) variant of primary.

**Circular progress ring** (`.ring`) — `<svg>` rotated −90°, two circles (track +
animated `bar` with `stroke-dasharray`/`dashoffset`), label centered. Used on hero
floating stat cards.

**Floating stat cards** (`.stat-card`) — absolutely-positioned glass cards over the
hero visual, gentle `float-y` 7s bob with staggered delays.

**Logo integration (critical — previous attempts botched it):** logo JPEGs are
white-art-on-black (`logo-dark-bg.jpg`) and black-on-white (`logo-light-bg.jpg`) in
`public/logo/`. JPEGs have no alpha. On dark surfaces use the dark-bg file with
`mix-blend-mode: screen` — the black background melts into the glass, no visible
rectangle. Keep the logo text English even in RTL.

## 5. Page archetypes

- **Marketing sections** — `.section` (110px vertical pad) > `.section-inner`
  (max 1160px) > `.section-head` (eyebrow + headline + lead). Reveal children with
  `.fade-up` + the `ScrollReveal` IntersectionObserver client component.
- **App pages** (hub/admin/articles list) — `.page` wrapper (accounts for fixed nav),
  `.card` glass panels, `.tbl` tables (right-aligned, hairline rows), `.pill`
  status chips (`.gold` / `.green` variants), `.icon-btn` ghost actions.
- **Forms** — dark inputs (`rgba(7,10,15,0.5)` fill, hairline border, focus →
  `--accent-brd`). `.lform` (light-label app forms) vs `.form` (marketing contact).
- **Admin shell** — `.kicker` + `<h1>` + `AdminNav` pill tabs + `.admin-tiles` stat
  grid. One nav component (`components/admin/AdminNav.tsx`) drives all admin pages.

## 6. RTL specifics
- `<html dir="rtl">`. Use logical props: `margin-inline-start`, `inset-inline-end`,
  `border-inline-start`, `padding-inline-start`.
- Force `dir="ltr"` + `text-align:right` on numbers, currency, emails, code, English
  symbols (stock tickers, prices, timestamps) so they read correctly.

## 7. Animated "agent demo" pattern
Each showcase card embeds a small self-contained client component with a looping
state machine (`useLoop(durations[])` → `setStep`). Demos render inside a `.demo-shell`
(dark inset, status dot + LTR English label). Keep them lightweight (CSS animations +
a single interval/timeout), pure visual, no real data. See
`components/landing/AgentShowcase.tsx` for the four reference demos (chat / calendar /
pipeline / ops-table).

## 8. Checklist when adding a surface
1. Wrap content in `.section`/`.section-inner` (marketing) or `.page` (app).
2. Open with a `.kicker` English eyebrow + sans headline w/ one `.serif-accent` word.
3. Build panels from the glass recipe; never invent new border/shadow values.
4. Accent is the only color — use it for one focal element per view, not everywhere.
5. Numbers/English → `dir="ltr"`. Hebrew copy → default RTL.
6. Add `.fade-up` to reveal blocks; ensure reduced-motion fallback still shows them.
7. Verify in preview at desktop + 375px; check no horizontal overflow (flex-wrap
   footer/link rows, grid → 1col under 960px).
