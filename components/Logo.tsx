import Link from "next/link";

export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <span className="logo-mark" aria-hidden="true" style={{ color: "var(--text)" }}>
      <svg
        viewBox="0 0 58 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: size, height: (size * 36) / 58, display: "block" }}
      >
        <path d="M4 34 L4 3 L22 34 L22 3" stroke="currentColor" strokeWidth="3.4" strokeLinecap="square" strokeLinejoin="miter" />
        <path d="M32 3 L43 34 L54 3" stroke="var(--accent)" strokeWidth="3.4" strokeLinecap="square" strokeLinejoin="miter" />
      </svg>
    </span>
  );
}

// Full brand logo (white-on-black JPEG). mix-blend-mode: screen makes the
// black background disappear into any dark surface — set via the parent's CSS.
export function Logo() {
  return (
    <Link href="/" className="nav-logo" aria-label="נועם ורדי — חזרה לדף הבית">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo/logo-dark-bg.jpg" alt="NOAM VARDI — AI · Innovation · Future" />
    </Link>
  );
}
