import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getSessionUser } from "@/lib/auth";
import { BRAND } from "@/lib/constants";

export const metadata = { title: "Terms & Privacy | SharpenDaily" };

export default async function TermsPage() {
  const user = await getSessionUser();
  return (
    <>
      <SiteHeader user={user} />
      <main className="page page-narrow">
        <h1>Terms of Use & Privacy Policy</h1>
        <p className="sub">Last updated: May 2026</p>

        <div className="card" style={{ lineHeight: 1.9 }}>
          <h3>1. General</h3>
          <p>
            Use of this site and the personal asset hub is subject to the terms below.
            Registering and using the service constitutes full agreement to these terms.
          </p>

          <h3>2. Account & security</h3>
          <p>
            Your password is stored hashed and is not accessible to anyone, including the
            site administrator. Each user is responsible for keeping their access details
            safe. Any financial data you enter is kept fully isolated and accessible only
            to you.
          </p>

          <h3>3. Asset hub — disclaimer</h3>
          <p>
            The data, prices and charts shown in the asset hub are for tracking and
            illustration only, and do not constitute investment advice, a recommendation,
            or a substitute for professional financial advice. Prices come from third-party
            providers and may be delayed.
          </p>

          <h3>4. Privacy & email</h3>
          <p>
            We collect only the information needed to run the service. Consent to receive
            email is optional and can be withdrawn at any time. We will not share your
            details with third parties without your consent.
          </p>

          <h3>5. Cookies</h3>
          <p>
            The site uses essential cookies to manage sign-in and remember your account
            when you return.
          </p>

          <h3>6. Contact</h3>
          <p>
            For any question:{" "}
            <a href={`mailto:${BRAND.email}`} style={{ textDecoration: "underline" }}>{BRAND.email}</a>
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
