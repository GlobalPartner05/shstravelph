const steps = [
  {
    number: "01",
    title: "Choose your route and vehicle",
    description: "Pick a confirmed route, see the fixed fare, and select the vehicle that fits your group and luggage.",
  },
  {
    number: "02",
    title: "Enter your travel and contact details",
    description: "Tell us your pickup date and time, flight details if applicable, and how to reach you.",
  },
  {
    number: "03",
    title: "Get your booking reference",
    description: "Your request is sent to our dispatch team for confirmation. You'll receive a reference and status update — a request is not the same as a confirmed ride until we confirm it.",
  },
];

export default function HowBookingWorks() {
  return (
    <section id="how-it-works" className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-coral-dark)]">
          How Booking Works
        </p>
        <h2 className="mt-2 text-balance text-3xl font-extrabold text-[var(--color-charcoal)] sm:text-4xl">
          Three Simple Steps
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="rounded-2xl border border-[var(--color-border-muted)] p-6">
              <p className="text-3xl font-extrabold text-[var(--color-coral)]/30">{step.number}</p>
              <h3 className="mt-2 text-lg font-bold text-[var(--color-charcoal)]">{step.title}</h3>
              <p className="mt-2 text-sm text-[var(--color-charcoal-soft)]">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
