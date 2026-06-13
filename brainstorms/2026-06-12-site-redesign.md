# Site Redesign: Brainstorm / Discovery Notes
Date: 2026-06-12 · Goal: Gather requirements/preferences for Noam's personal site (noamvardi-site, Vercel/Next.js) to hand to Fable 5 for full visual recreation.

## Context (from codebase scan)
- Next.js 16 + React 19 + Tailwind 4 + Supabase. Hebrew (RTL) UI.
- Pages: landing (`/`), private asset hub `/hub` (portfolio tracker, login-gated), market articles `/articles` (auto-published weekly via GitHub Action), admin `/admin`, `/terms`.

## Summary / key decisions
- **Full redesign** — landing, hub (מנהל נכסים), admin all included. Admin's own UI gets recreated too.
- **Major pivot**: site moves away from stock-market/finance content toward **AI automation agency pitch** — showcase agent use-cases (24/7 agents, appointment scheduling/rescheduling, ops automation) aimed at mid-size companies wanting more profit. Tone: touch psychology, show real possibilities. No pricing/offer section yet — pure showcase.
- **Hub (מנהל נכסים)**: needs better privacy/auth at entrance + general UX overhaul.
- **Process**: Fable 5 produces a BIG PLAN first (audit of what needs to change) before building anything.
- **Logo**: new "NV | NOAM VARDI — AI · INNOVATION · FUTURE" logo (light-bg + dark-bg versions) provided in chat — must be integrated well this time (previous Fable pass botched logo placement).
- **Quality bar**: must NOT look AI-generated/templatey — genuinely special, phenomenal design.

## Q&A log
### Q1 — scope
- Asked: New design covers landing+articles+terms only, or hub/admin too?
- Captured: Everything — landing, hub, admin all redesigned. Admin's own UI recreated too.

### Q2 — articles content
- Asked: drop `/articles` under new AI-agency positioning, or repurpose?
- Captured: Repurpose — weekly auto-articles switch topic to AI automation/agent trends (instead of market analysis). Keep existing market articles already published, don't delete them.

### Q3 — language
- Asked: keep Hebrew/RTL primary, or switch to English/bilingual?
- Captured: RTL Hebrew only. Logo sidebar/corner element stays English (as designed).

### Q4 — showcase use cases
- Asked: confirm shortlist (24/7 support agent, appointment scheduling/rescheduling, lead follow-up/sales outreach, ops/data-entry automation) or adjust?
- Captured: Good, confirmed as-is. Extra note: Fable can build/propose custom skills/sub-agents for specific use cases if it sees fit — open-ended, not locked to just these 4.

### Q5 — visual theme
- Asked: dark-default + light toggle vs light-first? Accent color preference?
- Captured: Let Fable pick — full creative freedom on theme/colors beyond logo (black/white).

### Q6 — hub privacy
- Asked: stronger auth (2FA/passkey) vs hiding hub link from public nav?
- Captured: Let Fable decide on auth level — 2FA "nice if he thinks so" but not required now. Main ask: backend/SQL must be unreachable/locked down (Supabase RLS + exposure hardening). User offers to install a Firebase skill if Fable wants extra tooling for this — optional, only if useful.

### Q7 — CTA
- Asked: contact mechanism for interested visitors?
- Captured: Existing small contact form is poorly designed — redesign/improve it. Add WhatsApp link (if missing). Calendly: Fable's call — if he thinks it's worth it, proceed with building it in; user will create the Calendly account afterward.

### Q8 — admin scope
- Asked: same functions (articles/users) with new UI, or new capabilities too?
- Captured: New capabilities added. Specifically: a "promo/offer" module — pre-designed slot/section on main page (built now, styled, but hidden/inactive). Later, when Noam has something to sell, he goes to admin, fills in pricing/details, toggles it live -> appears on main page with the pre-built design. Can edit/unpublish from admin anytime after.

### Logo files located
- User placed both logo images directly in project root:
  - `WhatsApp Image 2026-05-31 at 13.34.35.jpeg` (light-bg version)
  - `WhatsApp Image 2026-05-31 at 13.34.35 (1).jpeg` (dark-bg version)
- Will need moving into `public/logo/` (or similar) with proper names during implementation.

### Final check — reference/inspiration
- Asked: any reference sites/styles, dislikes, timeline?
- Captured: Shared screenshot of "Cairn" site (cybersecurity) as VIBE reference, not literal design to copy. Liked elements: cinematic full-bleed ambient photography background, calm/premium muted color grading, large bold sans + italic serif headline mix, glassy pill-shaped buttons/nav, floating glass stat-cards w/ circular progress indicators. Core want: site should *feel* futuristic and be enjoyable/impressive to use — that "wow" factor.

## Open flags (pending input)
- Logo files (light-bg + dark-bg) shared as chat images, now placed at project root as `WhatsApp Image 2026-05-31 at 13.34.35.jpeg` / `... (1).jpeg` — need moving into `public/logo/` with proper names before Fable can use them.
