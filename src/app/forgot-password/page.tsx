"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setMessage(data.message ?? data.error);
    setSubmitting(false);
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-14">
      <div className="w-full max-w-sm rounded-xl2 border border-forest/10 bg-white p-8 shadow-card">
        <h1 className="font-display text-2xl font-semibold text-forest">Reset your password</h1>
        <p className="mt-1 text-sm text-ink/60">We'll send a reset link to your email.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label-field">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="you@example.com" />
          </div>
          {message && <p className="rounded-lg bg-forest/5 px-4 py-2 text-sm text-forest">{message}</p>}
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Sending..." : "Send reset link"}
          </button>
        </form>
      </div>
    </div>
  );
}
