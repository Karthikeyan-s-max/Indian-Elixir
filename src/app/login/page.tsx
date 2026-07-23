"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock } from "lucide-react";
import { loginSchema, LoginInput } from "@/lib/validations";

import { Suspense } from "react";

function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(
    params.get("forbidden") ? "That page requires an admin account." : null
  );
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginInput) {
    setSubmitting(true);
    setError(null);
    const result = await signIn("credentials", { ...values, redirect: false });
    setSubmitting(false);

    if (result?.error) {
      setError("Invalid email or password");
      return;
    }
    router.push("/account");
    router.refresh();
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="w-full max-w-md">
        <p className="text-center font-display text-3xl text-forest">Indian Elixir</p>

        <div className="mt-8 rounded-lg border border-ink-border/20 bg-white px-10 pb-10 pt-14 shadow-card">
          <div className="flex justify-center">
            <div className="flex size-16 items-center justify-center overflow-hidden rounded-full border border-ink-border/30 shadow-soft">
              <Image src="/logo.png" alt="Indian Elixir" width={64} height={64} className="h-full w-full object-cover" />
            </div>
          </div>

          <div className="mt-4 text-center">
            <h1 className="font-display text-2xl text-forest">Welcome back</h1>
            <p className="mt-2 text-sm text-ink-muted">
              Sign in to track your orders and reorder in a click.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
            <div>
              <label className="label-field">Email Address</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                <input {...register("email")} className="input-field pl-11" placeholder="your@email.com" />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label-field">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                <input type="password" {...register("password")} className="input-field pl-11" placeholder="••••••••" />
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
            </div>

            {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}

            <button type="submit" disabled={submitting} className="btn-primary w-full !py-4">
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between text-xs">
            <Link href="/forgot-password" className="text-ink-muted underline hover:text-forest">Forgot password?</Link>
            <Link href="/signup" className="font-semibold text-ink-muted hover:text-forest">Create an account →</Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-ink-muted/60">© {new Date().getFullYear()} Indian Elixir. Rooted in Tradition.</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[80vh] items-center justify-center p-4"><p className="text-ink-muted">Loading login...</p></div>}>
      <LoginContent />
    </Suspense>
  );
}
