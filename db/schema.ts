import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// Ported from Postgres to SQLite for Cloudflare D1. Table and column names are
// identical so queries across the app stay untouched.
//
// Timestamps are stored as ISO-8601 UTC text, the same format the app writes
// with `new Date().toISOString()`, so string comparison and sorting stay correct.
const isoNow = sql`(strftime('%Y-%m-%dT%H:%M:%fZ','now'))`;

const idCol = () => integer("id").primaryKey({ autoIncrement: true });
const boolCol = (name: string, def = false) =>
  integer(name, { mode: "boolean" }).notNull().default(def);

export const adminUsers = sqliteTable("admin_users", {
  id: idCol(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at").notNull().default(isoNow),
});

export const vehicleCategories = sqliteTable("vehicle_categories", {
  id: idCol(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline"),
  description: text("description"),
  maxPassengers: integer("max_passengers").notNull(),
  maxLargeBags: integer("max_large_bags").notNull(),
  maxSmallBags: integer("max_small_bags").notNull(),
  amenities: text("amenities"), // comma-separated, e.g. "Air-conditioning,WiFi"
  imageUrl: text("image_url"),
  isActive: boolCol("is_active"),
  isPlaceholder: boolCol("is_placeholder", true),
  createdAt: text("created_at").notNull().default(isoNow),
  updatedAt: text("updated_at").notNull().default(isoNow),
});

export const routes = sqliteTable("routes", {
  id: idCol(),
  slug: text("slug").notNull().unique(),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  categoryLabel: text("category_label").notNull(), // "Airport Transfer" | "City Transfer" | "Other Luzon Destinations"
  description: text("description"),
  imageUrl: text("image_url"),
  isAirportPickup: boolCol("is_airport_pickup"),
  estimatedDurationNote: text("estimated_duration_note"), // e.g. "~2-3 hrs"
  isActive: boolCol("is_active"),
  isPlaceholder: boolCol("is_placeholder", true),
  createdAt: text("created_at").notNull().default(isoNow),
  updatedAt: text("updated_at").notNull().default(isoNow),
});

export const pricingRules = sqliteTable("pricing_rules", {
  id: idCol(),
  routeId: integer("route_id").notNull().references(() => routes.id),
  vehicleCategoryId: integer("vehicle_category_id").notNull().references(() => vehicleCategories.id),
  baseFare: real("base_fare").notNull(),
  roundTripFare: real("round_trip_fare"),
  currency: text("currency").notNull().default("PHP"),
  inclusionsNote: text("inclusions_note"),
  exclusionsNote: text("exclusions_note"),
  isActive: boolCol("is_active"),
  isPlaceholder: boolCol("is_placeholder", true),
  effectiveDate: text("effective_date").notNull().default(isoNow),
  createdAt: text("created_at").notNull().default(isoNow),
  updatedAt: text("updated_at").notNull().default(isoNow),
});

export const bookingStatusValues = [
  "requested",
  "confirmed",
  "rejected",
  "cancelled",
  "completed",
] as const;
export type BookingStatus = (typeof bookingStatusValues)[number];

export const bookings = sqliteTable("bookings", {
  id: idCol(),
  referenceCode: text("reference_code").notNull().unique(),
  routeId: integer("route_id").notNull().references(() => routes.id),
  vehicleCategoryId: integer("vehicle_category_id").notNull().references(() => vehicleCategories.id),
  tripType: text("trip_type").notNull().default("one_way"), // "one_way" | "round_trip"
  pickupDate: text("pickup_date").notNull(),
  pickupTime: text("pickup_time").notNull(),
  returnDate: text("return_date"),
  returnTime: text("return_time"),
  isAirportPickup: boolCol("is_airport_pickup"),
  airline: text("airline"),
  flightNumber: text("flight_number"),
  scheduledArrival: text("scheduled_arrival"),
  passengerCount: integer("passenger_count").notNull(),
  largeBags: integer("large_bags").notNull().default(0),
  smallBags: integer("small_bags").notNull().default(0),
  specialRequests: text("special_requests"),
  customerName: text("customer_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  whatsapp: text("whatsapp"),
  preferredContact: text("preferred_contact").notNull().default("phone"), // "phone" | "whatsapp" | "email"
  quotedFare: real("quoted_fare").notNull(),
  currency: text("currency").notNull().default("PHP"),
  paymentMethod: text("payment_method").notNull().default("cash"),
  paymentStatus: text("payment_status").notNull().default("unpaid"), // "unpaid" | "paid"
  status: text("status", { enum: bookingStatusValues }).notNull().default("requested"),
  adminNotes: text("admin_notes"),
  createdAt: text("created_at").notNull().default(isoNow),
  updatedAt: text("updated_at").notNull().default(isoNow),
});

export const bookingStatusHistory = sqliteTable("booking_status_history", {
  id: idCol(),
  bookingId: integer("booking_id").notNull().references(() => bookings.id),
  fromStatus: text("from_status"),
  toStatus: text("to_status", { enum: bookingStatusValues }).notNull(),
  note: text("note"),
  changedBy: text("changed_by").notNull().default("admin"),
  createdAt: text("created_at").notNull().default(isoNow),
});

// Site-wide configurable copy (WhatsApp number, policies) editable from /admin/settings.
// Every key ships with is_confirmed=false until the admin explicitly sets a real value.
export const siteSettings = sqliteTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull().default(""),
  isConfirmed: boolCol("is_confirmed"),
  updatedAt: text("updated_at").notNull().default(isoNow),
});
