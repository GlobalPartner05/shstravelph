"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What is included in the fare?",
    a: "The fare and its inclusions (such as tolls or fuel) are shown for each route before you book. If something isn't listed as included, it's an additional charge — we'll show that too.",
  },
  {
    q: "When do I pay, and how?",
    a: "Payment is cash to the driver at the time of your ride. We don't currently take online payments or deposits.",
  },
  {
    q: "What happens if my flight is delayed?",
    a: "Tell us your flight number when you book. Our dispatch team tracks arrivals manually and will adjust your pickup time for a confirmed delay.",
  },
  {
    q: "Where will I meet the driver?",
    a: "Meeting instructions are specific to each airport and terminal and will be shown on your confirmation page once your booking is confirmed.",
  },
  {
    q: "Can I cancel or modify a booking?",
    a: "Yes — contact us with your booking reference. Our full cancellation policy will be shown here and on your confirmation page once finalized.",
  },
  {
    q: "What if my destination is outside your standard routes?",
    a: "Message us on WhatsApp or send an inquiry and we'll let you know if we can arrange it.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-white py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-coral-dark)]">
          FAQ
        </p>
        <h2 className="mt-2 text-balance text-3xl font-extrabold text-[var(--color-charcoal)] sm:text-4xl">
          Questions, Answered
        </h2>

        <div className="mt-8 divide-y divide-[var(--color-border-muted)] rounded-2xl border border-[var(--color-border-muted)]">
          {faqs.map((faq, i) => (
            <div key={faq.q}>
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                aria-expanded={open === i}
              >
                <span className="font-medium text-[var(--color-charcoal)]">{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 flex-shrink-0 text-[var(--color-coral)] transition-transform ${open === i ? "rotate-180" : ""}`}
                />
              </button>
              {open === i && (
                <p className="px-5 pb-4 text-sm text-[var(--color-charcoal-soft)]">{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
