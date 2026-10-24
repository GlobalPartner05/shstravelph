import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border-muted)] bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Image
              src="/shs-emblem.png"
              alt="Sakura Hire Services emblem"
              width={1531}
              height={1027}
              className="h-20 w-auto"
            />
            <p className="mt-3 text-lg font-bold text-[var(--color-charcoal)]">
              <span className="text-[var(--color-coral)]">Sakura</span> Hire Services
            </p>
            <p className="mt-2 max-w-sm text-sm text-[var(--color-charcoal-soft)]">
              Private airport transfers and point-to-point rides across our confirmed Luzon
              service areas.
            </p>
          </div>
          <nav className="flex flex-col gap-2 text-sm text-[var(--color-charcoal-soft)]">
            <Link href="/#routes" className="hover:text-[var(--color-coral)]">
              Routes
            </Link>
            <Link href="/#faq" className="hover:text-[var(--color-coral)]">
              FAQ
            </Link>
            <Link href="/book" className="hover:text-[var(--color-coral)]">
              Book a Transfer
            </Link>
          </nav>
        </div>
        <p className="mt-8 text-xs text-[var(--color-charcoal-soft)]">
          &copy; {new Date().getFullYear()} Sakura Hire. All bookings are subject to confirmation.
        </p>
      </div>
    </footer>
  );
}
