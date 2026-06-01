import { redirect } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getSessionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { toggleAdminAction } from "./actions";

export const metadata = { title: "ניהול משתמשים | נועם ורדי" };

export default async function AdminUsersPage() {
  const user = await getSessionUser();
  if (!user?.isAdmin) redirect("/");

  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const currentUserId = authData.user?.id;

  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, email, is_admin, created_at")
    .order("created_at", { ascending: true });

  const profiles = data ?? [];

  return (
    <>
      <SiteHeader user={user} />
      <main className="page">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1>ניהול משתמשים</h1>
            <p className="sub" style={{ margin: 0 }}>{profiles.length} משתמשים רשומים</p>
          </div>
          <Link href="/admin" className="icon-btn" style={{ textDecoration: "none" }}>
            → חזרה לניהול
          </Link>
        </div>

        <div className="card" style={{ marginTop: 28, padding: 0, overflowX: "auto" }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>שם</th>
                <th>אימייל</th>
                <th>תאריך הרשמה</th>
                <th>סטטוס</th>
                <th>פעולה</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((p) => {
                const isMe = p.id === currentUserId;
                const joinDate = new Date(p.created_at).toLocaleDateString("he-IL", {
                  day: "numeric", month: "long", year: "numeric",
                });
                return (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600 }}>
                      {p.full_name || "—"}
                      {isMe && <span className="pill" style={{ marginInlineStart: 8, fontSize: 11 }}>אתה</span>}
                    </td>
                    <td className="muted" style={{ direction: "ltr", textAlign: "right" }}>{p.email}</td>
                    <td className="muted">{joinDate}</td>
                    <td>
                      <span className={`pill`} style={{
                        background: p.is_admin ? "#0a0a0a" : "#f5f5f5",
                        color: p.is_admin ? "#fff" : "#555",
                        border: "none",
                      }}>
                        {p.is_admin ? "אדמין" : "משתמש"}
                      </span>
                    </td>
                    <td>
                      {!isMe && (
                        <form action={toggleAdminAction}>
                          <input type="hidden" name="user_id" value={p.id} />
                          <input type="hidden" name="is_admin" value={String(!p.is_admin)} />
                          <button
                            className={`icon-btn${p.is_admin ? " danger" : ""}`}
                            type="submit"
                          >
                            {p.is_admin ? "הסר אדמין" : "הפוך לאדמין"}
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
