import { notFound } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { categoryLabel } from "@/components/ArticleCard";
import { getSessionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select("title, excerpt")
    .eq("slug", slug)
    .single();
  return {
    title: data ? `${data.title} | נועם ורדי` : "מאמר | נועם ורדי",
    description: data?.excerpt ?? undefined,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getSessionUser();
  const supabase = await createClient();
  const { data: a } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!a || (a.status !== "published" && !user?.isAdmin)) notFound();

  const date = a.published_at
    ? new Date(a.published_at).toLocaleDateString("he-IL", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <>
      <SiteHeader user={user} />
      <main className="page article-detail">
        <Link href="/articles" className="acard-more" style={{ display: "inline-block", marginBottom: 20 }}>
          → חזרה למאמרים
        </Link>
        <div className="cat">
          <span className="pill">{categoryLabel(a.category)}</span>
          {a.status !== "published" && (
            <span className="pill" style={{ marginInlineStart: 8 }}>טיוטה</span>
          )}
        </div>
        <h1>{a.title}</h1>
        <div className="meta">{date}</div>
        {a.cover_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="cover" src={a.cover_image} alt={a.title} />
        )}
        <div className="article-body">
          {String(a.body || "")
            .split(/\n{2,}/)
            .map((para: string, i: number) =>
              para.startsWith("## ") ? (
                <h2 key={i}>{para.slice(3)}</h2>
              ) : (
                <p key={i}>
                  {para.split("\n").map((line, j, arr) => (
                    <span key={j}>
                      {line}
                      {j < arr.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              )
            )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
