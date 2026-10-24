"use client";
import type { ApiResult } from "@/lib/types";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = (await res.json()) as ApiResult;
    if (!res.ok || !data.ok) {
      setError(data.error ?? "Login failed.");
      setSubmitting(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-cream)] px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-[var(--color-border-muted)] bg-white p-6">
        <h1 className="text-xl font-bold text-[var(--color-charcoal)]">Sakura Hire Services Admin</h1>
        <p className="mt-1 text-sm text-[var(--color-charcoal-soft)]">Sign in to manage bookings, routes, and pricing.</p>

        <label className="mt-5 flex flex-col gap-1 text-sm">
          <span className="font-medium text-[var(--color-charcoal)]">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-[var(--color-border-muted)] px-3 py-2"
          />
        </label>
        <label className="mt-3 flex flex-col gap-1 text-sm">
          <span className="font-medium text-[var(--color-charcoal)]">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-[var(--color-border-muted)] px-3 py-2"
          />
        </label>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-5 w-full rounded-full bg-[var(--color-coral)] py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {submitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
