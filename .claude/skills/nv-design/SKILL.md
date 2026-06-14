---
name: nv-design
description: Recreate the "Night Atelier" design system AND the full site-recreation playbook for noamvardi.ai — a dark, cinematic, bronze-accented, glass-surface, Hebrew-RTL premium AI-automation agency site (Next.js 16 App Router, React 19, Tailwind v4, Supabase, Vercel). Use when building or restyling any page/component (landing, hub, admin, articles, terms), wiring the promo slot / contact→leads / auth, hardening Supabase, or when asked to "match the site design", "use the NV design", "recreate the look/site", or apply the same theme to a new surface. For anything that MOVES (agent demos, atmosphere, scroll reveals, rings) read the companion skill [[nv-motion]].
---

# NV "Night Atelier" — design system + recreation playbook

Premium dark site for an AI-automation agency. Cinematic, calm, expensive-feeling.
Hebrew RTL throughout; English only for the logo and short serif-italic micro-labels.

This skill is two things: (A) the **design system** (tokens, type, components — §1–4, §7) and
(B) the **recreation playbook** (the *why* behind each decision, page archetypes, architecture
patterns, and the build process — §0, §5, §8–12). Read §0 first — it's the thinking that makes
the rest cohere. Motion lives in [[nv-motion]]; read it for any animated/interactive surface.

---

## 0. Design philosophy — the *why* (read first)

The look is a set of deliberate bets, not arbitrary taste. Recreate the **reasoning**, then the
pixels follow:

- **Dark-only, no light toggle.** A single coherent premium world is a stronger identity than a
  theme switcher, and it matches the logo's dark version + the cinematic "Cairn"-style reference.
  Don't add a light mode — it dilutes the identity.
- **Bronze accent, deliberately NOT cyan/purple.** Every generic AI template reaches for neon
  cyan/violet. The muted bronze/amber (`#c8a96a`) is the single anti-template move that makes the
  site read as bespoke and high-end. Accent is the *only* chroma on the page — one focal use per
  view, never sprinkled.
- **Warm off-white, never pure white.** Text `#f2efe9` on near-black blue. Pure `#fff` on pure
  `#000` is harsh and "tech-demo"; the warm pairing reads as editorial/film.
- **Atmosphere is built, never stock.** No photos. Depth comes from CSS layers — drifting aurora
  blobs + SVG film grain + vignette (see [[nv-motion]] §1). This is what separates it from a flat
  template. Calm, muted, unhurried.
- **Glass + hairlines as the universal material.** Every panel is the same recipe (§4) so the
  whole site feels like one object. Never invent a new border/shadow/radius — reuse the tokens.
- **Show, don't tell (the agent thesis).** The product is "AI agents that do real work", so the
  site *demonstrates* agents working (looping live demos) instead of listing features. The motion
  isn't decoration — it's the core argument. See [[nv-motion]] §0.
- **Security is part of the recreation, not an afterthought.** The redesign shipped real Supabase
  hardening (§10). A "recreation" that only copies pixels and leaves the privilege-escalation hole
  is incomplete.

**Anti-goal:** must NOT look like a generic AI-template site (no cyan/purple neon, no default
Tailwind cards, no stock hero photo, no emoji-soup). Bronze + glass + film-grain + RTL editorial
typography is the signature.

---

## 1. Foundations (CSS tokens)

Define once in `app/globals.css` under `:root`. Everything references these — never hardcode hex
in components.

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
- **Frank Ruhl Libre** (`--font-frank`) — Hebrew serif. Used italic for ONE accent word inside an
  otherwise-sans headline (`.serif-accent`).
- **Instrument Serif** (`--font-instrument`) — Latin serif italic. English micro-labels only
  (`.kicker`, agent taglines, big step numbers).

Headline signature = bold sans + one italic-serif accent word:
```jsx
<h2>לא עוד תוכנה. <span className="serif-accent">עובדים דיגיטליים.</span></h2>
```
Section eyebrow (English, italic serif, bronze, LTR):
```jsx
<span className="kicker">THE AGENT WORKFORCE</span>
```

## 3. Atmosphere (cinematic layer) → see [[nv-motion]]

Two fixed full-bleed layers (`.atmosphere` drifting blobs + `.grain` SVG film noise) injected once
in root `layout.tsx` before `{children}`. Exact CSS, drift timings, and the reduced-motion rules
live in [[nv-motion]] §1 + §6. This is the single biggest "not a template" signal — don't skip it.

## 4. Core components & recipes

**Glass surface** (the universal building block):
```css
background: var(--glass); border: 1px solid var(--glass-brd);
border-radius: var(--radius);
backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
```
Hover for cards: `transform: translateY(-6px)`, border → `--accent-brd`,
`box-shadow: 0 30px 70px rgba(0,0,0,0.45)`, transition `.35s`.

**Floating pill nav** — detached from top (`top:16px`), centered, `max-width:1060px`,
`border-radius:100px`, heavy backdrop-blur glass, drop shadow. Logo on the right (RTL start), links
+ CTA on the left. Collapses to a hamburger + full-screen `.mobile-nav` under 960px.

**Buttons** — all pill-shaped (`border-radius:100px`):
- `.btn-primary` — bronze fill, `#131008` text, bronze glow shadow.
- `.btn-glass` — transparent glass, hairline border (secondary).
- `.btn-wa` — WhatsApp green (`#1faa55`) variant of primary.
- `.btn-google` — full-width glass pill + Google `G` SVG, used in the auth drawer (§9).

**Circular progress ring** (`.ring`), **floating stat cards** (`.stat-card`), and the looping
**agent-demo** components → all in [[nv-motion]] (§2–3). They're motion-first; recipes live there.

**Logo integration (critical — earlier attempts botched it):** logo JPEGs are white-art-on-black
(`/logo/logo-dark-bg.jpg`) and black-on-white (`/logo/logo-light-bg.jpg`). JPEGs have **no alpha**.
On dark surfaces use the dark-bg file with `mix-blend-mode: screen` — the black background melts
into the glass, no visible rectangle. Keep the logo text English even in RTL. The NV `LogoMark` SVG
(in [Logo.tsx](components/Logo.tsx)) uses `currentColor`/`var(--accent)` for the favicon + small marks.

## 5. Page archetypes — the recreation playbook

The site has two structural families. Match the family, then fill with content.

**A) Marketing sections** (`/` landing): `.section` (110px vertical pad) > `.section-inner`
(max 1160px) > `.section-head` (`.kicker` eyebrow + sans headline w/ one `.serif-accent` word +
lead `<p>`). Reveal children with `.fade-up` (+ `ScrollReveal`, see [[nv-motion]] §4).
Landing order (each section = one job, top to bottom):
1. **Hero** — headline + sub + WhatsApp/scroll CTAs + floating stat cards ([HeroSection.tsx](components/landing/HeroSection.tsx)).
2. **Agent showcase** — 4 looping demo cards, the centerpiece ([AgentShowcase.tsx](components/landing/AgentShowcase.tsx); demos in [[nv-motion]] §2).
3. **Before/After + numbers band** — the psychology beat ([BeforeAfter.tsx](components/landing/BeforeAfter.tsx)).
4. **Process** — 4 glass step-cards, big italic-serif step numbers ([ProcessSection.tsx](components/landing/ProcessSection.tsx)).
5. **Promo slot** — renders only when enabled (§8) ([PromoSection.tsx](components/landing/PromoSection.tsx)).
6. **Articles teaser** — latest 3 published ([ArticlesTeaser.tsx](components/landing/ArticlesTeaser.tsx)).
7. **Contact** — split panel: WhatsApp/phone/email cards + optional Calendly + DB form (§8).
8. **Footer** — logo (blend-screen) + wrapping link row.

**B) App pages** (hub/admin/articles/terms): `.page` wrapper (clears the fixed nav), `.card` glass
panels, `.tbl` tables (right-aligned, hairline rows), `.pill` status chips (`.gold`/`.green`),
`.icon-btn` ghost actions. Per page:
- **`/hub`** — keep 100% of functionality ([HubClient.tsx](components/HubClient.tsx)); reskin to dark glass, Recharts
  recolored to `ACCENT = "#c8a96a"`, inline styles → design-system classes (`.seg`, `.th-box`,
  `.mini-track`). Don't touch the logic.
- **`/admin*`** — dashboard shell: `.kicker` + `<h1>` + `AdminNav` pill tabs ([AdminNav.tsx](components/admin/AdminNav.tsx)) +
  `.admin-tiles` stat grid. One nav component drives every admin page (articles / promo / leads /
  users). Tables styled, functions preserved.
- **`/articles` + `/articles/[slug]`** — dark editorial: serif accents, generous measure, `.acard`
  grid. Existing article content untouched.
- **`/terms`** — reskin only, `.page` + prose.
- **Auth drawer** ([AuthDrawer.tsx](components/AuthDrawer.tsx)) — left-sliding glass drawer, blend-screen logo, `.lform`
  inputs, Google button + divider (§9).

## 6. RTL specifics
- `<html dir="rtl">`. Use logical props: `margin-inline-start`, `inset-inline-end`,
  `border-inline-start`, `padding-inline-start`.
- Force `dir="ltr"` + `text-align:right` on numbers, currency, emails, code, English symbols
  (tickers, prices, timestamps, the logo, kickers/taglines) so they read correctly.
- Mind overflow at 375px: flex-wrap footer/link rows, grids → 1 col under 960px. The footer-links
  row is the classic offender — `flex-wrap: wrap; justify-content: center`.

## 7. Forms
Dark inputs (`rgba(7,10,15,0.5)` fill, hairline border, focus → `--accent-brd`). Two flavors:
`.lform` (app/auth forms, light labels) vs `.form` (marketing contact). Submit = `.btn-blk`
(bronze pill) or `.btn-primary`. Always include a honeypot field on public forms (§8).

## 8. Architecture patterns (part of the look)

These aren't "backend" — they're how the design stays editable and the contact loop closes.

- **Promo slot** — single-row `promos` table (`enabled, title, subtitle, price_text,
  features jsonb, cta_text, cta_link, badge_text`). [lib/promo.ts](lib/promo.ts) `getPromo()` reads it
  server-side; `PromoSection` renders the pre-built design **only when `promo.enabled || preview`**.
  Admin edits at `/admin/promo` ([PromoEditor.tsx](components/admin/PromoEditor.tsx)) with a **live preview** of the real
  landing section + a publish toggle. RLS: public SELECT, admin-only writes. Lets Noam drop in a
  pricing/offer block later without a deploy.
- **Contact → DB → leads inbox** — marketing form posts to a server action ([app/contact/actions.ts](app/contact/actions.ts))
  that validates (+ honeypot `website` field) and inserts into `contact_messages`. Admin reads them
  at `/admin/leads` with new/handled status. RLS: anyone INSERT, admin SELECT/UPDATE. No more
  `mailto:`.
- **Calendly slot** — `ContactSection` renders the embed only when `NEXT_PUBLIC_CALENDLY_URL` is
  set; absent → graceful no-op. Noam adds the env var later.
- **Brand constants** — phone/email/WhatsApp intl number live in [lib/constants.ts](lib/constants.ts) `BRAND`
  (`phoneIntl: "972528369212"`). WhatsApp CTAs build `wa.me/${BRAND.phoneIntl}?text=…`.
- **Content automation** — weekly Gemini cron ([publish_article.py](publish_article.py) + [articles.yml](.github/workflows/articles.yml))
  writes a Hebrew AI-automation/agent-trends column, `category: "ai_tech"`. Same pipeline/JSON
  contract as before — only the prompt + cover-image pool changed.

## 9. Auth (Supabase SSR)
- Email/password via server actions ([app/auth/actions.ts](app/auth/actions.ts)); service-role `createUser` path for
  instant login when `SUPABASE_SERVICE_ROLE_KEY` is set, else standard `signUp`.
- **Google OAuth** — `signInWithGoogleAction` calls `signInWithOAuth({provider:'google', redirectTo:
  origin+'/auth/callback'})`; the callback route ([route.ts](app/auth/callback/route.ts)) does
  `exchangeCodeForSession`. Drawer shows a `.btn-google` pill + `.auth-divider` ("או") above the
  email form, in both login and register modes. Provider must be enabled in Supabase + a Google
  Cloud OAuth client ID/secret filled in the dashboard.

## 10. Supabase hardening (do this as part of any recreation)
Applied via MCP `apply_migration` (no repo `supabase/migrations/` — query the live project, see
[[supabase-project]]). The real issues the redesign fixed:
1. **Privilege escalation (critical):** `profiles_update_own` let users UPDATE their own `is_admin`
   via the auto REST API. Fix: revoke column UPDATE from `anon`/`authenticated`, re-grant only safe
   columns (`full_name`, `base_currency`).
2. **Admin user-mgmt broken:** add `profiles_select_admin` SELECT policy using `is_admin()`; switch
   `toggleAdminAction` to `createServiceClient()` after `requireAdmin()`.
3. Revoke EXECUTE on `is_admin()`/`handle_new_user()` from `anon`/`authenticated`; pin
   `search_path` on the 3 SECURITY DEFINER functions; drop the broad storage listing policy.
4. Add explicit `.eq("user_id", userId)` filters on hub deletes for depth.
5. **Leaked-password protection** is Pro-only — flag it if the project isn't on Pro (can't enable
   on free tier). Run `get_advisors` after any DDL and expect clean.

## 11. Process & working method — how to recreate from scratch

The build order that worked (Fable 5's actual run):
1. **Audit first, run advisors before touching anything.** Know the current pages + the live
   Supabase security state before you plan.
2. **Plan → approval gate.** Write the plan file, get explicit approval before code (hard
   requirement on this project). Dark-only, bronze, the page list above.
3. `npm install`; **read `node_modules/next/dist/docs/` first** (AGENTS.md: this Next.js has
   breaking changes vs training data — don't assume APIs).
4. **Tokens before consumers:** design system (`globals.css`) + layout/fonts/favicon → THEN
   landing components → hub+security → admin+promo → articles/automation → skill. One logical
   commit per stage.
5. **Read an existing page before redesigning it.** Don't assume structure — open
   admin/users/article pages first, reuse shared classes so child routes inherit the theme free.
6. **Mutate carefully:** put files in place (logos) and **check live function definitions before a
   hardening migration** — verify, then alter. Schema changes go through MCP `apply_migration`.

The verification discipline (this is what made it actually work, not just compile):
- **`npm run build` clean first**, then start the preview server.
- **Verify in the browser by reading state, not by asserting.** `preview_eval` + `preview_snapshot`
  (accessibility tree) are the source of truth; screenshots are proof-for-the-user, not your check
  (they also time out — don't depend on them). Pull live env into `.env.local` from the Supabase
  MCP (project URL + publishable keys) so the local server actually runs.
- **Test stateful flows end-to-end, then clean up.** Contact form: fill → submit → confirm success
  state → **query the DB row → DELETE the test row**. Promo: toggle on → confirm the section renders
  live → reset to disabled. Never leave test data behind.
- **Responsive = measure, don't eyeball.** `preview_resize` to 375px, compare `scrollWidth` vs
  `clientWidth`; if it overflows, bisect with `getBoundingClientRect()` to find the culprit element
  (it was `.footer-links` not wrapping → 459px), fix, re-measure.
- **Re-read after state changes — a single read can race a `setState`.** (The mobile menu "looked
  broken" only because the read fired before React committed; re-checking showed it worked.)
- **Re-run `get_advisors` after any DDL**, expect clean.
- Verify motion in both normal + reduced-motion states ([[nv-motion]] §7).

Gotchas that cost time (don't repeat):
- **SQL `rollback` in the same batch reverts your real change.** Running `update … set enabled=true`
  together with a `begin … rollback` test block undoes the enable. Run the real statement
  **standalone**, test policies in a separate batch.
- **Leaked-password protection is Pro-only** — can't enable on free tier; flag it, don't loop on it.
- **`deploy_to_vercel` MCP returns instructions, not a deploy.** Pushing to `main` is the deploy
  (Vercel git integration auto-builds). If the integration is disconnected, an empty commit
  re-triggers the webhook once reconnected.

Finally: commit + push (auto-deploys via Vercel git integration).

## 12. Checklist when adding a surface
1. Wrap in `.section`/`.section-inner` (marketing) or `.page` (app).
2. Open with a `.kicker` English eyebrow + sans headline w/ one `.serif-accent` word.
3. Build panels from the glass recipe (§4); never invent border/shadow/radius values.
4. Accent is the only color — one focal element per view, not everywhere.
5. Numbers/English/logo → `dir="ltr"`. Hebrew copy → default RTL.
6. Anything that moves → follow [[nv-motion]] (`.fade-up` reveals, looping demos, reduced-motion
   kill-switch). Reduced-motion must still show content.
7. Public form → honeypot + server action + DB table; expose admin view if it's a lead.
8. Touched the DB/policies? → re-run `get_advisors`, expect clean.
9. Verify in preview at desktop + 375px before shipping.
