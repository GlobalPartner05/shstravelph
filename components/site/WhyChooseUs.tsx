import { BadgeCheck, Car, Receipt, MessageCircle, Snowflake, PlaneTakeoff } from "lucide-react";

const points = [
  { icon: BadgeCheck, text: "Professional, appropriately licensed drivers" },
  { icon: Car, text: "Private transportation, not a shared ride" },
  { icon: Receipt, text: "Clear prices shown before you book" },
  { icon: MessageCircle, text: "Direct booking assistance by WhatsApp" },
  { icon: Snowflake, text: "Comfortable, air-conditioned vehicles" },
  { icon: PlaneTakeoff, text: "Airport pickup coordination on supported routes" },
];

export default function WhyChooseUs() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-coral-dark)]">
        Why Choose Sakura Hire Services
      </p>
      <h2 className="mt-2 text-balance text-3xl font-extrabold text-[var(--color-charcoal)] sm:text-4xl">
        Built Around a Smooth Arrival
      </h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {points.map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-start gap-3 rounded-xl border border-[var(--color-border-muted)] bg-white p-4">
            <Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--color-coral)]" />
            <p className="text-sm text-[var(--color-charcoal)]">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
