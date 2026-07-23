export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validations";

// NOTE: sending the actual email is left as a TODO - plug in Resend/Nodemailer
// here. We still generate and persist the token so the reset flow works
// end-to-end once an email provider is wired in.
export async function POST(req: Request) {
  const body = await req.json();
  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email" }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email } });

  // Always return success to avoid leaking which emails are registered.
  if (!user) {
    return NextResponse.json({ message: "If that account exists, a reset link has been sent." });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken: token, resetTokenExpiry: expiry },
  });

  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  // TODO: replace with real email send. Logged for local/dev testing.
  console.log(`Password reset link for ${email}: ${resetUrl}`);

  return NextResponse.json({ message: "If that account exists, a reset link has been sent." });
}
