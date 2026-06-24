import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdminNav } from "@/components/admin/AdminNav";
import { categoryLabel } from "@/components/ArticleCard";
import { getSessionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { deleteArticleAction } from "./actions";

export const metadata = { title: "Admin | SharpenDaily" };

export default async function AdminPage() {
  const user = await getSessionUser();
  if (!user) redirect("/");
  if (!user.isAdmin) redirect("/");

  const supabase = await createClient();
  const [{ data }, { count: usersCount }, { count: newLeads }] = await Promise.all([
    supabase
      .from("articles")
      .select("id, title, slug, category, status, published_at")
      .order("created_at", { ascending: false }),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
  ]);
  const articles = data ?? [];
  const published = articles.filter((a) => a.status === "published").length;

  return (
    <>
      <SiteHeader user={user} />
      <main className="page">
        <span className="kicker">CONTROL ROOM</span>
        <h1>Admin</h1>
        <p className="sub">Articles, promo, leads and users — all in one place.</p>

        <AdminNav active="/admin" />

        <div className="admin-tiles">
          <div className="admin-tile"><div className="v">{articles.length}</div><div className="t">Articles</div></div>
          <div className="admin-tile"><div className="v">{published}</div><div className="t">Published</div></div>
          <div className="admin-tile"><div className="v">{usersCount ?? 0}</div><div className="t">Registered users</div></div>
          <div className="admin-tile"><div className="v">{newLeads ?? 0}</div><div className="t">New leads</div></div>
        </div>

        <div className="admin-head">
          <h3 style={{ margin: 0, fontSize: 18 }}>All articles</h3>
          <Link href="/admin/new" className="btn-blk">+ New article</Link>
        </div>

        <div className="card" style={{ padding: 0, overflowX: "auto" }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.length === 0 ? (
                <tr><td colSpan={4} className="muted" style={{ padding: 24 }}>No articles yet</td></tr>
              ) : (
                articles.map((a) => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 600 }}>{a.title}</td>
                    <td><span className="pill">{categoryLabel(a.category)}</span></td>
                    <td>
                      <span className={`pill ${a.status === "published" ? "green" : ""}`}>
                        {a.status === "published" ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <Link href={`/admin/${a.id}`} className="icon-btn">Edit</Link>
                        <Link href={`/articles/${a.slug}`} className="icon-btn" target="_blank">View</Link>
                        <form action={deleteArticleAction}>
                          <input type="hidden" name="id" value={a.id} />
                          <button className="icon-btn danger" type="submit">Delete</button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="card" style={{ marginTop: 24 }}>
          <h3 style={{ marginTop: 0 }}>Weekly automation</h3>
          <p className="muted" style={{ fontSize: 14, lineHeight: 1.8, margin: 0 }}>
            A how-to is published automatically once a week via{" "}
            <code>POST /api/automation/articles</code> (GitHub Action + Gemini).
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
