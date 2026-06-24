import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ArticleCard, type Article } from "@/components/ArticleCard";
import { getSessionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "How-tos | SharpenDaily" };
export const revalidate = 60;

export default async function ArticlesPage() {
  const user = await getSessionUser();
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select("id, title, slug, excerpt, cover_image, category, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  const articles = (data ?? []) as Article[];

  return (
    <>
      <SiteHeader user={user} />
      <main className="page">
        <span className="kicker">HOW-TOS</span>
        <h1>How-tos</h1>
        <p className="sub">The full written how-to behind every SharpenDaily video — the exact steps, prompts and tools.</p>

        {articles.length === 0 ? (
          <div className="empty-state">
            <p>No how-tos published yet — new content is coming soon.</p>
          </div>
        ) : (
          <div className="articles-grid">
            {articles.map((a) => (
              <ArticleCard a={a} key={a.id} />
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
