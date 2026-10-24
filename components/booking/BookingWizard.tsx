"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ActiveRoute } from "@/lib/queries";
import type { VehicleCategory, BookingFormState, ApiResult } from "@/lib/types";
import { EMPTY_BOOKING_FORM } from "@/lib/types";
import ProgressIndicator from "@/components/booking/ProgressIndicator";
import RouteStep from "@/components/booking/RouteStep";
import TravelDetailsStep from "@/components/booking/TravelDetailsStep";
import VehicleStep from "@/components/booking/VehicleStep";
import CustomerStep from "@/components/booking/CustomerStep";
import ReviewStep from "@/components/booking/ReviewStep";

const STORAGE_KEY = "sakurahire_booking_draft";
const STEPS = ["Route", "Travel Details", "Vehicle", "Your Details", "Review & Confirm"];

export default function BookingWizard({
  routes,
  vehicles,
}: {
  routes: ActiveRoute[];
  vehicles: VehicleCategory[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Restore an in-progress draft (back/forward preserves input) and apply any
  // query params from the homepage widget, computed once as the initial state
  // rather than patched in after mount via an effect.
  const [form, setForm] = useState<BookingFormState>(() => {
    let initial = EMPTY_BOOKING_FORM;
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved) initial = { ...initial, ...JSON.parse(saved) };
      } catch {
        // ignore corrupt/unavailable sessionStorage
      }
    }

    const routeIdParam = searchParams.get("routeId");
    const tripTypeParam = searchParams.get("tripType");
    const pickupDateParam = searchParams.get("pickupDate");
    const passengersParam = searchParams.get("passengers");

    if (routeIdParam) initial = { ...initial, routeId: Number(routeIdParam) };
    if (tripTypeParam === "round_trip" || tripTypeParam === "one_way") {
      initial = { ...initial, tripType: tripTypeParam };
    }
    if (pickupDateParam) initial = { ...initial, pickupDate: pickupDateParam };
    if (passengersParam) initial = { ...initial, passengerCount: Number(passengersParam) };

    return initial;
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    } catch {
      // ignore
    }
  }, [form]);

  function update(patch: Partial<BookingFormState>) {
    setForm((f) => ({ ...f, ...patch }));
  }

  function goNext() {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleConfirm() {
    if (submitting) return; // prevent duplicate submissions from a double click
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          routeId: form.routeId,
          vehicleCategoryId: form.vehicleCategoryId,
          tripType: form.tripType,
          pickupDate: form.pickupDate,
          pickupTime: form.pickupTime,
          returnDate: form.tripType === "round_trip" ? form.returnDate : undefined,
          returnTime: form.tripType === "round_trip" ? form.returnTime : undefined,
          airline: form.airline || undefined,
          flightNumber: form.flightNumber || undefined,
          scheduledArrival: form.scheduledArrival || undefined,
          passengerCount: form.passengerCount,
          largeBags: form.largeBags,
          smallBags: form.smallBags,
          specialRequests: form.specialRequests || undefined,
          customerName: form.customerName,
          email: form.email,
          phone: form.phone,
          whatsapp: form.whatsapp || undefined,
          preferredContact: form.preferredContact,
        }),
      });
      const data = (await res.json()) as ApiResult;
      if (!res.ok || !data.ok) {
        setSubmitError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
      router.push(`/book/confirmation/${String(data.referenceCode)}`);
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
      setSubmitting(false);
    }
  }

  const selectedRoute = routes.find((r) => r.id === form.routeId) ?? null;
  const selectedVehicle = vehicles.find((v) => v.id === form.vehicleCategoryId) ?? null;

  return (
    <div>
      <ProgressIndicator steps={STEPS} current={step} />

      <div className="mt-6 rounded-2xl border border-[var(--color-border-muted)] bg-white p-5 sm:p-8">
        {step === 0 && (
          <RouteStep routes={routes} form={form} onChange={update} onNext={goNext} />
        )}
        {step === 1 && (
          <TravelDetailsStep
            selectedRoute={selectedRoute}
            form={form}
            onChange={update}
            onNext={goNext}
            onBack={goBack}
          />
        )}
        {step === 2 && (
          <VehicleStep
            vehicles={vehicles}
            selectedRoute={selectedRoute}
            form={form}
            onChange={update}
            onNext={goNext}
            onBack={goBack}
          />
        )}
        {step === 3 && <CustomerStep form={form} onChange={update} onNext={goNext} onBack={goBack} />}
        {step === 4 && (
          <ReviewStep
            form={form}
            selectedRoute={selectedRoute}
            selectedVehicle={selectedVehicle}
            onBack={goBack}
            onConfirm={handleConfirm}
            submitting={submitting}
            submitError={submitError}
          />
        )}
      </div>
    </div>
  );
}
