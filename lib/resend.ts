import { SD } from "./sd";

// Outbound email via the Resend REST API (no SDK dependency). Dormant until
// RESEND_API_KEY is set — callers must treat a false return as "not sent".
export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
}): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[resend] RESEND_API_KEY missing — email skipped:", opts.subject);
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: SD.fromEmail,
        to: opts.to,
        reply_to: SD.replyTo,
        subject: opts.subject,
        html: opts.html,
      }),
    });
    if (!res.ok) {
      console.error("[resend] send failed", res.status, await res.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error("[resend] send error", e);
    return false;
  }
}

const shell = (inner: string) => `
<div style="background:#14110F;padding:40px 0;font-family:Inter,Arial,sans-serif;color:#F4F1EA">
  <div style="max-width:480px;margin:0 auto;padding:32px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:16px">
    <div style="font-weight:800;font-size:20px;letter-spacing:.5px;color:#C8862B;margin-bottom:24px">SD · SharpenDaily</div>
    ${inner}
    <p style="margin-top:32px;font-size:12px;color:rgba(244,241,234,0.4)">No spam. Unsubscribe anytime.</p>
  </div>
</div>`;

export function confirmEmail(confirmUrl: string) {
  return shell(`
    <p style="font-size:16px;margin:0 0 8px">Confirm your email to keep The Vault unlocked.</p>
    <p style="font-size:14px;color:rgba(244,241,234,0.64);margin:0 0 24px">You can already read today's how-to — confirm so every future write-up + the weekly Vault reach you free.</p>
    <a href="${confirmUrl}" style="display:inline-block;background:#C8862B;color:#14110F;font-weight:700;text-decoration:none;padding:12px 24px;border-radius:100px">Confirm & unlock The Vault</a>`);
}
