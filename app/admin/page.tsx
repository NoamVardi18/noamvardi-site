import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdminNav } from "@/components/admin/AdminNav";
import { categoryLabel } from "@/components/ArticleCard";
import { getSessionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { deleteArticleAction } from "./actions";

export const metadata = { title: "ניהול | נועם ורדי" };

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
        <h1>ניהול</h1>
        <p className="sub">מאמרים, פרומו, לידים ומשתמשים — הכל ממקום אחד.</p>

        <AdminNav active="/admin" />

        <div className="admin-tiles">
          <div className="admin-tile"><div className="v">{articles.length}</div><div className="t">מאמרים</div></div>
          <div className="admin-tile"><div className="v">{published}</div><div className="t">מפורסמים</div></div>
          <div className="admin-tile"><div className="v">{usersCount ?? 0}</div><div className="t">משתמשים רשומים</div></div>
          <div className="admin-tile"><div className="v">{newLeads ?? 0}</div><div className="t">לידים חדשים</div></div>
        </div>

        <div className="admin-head">
          <h3 style={{ margin: 0, fontSize: 18 }}>כל המאמרים</h3>
          <Link href="/admin/new" className="btn-blk">+ מאמר חדש</Link>
        </div>

        <div className="card" style={{ padding: 0, overflowX: "auto" }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>כותרת</th>
                <th>קטגוריה</th>
                <th>סטטוס</th>
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {articles.length === 0 ? (
                <tr><td colSpan={4} className="muted" style={{ padding: 24 }}>אין מאמרים עדיין</td></tr>
              ) : (
                articles.map((a) => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 600 }}>{a.title}</td>
                    <td><span className="pill">{categoryLabel(a.category)}</span></td>
                    <td>
                      <span className={`pill ${a.status === "published" ? "green" : ""}`}>
                        {a.status === "published" ? "מפורסם" : "טיוטה"}
                      </span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <Link href={`/admin/${a.id}`} className="icon-btn">ערוך</Link>
                        <Link href={`/articles/${a.slug}`} className="icon-btn" target="_blank">צפה</Link>
                        <form action={deleteArticleAction}>
                          <input type="hidden" name="id" value={a.id} />
                          <button className="icon-btn danger" type="submit">מחק</button>
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
          <h3 style={{ marginTop: 0 }}>אוטומציה שבועית</h3>
          <p className="muted" style={{ fontSize: 14, lineHeight: 1.8, margin: 0 }}>
            מאמר על טרנדים בסוכני AI ואוטומציה מתפרסם אוטומטית פעם בשבוע דרך{" "}
            <code>POST /api/automation/articles</code> (GitHub Action + Gemini).
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
