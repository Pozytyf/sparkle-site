import { Suspense, lazy } from 'react';
import Layout from '@/components/layout/Layout';
import PageSkeleton from '@/components/PageSkeleton';
import ParallaxDivider from '@/components/ParallaxDivider';
import serviceMaritime from '@/assets/service-maritime.jpg';
import serviceAir from '@/assets/service-air.jpg';

const HeroSection = lazy(() => import('@/components/home/HeroSection'));
const ServicesOverview = lazy(() => import('@/components/home/ServicesOverview'));
const WhyChooseUs = lazy(() => import('@/components/home/WhyChooseUs'));
const TestimonialsSection = lazy(() => import('@/components/home/TestimonialsSection'));
const PartnersMarquee = lazy(() => import('@/components/home/PartnersMarquee'));
const CTASection = lazy(() => import('@/components/home/CTASection'));
const FeaturedCarousel = lazy(() => import('@/components/home/FeaturedCarousel'));

const Index = () => {
  return (
    <Layout>
      <Suspense fallback={<PageSkeleton />}>
        <HeroSection />
        <ServicesOverview />
        <ParallaxDivider imageUrl={serviceMaritime} height="250px" overlayOpacity={0.7}>
          <div className="text-center container-custom">
            <h3 className="font-heading text-2xl md:text-3xl font-bold mb-2">+10 ans d'expertise logistique</h3>
            <p className="text-primary-foreground/80 text-lg">Maritime · Aérien · Routier · Ferroviaire</p>
          </div>
        </ParallaxDivider>
        <WhyChooseUs />
        <FeaturedCarousel />
        <ParallaxDivider imageUrl={serviceAir} height="200px" overlayOpacity={0.75} />
        <PartnersMarquee />
        <TestimonialsSection />
        <CTASection />
      </Suspense>
    </Layout>
  );
};

export default Index;
