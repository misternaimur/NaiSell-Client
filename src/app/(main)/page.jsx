/** @format */
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import CuratedArrivals from "@/components/CuratedArrivals";
import SuccessStories from "@/components/SuccessStories";
import MarketplaceStats from "@/components/MarketplaceStats";
import SustainabilityImpact from "@/components/SustainabilityImpact";
import TrustedSellers from "@/components/TrustedSellers";

export default function Home() {
  return (
    <div className="flex flex-col w-full bg-surface font-sans">
      {/* Hero Section */}
      <Hero />

      {/* Section 2: Categories */}
      <Categories />

      {/* Section 3: Curated Arrivals */}
      <CuratedArrivals />

      {/* Section 4: Success Stories */}
      <SuccessStories />

      {/* Section 5: Marketplace Statistics */}
      <MarketplaceStats />

      {/* Extra Section: Sustainability Impact */}
      <SustainabilityImpact />

      {/* Extra Section: Trusted Sellers */}
      <TrustedSellers />
    </div>
  );
}
