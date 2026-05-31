"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "./Logo";
import { AuthDrawer } from "./AuthDrawer";
import { signOutAction } from "@/app/auth/actions";

export type SessionUser = {
  name: string | null;
  email: string;
  isAdmin: boolean;
} | null;

const SECTIONS = [
  { id: "about", title: "אודות", sub: "מי אני ומה אני עושה" },
  { id: "work", title: "עבודות", sub: "אתרים שבניתי" },
  { id: "services", title: "שירותים", sub: "מה אני מציע" },
  { id: "offer", title: "מבצע אתר בלעדי", sub: "3 שנים ב-1,500 ₪" },
  { id: "contact", title: "צור קשר", sub: "השאר פרטים" },
];

export function SiteHeader({ user }: { user: SessionUser }) {
  const router = useRouter();
  const [dropOpen, setDropOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const dropRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserMenu(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function openAuth(mode: "login" | "register") {
    setAuthMode(mode);
    setDrawerOpen(true);
    setMobileOpen(false);
  }

  function goHub() {
    if (user) router.push("/hub");
    else openAuth("login");
  }

  return (
    <>
      <nav className="nav" aria-label="ניווט ראשי">
        <Logo />

        <div className="nav-actions desktop">
          {/* Sections dropdown */}
          <div className={`dropdown ${dropOpen ? "open" : ""}`} ref={dropRef}>
            <button
              className="nav-link dropdown-trigger"
              onClick={() => setDropOpen((o) => !o)}
              aria-expanded={dropOpen}
              aria-haspopup="true"
            >
              סקשנים <span className="chev" aria-hidden="true">▾</span>
            </button>
            <div className="dropdown-panel" role="menu">
              {SECTIONS.map((s) => (
                <Link
                  key={s.id}
                  href={`/#${s.id}`}
                  className="dropdown-item"
                  role="menuitem"
                  onClick={() => setDropOpen(false)}
                >
                  <span className="di-title">{s.title}</span>
                  <span className="di-sub">{s.sub}</span>
                </Link>
              ))}
            </div>
          </div>

          <Link href="/articles" className="nav-link">מאמרים</Link>
          <button className="nav-link" onClick={goHub}>מרכז הנכסים</button>

          {user ? (
            <div className={`dropdown ${userMenu ? "open" : ""}`} ref={userRef}>
              <button
                className="nav-cta dropdown-trigger"
                onClick={() => setUserMenu((o) => !o)}
                aria-expanded={userMenu}
              >
                {user.name?.split(" ")[0] || "החשבון שלי"}{" "}
                <span className="chev" aria-hidden="true">▾</span>
              </button>
              <div className="dropdown-panel" role="menu">
                <Link href="/hub" className="dropdown-item" onClick={() => setUserMenu(false)}>
                  <span className="di-title">מרכז הנכסים</span>
                  <span className="di-sub">ההשקעות שלי</span>
                </Link>
                {user.isAdmin && (
                  <Link href="/admin" className="dropdown-item" onClick={() => setUserMenu(false)}>
                    <span className="di-title">ניהול</span>
                    <span className="di-sub">מאמרים ואדמין</span>
                  </Link>
                )}
                <button
                  className="dropdown-item"
                  onClick={async () => {
                    await signOutAction();
                    setUserMenu(false);
                    router.refresh();
                  }}
                >
                  <span className="di-title">התנתקות</span>
                  <span className="di-sub">{user.email}</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              <button className="nav-cta ghost" onClick={() => openAuth("login")}>התחברות</button>
              <button className="nav-cta" onClick={() => openAuth("register")}>הרשמה</button>
            </>
          )}
        </div>

        <button
          className="hamburger"
          aria-label="פתח תפריט"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(true)}
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-nav ${mobileOpen ? "open" : ""}`} role="dialog" aria-label="תפריט">
        <button className="close-x" aria-label="סגור" onClick={() => setMobileOpen(false)}>✕</button>
        <Link href="/#about" onClick={() => setMobileOpen(false)}>אודות</Link>
        <Link href="/#work" onClick={() => setMobileOpen(false)}>עבודות</Link>
        <Link href="/#services" onClick={() => setMobileOpen(false)}>שירותים</Link>
        <Link href="/articles" onClick={() => setMobileOpen(false)}>מאמרים</Link>
        <button onClick={() => { setMobileOpen(false); goHub(); }}>מרכז הנכסים</button>
        {user ? (
          <>
            {user.isAdmin && <Link href="/admin" onClick={() => setMobileOpen(false)}>ניהול</Link>}
            <button onClick={async () => { await signOutAction(); setMobileOpen(false); router.refresh(); }}>
              התנתקות
            </button>
          </>
        ) : (
          <>
            <button onClick={() => openAuth("login")}>התחברות</button>
            <button onClick={() => openAuth("register")}>הרשמה</button>
          </>
        )}
      </div>

      <AuthDrawer
        open={drawerOpen}
        mode={authMode}
        setMode={setAuthMode}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
}
