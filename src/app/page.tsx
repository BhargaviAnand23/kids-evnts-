import { Hero } from '@/components/home/Hero';
import { Categories } from '@/components/home/Categories';
import { ActivityQuiz } from '@/components/home/ActivityQuiz';
import { TrendingEvents } from '@/components/home/TrendingEvents';
import { MegaEventBanner } from '@/components/home/MegaEventBanner';
import { HowItWorks } from '@/components/home/HowItWorks';
import { HappyKidsGallery } from '@/components/home/HappyKidsGallery';
import { Testimonials } from '@/components/home/Testimonials';
import { AdBanner } from '@/components/ui/AdBanner';

export default function Home() {
  return (
    <div>
      <Hero />
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 py-4">
        <AdBanner slot="homepage-below-hero" format="horizontal" />
      </div>
      <Categories />
      <ActivityQuiz />
      <TrendingEvents />
      <MegaEventBanner />
      <HowItWorks />
      <HappyKidsGallery />
      <Testimonials />
    </div>
  );
}
