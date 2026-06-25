"use client";

import { SubscribeForm } from "./SubscribeForm";

// Soft gate: the real intro is rendered above this by the server. Below is a
// blurred skeleton (no real content shipped) + the inline email overlay.
export function ArticleGate({ sourceVideo }: { sourceVideo?: string }) {
  return (
    <div className="sd-gate">
      <div className="sd-gate-skeleton" aria-hidden="true">
        {Array.from({ length: 7 }).map((_, i) => (
          <span key={i} style={{ width: `${90 - (i % 3) * 18}%` }} />
        ))}
      </div>
      <div className="sd-gate-overlay">
        <h3>Enter your email to read the full how-to</h3>
        <p>Confirm via the email link to unlock this and every future SharpenDaily how-to. Free.</p>
        <SubscribeForm sourceVideo={sourceVideo} cta="Unlock free" />
        <span className="sd-trust">No spam. Unsubscribe anytime.</span>
      </div>
    </div>
  );
}
