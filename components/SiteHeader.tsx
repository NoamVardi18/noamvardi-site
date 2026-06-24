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
  { href: "/about#agents", label: "What I do" },
  { href: "/about#process", label: "How it works" },
  { href: "/articles", label: "How-tos" },
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

  return (
    <>
      <div className="nav-wrap">
        <nav className="nav" aria-label="Main navigation">
          <Logo />

          <div className="nav-links desktop">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="nav-link">
                {l.label}
              </Link>
            ))}

            {user ? (
              <div className={`dropdown ${userMenu ? "open" : ""}`} ref={userRef}>
                <button
                  className="nav-cta ghost dropdown-trigger"
                  onClick={() => setUserMenu((o) => !o)}
                  aria-expanded={userMenu}
                >
                  {user.name?.split(" ")[0] || "My account"}{" "}
                  <span className="chev" aria-hidden="true">▾</span>
                </button>
                <div className="dropdown-panel" role="menu">
                  {user.isAdmin && (
                    <>
                      <Link href="/hub" className="dropdown-item" onClick={() => setUserMenu(false)}>
                        <span className="di-title">Portfolio</span>
                        <span className="di-sub">My investments</span>
                      </Link>
                      <Link href="/admin" className="dropdown-item" onClick={() => setUserMenu(false)}>
                        <span className="di-title">Admin</span>
                        <span className="di-sub">Articles, users & promo</span>
                      </Link>
                    </>
                  )}
                  <button
                    className="dropdown-item"
                    onClick={async () => {
                      await signOutAction();
                      setUserMenu(false);
                      router.refresh();
                    }}
                  >
                    <span className="di-title">Sign out</span>
                    <span className="di-sub">{user.email}</span>
                  </button>
                </div>
              </div>
            ) : (
              <button className="nav-cta ghost" onClick={() => openAuth("login")}>
                Sign in
              </button>
            )}
            <Link href="/about#contact" className="nav-cta">Get in touch</Link>
          </div>

          <button
            className="hamburger"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <span /><span /><span />
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      <div className={`mobile-nav ${mobileOpen ? "open" : ""}`} role="dialog" aria-label="Menu">
        <button className="close-x" aria-label="Close" onClick={() => setMobileOpen(false)}>✕</button>
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}>
            {l.label}
          </Link>
        ))}
        <Link href="/about#contact" onClick={() => setMobileOpen(false)}>Contact</Link>
        {user ? (
          <>
            {user.isAdmin && <Link href="/admin" onClick={() => setMobileOpen(false)}>Admin</Link>}
            <button onClick={async () => { await signOutAction(); setMobileOpen(false); router.refresh(); }}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <button onClick={() => openAuth("login")}>Sign in</button>
            <button onClick={() => openAuth("register")}>Sign up</button>
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
