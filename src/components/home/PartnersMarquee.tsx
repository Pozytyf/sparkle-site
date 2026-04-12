import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

const fallbackPartners = [
  'SOCOCE', 'Pharma Distribution CI', 'Agro-Industries CI', 'Textiles Africains',
  'Port Autonome d\'Abidjan', 'Bolloré Transport', 'CMA CGM', 'Maersk',
  'DHL Logistics', 'Mediterranean Shipping',
];

const PartnersMarquee = () => {
  const { t } = useLanguage();
  const [partners, setPartners] = useState<{ name: string; logo_url: string | null; website: string | null }[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('partners').select('*').order('sort_order');
      if (data && data.length > 0) {
        setPartners(data);
      } else {
        setPartners(fallbackPartners.map(p => ({ name: p, logo_url: null, website: null })));
      }
    };
    fetch();
  }, []);

  // Double for seamless marquee
  const items = [...partners, ...partners];

  return (
    <section className="py-16 bg-background border-y border-border overflow-hidden">
      <div className="container-custom mb-10">
        <motion.h3 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-heading text-2xl font-bold text-foreground text-center">
          {t('partners.title')}
        </motion.h3>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

        <div className="marquee-track">
          {items.map((partner, index) => (
            <div key={index} className="flex-shrink-0 mx-8 px-8 py-4 bg-muted rounded-xl border border-border hover:border-accent/30 hover:shadow-md transition-all duration-300 cursor-default flex items-center gap-3">
              {partner.logo_url ? (
                <img src={partner.logo_url} alt={partner.name} className="h-8 w-auto object-contain max-w-[100px]" loading="lazy" />
              ) : (
                <span className="font-heading font-semibold text-muted-foreground whitespace-nowrap text-sm">
                  {partner.name}
                </span>
              )}
              {partner.logo_url && (
                <span className="font-heading font-semibold text-muted-foreground whitespace-nowrap text-sm">
                  {partner.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersMarquee;
