import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdminNav } from "@/components/admin/AdminNav";
import { getSessionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "תיק השקעות | ניהול" };
export const dynamic = "force-dynamic";

export default async function AdminPortfolioPage() {
  const user = await getSessionUser();
  if (!user?.isAdmin) redirect("/");

  const supabase = await createClient();
  const { data } = await supabase
    .from("portfolio_dashboard")
    .select("html, updated_at")
    .eq("id", 1)
    .single();

  const updated = data?.updated_at
    ? new Date(data.updated_at).toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" })
    : null;

  return (
    <>
      <SiteHeader user={user} />
      <main className="page">
        <span className="kicker">PORTFOLIO</span>
        <h1>תיק השקעות</h1>
        <p className="sub">{updated ? `עודכן: ${updated}` : "אין נתונים עדיין"}</p>
        <AdminNav active="/admin/portfolio" />

        {data?.html ? (
          <iframe
            srcDoc={data.html}
            title="Portfolio dashboard"
            style={{
              width: "100%",
              height: "calc(100vh - 220px)",
              border: "1px solid var(--border, #2a2a2a)",
              borderRadius: "12px",
              background: "#0b0b0c",
            }}
          />
        ) : (
          <p>הלוח עוד לא נוצר. הרץ את ה-Financial Advisor (mode 7) כדי לדחוף נתונים.</p>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
