import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
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
  const { data } = await supabase
    .from("articles")
    .select("id, title, slug, category, status, published_at")
    .order("created_at", { ascending: false });
  const articles = data ?? [];

  return (
    <>
      <SiteHeader user={user} />
      <main className="page">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1>ניהול מאמרים</h1>
            <p className="sub" style={{ margin: 0 }}>צור, ערוך ופרסם מאמרים</p>
          </div>
          <Link href="/admin/new" className="btn-blk" style={{ textDecoration: "none" }}>
            + מאמר חדש
          </Link>
        </div>

        <div className="card" style={{ marginTop: 28, padding: 0, overflowX: "auto" }}>
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
                    <td>{categoryLabel(a.category)}</td>
                    <td>
                      <span className="pill">{a.status === "published" ? "מפורסם" : "טיוטה"}</span>
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

        <div className="card" style={{ marginTop: 28 }}>
          <h3 style={{ marginTop: 0 }}>אוטומציה שבועית (Claude Cowork)</h3>
          <p className="muted" style={{ fontSize: 14, lineHeight: 1.8 }}>
            מאמרים נוצרים אוטומטית דרך נקודת הקצה <code>POST /api/automation/articles</code> עם הכותרת
            <code> x-automation-secret</code>. ניתן לחבר את Claude Cowork כדי להוסיף מאמר חדש בכל שבוע ללא התערבות.
          </p>
        </div>

        <div className="card" style={{ marginTop: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ marginTop: 0 }}>ניהול משתמשים</h3>
              <p className="muted" style={{ fontSize: 14, margin: 0 }}>הענקת / שלילת הרשאות אדמין</p>
            </div>
            <Link href="/admin/users" className="btn-blk" style={{ textDecoration: "none", padding: "10px 20px" }}>
              ניהול משתמשים →
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
