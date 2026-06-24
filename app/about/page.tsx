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
      .select("id, title, slug, excerpt, cover_image, video_url, category, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(3),
  ]);

  return (
    <>
      <a href="#main" className="skip-link">Skip to main content</a>
      <SiteHeader user={user} />
      <main id="main">
        {/* ── BANNER (ported from SharpenDaily Hero.dc.html) ── */}
        <section className="sdl-banner">
          <div className="sdl-banner-inner">
            <span className="sdl-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 1 L13.6 9.2 L21.8 11 L13.6 12.8 L12 21 L10.4 12.8 L2.2 11 L10.4 9.2 Z" fill="var(--accent)" />
              </svg>
              <span>AI, applied to real skills</span>
            </span>
            <h1>
              I build real things with AI
              <br />
              and show you <span className="sdl-acc">exactly</span> how.
            </h1>
            <p>
              I turn AI into agents, automations and tools you can actually use — and every Short
              comes with the full how-to, free.
            </p>
            <div className="sdl-chips">
              <span>AI agents</span>
              <span>Automation</span>
              <span>Web &amp; product builds</span>
            </div>
            <div className="sdl-banner-cta">
              <Link href="/" className="primary">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 1 L13.6 9.2 L21.8 11 L13.6 12.8 L12 21 L10.4 12.8 L2.2 11 L10.4 9.2 Z" fill="#14110F" />
                </svg>
                Get the how-tos
              </Link>
              <a href="#contact" className="ghost">Get in touch</a>
            </div>
          </div>
          <div className="sdl-scroll" aria-hidden="true">
            <span className="label">Scroll for more</span>
            <span className="arrow">↓</span>
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
