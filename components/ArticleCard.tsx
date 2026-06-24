import Link from "next/link";
import { ARTICLE_CATEGORIES } from "@/lib/constants";

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  video_url: string | null;
  category: string;
  published_at: string | null;
};

export function categoryLabel(cat: string) {
  return ARTICLE_CATEGORIES.find((c) => c.value === cat)?.label ?? cat;
}

export function ArticleCard({ a }: { a: Article }) {
  return (
    <Link href={`/articles/${a.slug}`} className="acard">
      <div className="acard-img" aria-hidden="true">
        {a.cover_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={a.cover_image} alt="" loading="lazy" />
        ) : (
          <div className="acard-ph">
            <svg viewBox="0 0 58 36" width="48" height="30" fill="none">
              <path d="M4 34 L4 3 L22 34 L22 3" stroke="rgba(242,239,233,0.25)" strokeWidth="3.4" />
              <path d="M32 3 L43 34 L54 3" stroke="rgba(200,169,106,0.45)" strokeWidth="3.4" />
            </svg>
          </div>
        )}
        {a.video_url && (
          <span className="acard-play">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        )}
      </div>
      <div className="acard-body">
        <span className="pill">{categoryLabel(a.category)}</span>
        <h3>{a.title}</h3>
        {a.excerpt && <p>{a.excerpt}</p>}
        <span className="acard-more">Read more →</span>
      </div>
    </Link>
  );
}
