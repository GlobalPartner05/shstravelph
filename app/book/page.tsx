import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import BookingWizard from "@/components/booking/BookingWizard";
import { getActiveRoutesWithFromPrice, getActiveVehicleCategories } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function BookPage() {
  const [routes, vehicles] = await Promise.all([
    getActiveRoutesWithFromPrice(),
    getActiveVehicleCategories(),
  ]);

  return (
    <>
      <Header />
      <main className="flex-1 bg-[var(--color-cream)]">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <BookingWizard routes={routes} vehicles={vehicles} />
        </div>
      </main>
      <Footer />
    </>
  );
}
