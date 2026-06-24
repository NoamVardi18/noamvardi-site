import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdminNav } from "@/components/admin/AdminNav";
import { PromoEditor } from "@/components/admin/PromoEditor";
import { getSessionUser } from "@/lib/auth";
import { getPromo } from "@/lib/promo";

export const metadata = { title: "Promo | Admin" };

export default async function AdminPromoPage() {
  const user = await getSessionUser();
  if (!user?.isAdmin) redirect("/");

  const promo = await getPromo();

  return (
    <>
      <SiteHeader user={user} />
      <main className="page">
        <span className="kicker">PROMO MODULE</span>
        <h1>Homepage offer</h1>
        <p className="sub">
          Fill in the details, flip the switch — and the offer appears on the homepage in
          the ready-made design. Turn it off or update it anytime.
        </p>
        <AdminNav active="/admin/promo" />
        {promo ? (
          <PromoEditor promo={promo} />
        ) : (
          <div className="card">
            <p className="muted" style={{ margin: 0 }}>
              No promo row found in the database. Run the promos_and_contact_messages migration.
            </p>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
