import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ArticleCard, type Article } from "@/components/ArticleCard";
import { getSessionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "מאמרים | נועם ורדי" };
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
        <h1>מאמרים</h1>
        <p className="sub">תובנות על בינה מלאכותית, פיתוח אתרים ושוק ההון</p>

        {articles.length === 0 ? (
          <div className="empty-state">
            <p>עדיין אין מאמרים שפורסמו — בקרוב יעלה כאן תוכן חדש.</p>
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
