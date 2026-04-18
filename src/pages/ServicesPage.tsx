import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Plane, Ship, Train, CheckCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteContent } from '@/hooks/useSiteContent';
import { EditableText } from '@/components/cms/EditableText';
import { EditableImage } from '@/components/cms/EditableImage';
import ParallaxDivider from '@/components/ParallaxDivider';
import serviceRoad from '@/assets/service-road.jpg';
import serviceAir from '@/assets/service-air.jpg';
import serviceMaritime from '@/assets/service-maritime.jpg';
import serviceRail from '@/assets/service-rail.jpg';

const ServicesPage = () => {
  const { t, language } = useLanguage();
  const { c } = useSiteContent();

  const services = [
    {
      icon: Truck, key: 'road',
      titleKey: 'service_road_title', descKey: 'service_road_desc', imageKey: 'service_road_image',
      defaultTitle: t('services.road.title'), defaultDesc: t('services.road.desc'), defaultImage: serviceRoad,
      features: language === 'fr' ? ['Livraison porte-à-porte', 'Suivi en temps réel', 'Flotte de véhicules modernes', 'Respect des délais'] : ['Door-to-door delivery', 'Real-time tracking', 'Modern vehicle fleet', 'On-time delivery'],
    },
    {
      icon: Plane, key: 'air',
      titleKey: 'service_air_title', descKey: 'service_air_desc', imageKey: 'service_air_image',
      defaultTitle: t('services.air.title'), defaultDesc: t('services.air.desc'), defaultImage: serviceAir,
      features: language === 'fr' ? ['Express et standard', 'Toutes destinations mondiales', 'Dédouanement rapide', 'Assurance cargo'] : ['Express and standard', 'All worldwide destinations', 'Fast customs clearance', 'Cargo insurance'],
    },
    {
      icon: Ship, key: 'maritime',
      titleKey: 'service_maritime_title', descKey: 'service_maritime_desc', imageKey: 'service_maritime_image',
      defaultTitle: t('services.maritime.title'), defaultDesc: t('services.maritime.desc'), defaultImage: serviceMaritime,
      features: language === 'fr' ? ['Conteneurs complets et groupage', 'Suivi GPS des conteneurs', 'Assurance maritime', 'Tarifs compétitifs'] : ['Full containers and groupage', 'GPS container tracking', 'Maritime insurance', 'Competitive rates'],
    },
    {
      icon: Train, key: 'rail',
      titleKey: 'service_rail_title', descKey: 'service_rail_desc', imageKey: 'service_rail_image',
      defaultTitle: t('services.rail.title'), defaultDesc: t('services.rail.desc'), defaultImage: serviceRail,
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
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              <EditableText contentKey="services_title" fallback={`${t('services.title1')} ${t('services.title2')}`} label="Titre Services" />
            </h1>
            <p className="text-lg text-primary-foreground/90">
              <EditableText contentKey="services_description" fallback={t('services.description')} label="Description Services" multiline as="span" />
            </p>
          </motion.div>
        </div>
      </section>

      <ParallaxDivider imageUrl={serviceRoad} height="200px" overlayOpacity={0.7} />

      {/* Services Detail */}
      <section className="section-padding">
        <div className="container-custom space-y-24">
          {services.map((service, index) => (
            <motion.div
              key={service.key}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
            >
              <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="relative">
                  <EditableImage
                    contentKey={service.imageKey}
                    fallbackSrc={service.defaultImage}
                    alt={c(service.titleKey, service.defaultTitle)}
                    label={`Image ${service.defaultTitle}`}
                    className="relative rounded-2xl overflow-hidden shadow-xl group"
                    imgClassName="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent pointer-events-none rounded-2xl" />
                  <div className="absolute bottom-6 left-6 z-10">
                    <div className="h-14 w-14 rounded-xl bg-accent flex items-center justify-center">
                      <service.icon className="h-7 w-7 text-accent-foreground" />
                    </div>
                  </div>
                </div>
              </div>
              <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
                  <EditableText contentKey={service.titleKey} fallback={service.defaultTitle} label={`Titre ${service.defaultTitle}`} />
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  <EditableText contentKey={service.descKey} fallback={service.defaultDesc} label={`Description ${service.defaultTitle}`} multiline as="span" />
                </p>
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
