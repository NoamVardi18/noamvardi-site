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

// Dark, branded shell. Tables + inline styles only — survives Gmail/Outlook.
const shell = (inner: string) => `
<!doctype html>
<html><body style="margin:0;padding:0;background:#0f0d0b;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0f0d0b;padding:32px 0;font-family:'Hanken Grotesk',-apple-system,Segoe UI,Roboto,Arial,sans-serif;">
  <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">

      <!-- brand -->
      <tr><td style="padding:0 8px 22px;">
        <table role="presentation" cellpadding="0" cellspacing="0"><tr>
          <td style="width:40px;height:40px;background:#1d1813;border:1px solid rgba(200,134,43,.4);border-radius:11px;text-align:center;vertical-align:middle;">
            <span style="font-weight:700;font-size:16px;color:#C8862B;letter-spacing:-.5px;">SD</span>
          </td>
          <td style="padding-left:11px;font-weight:600;font-size:16px;color:#F4F1EA;">SharpenDaily</td>
        </tr></table>
      </td></tr>

      <!-- card -->
      <tr><td style="background:#16120f;border:1px solid rgba(244,241,234,.08);border-radius:18px;padding:34px 30px;">
        ${inner}
      </td></tr>

      <!-- footer -->
      <tr><td style="padding:22px 8px 0;">
        <p style="margin:0;font-size:12px;line-height:1.6;color:rgba(244,241,234,.38);">
          You're getting this because you asked for SharpenDaily how-tos.<br>
          No spam, ever. Unsubscribe anytime · <a href="https://sharpendaily.co" style="color:rgba(244,241,234,.5);">sharpendaily.co</a>
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body></html>`;

const button = (href: string, label: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:6px 0 4px;"><tr><td style="background:#C8862B;border-radius:100px;">
    <a href="${href}" style="display:inline-block;padding:13px 28px;font-size:15px;font-weight:700;color:#14110F;text-decoration:none;">${label}</a>
  </td></tr></table>`;

export function confirmEmail(confirmUrl: string) {
  return shell(`
    <p style="margin:0 0 6px;font-size:12px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#C8862B;">One quick step</p>
    <h1 style="margin:0 0 14px;font-size:24px;line-height:1.2;color:#F4F1EA;font-weight:700;">Confirm your email to keep The&nbsp;Vault unlocked</h1>
    <p style="margin:0 0 22px;font-size:15px;line-height:1.65;color:rgba(244,241,234,.66);">
      You can already read today's how-to. Confirm your address so every future write-up — plus the
      weekly Vault of prompts, tools and repos — lands in your inbox. Free.
    </p>
    ${button(confirmUrl, "Confirm & unlock The Vault →")}
    <p style="margin:18px 0 0;font-size:12.5px;line-height:1.6;color:rgba(244,241,234,.4);">
      Button not working? Paste this link:<br>
      <a href="${confirmUrl}" style="color:#C8862B;word-break:break-all;">${confirmUrl}</a>
    </p>`);
}
