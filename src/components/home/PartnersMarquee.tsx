import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const partners = [
  'SOCOCE', 'Pharma Distribution CI', 'Agro-Industries CI', 'Textiles Africains',
  'Port Autonome d\'Abidjan', 'Bolloré Transport', 'CMA CGM', 'Maersk',
  'DHL Logistics', 'Mediterranean Shipping', 'SOCOCE', 'Pharma Distribution CI',
  'Agro-Industries CI', 'Textiles Africains', 'Port Autonome d\'Abidjan', 'Bolloré Transport',
];

const PartnersMarquee = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-background border-y border-border overflow-hidden">
      <div className="container-custom mb-10">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-heading text-2xl font-bold text-foreground text-center"
        >
          {t('partners.title')}
        </motion.h3>
      </div>

      {/* Marquee */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

        <div className="marquee-track">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex-shrink-0 mx-8 px-8 py-4 bg-muted rounded-xl border border-border hover:border-accent/30 hover:shadow-md transition-all duration-300 cursor-default"
            >
              <span className="font-heading font-semibold text-muted-foreground whitespace-nowrap text-sm">
                {partner}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersMarquee;
