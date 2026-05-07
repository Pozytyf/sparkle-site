import { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, AlertCircle } from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteContent';
import { EditableText } from '@/components/cms/EditableText';
import { Skeleton } from '@/components/ui/skeleton';
import { useHeroSlides, type HeroSlide } from '@/hooks/useHeroSlides';
import serviceMaritime from '@/assets/service-maritime.jpg';
import serviceAir from '@/assets/service-air.jpg';
import serviceRoad from '@/assets/service-road.jpg';
import serviceRail from '@/assets/service-rail.jpg';

const fallbackSlides: HeroSlide[] = [
  { id: 'f1', image_url: serviceMaritime, title: 'Maritime' },
  { id: 'f2', image_url: serviceAir, title: 'Aérien' },
  { id: 'f3', image_url: serviceRoad, title: 'Routier' },
  { id: 'f4', image_url: serviceRail, title: 'Ferroviaire' },
];

const FeaturedCarousel = () => {
  const { c } = useSiteContent();
  const { data, isLoading, error } = useHeroSlides();
  const slides: HeroSlide[] = data && data.length > 0 ? data : fallbackSlides;

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => emblaApi.scrollNext(), 4500);
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => { clearInterval(interval); emblaApi.off('select', onSelect); };
  }, [emblaApi, slides.length]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const current = slides[selected] || slides[0];

  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="inline-flex items-center gap-2 text-accent font-semibold text-sm uppercase tracking-wider mb-3">
            <Sparkles className="h-4 w-4" />
            <EditableText contentKey="featured_badge" fallback="En vedette" label="Carrousel - Badge" />
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
            <EditableText contentKey="featured_title" fallback="Nos réalisations en images" label="Carrousel - Titre" />
          </h2>
          <p className="text-muted-foreground text-lg">
            <EditableText contentKey="featured_subtitle" fallback="Un aperçu de l'expertise HP LOGISTICS au quotidien." label="Carrousel - Sous-titre" multiline />
          </p>
        </motion.div>

        {error && (
          <div className="max-w-xl mx-auto mb-6 flex items-start gap-3 p-4 rounded-xl border border-destructive/30 bg-destructive/5 text-sm text-destructive">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Impossible de charger les visuels</p>
              <p className="text-destructive/80">Affichage des images par défaut.</p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="relative">
            <div className="overflow-hidden rounded-3xl">
              <div className="flex gap-4">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="flex-[0_0_100%] md:flex-[0_0_55%] h-[420px] md:h-[480px] rounded-2xl" />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-3xl shadow-2xl" ref={emblaRef}>
              <div className="flex">
                {slides.map((s) => (
                  <div key={s.id} className="relative flex-[0_0_100%] md:flex-[0_0_70%] lg:flex-[0_0_55%] pr-4">
                    <div className="relative h-[420px] md:h-[480px] rounded-2xl overflow-hidden group">
                      <img
                        src={s.image_url}
                        alt={s.title || ''}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Synced text overlay */}
            <div className="absolute bottom-8 left-8 right-8 md:left-12 z-10 pointer-events-none max-w-md">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current?.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="text-primary-foreground"
                >
                  <div className="text-xs uppercase tracking-widest text-accent font-semibold mb-2">
                    {String(selected + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                  </div>
                  <h3 className="font-heading text-2xl md:text-3xl font-bold drop-shadow-lg">
                    {current?.title || c('featured_default_title', 'Solution logistique')}
                  </h3>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              onClick={scrollPrev}
              aria-label="Précédent"
              className="absolute left-2 md:-left-6 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-card border border-border shadow-lg flex items-center justify-center text-foreground hover:bg-accent hover:text-accent-foreground hover:scale-110 transition-all z-20"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={scrollNext}
              aria-label="Suivant"
              className="absolute right-2 md:-right-6 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-card border border-border shadow-lg flex items-center justify-center text-foreground hover:bg-accent hover:text-accent-foreground hover:scale-110 transition-all z-20"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="flex justify-center gap-2 mt-6">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi?.scrollTo(i)}
                  aria-label={`Aller au slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    selected === i ? 'w-8 bg-accent' : 'w-2 bg-border hover:bg-muted-foreground/40'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCarousel;
