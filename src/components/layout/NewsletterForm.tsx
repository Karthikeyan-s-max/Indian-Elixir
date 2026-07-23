"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setSubmitting(false);

      if (res.ok) {
        setMessage(data.message);
        setEmail("");
      } else {
        setError(data.error ?? "Failed to join. Please try again.");
      }
    } catch (err) {
      setSubmitting(false);
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-bold uppercase tracking-wide text-ink">Join Our Circle</p>
      <p className="text-xs leading-relaxed text-ink-muted">
        Receive seasonal harvest notes, traditional recipes, and exclusive wellness insights.
      </p>
      {message ? (
        <div className="flex items-center gap-2 rounded-lg border border-sage bg-sage/20 p-3 text-xs font-semibold text-forest">
          <CheckCircle2 className="h-4 w-4 text-forest shrink-0" />
          <span>{message}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="input-field text-xs !py-2.5 flex-1"
          />
          <button
            type="submit"
            disabled={submitting}
            className="btn-copper text-xs !px-4 !py-2.5 flex items-center justify-center gap-1 shrink-0"
          >
            {submitting ? "Joining..." : <>Join <Send className="h-3 w-3" /></>}
          </button>
        </form>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
