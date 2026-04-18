import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Ship, Plane, Truck, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCountUp } from '@/hooks/useCountUp';
import { useSiteContent } from '@/hooks/useSiteContent';
import { supabase } from '@/integrations/supabase/client';
import heroImage from '@/assets/hero-logistics.jpg';
import serviceRoad from '@/assets/service-road.jpg';
import serviceMaritime from '@/assets/service-maritime.jpg';
import serviceAir from '@/assets/service-air.jpg';

const defaultSlides = [heroImage, serviceRoad, serviceMaritime, serviceAir];

const HeroSection = () => {
  const { t } = useLanguage();
  const { c } = useSiteContent();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroSlides, setHeroSlides] = useState<string[]>(defaultSlides);
  const stat1 = useCountUp(10, 2000);
  const stat2 = useCountUp(500, 2500);

  // Fetch dynamic slides from DB
  useEffect(() => {
    const fetchSlides = async () => {
      const { data } = await supabase.from('hero_slides').select('image_url').order('sort_order');
      if (data && data.length > 0) {
        setHeroSlides(data.map(s => s.image_url));
      }
    };
    fetchSlides();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const goToSlide = (index: number) => setCurrentSlide(index);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image Carousel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <img
            src={heroSlides[currentSlide]}
            alt="Logistics background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-hero" />
        </motion.div>
      </AnimatePresence>

      {/* Animated particles - enhanced */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => {
          const size = 3 + (i % 5) * 4;
          const x = (i * 17 + 5) % 90;
          const y = (i * 13 + 8) % 85;
          const dur = 4 + (i % 4) * 2;
          const del = (i % 6) * 0.5;
          return (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: size,
                height: size,
                left: `${x}%`,
                top: `${y}%`,
                background: i % 3 === 0
                  ? 'hsl(35 95% 55% / 0.25)'
                  : i % 3 === 1
                  ? 'hsl(210 40% 98% / 0.15)'
                  : 'hsl(35 95% 55% / 0.12)',
              }}
              animate={{
                y: [0, -40 - (i % 5) * 15, 0],
                x: [0, (i % 2 === 0 ? 15 : -15), 0],
                opacity: [0.1, 0.7, 0.1],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: dur,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: del,
              }}
            />
          );
        })}
      </div>

      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 20% 50%, hsl(35 95% 55% / 0.08) 0%, transparent 70%)',
        }}
        animate={{
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 40% 60% at 80% 40%, hsl(217 91% 40% / 0.12) 0%, transparent 70%)',
        }}
        animate={{
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 right-[10%] text-primary-foreground/20"
        >
          <Ship className="w-24 h-24" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -3, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-1/3 right-[20%] text-primary-foreground/15"
        >
          <Plane className="w-20 h-20" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute top-1/3 left-[5%] text-primary-foreground/10"
        >
          <Truck className="w-16 h-16" />
        </motion.div>
      </div>

      {/* Slide Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center text-primary-foreground/70 hover:bg-primary-foreground/20 hover:text-primary-foreground transition-all"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center text-primary-foreground/70 hover:bg-primary-foreground/20 hover:text-primary-foreground transition-all"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Content */}
      <div className="container-custom relative z-10 pt-24">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-5 py-2.5 bg-accent text-accent-foreground text-base font-bold rounded-full mb-8 shadow-lg shadow-accent/30">
              {c('hero_badge', t('hero.badge'))}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-5xl md:text-6xl lg:text-7xl font-extrabold text-primary-foreground leading-tight mb-8 drop-shadow-lg"
          >
            {c('hero_title', `${t('hero.title1')} ${t('hero.title2')} ${t('hero.title3')}`)}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-primary-foreground/90 mb-10 leading-relaxed drop-shadow-sm"
          >
            {c('hero_subtitle', t('hero.description'))}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button asChild variant="hero" size="xl">
              <Link to="/contact">
                {t('hero.cta')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="hero-outline" size="xl">
              <Link to="/services">{t('hero.discover')}</Link>
            </Button>
          </motion.div>

          {/* Animated Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-primary-foreground/20"
          >
            <div className="text-center" ref={stat1.ref}>
              <div className="font-heading text-3xl md:text-4xl font-bold text-accent">
                {stat1.count}+
              </div>
              <div className="text-sm text-primary-foreground/70 mt-1">{t('hero.stat1')}</div>
            </div>
            <div className="text-center" ref={stat2.ref}>
              <div className="font-heading text-3xl md:text-4xl font-bold text-accent">
                {stat2.count}+
              </div>
              <div className="text-sm text-primary-foreground/70 mt-1">{t('hero.stat2')}</div>
            </div>
            <div className="text-center">
              <div className="font-heading text-3xl md:text-4xl font-bold text-accent">24/7</div>
              <div className="text-sm text-primary-foreground/70 mt-1">{t('hero.stat3')}</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Slide Dots */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-500 ${
              index === currentSlide
                ? 'w-8 bg-accent'
                : 'w-2 bg-primary-foreground/30 hover:bg-primary-foreground/50'
            }`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2"
        >
          <div className="w-1.5 h-2.5 bg-primary-foreground/50 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
