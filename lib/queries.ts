import { getDb } from "@/db/client";
import { pricingRules, routes, vehicleCategories } from "@/db/schema";
import { and, asc, eq } from "drizzle-orm";

export type ActiveRoute = {
  id: number;
  slug: string;
  origin: string;
  destination: string;
  categoryLabel: string;
  description: string | null;
  imageUrl: string | null;
  isAirportPickup: boolean;
  estimatedDurationNote: string | null;
  fromFare: number | null;
  currency: string;
  isPlaceholder: boolean;
};

/** Active routes for the public homepage, each with its cheapest active fare (if priced). */
export async function getActiveRoutesWithFromPrice(): Promise<ActiveRoute[]> {
  const db = await getDb();
  const activeRoutes = await db.select().from(routes).where(eq(routes.isActive, true));

  const results: ActiveRoute[] = [];
  for (const route of activeRoutes) {
    const [priceRow] = await db
      .select({ fromFare: pricingRules.baseFare, currency: pricingRules.currency })
      .from(pricingRules)
      .where(and(eq(pricingRules.routeId, route.id), eq(pricingRules.isActive, true)))
      .orderBy(asc(pricingRules.baseFare))
      .limit(1);

    results.push({
      id: route.id,
      slug: route.slug,
      origin: route.origin,
      destination: route.destination,
      categoryLabel: route.categoryLabel,
      description: route.description,
      imageUrl: route.imageUrl,
      isAirportPickup: route.isAirportPickup,
      estimatedDurationNote: route.estimatedDurationNote,
      fromFare: priceRow?.fromFare ?? null,
      currency: priceRow?.currency ?? "PHP",
      isPlaceholder: route.isPlaceholder,
    });
  }
  // Only show routes that actually have at least one active price — otherwise
  // there is nothing bookable and we'd be inviting a click into a dead end.
  return results.filter((r) => r.fromFare != null);
}

export async function getActiveVehicleCategories() {
  const db = await getDb();
  return db.select().from(vehicleCategories).where(eq(vehicleCategories.isActive, true));
}

export async function getRouteBySlug(slug: string) {
  const db = await getDb();
  const [route] = await db.select().from(routes).where(eq(routes.slug, slug));
  return route ?? null;
}
