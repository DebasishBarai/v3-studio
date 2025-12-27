import { LogoSection } from '@/components/landing-components/logo-section';
import { HeroSection } from '@/components/landing-components/hero-section';
import { Features } from '@/components/landing-components/features-section';
import { Features2 } from '@/components/landing-components/features-2-section';
import { VideoGallery } from '@/components/landing-components/video-gallery';
import { CallToAction } from '@/components/landing-components/call-to-action';
import { PricingPage } from '@/components/billing';
import { NavbarDemo } from '@/components/landing-components/navbar';
import { ProductPreviewSection } from '@/components/landing-components/product-preview-section';

export const LandingPage = () => {
  return (
    <div className="bg-black text-white min-h-screen min-w-full flex flex-col justify-start items-center">
      {/* <LogoSection /> */}
      <NavbarDemo />
      <HeroSection />
      <ProductPreviewSection />
      <Features />
      <PricingPage />
      <VideoGallery />
      <CallToAction />
    </div>
  );
};
