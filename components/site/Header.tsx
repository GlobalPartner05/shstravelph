import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border-muted)] bg-[var(--color-cream)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3 text-lg font-bold text-[var(--color-charcoal)]">
          <Image
            src="/shs-emblem.png"
            alt="Sakura Hire Services emblem"
            width={1531}
            height={1027}
            className="h-11 w-auto"
          />
          <span className="leading-tight">
            <span className="text-[var(--color-coral)]">Sakura</span> Hire Services
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-[var(--color-charcoal-soft)] sm:flex">
          <Link href="/#routes" className="hover:text-[var(--color-coral)]">
            Routes
          </Link>
          <Link href="/#vehicles" className="hover:text-[var(--color-coral)]">
            Vehicles
          </Link>
          <Link href="/#how-it-works" className="hover:text-[var(--color-coral)]">
            How It Works
          </Link>
          <Link href="/#faq" className="hover:text-[var(--color-coral)]">
            FAQ
          </Link>
        </nav>
        <Link
          href="/book"
          className="rounded-full bg-[var(--color-coral)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-coral-dark)]"
        >
          Book Your Transfer
        </Link>
      </div>
    </header>
  );
}
