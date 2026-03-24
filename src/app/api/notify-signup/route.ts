import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email } = await req.json();

  await resend.emails.send({
    from: "FST Credits <noreply@fstcredits.com>",
    to: ["info@bilsas.org"],
    subject: "New signup 🚀",
    html: `<p>New user: ${email}</p>`,
  });

  return NextResponse.json({ ok: true });
}