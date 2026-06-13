import Link from "next/link";
import { BRAND } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-inner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo/logo-dark-bg.jpg" alt="NOAM VARDI — AI · Innovation · Future" />
        <div className="footer-links">
          <Link href="/#agents">הסוכנים</Link>
          <Link href="/articles">מאמרים</Link>
          <Link href="/terms">תנאי שימוש</Link>
          <a href={`https://wa.me/${BRAND.phoneIntl}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
        </div>
        <span className="copy">© {new Date().getFullYear()} Noam Vardi · כל הזכויות שמורות</span>
      </div>
    </footer>
  );
}
