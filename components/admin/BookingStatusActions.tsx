"use client";
import type { ApiResult } from "@/lib/types";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { BookingStatus } from "@/db/schema";

const NEXT_STATUS_OPTIONS: Record<BookingStatus, BookingStatus[]> = {
  requested: ["confirmed", "rejected"],
  confirmed: ["completed", "cancelled"],
  rejected: [],
  cancelled: [],
  completed: [],
};

export default function BookingStatusActions({ bookingId, currentStatus }: { bookingId: number; currentStatus: BookingStatus }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const options = NEXT_STATUS_OPTIONS[currentStatus] ?? [];

  async function setStatus(status: BookingStatus) {
    setSubmitting(true);
    setError(null);
    const res = await fetch(`/api/admin/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, note: note || undefined }),
    });
    const data = (await res.json()) as ApiResult;
    if (!res.ok || !data.ok) {
      setError(data.error ?? "Failed to update status.");
      setSubmitting(false);
      return;
    }
    router.refresh();
  }

  if (options.length === 0) {
    return <p className="text-sm text-[var(--color-charcoal-soft)]">No further status changes available from &quot;{currentStatus}&quot;.</p>;
  }

  return (
    <div>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-[var(--color-charcoal)]">Note (optional, visible to admins only)</span>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} className="rounded-lg border border-[var(--color-border-muted)] px-3 py-2" />
      </label>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <div className="mt-3 flex gap-2">
        {options.map((status) => (
          <button
            key={status}
            type="button"
            disabled={submitting}
            onClick={() => setStatus(status)}
            className={`rounded-full px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 ${
              status === "confirmed" || status === "completed" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            Mark as {status}
          </button>
        ))}
      </div>
    </div>
  );
}
