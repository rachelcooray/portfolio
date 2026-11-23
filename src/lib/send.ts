// Sends a message to Rachel through a free form service, so her inbox
// address is never in the page source. Set ONE of these at build time:
//   NEXT_PUBLIC_FORMSPREE_ENDPOINT  e.g. https://formspree.io/f/abcdwxyz
//   NEXT_PUBLIC_WEB3FORMS_KEY       the Web3Forms access key
// Nothing is stored by this site. No tracking, no analytics.
const FORMSPREE = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT ?? "";
const WEB3FORMS = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "";

export type Outgoing = { name: string; email: string; topic: string; message: string };

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function sendToRachel(m: Outgoing): Promise<void> {
  if (!WEB3FORMS && !FORMSPREE) throw new Error("no form service configured");
  const subject = `Portfolio: ${m.topic}`;
  const r = WEB3FORMS
    ? await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ access_key: WEB3FORMS, subject, from_name: m.name, ...m }),
      })
    : await fetch(FORMSPREE, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...m, _subject: subject }),
      });
  if (!r.ok) throw new Error("send failed");
}
