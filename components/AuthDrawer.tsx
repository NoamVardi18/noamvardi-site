"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInAction, signUpAction } from "@/app/auth/actions";

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
        aria-label={mode === "login" ? "התחברות" : "הרשמה"}
        aria-hidden={!open}
      >
        <button className="drawer-close" onClick={onClose} aria-label="סגור">
          ✕
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo/logo-dark-bg.jpg" alt="" aria-hidden="true" className="drawer-logo" style={{ alignSelf: "flex-start" }} />

        {mode === "login" ? (
          <>
            <h2>ברוך שובך</h2>
            <p className="form-note" style={{ marginBottom: 24 }}>
              התחבר כדי לגשת למרכז הנכסים שלך
            </p>
            <form action={loginSubmit} className="lform">
              <div className="lfg">
                <label htmlFor="li-email">אימייל</label>
                <input id="li-email" name="email" type="email" autoComplete="email" required dir="ltr" />
              </div>
              <div className="lfg">
                <label htmlFor="li-pass">סיסמה</label>
                <input id="li-pass" name="password" type="password" autoComplete="current-password" required dir="ltr" />
              </div>
              {loginState.error && <div className="form-error">{loginState.error}</div>}
              <button className="btn-blk" type="submit" disabled={loginPending}>
                {loginPending ? "מתחבר..." : "התחברות"}
              </button>
            </form>
            <p className="switch">
              אין לך חשבון עדיין?{" "}
              <button onClick={() => setMode("register")}>הרשמה</button>
            </p>
          </>
        ) : (
          <>
            <h2>יצירת חשבון</h2>
            <p className="form-note" style={{ marginBottom: 24 }}>
              הצטרף וקבל גישה למרכז הנכסים האישי
            </p>
            <form action={regSubmit} className="lform">
              <div className="lfg">
                <label htmlFor="re-name">שם מלא</label>
                <input id="re-name" name="full_name" type="text" autoComplete="name" required />
              </div>
              <div className="lfg">
                <label htmlFor="re-email">אימייל</label>
                <input id="re-email" name="email" type="email" autoComplete="email" required dir="ltr" />
              </div>
              <div className="lfg">
                <label htmlFor="re-pass">סיסמה (8 תווים לפחות)</label>
                <input id="re-pass" name="password" type="password" autoComplete="new-password" minLength={8} required dir="ltr" />
              </div>
              <label className="checkbox-row">
                <input type="checkbox" name="agreed_terms" required />
                <span>
                  קראתי ואני מאשר/ת את{" "}
                  <Link href="/terms" target="_blank" style={{ textDecoration: "underline" }}>
                    תנאי השימוש ומדיניות הפרטיות
                  </Link>
                </span>
              </label>
              <label className="checkbox-row">
                <input type="checkbox" name="marketing_opt_in" />
                <span>אני מעוניין/ת לקבל עדכונים ודיוור (אופציונלי)</span>
              </label>
              {regState.error && <div className="form-error">{regState.error}</div>}
              <button className="btn-blk" type="submit" disabled={regPending}>
                {regPending ? "נרשם..." : "יצירת חשבון"}
              </button>
            </form>
            <p className="switch">
              כבר יש לך חשבון?{" "}
              <button onClick={() => setMode("login")}>התחברות</button>
            </p>
          </>
        )}
      </aside>
    </>
  );
}
