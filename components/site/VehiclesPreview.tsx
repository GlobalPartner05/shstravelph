import VehicleCard from "@/components/site/VehicleCard";
import { getActiveVehicleCategories } from "@/lib/queries";

export default async function VehiclesPreview() {
  const vehicles = await getActiveVehicleCategories();

  if (vehicles.length === 0) {
    return null;
  }

  return (
    <section id="vehicles" className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-coral-dark)]">
          Choose Your Ride
        </p>
        <h2 className="mt-2 text-balance text-3xl font-extrabold text-[var(--color-charcoal)] sm:text-4xl">
          Our Vehicle Options
        </h2>
        <p className="mt-2 max-w-2xl text-[var(--color-charcoal-soft)]">
          Comfortable, reliable, and sized for your group. The exact fare for your route is
          shown during booking.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((v) => (
            <VehicleCard
              key={v.id}
              name={v.name}
              tagline={v.tagline}
              maxPassengers={v.maxPassengers}
              maxLargeBags={v.maxLargeBags}
              maxSmallBags={v.maxSmallBags}
              amenities={v.amenities}
              isPlaceholder={v.isPlaceholder}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
