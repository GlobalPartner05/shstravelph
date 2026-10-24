import Link from "next/link";
import { MessageSquare, Send } from "lucide-react";
import RouteCard from "@/components/site/RouteCard";
import type { ActiveRoute } from "@/lib/queries";

export default function PopularRoutes({ routes }: { routes: ActiveRoute[] }) {
  if (routes.length === 0) {
    return (
      <section id="routes" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-sm text-[var(--color-charcoal-soft)]">
          Routes and pricing are being finalized. Please check back soon.
        </p>
      </section>
    );
  }

  return (
    <section id="routes" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-coral-dark)]">
        Popular Routes
      </p>
      <h2 className="mt-2 text-balance text-3xl font-extrabold text-[var(--color-charcoal)] sm:text-4xl">
        Your Destination, Our Drive
      </h2>
      <p className="mt-2 max-w-2xl text-[var(--color-charcoal-soft)]">
        We cover confirmed airports, cities, and destinations across Luzon. Choose your route,
        get a fixed fare, and request your transfer in minutes.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {routes.map((route) => (
          <RouteCard key={route.id} route={route} />
        ))}

        <div className="flex flex-col justify-center gap-3 rounded-2xl border border-dashed border-[var(--color-coral)]/40 bg-[var(--color-coral-light)]/60 p-6 text-center">
          <p className="text-lg font-bold text-[var(--color-charcoal)]">Need a different route?</p>
          <p className="text-sm text-[var(--color-charcoal-soft)]">
            We also serve other confirmed destinations across Luzon. Contact us for a quick
            quote.
          </p>
          <div className="mt-2 flex flex-col gap-2">
            <Link
              href="/#faq"
              className="flex items-center justify-center gap-2 rounded-full bg-[var(--color-coral)] py-2.5 text-sm font-semibold text-white"
            >
              <MessageSquare className="h-4 w-4" /> Chat With Us
            </Link>
            <Link
              href="/#faq"
              className="flex items-center justify-center gap-2 rounded-full border border-[var(--color-coral)] py-2.5 text-sm font-semibold text-[var(--color-coral-dark)]"
            >
              <Send className="h-4 w-4" /> Send an Inquiry
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
