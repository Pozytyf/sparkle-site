import { Suspense, lazy } from 'react';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import PageSkeleton from '@/components/PageSkeleton';
import ParallaxDivider from '@/components/ParallaxDivider';
import { useLanguage } from '@/contexts/LanguageContext';
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
  const { t } = useLanguage();
  return (
    <Layout>
      <Seo titleKey="seo.home.title" descKey="seo.home.desc" path="/" />
      <Suspense fallback={<PageSkeleton />}>
        <HeroSection />
        <ServicesOverview />
        <ParallaxDivider imageUrl={serviceMaritime} height="250px" overlayOpacity={0.7}>
          <div className="text-center container-custom">
            <h3 className="font-heading text-2xl md:text-3xl font-bold mb-2">{t('parallax.expertise')}</h3>
            <p className="text-primary-foreground/80 text-lg">{t('parallax.modes')}</p>
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
