import { redirect } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ArticleEditor } from "@/components/ArticleEditor";
import { getSessionUser } from "@/lib/auth";

export const metadata = { title: "New article | Admin" };

export default async function NewArticlePage() {
  const user = await getSessionUser();
  if (!user?.isAdmin) redirect("/");

  return (
    <>
      <SiteHeader user={user} />
      <main className="page page-narrow">
        <Link href="/admin" className="acard-more" style={{ display: "inline-block", marginBottom: 18 }}>
          ← Back to admin
        </Link>
        <h1>New article</h1>
        <p className="sub">Write an article and publish it to the site</p>
        <div className="card">
          <ArticleEditor />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
