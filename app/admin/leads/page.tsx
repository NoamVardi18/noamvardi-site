import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdminNav } from "@/components/admin/AdminNav";
import { getSessionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { setLeadStatusAction, deleteLeadAction } from "./actions";

export const metadata = { title: "Leads | Admin" };

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string;
  status: string;
  created_at: string;
};

export default async function AdminLeadsPage() {
  const user = await getSessionUser();
  if (!user?.isAdmin) redirect("/");

  const supabase = await createClient();
  const { data } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  const leads = (data ?? []) as Lead[];
  const newCount = leads.filter((l) => l.status === "new").length;

  return (
    <>
      <SiteHeader user={user} />
      <main className="page">
        <span className="kicker">INBOX</span>
        <h1>Leads</h1>
        <p className="sub">
          {leads.length} inquiries from the site{newCount > 0 ? ` · ${newCount} new` : ""}
        </p>
        <AdminNav active="/admin/leads" />

        {leads.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: 48 }}>
            <p className="muted" style={{ margin: 0 }}>No inquiries yet — when someone submits the homepage form, it shows up here.</p>
          </div>
        ) : (
          leads.map((l) => (
            <div className="card" key={l.id} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <strong style={{ fontSize: 16 }}>{l.name}</strong>
                    {l.company && <span className="muted" style={{ fontSize: 13 }}>· {l.company}</span>}
                    <span className={`pill ${l.status === "new" ? "gold" : ""}`}>
                      {l.status === "new" ? "New" : "Handled"}
                    </span>
                  </div>
                  <div className="muted" style={{ fontSize: 13.5, direction: "ltr" }}>
                    <a href={`mailto:${l.email}`} style={{ textDecoration: "none" }}>{l.email}</a>
                    {l.phone && <> · <a href={`tel:${l.phone}`} style={{ textDecoration: "none" }}>{l.phone}</a></>}
                  </div>
                </div>
                <span className="muted" style={{ fontSize: 12.5 }}>
                  {new Date(l.created_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                </span>
              </div>
              <p style={{ margin: "14px 0 16px", fontSize: 15, lineHeight: 1.8, color: "var(--text-dim)", whiteSpace: "pre-wrap" }}>
                {l.message}
              </p>
              <div className="row-actions">
                <form action={setLeadStatusAction}>
                  <input type="hidden" name="id" value={l.id} />
                  <input type="hidden" name="status" value={l.status === "new" ? "handled" : "new"} />
                  <button className="icon-btn" type="submit">
                    {l.status === "new" ? "Mark handled ✓" : "Back to new"}
                  </button>
                </form>
                <form action={deleteLeadAction}>
                  <input type="hidden" name="id" value={l.id} />
                  <button className="icon-btn danger" type="submit">Delete</button>
                </form>
              </div>
            </div>
          ))
        )}
      </main>
      <SiteFooter />
    </>
  );
}
