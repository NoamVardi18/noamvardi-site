import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ArticleEditor } from "@/components/ArticleEditor";
import { getSessionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Edit article | Admin" };

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user?.isAdmin) redirect("/");

  const supabase = await createClient();
  const { data: article } = await supabase
    .from("articles")
    .select("id, title, category, excerpt, body, status, cover_image")
    .eq("id", id)
    .single();

  if (!article) notFound();

  return (
    <>
      <SiteHeader user={user} />
      <main className="page page-narrow">
        <Link href="/admin" className="acard-more" style={{ display: "inline-block", marginBottom: 18 }}>
          ← Back to admin
        </Link>
        <h1>Edit article</h1>
        <div className="card">
          <ArticleEditor article={article} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
