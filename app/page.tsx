import Header from "@/components/site/Header";
import Hero from "@/components/site/Hero";
import PopularRoutes from "@/components/site/PopularRoutes";
import VehiclesPreview from "@/components/site/VehiclesPreview";
import WhyChooseUs from "@/components/site/WhyChooseUs";
import HowBookingWorks from "@/components/site/HowBookingWorks";
import AirportPickupSection from "@/components/site/AirportPickupSection";
import Faq from "@/components/site/Faq";
import CTASection from "@/components/site/CTASection";
import Footer from "@/components/site/Footer";
import { getActiveRoutesWithFromPrice } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const routes = await getActiveRoutesWithFromPrice();

  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero routes={routes} />
        <PopularRoutes routes={routes} />
        <VehiclesPreview />
        <WhyChooseUs />
        <HowBookingWorks />
        <AirportPickupSection />
        <Faq />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
