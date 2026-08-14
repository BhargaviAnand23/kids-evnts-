import { Hero } from '@/components/home/Hero';
import { ParentTrustBar } from '@/components/home/ParentTrustBar';
import { Categories } from '@/components/home/Categories';
import { CuratedCollections } from '@/components/home/CuratedCollections';
import { FeaturedEventSection } from '@/components/home/FeaturedEventSection';
import { ActivityQuiz } from '@/components/home/ActivityQuiz';
import { TrendingEvents } from '@/components/home/TrendingEvents';
import { OrganizerSpotlight } from '@/components/home/OrganizerSpotlight';
import { WhyParentsChoose } from '@/components/home/WhyParentsChoose';
import { MegaEventBanner } from '@/components/home/MegaEventBanner';
import { HowItWorks } from '@/components/home/HowItWorks';
import { HappyKidsGallery } from '@/components/home/HappyKidsGallery';
import { Testimonials } from '@/components/home/Testimonials';
import { FinalCTA } from '@/components/home/FinalCTA';
import { AdBanner } from '@/components/ui/AdBanner';
import { OnboardingWalkthrough } from '@/components/shared/OnboardingWalkthrough';

export default function Home() {
  return (
    <div>
      <OnboardingWalkthrough />
      <Hero />
      <ParentTrustBar />
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-4">
        <AdBanner slot="homepage-below-hero" format="horizontal" />
      </div>
      <Categories />
      <CuratedCollections />
      <FeaturedEventSection />
      <ActivityQuiz />
      <TrendingEvents />
      <WhyParentsChoose />
      <OrganizerSpotlight />
      <MegaEventBanner />
      <HowItWorks />
      <HappyKidsGallery />
      <Testimonials />
      <FinalCTA />
    </div>
  );
}


