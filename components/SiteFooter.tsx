import Link from "next/link";
import { SDMark } from "./sharpen/SDMark";
import { SD } from "@/lib/sd";

export function SiteFooter() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-inner">
        <Link href="/" className="nav-logo" aria-label="SharpenDaily — home">
          <SDMark size={32} />
          <span className="nav-logo-word">SharpenDaily</span>
        </Link>
        <div className="footer-links">
          <Link href="/#agents">What I do</Link>
          <Link href="/articles">How-tos</Link>
          <Link href="/terms">Terms</Link>
          <a href={SD.socials.youtube} target="_blank" rel="noopener noreferrer">YouTube</a>
          <a href={SD.socials.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href={SD.socials.tiktok} target="_blank" rel="noopener noreferrer">TikTok</a>
        </div>
        <span className="copy">© {new Date().getFullYear()} SharpenDaily · {SD.handle}</span>
      </div>
    </footer>
  );
}
