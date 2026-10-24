"use client";
import type { ApiResult } from "@/lib/types";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SettingEditor({
  settingKey,
  label,
  helpText,
  initialValue,
  initialConfirmed,
  multiline,
}: {
  settingKey: string;
  label: string;
  helpText: string;
  initialValue: string;
  initialConfirmed: boolean;
  multiline?: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);
  const [confirmed, setConfirmed] = useState(initialConfirmed);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setError(null);
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: settingKey, value, isConfirmed: confirmed }),
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
      <p className="font-semibold text-[var(--color-charcoal)]">{label}</p>
      <p className="text-xs text-[var(--color-charcoal-soft)]">{helpText}</p>
      {multiline ? (
        <textarea value={value} onChange={(e) => setValue(e.target.value)} rows={3} className="mt-2 w-full rounded-lg border border-[var(--color-border-muted)] px-3 py-2 text-sm" />
      ) : (
        <input value={value} onChange={(e) => setValue(e.target.value)} className="mt-2 w-full rounded-lg border border-[var(--color-border-muted)] px-3 py-2 text-sm" />
      )}
      <label className="mt-2 flex items-center gap-2 text-sm">
        <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
        This is confirmed and OK to show publicly
      </label>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <button type="button" onClick={save} disabled={saving} className="mt-3 rounded-full bg-[var(--color-coral)] px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
