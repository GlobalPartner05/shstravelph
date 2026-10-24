import { getDb } from "@/db/client";
import { vehicleCategories } from "@/db/schema";
import VehicleEditor from "@/components/admin/VehicleEditor";

export const dynamic = "force-dynamic";

export default async function AdminVehiclesPage() {
  const db = await getDb();
  const vehicles = await db.select().from(vehicleCategories);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-charcoal)]">Vehicles</h1>
        <p className="text-sm text-[var(--color-charcoal-soft)]">
          A vehicle only appears for customers once it is Active. Capacities here are enforced when calculating quotes.
        </p>
      </div>
      <div className="space-y-4">
        {vehicles.map((v) => (
          <VehicleEditor key={v.id} vehicle={v} />
        ))}
      </div>
    </div>
  );
}
