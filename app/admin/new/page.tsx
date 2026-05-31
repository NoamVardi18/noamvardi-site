import { redirect } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ArticleEditor } from "@/components/ArticleEditor";
import { getSessionUser } from "@/lib/auth";

export const metadata = { title: "מאמר חדש | ניהול" };

export default async function NewArticlePage() {
  const user = await getSessionUser();
  if (!user?.isAdmin) redirect("/");

  return (
    <>
      <SiteHeader user={user} />
      <main className="page page-narrow">
        <Link href="/admin" className="acard-more" style={{ display: "inline-block", marginBottom: 18 }}>
          → חזרה לניהול
        </Link>
        <h1>מאמר חדש</h1>
        <p className="sub">צור מאמר ופרסם אותו לאתר</p>
        <div className="card">
          <ArticleEditor />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
