import { Hero } from '@/components/home/Hero';
import { Categories } from '@/components/home/Categories';
import { ActivityQuiz } from '@/components/home/ActivityQuiz';
import { TrendingEvents } from '@/components/home/TrendingEvents';
import { MegaEventBanner } from '@/components/home/MegaEventBanner';
import { HowItWorks } from '@/components/home/HowItWorks';
import { HappyKidsGallery } from '@/components/home/HappyKidsGallery';
import { Testimonials } from '@/components/home/Testimonials';
import { AdBanner } from '@/components/ui/AdBanner';
import { OnboardingWalkthrough } from '@/components/shared/OnboardingWalkthrough';
import { LogoLoop } from '@/components/home/LogoLoop';
import { StatsHighlights } from '@/components/home/StatsHighlights';
import { FeaturedOrganizer } from '@/components/home/FeaturedOrganizer';

export default function Home() {
  return (
    <div>
      <OnboardingWalkthrough />
      <Hero />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-4">
        <AdBanner slot="homepage-below-hero" format="horizontal" />
      </div>
      <LogoLoop />
      <Categories />
      <StatsHighlights />
      <ActivityQuiz />
      <TrendingEvents />
      <MegaEventBanner />
      <FeaturedOrganizer />
      <HowItWorks />
      <HappyKidsGallery />
      <Testimonials />
    </div>
  );
}
