import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Truck, Plane, Ship, Train, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import serviceRoad from '@/assets/service-road.jpg';
import serviceAir from '@/assets/service-air.jpg';
import serviceMaritime from '@/assets/service-maritime.jpg';
import serviceRail from '@/assets/service-rail.jpg';

const ServicesOverview = () => {
  const { t } = useLanguage();

  const services = [
    { icon: Truck, title: t('services.road.title'), description: t('services.road.desc'), image: serviceRoad, color: 'from-blue-600/80 to-blue-900/80' },
    { icon: Plane, title: t('services.air.title'), description: t('services.air.desc'), image: serviceAir, color: 'from-sky-500/80 to-sky-800/80' },
    { icon: Ship, title: t('services.maritime.title'), description: t('services.maritime.desc'), image: serviceMaritime, color: 'from-teal-600/80 to-teal-900/80' },
    { icon: Train, title: t('services.rail.title'), description: t('services.rail.desc'), image: serviceRail, color: 'from-amber-600/80 to-amber-900/80' },
  ];

  return (
    <section className="section-padding bg-muted">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4"
          >
            {t('services.badge')}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            {t('services.title1')} <span className="text-accent">{t('services.title2')}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg"
          >
            {t('services.description')}
          </motion.p>
        </div>

        {/* Services Grid with images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500 cursor-pointer h-80"
            >
              {/* Background Image */}
              <img
                src={service.image}
                alt={service.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${service.color} opacity-80 group-hover:opacity-90 transition-opacity duration-500`} />
              
              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-end p-6 text-primary-foreground">
                <motion.div
                  className="mb-auto pt-4"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="h-14 w-14 rounded-xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
                    <service.icon className="h-7 w-7" />
                  </div>
                </motion.div>
                <h3 className="font-heading text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-primary-foreground/80 text-sm leading-relaxed transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button asChild variant="default" size="lg">
            <Link to="/services">
              {t('services.viewAll')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesOverview;
