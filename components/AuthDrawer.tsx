"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInAction, signUpAction, signInWithGoogleAction } from "@/app/auth/actions";
import { SDMark } from "./sharpen/SDMark";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.56 2.7-3.86 2.7-6.62z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.36 0-4.36-1.6-5.07-3.74H.9v2.33A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.93 10.68A5.4 5.4 0 0 1 3.65 9c0-.58.1-1.15.28-1.68V4.99H.9A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.01z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58A8.65 8.65 0 0 0 9 0 9 9 0 0 0 .96 4.99l2.97 2.33C4.64 5.18 6.64 3.58 9 3.58z" />
    </svg>
  );
}

type Mode = "login" | "register";

export function AuthDrawer({
  open,
  mode,
  setMode,
  onClose,
}: {
  open: boolean;
  mode: Mode;
  setMode: (m: Mode) => void;
  onClose: () => void;
}) {
  const router = useRouter();
  const [loginState, loginSubmit, loginPending] = useActionState(signInAction, {});
  const [regState, regSubmit, regPending] = useActionState(signUpAction, {});

  useEffect(() => {
    if (loginState.ok || regState.ok) {
      onClose();
      router.refresh();
    }
  }, [loginState.ok, regState.ok, onClose, router]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      <div
        className={`drawer-overlay ${open ? "open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`drawer ${open ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={mode === "login" ? "Sign in" : "Sign up"}
        aria-hidden={!open}
      >
        <button className="drawer-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <div className="drawer-logo" style={{ alignSelf: "flex-start" }}>
          <SDMark size={40} />
        </div>

        {mode === "login" ? (
          <>
            <h2>Welcome back</h2>
            <p className="form-note" style={{ marginBottom: 24 }}>
              Sign in to access your portfolio
            </p>
            <form action={signInWithGoogleAction}>
              <button className="btn-google" type="submit">
                <GoogleIcon />
                Continue with Google
              </button>
            </form>
            <div className="auth-divider">or</div>
            <form action={loginSubmit} className="lform">
              <div className="lfg">
                <label htmlFor="li-email">Email</label>
                <input id="li-email" name="email" type="email" autoComplete="email" required dir="ltr" />
              </div>
              <div className="lfg">
                <label htmlFor="li-pass">Password</label>
                <input id="li-pass" name="password" type="password" autoComplete="current-password" required dir="ltr" />
              </div>
              {loginState.error && <div className="form-error">{loginState.error}</div>}
              <button className="btn-blk" type="submit" disabled={loginPending}>
                {loginPending ? "Signing in…" : "Sign in"}
              </button>
            </form>
            <p className="switch">
              Don&apos;t have an account yet?{" "}
              <button onClick={() => setMode("register")}>Sign up</button>
            </p>
          </>
        ) : (
          <>
            <h2>Create account</h2>
            <p className="form-note" style={{ marginBottom: 24 }}>
              Join and get access to your personal portfolio
            </p>
            <form action={signInWithGoogleAction}>
              <button className="btn-google" type="submit">
                <GoogleIcon />
                Continue with Google
              </button>
            </form>
            <div className="auth-divider">or</div>
            <form action={regSubmit} className="lform">
              <div className="lfg">
                <label htmlFor="re-name">Full name</label>
                <input id="re-name" name="full_name" type="text" autoComplete="name" required />
              </div>
              <div className="lfg">
                <label htmlFor="re-email">Email</label>
                <input id="re-email" name="email" type="email" autoComplete="email" required dir="ltr" />
              </div>
              <div className="lfg">
                <label htmlFor="re-pass">Password (8+ characters)</label>
                <input id="re-pass" name="password" type="password" autoComplete="new-password" minLength={8} required dir="ltr" />
              </div>
              <label className="checkbox-row">
                <input type="checkbox" name="agreed_terms" required />
                <span>
                  I have read and accept the{" "}
                  <Link href="/terms" target="_blank" style={{ textDecoration: "underline" }}>
                    Terms &amp; Privacy Policy
                  </Link>
                </span>
              </label>
              <label className="checkbox-row">
                <input type="checkbox" name="marketing_opt_in" />
                <span>I&apos;d like to receive updates (optional)</span>
              </label>
              {regState.error && <div className="form-error">{regState.error}</div>}
              <button className="btn-blk" type="submit" disabled={regPending}>
                {regPending ? "Creating…" : "Create account"}
              </button>
            </form>
            <p className="switch">
              Already have an account?{" "}
              <button onClick={() => setMode("login")}>Sign in</button>
            </p>
          </>
        )}
      </aside>
    </>
  );
}
