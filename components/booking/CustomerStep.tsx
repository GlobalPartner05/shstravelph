import type { BookingFormState } from "@/lib/types";

type Props = {
  form: BookingFormState;
  onChange: (patch: Partial<BookingFormState>) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function CustomerStep({ form, onChange, onNext, onBack }: Props) {
  const canContinue = form.customerName.trim() !== "" && form.email.trim() !== "" && form.phone.trim() !== "";

  return (
    <div>
      <h2 className="text-xl font-bold text-[var(--color-charcoal)]">Your details</h2>
      <p className="mt-1 text-sm text-[var(--color-charcoal-soft)]">
        We only ask for what&apos;s needed to confirm and contact you about this booking.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          <span className="font-medium text-[var(--color-charcoal)]">Full name</span>
          <input
            required
            value={form.customerName}
            onChange={(e) => onChange({ customerName: e.target.value })}
            className="rounded-lg border border-[var(--color-border-muted)] px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-[var(--color-charcoal)]">Email</span>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => onChange({ email: e.target.value })}
            className="rounded-lg border border-[var(--color-border-muted)] px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-[var(--color-charcoal)]">Mobile number</span>
          <input
            required
            placeholder="+63 9XX XXX XXXX"
            value={form.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            className="rounded-lg border border-[var(--color-border-muted)] px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-[var(--color-charcoal)]">WhatsApp (if different)</span>
          <input
            value={form.whatsapp}
            onChange={(e) => onChange({ whatsapp: e.target.value })}
            className="rounded-lg border border-[var(--color-border-muted)] px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-[var(--color-charcoal)]">Preferred contact method</span>
          <select
            value={form.preferredContact}
            onChange={(e) => onChange({ preferredContact: e.target.value as "phone" | "whatsapp" | "email" })}
            className="rounded-lg border border-[var(--color-border-muted)] px-3 py-2"
          >
            <option value="phone">Phone call</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="email">Email</option>
          </select>
        </label>
      </div>

      <div className="mt-6 flex gap-3">
        <button type="button" onClick={onBack} className="rounded-full border border-[var(--color-border-muted)] px-6 py-3 font-semibold text-[var(--color-charcoal)]">
          Back
        </button>
        <button
          type="button"
          disabled={!canContinue}
          onClick={onNext}
          className="flex-1 rounded-full bg-[var(--color-coral)] py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none sm:px-8"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
