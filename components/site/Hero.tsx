import { Shield, Clock, Car, MapPin } from "lucide-react";
import BookingWidget from "@/components/booking/BookingWidget";
import type { ActiveRoute } from "@/lib/queries";

const trustPoints = [
  { icon: Shield, title: "Safe & Reliable", subtitle: "Professional drivers" },
  { icon: Clock, title: "On-Time Pickup", subtitle: "Flight details on file" },
  { icon: Car, title: "Comfortable Rides", subtitle: "Clean, air-conditioned vehicles" },
  { icon: MapPin, title: "Transparent Fares", subtitle: "No hidden charges" },
];

export default function Hero({ routes }: { routes: ActiveRoute[] }) {
  return (
    <section className="bg-gradient-to-b from-[var(--color-coral-light)] to-[var(--color-cream)]">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-coral-dark)]">
            Sakura Hire Services
          </p>
          <h1 className="mt-3 text-balance text-4xl font-extrabold leading-tight text-[var(--color-charcoal)] sm:text-5xl">
            Your Ride Is Ready When You Arrive.
          </h1>
          <p className="mt-4 text-lg text-[var(--color-charcoal-soft)]">
            Private airport transfers and comfortable door-to-door rides across our Luzon service
            areas. Know your fare, choose your vehicle, and arrange your pickup before you
            travel.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {trustPoints.map(({ icon: Icon, title, subtitle }) => (
            <div key={title} className="flex items-start gap-2">
              <Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--color-coral)]" />
              <div>
                <p className="text-sm font-semibold text-[var(--color-charcoal)]">{title}</p>
                <p className="text-xs text-[var(--color-charcoal-soft)]">{subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <BookingWidget routes={routes} />
        </div>
      </div>
    </section>
  );
}
