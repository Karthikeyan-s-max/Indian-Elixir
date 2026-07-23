"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordContent() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }
    setMessage(data.message);
    setTimeout(() => router.push("/login"), 1500);
  }

  if (!token) {
    return (
      <div className="container-page py-14 text-center text-sm text-ink/60">
        This reset link is missing a token. Please request a new one from the{" "}
        <a href="/forgot-password" className="text-forest underline">forgot password</a> page.
      </div>
    );
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-14">
      <div className="w-full max-w-sm rounded-xl2 border border-forest/10 bg-white p-8 shadow-card">
        <h1 className="font-display text-2xl font-semibold text-forest">Set a new password</h1>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label-field">New password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
          </div>
          {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}
          {message && <p className="rounded-lg bg-forest/5 px-4 py-2 text-sm text-forest">{message}</p>}
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="container-page py-14 text-center text-ink-muted">Loading reset page...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
