import { getDb } from "@/db/client";
import { routes, pricingRules, vehicleCategories } from "@/db/schema";
import RouteEditor from "@/components/admin/RouteEditor";
import PricingEditor from "@/components/admin/PricingEditor";

export const dynamic = "force-dynamic";

export default async function AdminRoutesPage() {
  const db = await getDb();
  const allRoutes = await db.select().from(routes);
  const allPricing = await db.select().from(pricingRules);
  const allVehicles = await db.select().from(vehicleCategories);

  const vehicleById = new Map(allVehicles.map((v) => [v.id, v.name]));
  const routeById = new Map(allRoutes.map((r) => [r.id, `${r.origin} → ${r.destination}`]));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-charcoal)]">Routes</h1>
        <p className="text-sm text-[var(--color-charcoal-soft)]">
          A route only appears on the public site once it is Active and has at least one Active, non-placeholder price.
        </p>
      </div>

      <div className="space-y-4">
        {allRoutes.map((r) => (
          <RouteEditor key={r.id} route={r} />
        ))}
      </div>

      <div>
        <h2 className="text-xl font-bold text-[var(--color-charcoal)]">Pricing</h2>
        <p className="text-sm text-[var(--color-charcoal-soft)]">Each row is a route + vehicle combination.</p>
        <div className="mt-4 space-y-4">
          {allPricing.map((p) => (
            <PricingEditor
              key={p.id}
              pricing={p}
              routeLabel={routeById.get(p.routeId) ?? `Route #${p.routeId}`}
              vehicleLabel={vehicleById.get(p.vehicleCategoryId) ?? `Vehicle #${p.vehicleCategoryId}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
