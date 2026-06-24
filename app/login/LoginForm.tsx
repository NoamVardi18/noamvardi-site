"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInAction } from "@/app/auth/actions";
import { SDMark } from "@/components/sharpen/SDMark";

// Admin-only sign-in. Readers never see this — The Vault unlocks by email.
export function LoginForm() {
  const router = useRouter();
  const [state, submit, pending] = useActionState(signInAction, {});

  useEffect(() => {
    if (state.ok) router.push("/admin");
  }, [state.ok, router]);

  return (
    <div className="lform-card">
      <div style={{ marginBottom: 18 }}>
        <SDMark size={40} />
      </div>
      <h2>Sign in</h2>
      <p className="form-note" style={{ marginBottom: 24 }}>Admin access.</p>
      <form action={submit} className="lform">
        <div className="lfg">
          <label htmlFor="li-email">Email</label>
          <input id="li-email" name="email" type="email" autoComplete="email" required dir="ltr" />
        </div>
        <div className="lfg">
          <label htmlFor="li-pass">Password</label>
          <input id="li-pass" name="password" type="password" autoComplete="current-password" required dir="ltr" />
        </div>
        {state.error && <div className="form-error">{state.error}</div>}
        <button className="btn-blk" type="submit" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
