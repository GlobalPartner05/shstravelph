"use client";
import type { ApiResult } from "@/lib/types";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Pricing = {
  id: number;
  routeId: number;
  vehicleCategoryId: number;
  baseFare: number;
  roundTripFare: number | null;
  currency: string;
  inclusionsNote: string | null;
  exclusionsNote: string | null;
  isActive: boolean;
  isPlaceholder: boolean;
};

export default function PricingEditor({ pricing, routeLabel, vehicleLabel }: { pricing: Pricing; routeLabel: string; vehicleLabel: string }) {
  const router = useRouter();
  const [form, setForm] = useState(pricing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setError(null);
    const res = await fetch("/api/admin/pricing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        roundTripFare: form.roundTripFare || undefined,
        inclusionsNote: form.inclusionsNote || undefined,
        exclusionsNote: form.exclusionsNote || undefined,
      }),
    });
    const data = (await res.json()) as ApiResult;
    if (!res.ok || !data.ok) {
      setError(data.error ?? "Failed to save.");
      setSaving(false);
      return;
    }
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-[var(--color-border-muted)] bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[var(--color-charcoal)]">
          {routeLabel} &middot; {vehicleLabel}
        </p>
        <div className="flex gap-3 text-xs">
          <label className="flex items-center gap-1">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
            Active
          </label>
          <label className="flex items-center gap-1">
            <input type="checkbox" checked={form.isPlaceholder} onChange={(e) => setForm({ ...form, isPlaceholder: e.target.checked })} />
            Placeholder
          </label>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-[var(--color-charcoal)]">Base fare (&#8369;)</span>
          <input
            type="number"
            value={form.baseFare}
            onChange={(e) => setForm({ ...form, baseFare: Number(e.target.value) })}
            className="rounded-lg border border-[var(--color-border-muted)] px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-[var(--color-charcoal)]">Round-trip fare (&#8369;, optional)</span>
          <input
            type="number"
            value={form.roundTripFare ?? ""}
            onChange={(e) => setForm({ ...form, roundTripFare: e.target.value ? Number(e.target.value) : null })}
            className="rounded-lg border border-[var(--color-border-muted)] px-3 py-2"
          />
        </label>
      </div>
      <label className="mt-3 flex flex-col gap-1 text-sm">
        <span className="font-medium text-[var(--color-charcoal)]">Inclusions</span>
        <input
          value={form.inclusionsNote ?? ""}
          onChange={(e) => setForm({ ...form, inclusionsNote: e.target.value })}
          className="rounded-lg border border-[var(--color-border-muted)] px-3 py-2"
        />
      </label>
      <label className="mt-3 flex flex-col gap-1 text-sm">
        <span className="font-medium text-[var(--color-charcoal)]">Exclusions</span>
        <input
          value={form.exclusionsNote ?? ""}
          onChange={(e) => setForm({ ...form, exclusionsNote: e.target.value })}
          className="rounded-lg border border-[var(--color-border-muted)] px-3 py-2"
        />
      </label>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="mt-3 rounded-full bg-[var(--color-coral)] px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save price"}
      </button>
    </div>
  );
}
