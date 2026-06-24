import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AgentShowcase } from "@/components/landing/AgentShowcase";
import { BeforeAfter } from "@/components/landing/BeforeAfter";
import { ProcessSection } from "@/components/landing/ProcessSection";
import { ArticlesTeaser } from "@/components/landing/ArticlesTeaser";
import { PromoSection } from "@/components/landing/PromoSection";
import { ContactSection } from "@/components/landing/ContactSection";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { SubscribeForm } from "@/components/sharpen/SubscribeForm";
import { EntryModal } from "@/components/sharpen/EntryModal";
import { SDMark } from "@/components/sharpen/SDMark";
import { getSessionUser } from "@/lib/auth";
import { getPromo } from "@/lib/promo";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { SD } from "@/lib/sd";
import type { Article } from "@/components/ArticleCard";

export const revalidate = 60;

const CARDS = [
  {
    title: "Every video's full step-by-step",
    body: "The complete walk-through behind each Short — nothing left on the cutting-room floor.",
  },
  {
    title: "The exact prompts & tools I use",
    body: "Copy-paste the real prompts, the exact tools, the settings that actually worked.",
  },
  {
    title: "A short weekly newsletter",
    body: "One tight email a week. The best of what's working. No spam, no filler.",
  },
];

async function subscriberCount(): Promise<number | null> {
  try {
    const supabase = createServiceClient();
    const { count } = await supabase
      .from("subscribers")
      .select("id", { count: "exact", head: true })
      .eq("brand", SD.brand)
      .eq("confirmed", true);
    return count ?? null;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const user = await getSessionUser();
  const supabase = await createClient();

  const [promo, { data: articlesData }, count] = await Promise.all([
    getPromo(),
    supabase
      .from("articles")
      .select("id, title, slug, excerpt, cover_image, category, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(3),
    subscriberCount(),
  ]);

  return (
    <>
      <a href="#main" className="skip-link">Skip to main content</a>
      <SiteHeader user={user} />
      <main id="main">
        <div className="sd-main">
          <section className="sd-hero">
            <SDMark size={64} />
            <h1>
              Get genuinely better — <span className="sd-accent">daily</span>
            </h1>
            <p className="sd-hero-sub">
              The full how-to behind every SharpenDaily video. Free.
            </p>
            <div className="sd-hero-form">
              <SubscribeForm cta="Unlock free" />
            </div>
            <span className="sd-trust">No spam. Unsubscribe anytime.</span>
            {count != null && count > 0 && (
              <span className="sd-count">
                {count.toLocaleString("en-US")} readers getting sharper
              </span>
            )}
          </section>

          <section className="sd-cards">
            {CARDS.map((c) => (
              <div className="sd-card" key={c.title}>
                <span className="sd-card-spark" aria-hidden="true">
                  <SDMark size={28} />
                </span>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </div>
            ))}
          </section>
        </div>

        <AgentShowcase />
        <BeforeAfter />
        <ProcessSection />
        <PromoSection promo={promo} />
        <ArticlesTeaser articles={(articlesData ?? []) as Article[]} />
        <ContactSection />
      </main>
      <SiteFooter />
      <ScrollReveal />
      <EntryModal />
    </>
  );
}
