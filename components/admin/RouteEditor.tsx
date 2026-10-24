"use client";
import type { ApiResult } from "@/lib/types";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Route = {
  id: number;
  slug: string;
  origin: string;
  destination: string;
  categoryLabel: string;
  description: string | null;
  imageUrl: string | null;
  isAirportPickup: boolean;
  estimatedDurationNote: string | null;
  isActive: boolean;
  isPlaceholder: boolean;
};

export default function RouteEditor({ route }: { route: Route }) {
  const router = useRouter();
  const [form, setForm] = useState(route);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setError(null);
    const res = await fetch("/api/admin/routes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        description: form.description || undefined,
        imageUrl: form.imageUrl || undefined,
        estimatedDurationNote: form.estimatedDurationNote || undefined,
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
        <p className="font-semibold text-[var(--color-charcoal)]">
          {form.origin} &rarr; {form.destination}
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
        <Field label="Origin" value={form.origin} onChange={(v) => setForm({ ...form, origin: v })} />
        <Field label="Destination" value={form.destination} onChange={(v) => setForm({ ...form, destination: v })} />
        <Field label="Category label" value={form.categoryLabel} onChange={(v) => setForm({ ...form, categoryLabel: v })} />
        <Field label="Duration note" value={form.estimatedDurationNote ?? ""} onChange={(v) => setForm({ ...form, estimatedDurationNote: v })} />
        <Field label="Image URL" value={form.imageUrl ?? ""} onChange={(v) => setForm({ ...form, imageUrl: v })} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isAirportPickup} onChange={(e) => setForm({ ...form, isAirportPickup: e.target.checked })} />
          Airport pickup route
        </label>
      </div>
      <label className="mt-3 flex flex-col gap-1 text-sm">
        <span className="font-medium text-[var(--color-charcoal)]">Description</span>
        <textarea
          value={form.description ?? ""}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={2}
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
        {saving ? "Saving..." : "Save route"}
      </button>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-[var(--color-charcoal)]">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="rounded-lg border border-[var(--color-border-muted)] px-3 py-2" />
    </label>
  );
}
