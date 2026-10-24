import Link from "next/link";
import { getDb } from "@/db/client";
import { bookings, routes, vehicleCategories, pricingRules } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getAllSettings } from "@/lib/settings";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const db = await getDb();

  const allRoutes = await db.select().from(routes);
  const allVehicles = await db.select().from(vehicleCategories);
  const allPricing = await db.select().from(pricingRules);
  const settings = await getAllSettings();

  const inactiveRoutes = allRoutes.filter((r) => !r.isActive).length;
  const placeholderRoutes = allRoutes.filter((r) => r.isActive && r.isPlaceholder).length;
  const inactiveVehicles = allVehicles.filter((v) => !v.isActive).length;
  const placeholderVehicles = allVehicles.filter((v) => v.isActive && v.isPlaceholder).length;
  const placeholderPricing = allPricing.filter((p) => p.isActive && p.isPlaceholder).length;
  const unconfirmedSettings = Object.values(settings).filter((s) => !s.isConfirmed).length;

  const pendingBookings = await db
    .select({
      id: bookings.id,
      referenceCode: bookings.referenceCode,
      customerName: bookings.customerName,
      pickupDate: bookings.pickupDate,
      pickupTime: bookings.pickupTime,
      quotedFare: bookings.quotedFare,
      routeOrigin: routes.origin,
      routeDestination: routes.destination,
    })
    .from(bookings)
    .innerJoin(routes, eq(bookings.routeId, routes.id))
    .where(eq(bookings.status, "requested"))
    .orderBy(desc(bookings.createdAt));

  const checklist = [
    { label: `${inactiveRoutes} route(s) inactive`, ok: inactiveRoutes === 0, href: "/admin/routes" },
    { label: `${placeholderRoutes} active route(s) still marked placeholder`, ok: placeholderRoutes === 0, href: "/admin/routes" },
    { label: `${inactiveVehicles} vehicle categor${inactiveVehicles === 1 ? "y" : "ies"} inactive`, ok: inactiveVehicles === 0, href: "/admin/vehicles" },
    { label: `${placeholderVehicles} active vehicle categor${placeholderVehicles === 1 ? "y" : "ies"} still marked placeholder`, ok: placeholderVehicles === 0, href: "/admin/vehicles" },
    { label: `${placeholderPricing} active price(s) still marked placeholder`, ok: placeholderPricing === 0, href: "/admin/routes" },
    { label: `${unconfirmedSettings} site setting(s) unconfirmed (WhatsApp number, policies)`, ok: unconfirmedSettings === 0, href: "/admin/settings" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-charcoal)]">Dashboard</h1>
        <p className="text-sm text-[var(--color-charcoal-soft)]">Pre-launch checklist and pending booking requests.</p>
      </div>

      <section className="rounded-xl border border-[var(--color-border-muted)] bg-white p-5">
        <h2 className="font-semibold text-[var(--color-charcoal)]">Before you go live</h2>
        <ul className="mt-3 space-y-2">
          {checklist.map((item) => (
            <li key={item.label} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                {item.ok ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                )}
                {item.label}
              </span>
              {!item.ok && (
                <Link href={item.href} className="text-xs font-semibold text-[var(--color-coral)]">
                  Fix &rarr;
                </Link>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-[var(--color-border-muted)] bg-white p-5">
        <h2 className="font-semibold text-[var(--color-charcoal)]">Pending booking requests ({pendingBookings.length})</h2>
        {pendingBookings.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--color-charcoal-soft)]">Nothing waiting on you right now.</p>
        ) : (
          <div className="mt-3 divide-y divide-[var(--color-border-muted)]">
            {pendingBookings.map((b) => (
              <Link
                key={b.id}
                href={`/admin/bookings/${b.id}`}
                className="flex items-center justify-between py-3 text-sm hover:bg-[var(--color-coral-light)]/30"
              >
                <div>
                  <p className="font-medium text-[var(--color-charcoal)]">
                    {b.referenceCode} &middot; {b.customerName}
                  </p>
                  <p className="text-xs text-[var(--color-charcoal-soft)]">
                    {b.routeOrigin} &rarr; {b.routeDestination} &middot; {b.pickupDate} {b.pickupTime}
                  </p>
                </div>
                <p className="font-semibold text-[var(--color-charcoal)]">&#8369;{b.quotedFare.toLocaleString()}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
