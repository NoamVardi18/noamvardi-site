"use client";

import { useEffect, useState } from "react";
import { SubscribeForm } from "./SubscribeForm";
import { SDMark } from "./SDMark";

const KEY = "sd_entry_seen";

// Shows the moment someone enters the site — once. Dismiss or subscribe = done.
export function EntryModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(KEY)) return;
    const t = setTimeout(() => setOpen(true), 600);
    return () => clearTimeout(t);
  }, []);

  function close() {
    localStorage.setItem(KEY, "1");
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="sd-modal-overlay" role="dialog" aria-modal="true" onClick={close}>
      <div className="sd-modal" onClick={(e) => e.stopPropagation()}>
        <button className="sd-modal-x" onClick={close} aria-label="Close">
          ×
        </button>
        <SDMark size={48} />
        <h2>Get genuinely better — daily</h2>
        <p>The full how-to behind every SharpenDaily video. Free.</p>
        <SubscribeForm cta="Unlock free" onDone={() => localStorage.setItem(KEY, "1")} />
        <span className="sd-trust">No spam. Unsubscribe anytime.</span>
      </div>
    </div>
  );
}
