"use client";

export const dynamic = "force-dynamic";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Mail, Phone, Lock } from "lucide-react";
import { signupSchema, SignupInput } from "@/lib/validations";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({ resolver: zodResolver(signupSchema) });

  async function onSubmit(values: SignupInput) {
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      setSubmitting(false);
      return;
    }

    await signIn("credentials", { email: values.email, password: values.password, redirect: false });
    setSubmitting(false);
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
            <h1 className="font-display text-2xl text-forest">Create your account</h1>
            <p className="mt-2 text-sm text-ink-muted">Takes 30 seconds. No spam, ever.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
            <div>
              <label className="label-field">Full Name</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                <input {...register("name")} className="input-field pl-11" placeholder="Your full name" />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
            </div>
            <div>
              <label className="label-field">Email Address</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                <input {...register("email")} className="input-field pl-11" placeholder="your@email.com" />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label-field">WhatsApp Number</label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                <input {...register("phone")} className="input-field pl-11" placeholder="98765 43210" />
              </div>
              {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
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
              {submitting ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-ink-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-forest hover:underline">Sign in</Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-ink-muted/60">© {new Date().getFullYear()} Indian Elixir. Rooted in Tradition.</p>
      </div>
    </div>
  );
}
