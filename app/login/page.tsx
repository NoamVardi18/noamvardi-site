import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getSessionUser } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Sign in | SharpenDaily", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) redirect(user.isAdmin ? "/admin" : "/");

  return (
    <>
      <SiteHeader user={null} />
      <main className="page" style={{ display: "flex", justifyContent: "center", paddingTop: 60 }}>
        <LoginForm />
      </main>
      <SiteFooter />
    </>
  );
}
