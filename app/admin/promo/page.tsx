import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdminNav } from "@/components/admin/AdminNav";
import { PromoEditor } from "@/components/admin/PromoEditor";
import { getSessionUser } from "@/lib/auth";
import { getPromo } from "@/lib/promo";

export const metadata = { title: "ניהול פרומו | נועם ורדי" };

export default async function AdminPromoPage() {
  const user = await getSessionUser();
  if (!user?.isAdmin) redirect("/");

  const promo = await getPromo();

  return (
    <>
      <SiteHeader user={user} />
      <main className="page">
        <span className="kicker">PROMO MODULE</span>
        <h1>הצעה בדף הבית</h1>
        <p className="sub">
          מלאו את הפרטים, הפעילו את המתג — וההצעה תופיע בדף הבית בעיצוב המוכן.
          אפשר לכבות או לעדכן בכל רגע.
        </p>
        <AdminNav active="/admin/promo" />
        {promo ? (
          <PromoEditor promo={promo} />
        ) : (
          <div className="card">
            <p className="muted" style={{ margin: 0 }}>
              לא נמצאה רשומת פרומו במסד הנתונים. הריצו את המיגרציה promos_and_contact_messages.
            </p>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
