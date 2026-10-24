import Link from "next/link";
import { getDb } from "@/db/client";
import { bookings, routes } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

const STATUS_COLORS: Record<string, string> = {
  requested: "bg-amber-100 text-amber-800",
  confirmed: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-700",
  completed: "bg-blue-100 text-blue-800",
};

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const db = await getDb();
  const rows = await db
    .select({
      id: bookings.id,
      referenceCode: bookings.referenceCode,
      status: bookings.status,
      customerName: bookings.customerName,
      pickupDate: bookings.pickupDate,
      pickupTime: bookings.pickupTime,
      quotedFare: bookings.quotedFare,
      routeOrigin: routes.origin,
      routeDestination: routes.destination,
    })
    .from(bookings)
    .innerJoin(routes, eq(bookings.routeId, routes.id))
    .orderBy(desc(bookings.createdAt));

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--color-charcoal)]">All Bookings</h1>
      <div className="mt-5 overflow-x-auto rounded-xl border border-[var(--color-border-muted)] bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--color-border-muted)] text-left text-xs uppercase text-[var(--color-charcoal-soft)]">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Route</th>
              <th className="px-4 py-3">Pickup</th>
              <th className="px-4 py-3">Fare</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-muted)]">
            {rows.map((b) => (
              <tr key={b.id} className="hover:bg-[var(--color-coral-light)]/20">
                <td className="px-4 py-3">
                  <Link href={`/admin/bookings/${b.id}`} className="font-medium text-[var(--color-coral)]">
                    {b.referenceCode}
                  </Link>
                </td>
                <td className="px-4 py-3">{b.customerName}</td>
                <td className="px-4 py-3">
                  {b.routeOrigin} &rarr; {b.routeDestination}
                </td>
                <td className="px-4 py-3">
                  {b.pickupDate} {b.pickupTime}
                </td>
                <td className="px-4 py-3">&#8369;{b.quotedFare.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[b.status] ?? ""}`}>{b.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="p-4 text-sm text-[var(--color-charcoal-soft)]">No bookings yet.</p>}
      </div>
    </div>
  );
}
