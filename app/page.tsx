import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { HeroSection } from "@/components/landing/HeroSection";
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

export default async function HomePage() {
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
      <a href="#main" className="skip-link">דלג לתוכן הראשי</a>
      <SiteHeader user={user} />
      <main id="main">
        <HeroSection />
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
