import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { QuickActionCards } from '../components/home/QuickActionCards';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { FeaturedVehiclesSection } from '../components/home/FeaturedVehiclesSection';
import { VehicleFinderWidget } from '../components/home/VehicleFinderWidget';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { SparePartsPreview } from '../components/home/SparePartsPreview';
import { DoorstepServiceBanner } from '../components/home/DoorstepServiceBanner';
import { HowItWorksSection } from '../components/home/HowItWorksSection';
import { ReviewsAndFaqSection } from '../components/home/ReviewsAndFaqSection';
import { FinalCtaSection } from '../components/home/FinalCtaSection';

export const HomePage: React.FC = () => {
  return (
    <div className="min-w-0">
      {/* B. Hero Section */}
      <HeroSection />

      {/* C. Quick Action Cards */}
      <QuickActionCards />

      {/* D. Shop by Category */}
      <CategoryGrid />

      {/* E. Featured Electric Vehicles */}
      <FeaturedVehiclesSection />

      {/* F. Find the Right EV (Interactive Vehicle Finder) */}
      <VehicleFinderWidget />

      {/* G. Why Choose Us */}
      <WhyChooseUs />

      {/* H. Spare Parts Marketplace Preview */}
      <SparePartsPreview />

      {/* I. Doorstep Service Section */}
      <DoorstepServiceBanner />

      {/* J. How It Works */}
      <HowItWorksSection />

      {/* K. Customer Reviews and FAQs */}
      <ReviewsAndFaqSection />

      {/* L. Final CTA */}
      <FinalCtaSection />
    </div>
  );
};
