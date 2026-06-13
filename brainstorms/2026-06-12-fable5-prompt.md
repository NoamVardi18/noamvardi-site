# Prompt for Fable 5 — Full Site Recreation

## Context
This is a Next.js 16 (App Router) + React 19 + Tailwind CSS v4 + Supabase project, deployed on Vercel. UI language is **Hebrew, RTL throughout** — keep this.

Current pages:
- `/` — landing page
- `/hub` — private portfolio/asset tracker ("מרכז הנכסים"), login-gated via Supabase auth
- `/articles` + `/articles/[slug]` — auto-published market articles, generated weekly via a GitHub Action (`.github/workflows/articles.yml` + `publish_article.py`)
- `/admin`, `/admin/new`, `/admin/[id]`, `/admin/users` — admin panel (article management + user management)
- `/terms`

## Goal
Full visual recreation of the **entire site** — landing, hub, admin, articles, terms. Every page gets redesigned, not just the homepage.

## The big pivot — new positioning
The site currently centers on stock-market/finance content. Change the core positioning to an **AI automation agency pitch**: Noam offers AI agents/workflows that take over real business tasks for mid-size companies, making them more profitable. Showcase concrete use cases such as:
- 24/7 customer support agents
- Appointment scheduling & last-minute rescheduling automation
- Lead follow-up / sales outreach agents
- Ops & data-entry automation

Feel free to propose additional/better use cases — even build custom mini "skill" showcase modules if a specific use case deserves its own section.

Tone: speak to psychology — show real possibilities, make visitors *feel* what having a 24/7 agent workforce would do for their business. **No pricing/services/offer section for now** — pure showcase/portfolio energy.

## Logo
Two logo files are at the project root:
- `WhatsApp Image 2026-05-31 at 13.34.35.jpeg` — light-background version
- `WhatsApp Image 2026-05-31 at 13.34.35 (1).jpeg` — dark-background version

Move these into `public/logo/` with proper names and integrate properly across the site (header, favicon, etc.). A previous redesign attempt placed the logo badly — get this right this time. Logo text is in English ("NOAM VARDI — AI · INNOVATION · FUTURE") — keep it English even though the rest of the UI is Hebrew/RTL.

## Visual direction
- Full creative freedom on color palette / light vs dark theme.
- Reference vibe (not to copy literally): cinematic full-bleed ambient photography backgrounds, calm/premium muted color grading, bold sans + italic serif headline mixes, glassy pill-shaped buttons/nav, floating glass "stat card" widgets with circular progress indicators. Premium, futuristic, genuine "wow factor" — enjoyable and impressive to browse.
- Hard requirement: must **not** look like a generic AI-template site. Genuinely unique, custom-feeling design.

## Articles (`/articles`)
- Keep existing published articles (don't delete).
- Repurpose the weekly auto-generated article topic from market analysis to AI-automation/agent-trend content going forward. The weekly cron already runs — just shift the topic/prompt (flag if `publish_article.py` / `.github/workflows/articles.yml` need touching).

## Hub (`/hub` — "מרכז הנכסים", private asset tracker)
- Redesign visually to match the new site language.
- Improve privacy/security at the entrance: harden the Supabase backend so the DB/SQL isn't reachable/exposed (review RLS policies, exposed endpoints). Stronger auth (2FA/passkey) is a nice-to-have if warranted — not mandatory right now.

## Admin (`/admin*`)
- Redesign the admin UI itself (currently a plain articles+users table).
- Keep existing functions (article management, user management).
- Add new capability: a **"promo/offer" module** — pre-design a styled slot/section on the main landing page for a future paid offering, but keep it hidden/inactive by default. From admin, Noam should be able to fill in pricing/details and toggle it live (appears on main page using the pre-built design), and edit/unpublish later.

## Contact / CTA
- The current contact form is small and poorly designed — redesign it properly.
- Add a WhatsApp contact link if one doesn't already exist.
- Consider whether a Calendly booking widget fits the design — if it adds value, build the integration point in (Noam will create the Calendly account and provide the link/embed code afterward).

## Process — important
Before writing any code, produce a comprehensive **plan** first: an audit of the current site (what exists, what needs to change page-by-page) plus your proposed new design direction (layout, visual language, page-by-page breakdown, logo integration approach, theme/colors, the promo module, hub/admin changes). Present this plan for review/approval before implementation begins.
