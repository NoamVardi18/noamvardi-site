import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AgentShowcase } from "@/components/landing/AgentShowcase";
import { BeforeAfter } from "@/components/landing/BeforeAfter";
import { ProcessSection } from "@/components/landing/ProcessSection";
import { ArticlesTeaser } from "@/components/landing/ArticlesTeaser";
import { PromoSection } from "@/components/landing/PromoSection";
import { ContactSection } from "@/components/landing/ContactSection";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { getSessionUser } from "@/lib/auth";
import { getPromo } from "@/lib/promo";
import { createClient } from "@/lib/supabase/server";
import type { Article } from "@/components/ArticleCard";

export const revalidate = 60;
export const metadata = { title: "What I do | SharpenDaily" };

export default async function AboutPage() {
  const user = await getSessionUser();
  const supabase = await createClient();

  const [promo, { data: articlesData }] = await Promise.all([
    getPromo(),
    supabase
      .from("articles")
      .select("id, title, slug, excerpt, cover_image, category, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(3),
  ]);

  return (
    <>
      <a href="#main" className="skip-link">Skip to main content</a>
      <SiteHeader user={user} />
      <main id="main">
        {/* ── BANNER (regenerate via claude.ai — see runbook prompt) ── */}
        <section className="sdl-banner">
          <div className="sdl-banner-inner">
            <span className="sdl-badge">
              <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 1 L13.6 9.4 L22 12 L13.6 14.6 L12 23 L10.4 14.6 L2 12 L10.4 9.4 Z" fill="var(--accent)" />
              </svg>
              <span>AI, applied to real skills</span>
            </span>
            <h1>
              I build with AI — and show you{" "}
              <span className="sdl-acc">exactly how</span>
            </h1>
            <p>
              From agents and automations to the prompts and tools behind every build. Watch the
              Short, then get the full how-to — free.
            </p>
            <div className="sdl-banner-cta">
              <Link href="/" className="btn-primary">Get the how-tos</Link>
              <a href="#contact" className="btn-glass">Get in touch</a>
            </div>
          </div>
        </section>

        <AgentShowcase />
        <BeforeAfter />
        <ProcessSection />
        <PromoSection promo={promo} />
        <ArticlesTeaser articles={(articlesData ?? []) as Article[]} />
        <ContactSection />
      </main>
      <SiteFooter />
      <ScrollReveal />
    </>
  );
}
