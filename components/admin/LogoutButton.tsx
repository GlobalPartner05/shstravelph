"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
      }}
      className="text-sm font-medium text-[var(--color-charcoal-soft)] hover:text-[var(--color-coral)]"
    >
      Log out
    </button>
  );
}
