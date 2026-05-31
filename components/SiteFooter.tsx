import { BRAND } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="footer" role="contentinfo">
      <span>© {new Date().getFullYear()} Noam Vardi · כל הזכויות שמורות</span>
      <span>
        <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
        &nbsp;·&nbsp;
        <a href={`tel:${BRAND.phone}`}>052-836-9212</a>
      </span>
    </footer>
  );
}
