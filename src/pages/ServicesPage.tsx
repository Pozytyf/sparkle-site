import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Plane, Ship, Train, CheckCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import ParallaxDivider from '@/components/ParallaxDivider';
import serviceRoad from '@/assets/service-road.jpg';
import serviceAir from '@/assets/service-air.jpg';
import serviceMaritime from '@/assets/service-maritime.jpg';
import serviceRail from '@/assets/service-rail.jpg';

const ServicesPage = () => {
  const { t, language } = useLanguage();

  const services = [
    {
      icon: Truck, title: t('services.road.title'), description: t('services.road.desc'), image: serviceRoad,
      features: language === 'fr' ? ['Livraison porte-à-porte', 'Suivi en temps réel', 'Flotte de véhicules modernes', 'Respect des délais'] : ['Door-to-door delivery', 'Real-time tracking', 'Modern vehicle fleet', 'On-time delivery'],
    },
    {
      icon: Plane, title: t('services.air.title'), description: t('services.air.desc'), image: serviceAir,
      features: language === 'fr' ? ['Express et standard', 'Toutes destinations mondiales', 'Dédouanement rapide', 'Assurance cargo'] : ['Express and standard', 'All worldwide destinations', 'Fast customs clearance', 'Cargo insurance'],
    },
    {
      icon: Ship, title: t('services.maritime.title'), description: t('services.maritime.desc'), image: serviceMaritime,
      features: language === 'fr' ? ['Conteneurs complets et groupage', 'Suivi GPS des conteneurs', 'Assurance maritime', 'Tarifs compétitifs'] : ['Full containers and groupage', 'GPS container tracking', 'Maritime insurance', 'Competitive rates'],
    },
    {
      icon: Train, title: t('services.rail.title'), description: t('services.rail.desc'), image: serviceRail,
      features: language === 'fr' ? ['Transport de gros volumes', 'Solution écologique', 'Réseau ferroviaire étendu', 'Tarifs avantageux'] : ['Large volume transport', 'Eco-friendly solution', 'Extended rail network', 'Advantageous rates'],
    },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <span className="inline-block px-4 py-2 bg-accent/90 text-accent-foreground text-sm font-semibold rounded-full mb-6">{t('services.badge')}</span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-6">{t('services.title1')} {t('services.title2')}</h1>
            <p className="text-lg text-primary-foreground/90">{t('services.description')}</p>
          </motion.div>
        </div>
      </section>

      <ParallaxDivider imageUrl={serviceRoad} height="200px" overlayOpacity={0.7} />

      {/* Services Detail */}
      <section className="section-padding">
        <div className="container-custom space-y-24">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
            >
              <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="relative rounded-2xl overflow-hidden shadow-xl group">
                  <img src={service.image} alt={service.title} className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <div className="h-14 w-14 rounded-xl bg-accent flex items-center justify-center">
                      <service.icon className="h-7 w-7 text-accent-foreground" />
                    </div>
                  </div>
                </div>
              </div>
              <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <h2 className="font-heading text-3xl font-bold text-foreground mb-4">{service.title}</h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">{service.description}</p>
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, i) => (
                    <motion.li key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-center gap-3 text-foreground">
                      <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>
                <Button asChild variant="default" size="lg">
                  <Link to="/contact">{t('cta.quote')} <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default ServicesPage;
