import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdminNav } from "@/components/admin/AdminNav";
import { getSessionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { toggleAdminAction } from "./actions";

export const metadata = { title: "Users | Admin" };

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
        <span className="kicker">USERS</span>
        <h1>Users</h1>
        <p className="sub">{profiles.length} registered users</p>
        <AdminNav active="/admin/users" />

        <div className="card" style={{ padding: 0, overflowX: "auto" }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((p) => {
                const isMe = p.id === currentUserId;
                const joinDate = new Date(p.created_at).toLocaleDateString("en-US", {
                  day: "numeric", month: "long", year: "numeric",
                });
                return (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600 }}>
                      {p.full_name || "—"}
                      {isMe && <span className="pill" style={{ marginInlineStart: 8, fontSize: 11 }}>You</span>}
                    </td>
                    <td className="muted" style={{ direction: "ltr" }}>{p.email}</td>
                    <td className="muted">{joinDate}</td>
                    <td>
                      <span className={`pill ${p.is_admin ? "gold" : ""}`}>
                        {p.is_admin ? "Admin" : "User"}
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
                            {p.is_admin ? "Remove admin" : "Make admin"}
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
