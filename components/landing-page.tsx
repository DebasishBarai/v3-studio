import { HeroSection } from '@/components/landing-components/hero-section';
import { Features } from '@/components/landing-components/features-section';
import { VideoGallery } from '@/components/landing-components/video-gallery';
import { CallToAction } from '@/components/landing-components/call-to-action';
import { PricingPage } from '@/components/billing';
import { NavbarDemo } from '@/components/landing-components/navbar';
import { ProductPreviewSection } from '@/components/landing-components/product-preview-section';
import { Showcase } from './landing-components/showcase';

export const LandingPage = () => {
  return (
    <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white min-h-screen min-w-full flex flex-col justify-start items-center">
      {/* <LogoSection /> */}
      <NavbarDemo />
      <HeroSection />
      <ProductPreviewSection />
      <Features />
      <Showcase />
      {/* <VideoGallery /> */}
      <CallToAction />
      <PricingPage />
    </div>
  );
};
