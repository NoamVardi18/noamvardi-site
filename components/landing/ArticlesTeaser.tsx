import Link from "next/link";
import { ArticleCard, type Article } from "@/components/ArticleCard";

export function ArticlesTeaser({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;
  return (
    <section className="section" id="insights" aria-label="מאמרים">
      <div className="section-inner">
        <div className="section-head fade-up" style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 18, maxWidth: "none" }}>
          <div>
            <span className="kicker">INSIGHTS</span>
            <h2 style={{ margin: 0 }}>
              מה חדש בעולם <span className="serif-accent">הסוכנים.</span>
            </h2>
          </div>
          <Link href="/articles" className="btn-glass" style={{ padding: "11px 24px" }}>
            לכל המאמרים ←
          </Link>
        </div>
        <div className="articles-grid">
          {articles.map((a, i) => (
            <div className={`fade-up ${i ? `d${i}` : ""}`} key={a.id}>
              <ArticleCard a={a} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
