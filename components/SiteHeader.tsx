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

const LINKS = [
  { href: "/#agents", label: "הסוכנים" },
  { href: "/#process", label: "איך זה עובד" },
  { href: "/articles", label: "מאמרים" },
];

export function SiteHeader({ user }: { user: SessionUser }) {
  const router = useRouter();
  const [userMenu, setUserMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
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
      <div className="nav-wrap">
        <nav className="nav" aria-label="ניווט ראשי">
          <Logo />

          <div className="nav-links desktop">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="nav-link">
                {l.label}
              </Link>
            ))}
            <button className="nav-link" onClick={goHub}>מרכז הנכסים</button>

            {user ? (
              <div className={`dropdown ${userMenu ? "open" : ""}`} ref={userRef}>
                <button
                  className="nav-cta ghost dropdown-trigger"
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
                      <span className="di-sub">מאמרים, משתמשים ופרומו</span>
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
              <button className="nav-cta ghost" onClick={() => openAuth("login")}>
                התחברות
              </button>
            )}
            <Link href="/#contact" className="nav-cta">דברו איתי</Link>
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
      </div>

      {/* Mobile menu */}
      <div className={`mobile-nav ${mobileOpen ? "open" : ""}`} role="dialog" aria-label="תפריט">
        <button className="close-x" aria-label="סגור" onClick={() => setMobileOpen(false)}>✕</button>
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}>
            {l.label}
          </Link>
        ))}
        <button onClick={() => { setMobileOpen(false); goHub(); }}>מרכז הנכסים</button>
        <Link href="/#contact" onClick={() => setMobileOpen(false)}>צור קשר</Link>
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
