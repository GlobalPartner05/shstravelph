"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="flex items-center gap-2 rounded-full border border-[var(--color-border-muted)] px-5 py-2.5 text-sm font-semibold text-[var(--color-charcoal)]"
    >
      <Printer className="h-4 w-4" /> Print
    </button>
  );
}
