import Link from "next/link";
import { cookies } from "next/headers";
import { SubscribeForm } from "@/components/sharpen/SubscribeForm";
import { getSessionUser } from "@/lib/auth";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { SD, SD_ACCESS_COOKIE } from "@/lib/sd";

export const revalidate = 60;

const Spark = ({ s = 13 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 1 L13.6 9.4 L22 12 L13.6 14.6 L12 23 L10.4 14.6 L2 12 L10.4 9.4 Z" fill="var(--accent)" />
  </svg>
);

const CARDS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round">
        <path d="M9 6h11M9 12h11M9 18h11" />
        <circle cx="4" cy="6" r="1.4" fill="var(--accent)" stroke="none" />
        <circle cx="4" cy="12" r="1.4" fill="var(--accent)" stroke="none" />
        <circle cx="4" cy="18" r="1.4" fill="var(--accent)" stroke="none" />
      </svg>
    ),
    title: "Every video's full step-by-step",
    body: "The complete written walkthrough for the Short you just watched — nothing cut for runtime.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 8l-4 4 4 4" />
        <path d="M16 8l4 4-4 4" />
      </svg>
    ),
    title: "The exact prompts, tools & repos",
    body: "Copy-paste prompts, the apps behind them, the GitHub repos, and the settings that actually matter.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="M3.5 7l8.5 6 8.5-6" />
      </svg>
    ),
    title: "The Vault — a short weekly drop",
    body: "One email a week: the best thing I learned plus the free extras. Unsubscribe in one click.",
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
  const [user, jar] = await Promise.all([getSessionUser(), cookies()]);
  const unlocked = !!user || jar.get(SD_ACCESS_COOKIE)?.value === "1";

  const supabase = await createClient();
  const [{ data: latest }, count] = await Promise.all([
    supabase
      .from("articles")
      .select("title, slug, excerpt")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    subscriberCount(),
  ]);

  return (
    <div className="sdl">
      <div className="sdl-vignette" aria-hidden="true" />
      <div className="sdl-wrap">

        {/* nav */}
        <nav className="sdl-nav">
          <Link href="/" className="sdl-brand">
            <span className="sdl-logo">
              <b>SD</b>
              <Spark />
            </span>
            <span className="sdl-brand-name">SharpenDaily</span>
          </Link>
          <div className="sdl-nav-links">
            <Link href="/articles">The Vault</Link>
            <Link href="/about">What I do →</Link>
          </div>
        </nav>

        {/* hero */}
        <header className="sdl-hero">
          <span className="sdl-badge">
            <Spark s={11} />
            <span>AI to get genuinely better at real things</span>
          </span>
          <h1>
            Get genuinely
            <br />
            better — <span className="sdl-acc">daily</span>
          </h1>
          <p className="sdl-hero-sub">The full how-to behind every SharpenDaily video. Free.</p>
          <div className="sdl-hero-form">
            <SubscribeForm cta="Unlock The Vault" />
          </div>
        </header>

        {/* what you get */}
        <section id="get" className="sdl-get">
          <div className="sdl-eyebrow">
            <span className="line" />
            <span className="txt">What you get</span>
            <span className="line" />
          </div>
          <div className="sdl-cards">
            {CARDS.map((c) => (
              <div className="sdl-card" key={c.title}>
                <div className="sdl-card-icon">{c.icon}</div>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* today's how-to — gated */}
        {latest && (
          <section className="sdl-gate-wrap">
            <div className="sdl-eyebrow">
              <span className="line" />
              <span className="txt">Today&apos;s how-to</span>
              <span className="line" />
            </div>
            <article className="sdl-article">
              <span className="sdl-tag">
                <Spark s={10} />
                <span>FROM THE LATEST SHORT</span>
              </span>
              <h2>{latest.title}</h2>
              {latest.excerpt && <p className="sdl-article-lead">{latest.excerpt}</p>}

              <div className="sdl-locked">
                <div className={`sdl-locked-body${unlocked ? " unlocked" : ""}`}>
                  <h3>The full step-by-step</h3>
                  <p>
                    The complete routine from the video — every step, the exact prompts, and the
                    tools behind them. Read the whole thing free.
                  </p>
                  <h3>What most people get wrong</h3>
                  <p>
                    The one mistake that quietly wastes the effort — and the small change that turns
                    twenty idle minutes into real, measurable progress.
                  </p>
                </div>

                {unlocked ? (
                  <Link href={`/articles/${latest.slug}`} className="sdl-read-more">
                    Read the full how-to →
                  </Link>
                ) : (
                  <div className="sdl-gate-overlay">
                    <span className="lock">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="4" y="11" width="16" height="9" rx="2.2" />
                        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                      </svg>
                    </span>
                    <h4>Enter your email to read the full how-to</h4>
                    <p>You&apos;ll also get every future write-up + The Vault, free. No spam.</p>
                    <SubscribeForm cta="Read it free" sourceVideo={latest.slug} />
                  </div>
                )}
              </div>
            </article>
          </section>
        )}

        {/* trust row */}
        <section className="sdl-trust">
          <div className="sdl-trust-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>No spam. Unsubscribe anytime.</span>
          </div>
          {count != null && count > 0 && (
            <>
              <span className="sdl-trust-sep" />
              <div className="sdl-trust-item">
                <div className="sdl-avatars">
                  <span style={{ background: "linear-gradient(135deg,#C8862B,#8a5a18)" }} />
                  <span style={{ background: "linear-gradient(135deg,#d6a05a,#9c6a22)" }} />
                  <span style={{ background: "linear-gradient(135deg,#e8c690,#b07c2e)" }} />
                </div>
                <span>
                  <b>{count.toLocaleString("en-US")}+</b> getting sharper daily
                </span>
              </div>
            </>
          )}
        </section>

        {/* footer */}
        <footer className="sdl-footer">
          <div className="sdl-footer-brand">
            <span className="sdl-footer-logo">SD</span>
            <span className="sdl-footer-copy">© SharpenDaily 2026</span>
          </div>
          <div className="sdl-footer-links">
            <a href={SD.socials.youtube}>YouTube</a>
            <a href={SD.socials.tiktok}>TikTok</a>
            <a href={SD.socials.instagram}>Instagram</a>
            <Link href="/articles">The Vault</Link>
            <Link href="/about">What I do</Link>
          </div>
        </footer>

        <p className="sdl-tagline-foot">@sharpendaily everywhere</p>
      </div>
    </div>
  );
}
