"use client";
import type { ApiResult } from "@/lib/types";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Vehicle = {
  id: number;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  maxPassengers: number;
  maxLargeBags: number;
  maxSmallBags: number;
  amenities: string | null;
  imageUrl: string | null;
  isActive: boolean;
  isPlaceholder: boolean;
};

export default function VehicleEditor({ vehicle }: { vehicle: Vehicle }) {
  const router = useRouter();
  const [form, setForm] = useState(vehicle);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setError(null);
    const res = await fetch("/api/admin/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        tagline: form.tagline || undefined,
        description: form.description || undefined,
        amenities: form.amenities || undefined,
        imageUrl: form.imageUrl || undefined,
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
        <p className="font-semibold text-[var(--color-charcoal)]">{form.name}</p>
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
        <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        <Field label="Tagline" value={form.tagline ?? ""} onChange={(v) => setForm({ ...form, tagline: v })} />
        <NumField label="Max passengers" value={form.maxPassengers} onChange={(v) => setForm({ ...form, maxPassengers: v })} />
        <NumField label="Max large bags" value={form.maxLargeBags} onChange={(v) => setForm({ ...form, maxLargeBags: v })} />
        <NumField label="Max small bags" value={form.maxSmallBags} onChange={(v) => setForm({ ...form, maxSmallBags: v })} />
        <Field label="Amenities (comma-separated)" value={form.amenities ?? ""} onChange={(v) => setForm({ ...form, amenities: v })} />
        <Field label="Image URL" value={form.imageUrl ?? ""} onChange={(v) => setForm({ ...form, imageUrl: v })} />
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="mt-3 rounded-full bg-[var(--color-coral)] px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save vehicle"}
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

function NumField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-[var(--color-charcoal)]">{label}</span>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="rounded-lg border border-[var(--color-border-muted)] px-3 py-2"
      />
    </label>
  );
}
