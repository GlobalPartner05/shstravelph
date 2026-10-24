import type { vehicleCategories } from "@/db/schema";

export type VehicleCategory = typeof vehicleCategories.$inferSelect;

/** Shape of our API JSON responses, loose enough for ad-hoc fields without resorting to `any`. */
export type ApiResult = { ok: boolean; error?: string; [key: string]: unknown };

export type BookingFormState = {
  routeId: number | null;
  tripType: "one_way" | "round_trip";
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  airline: string;
  flightNumber: string;
  scheduledArrival: string;
  passengerCount: number;
  largeBags: number;
  smallBags: number;
  specialRequests: string;
  vehicleCategoryId: number | null;
  customerName: string;
  email: string;
  phone: string;
  whatsapp: string;
  preferredContact: "phone" | "whatsapp" | "email";
};

export const EMPTY_BOOKING_FORM: BookingFormState = {
  routeId: null,
  tripType: "one_way",
  pickupDate: "",
  pickupTime: "",
  returnDate: "",
  returnTime: "",
  airline: "",
  flightNumber: "",
  scheduledArrival: "",
  passengerCount: 1,
  largeBags: 0,
  smallBags: 0,
  specialRequests: "",
  vehicleCategoryId: null,
  customerName: "",
  email: "",
  phone: "",
  whatsapp: "",
  preferredContact: "phone",
};
