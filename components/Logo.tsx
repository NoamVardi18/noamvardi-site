import Link from "next/link";
import { BRAND } from "@/lib/constants";

export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <span className="logo-mark" aria-hidden="true">
      <svg
        viewBox="0 0 58 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: size, height: (size * 36) / 58 }}
      >
        <path d="M4 34 L4 3 L22 34 L22 3" stroke="#0a0a0a" strokeWidth="3.4" strokeLinecap="square" strokeLinejoin="miter" />
        <path d="M32 3 L43 34 L54 3" stroke="#0a0a0a" strokeWidth="3.4" strokeLinecap="square" strokeLinejoin="miter" />
      </svg>
    </span>
  );
}

export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="נועם ורדי - חזרה לדף הבית">
      <LogoMark />
      <span className="logo-divider" aria-hidden="true" />
      <span className="logo-text">
        <span className="name">{BRAND.name}</span>
        <span className="tagline">{BRAND.tagline}</span>
      </span>
    </Link>
  );
}
