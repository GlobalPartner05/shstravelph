import Link from "next/link";

export default function CTASection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="rounded-2xl bg-[var(--color-coral)] px-6 py-12 text-center text-white sm:px-12">
        <h2 className="text-balance text-3xl font-extrabold sm:text-4xl">
          Ready to Book Your Transfer?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-white/90">
          Pick your route, choose your vehicle, and get a booking reference in minutes.
        </p>
        <Link
          href="/book"
          className="mt-6 inline-block rounded-full bg-white px-8 py-3 text-sm font-bold text-[var(--color-coral-dark)] transition hover:bg-white/90"
        >
          Book Your Transfer
        </Link>
      </div>
    </section>
  );
}
