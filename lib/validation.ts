import { z } from "zod";

export const quoteSchema = z.object({
  routeId: z.number().int().positive(),
  vehicleCategoryId: z.number().int().positive(),
  passengerCount: z.number().int().min(1).max(20),
  largeBags: z.number().int().min(0).max(20),
  smallBags: z.number().int().min(0).max(20),
  tripType: z.enum(["one_way", "round_trip"]),
});

export const createBookingSchema = z.object({
  routeId: z.number().int().positive(),
  vehicleCategoryId: z.number().int().positive(),
  tripType: z.enum(["one_way", "round_trip"]),
  pickupDate: z.string().min(1),
  pickupTime: z.string().min(1),
  returnDate: z.string().optional(),
  returnTime: z.string().optional(),
  airline: z.string().optional(),
  flightNumber: z.string().optional(),
  scheduledArrival: z.string().optional(),
  passengerCount: z.number().int().min(1).max(20),
  largeBags: z.number().int().min(0).max(20),
  smallBags: z.number().int().min(0).max(20),
  specialRequests: z.string().max(1000).optional(),
  customerName: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().min(5).max(30),
  whatsapp: z.string().max(30).optional(),
  preferredContact: z.enum(["phone", "whatsapp", "email"]).default("phone"),
});

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(["requested", "confirmed", "rejected", "cancelled", "completed"]),
  note: z.string().max(1000).optional(),
});

export const upsertRouteSchema = z.object({
  id: z.number().int().positive().optional(),
  slug: z.string().min(1),
  origin: z.string().min(1),
  destination: z.string().min(1),
  categoryLabel: z.string().min(1),
  description: z.string().max(500).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  isAirportPickup: z.boolean(),
  estimatedDurationNote: z.string().max(100).optional(),
  isActive: z.boolean(),
  isPlaceholder: z.boolean(),
});

export const upsertVehicleSchema = z.object({
  id: z.number().int().positive().optional(),
  slug: z.string().min(1),
  name: z.string().min(1),
  tagline: z.string().max(200).optional(),
  description: z.string().max(500).optional(),
  maxPassengers: z.number().int().min(1).max(50),
  maxLargeBags: z.number().int().min(0).max(50),
  maxSmallBags: z.number().int().min(0).max(50),
  amenities: z.string().max(300).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean(),
  isPlaceholder: z.boolean(),
});

export const upsertPricingSchema = z.object({
  id: z.number().int().positive().optional(),
  routeId: z.number().int().positive(),
  vehicleCategoryId: z.number().int().positive(),
  baseFare: z.number().positive(),
  roundTripFare: z.number().positive().optional(),
  currency: z.string().default("PHP"),
  inclusionsNote: z.string().max(500).optional(),
  exclusionsNote: z.string().max(500).optional(),
  isActive: z.boolean(),
  isPlaceholder: z.boolean(),
});

export const updateSettingSchema = z.object({
  key: z.string().min(1),
  value: z.string().max(2000),
  isConfirmed: z.boolean(),
});
