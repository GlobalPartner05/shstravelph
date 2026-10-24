import { getDb } from "@/db/client";
import { pricingRules, routes, vehicleCategories } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export type QuoteInput = {
  routeId: number;
  vehicleCategoryId: number;
  passengerCount: number;
  largeBags: number;
  smallBags: number;
  tripType: "one_way" | "round_trip";
};

export type QuoteResult =
  | {
      ok: true;
      fare: number;
      currency: string;
      inclusionsNote: string | null;
      exclusionsNote: string | null;
      route: { id: number; origin: string; destination: string };
      vehicle: { id: number; name: string; maxPassengers: number; maxLargeBags: number; maxSmallBags: number };
    }
  | { ok: false; error: string };

/**
 * The single source of truth for fare calculation. Always re-run this
 * server-side before creating a booking — never trust a price the client sends.
 */
export async function computeQuote(input: QuoteInput): Promise<QuoteResult> {
  const db = await getDb();

  const [route] = await db
    .select()
    .from(routes)
    .where(and(eq(routes.id, input.routeId), eq(routes.isActive, true)));
  if (!route) return { ok: false, error: "Route not found or not currently bookable." };

  const [vehicle] = await db
    .select()
    .from(vehicleCategories)
    .where(and(eq(vehicleCategories.id, input.vehicleCategoryId), eq(vehicleCategories.isActive, true)));
  if (!vehicle) return { ok: false, error: "Vehicle not found or not currently bookable." };

  if (input.passengerCount > vehicle.maxPassengers) {
    return { ok: false, error: `This vehicle seats up to ${vehicle.maxPassengers} passengers.` };
  }
  if (input.largeBags > vehicle.maxLargeBags) {
    return { ok: false, error: `This vehicle fits up to ${vehicle.maxLargeBags} large bags.` };
  }
  if (input.smallBags > vehicle.maxSmallBags) {
    return { ok: false, error: `This vehicle fits up to ${vehicle.maxSmallBags} small bags.` };
  }

  const [pricing] = await db
    .select()
    .from(pricingRules)
    .where(
      and(
        eq(pricingRules.routeId, route.id),
        eq(pricingRules.vehicleCategoryId, vehicle.id),
        eq(pricingRules.isActive, true),
      ),
    );
  if (!pricing) {
    return { ok: false, error: "Pricing for this route and vehicle isn't published yet." };
  }

  const fare =
    input.tripType === "round_trip" && pricing.roundTripFare != null
      ? pricing.roundTripFare
      : pricing.baseFare;

  return {
    ok: true,
    fare,
    currency: pricing.currency,
    inclusionsNote: pricing.inclusionsNote,
    exclusionsNote: pricing.exclusionsNote,
    route: { id: route.id, origin: route.origin, destination: route.destination },
    vehicle: {
      id: vehicle.id,
      name: vehicle.name,
      maxPassengers: vehicle.maxPassengers,
      maxLargeBags: vehicle.maxLargeBags,
      maxSmallBags: vehicle.maxSmallBags,
    },
  };
}
