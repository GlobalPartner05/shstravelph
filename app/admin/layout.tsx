import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <header className="border-b border-[var(--color-border-muted)] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <nav className="flex items-center gap-5 text-sm font-medium text-[var(--color-charcoal-soft)]">
            <Link href="/admin" className="font-bold text-[var(--color-charcoal)]">
              Sakura Hire Services Admin
            </Link>
            <Link href="/admin/bookings" className="hover:text-[var(--color-coral)]">
              Bookings
            </Link>
            <Link href="/admin/routes" className="hover:text-[var(--color-coral)]">
              Routes
            </Link>
            <Link href="/admin/vehicles" className="hover:text-[var(--color-coral)]">
              Vehicles
            </Link>
            <Link href="/admin/settings" className="hover:text-[var(--color-coral)]">
              Settings
            </Link>
          </nav>
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
