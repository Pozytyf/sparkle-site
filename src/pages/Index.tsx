import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import ServicesOverview from '@/components/home/ServicesOverview';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import PartnersMarquee from '@/components/home/PartnersMarquee';
import CTASection from '@/components/home/CTASection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ServicesOverview />
      <WhyChooseUs />
      <PartnersMarquee />
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
