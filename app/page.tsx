import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Landing } from "@/components/Landing";
import { getSessionUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getSessionUser();
  return (
    <>
      <a href="#main" className="skip-link">דלג לתוכן הראשי</a>
      <SiteHeader user={user} />
      <Landing />
      <SiteFooter />
    </>
  );
}
