"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SubscribeForm({
  sourceVideo,
  cta = "Unlock free",
  onDone,
}: {
  sourceVideo?: string;
  cta?: string;
  onDone?: () => void;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setMsg("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source_video: sourceVideo }),
      });
      const data = await res.json();
      if (!res.ok) {
        setState("error");
        setMsg(data.error || "Something went wrong");
        return;
      }
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
        You&apos;re in. Check your inbox to confirm — every future how-to is free.
      </p>
    );
  }

  return (
    <form className="sd-form" onSubmit={submit}>
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
      {state === "error" && <span className="sd-form-err">{msg}</span>}
    </form>
  );
}
