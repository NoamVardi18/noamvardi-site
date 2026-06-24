import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdminNav } from "@/components/admin/AdminNav";
import { getSessionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Portfolio | Admin" };
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
    ? new Date(data.updated_at).toLocaleString("en-US", { timeZone: "Asia/Jerusalem" })
    : null;

  return (
    <>
      <SiteHeader user={user} />
      <main className="page">
        <span className="kicker">PORTFOLIO</span>
        <h1>Portfolio</h1>
        <p className="sub">{updated ? `Updated: ${updated}` : "No data yet"}</p>
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
          <p>The dashboard hasn&apos;t been generated yet. Run the Financial Advisor (mode 7) to push data.</p>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
