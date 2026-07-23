"use client";

import { useEffect, useState } from "react";
import { Star, MessageSquare, CheckCircle2, User } from "lucide-react";

type Review = {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export default function ProductReviewsSection({ slug }: { slug: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState<number>(5.0);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Form state
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function loadReviews() {
    fetch(`/api/products/${slug}/reviews`)
      .then((res) => res.json())
      .then((data) => {
        if (data.reviews) {
          setReviews(data.reviews);
          setAvgRating(data.avgRating ?? 5.0);
          setTotal(data.total ?? 0);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  useEffect(() => {
    loadReviews();
  }, [slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userName || !comment) return;

    setSubmitting(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/products/${slug}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, userEmail, rating, comment }),
      });
      const data = await res.json();
      setSubmitting(false);

      if (res.ok) {
        setSuccessMsg("✨ Thank you! Your review has been published.");
        setComment("");
        setUserName("");
        setUserEmail("");
        loadReviews();
      } else {
        setErrorMsg(data.error ?? "Failed to submit review. Please try again.");
      }
    } catch {
      setSubmitting(false);
      setErrorMsg("Something went wrong. Please try again.");
    }
  }

  return (
    <section className="bg-cream-card py-20 border-t border-ink-border/20">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Left Column: Reviews List & Overall Rating */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <p className="eyebrow">Real Customer Opinions</p>
              <h2 className="mt-1 font-display text-3xl font-bold text-forest">
                Customer Reviews &amp; Ratings
              </h2>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.round(avgRating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-ink-muted/30"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-display text-2xl font-bold text-forest">
                  {avgRating} / 5.0
                </span>
                <span className="text-sm text-ink-muted">
                  ({total} {total === 1 ? "Review" : "Reviews"})
                </span>
              </div>
            </div>

            {loading ? (
              <p className="text-sm text-ink-muted">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <div className="rounded-xl border border-dashed border-ink-border/40 p-8 text-center bg-white/50">
                <MessageSquare className="mx-auto h-8 w-8 text-copper/50 mb-2" />
                <p className="font-semibold text-ink">No reviews yet for this product.</p>
                <p className="text-xs text-ink-muted mt-1">
                  Be the first to share your experience with Indian Elixir!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r.id} className="card p-6 space-y-3 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-8 items-center justify-center rounded-full bg-forest/10 text-forest font-bold text-xs">
                          {r.userName[0]?.toUpperCase() ?? "U"}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-forest">{r.userName}</p>
                          <p className="text-[10px] text-ink-muted">
                            {new Date(r.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < r.rating ? "fill-amber-400" : "text-ink-muted/30"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-ink leading-relaxed">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Write a Review Form */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-forest/10 bg-white p-8 shadow-card space-y-6">
              <div>
                <h3 className="font-display text-xl font-bold text-forest">
                  Write a Product Review
                </h3>
                <p className="mt-1 text-xs text-ink-muted">
                  Share your experience with our traditional harvest.
                </p>
              </div>

              {successMsg ? (
                <div className="rounded-xl border border-sage bg-sage/20 p-4 text-xs font-semibold text-forest flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-forest shrink-0" />
                  <span>{successMsg}</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="label-field text-xs">Your Rating</label>
                    <div className="flex gap-2 pt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 text-amber-400 hover:scale-110 transition"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              star <= rating ? "fill-amber-400" : "text-ink-muted/30"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="label-field text-xs">Your Name *</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      required
                      className="input-field text-xs"
                    />
                  </div>

                  <div>
                    <label className="label-field text-xs">Email Address (Optional)</label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="input-field text-xs"
                    />
                  </div>

                  <div>
                    <label className="label-field text-xs">Your Review *</label>
                    <textarea
                      rows={4}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Tell us about the aroma, taste, energy boost, or packaging..."
                      required
                      className="input-field text-xs"
                    />
                  </div>

                  {errorMsg && <p className="text-xs text-red-600">{errorMsg}</p>}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-copper text-xs w-full !py-3 flex justify-center items-center gap-2"
                  >
                    {submitting ? "Submitting..." : "Publish Review"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
