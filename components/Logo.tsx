import Link from "next/link";
import { SDMark } from "./sharpen/SDMark";

export function LogoMark({ size = 36 }: { size?: number }) {
  return <SDMark size={size} />;
}

// SharpenDaily brand lockup — SD spark mark + wordmark. Bronze on charcoal.
export function Logo() {
  return (
    <Link href="/" className="nav-logo" aria-label="SharpenDaily — home">
      <SDMark size={36} />
      <span className="nav-logo-word">SharpenDaily</span>
    </Link>
  );
}
