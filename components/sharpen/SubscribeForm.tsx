"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SubscribeForm({
  sourceVideo,
  cta = "Unlock The Vault",
  consentLabel = "Yes — email me new how-tos + the weekly Vault. Unsubscribe anytime.",
  onDone,
}: {
  sourceVideo?: string;
  cta?: string;
  consentLabel?: string;
  onDone?: () => void;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [alreadyConfirmed, setAlreadyConfirmed] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) {
      setState("error");
      setMsg("Please tick the box so I can send you the how-tos.");
      return;
    }
    setState("loading");
    setMsg("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent, source_video: sourceVideo }),
      });
      const data = await res.json();
      if (!res.ok) {
        setState("error");
        setMsg(data.error || "Something went wrong");
        return;
      }
      setAlreadyConfirmed(!!data.confirmed);
      setState("done");
      onDone?.();
      router.refresh();
    } catch {
      setState("error");
      setMsg("Network error — try again");
    }
  }

  if (state === "done") {
    return (
      <p className="sd-form-done">
        {alreadyConfirmed
          ? "Welcome back — The Vault is unlocked."
          : "Almost there — check your inbox and click the confirm link to unlock The Vault. Every how-to is free."}
      </p>
    );
  }

  return (
    <form className="sd-form" onSubmit={submit}>
      <div className="sd-form-row">
        <input
          type="email"
          required
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={state === "loading"}
          aria-label="Email"
        />
        <button type="submit" className="btn-primary" disabled={state === "loading"}>
          {state === "loading" ? "…" : cta}
        </button>
      </div>
      <label className="sd-consent">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          aria-label="Consent to receive emails"
        />
        <span>{consentLabel}</span>
      </label>
      {state === "error" && <span className="sd-form-err">{msg}</span>}
    </form>
  );
}
