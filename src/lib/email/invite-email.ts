import nodemailer from "nodemailer";

/*
 * Sends advocate invitations through the Gmail account in SMTP_USER, using a
 * Google app password (SMTP_PASSWORD). Plain TypeScript with no path aliases so
 * scripts/invite.mjs can import it too. Without SMTP settings, nothing is sent
 * and callers fall back to showing the link.
 */

export type InviteEmail = {
  to: string;
  link: string;
  organization: string;
  /** Who sent it, e.g. "Jordan Lee". Omitted for the first advocate of an organization. */
  inviter?: string;
  isAdmin?: boolean;
};

export function emailConfigured() {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASSWORD);
}

function escapeHtml(text: string) {
  return text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

export function inviteMessage({ link, organization, inviter, isAdmin }: InviteEmail) {
  const subject = `You're invited to join ${organization} on Tenantly`;
  const intro = inviter
    ? `${inviter} invited you to join ${organization} on Tenantly${isAdmin ? " as an administrator" : ""}.`
    : `You're invited to set up ${organization} on Tenantly${isAdmin ? " as its administrator" : ""}.`;
  const body =
    "Tenantly helps Baltimore tenants check whether their landlord was licensed to file in rent court, " +
    "and lets them share their case with your team.";
  const text = `${intro}\n\n${body}\n\nCreate your account:\n${link}\n\nThis link expires in 14 days. If you weren't expecting it, you can ignore this email.`;
  const html = `<!doctype html>
<html><body style="margin:0;background:#eef2ff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:16px;padding:32px">
<tr><td style="font-size:18px;font-weight:700;color:#2563eb;padding-bottom:20px">Tenantly</td></tr>
<tr><td style="font-size:16px;line-height:1.5;padding-bottom:12px">${escapeHtml(intro)}</td></tr>
<tr><td style="font-size:14px;line-height:1.5;color:#475569;padding-bottom:24px">${escapeHtml(body)}</td></tr>
<tr><td style="padding-bottom:24px"><a href="${escapeHtml(link)}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 20px;border-radius:10px">Create your account</a></td></tr>
<tr><td style="font-size:12px;line-height:1.5;color:#64748b">This link expires in 14 days. If the button doesn't work, paste this into your browser:<br><a href="${escapeHtml(link)}" style="color:#2563eb;word-break:break-all">${escapeHtml(link)}</a></td></tr>
<tr><td style="font-size:12px;line-height:1.5;color:#94a3b8;padding-top:20px">If you weren't expecting this invitation, you can ignore it.</td></tr>
</table></td></tr></table></body></html>`;
  return { subject, text, html };
}

/** Emails the invitation. Returns false (never throws) when it couldn't be sent. */
export async function sendInviteEmail(invite: InviteEmail): Promise<boolean> {
  if (!emailConfigured()) return false;
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  });
  try {
    await transport.sendMail({
      from: { name: "Tenantly", address: process.env.SMTP_USER! },
      to: invite.to,
      ...inviteMessage(invite),
    });
    return true;
  } catch (error) {
    console.error("Invite email failed:", error instanceof Error ? error.message : error);
    return false;
  }
}
