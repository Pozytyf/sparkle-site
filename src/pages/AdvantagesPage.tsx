import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Clock, Users, CheckCircle, Headphones, Globe, Truck, Building, Warehouse, Monitor } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCountUp } from '@/hooks/useCountUp';
import { EditableText } from '@/components/cms/EditableText';

const AdvantagesPage = () => {
  const { t } = useLanguage();
  const years = useCountUp(10, 2000);
  const clients = useCountUp(500, 2500);
  const satisfaction = useCountUp(98, 2000);

  const engagements = [
    { key: 'reactivity', icon: Clock, defaultTitle: t('why.reactivity.title'), defaultDesc: t('why.reactivity.desc') },
    { key: 'reliability', icon: Shield, defaultTitle: t('why.reliability.title'), defaultDesc: t('why.reliability.desc') },
    { key: 'transparency', icon: CheckCircle, defaultTitle: t('why.transparency.title'), defaultDesc: t('why.transparency.desc') },
    { key: 'proximity', icon: Users, defaultTitle: t('why.proximity.title'), defaultDesc: t('why.proximity.desc') },
    { key: 'support', icon: Headphones, defaultTitle: t('why.support.title'), defaultDesc: t('why.support.desc') },
    { key: 'network', icon: Globe, defaultTitle: t('why.network.title'), defaultDesc: t('why.network.desc') },
  ];

  const infrastructure = [
    { key: 'vehicles', icon: Truck, defaultTitle: t('advantages.vehicles'), defaultDesc: t('advantages.vehiclesDesc') },
    { key: 'facilities', icon: Building, defaultTitle: t('advantages.facilities'), defaultDesc: t('advantages.facilitiesDesc') },
    { key: 'warehouses', icon: Warehouse, defaultTitle: t('advantages.warehouses'), defaultDesc: t('advantages.warehousesDesc') },
    { key: 'tools', icon: Monitor, defaultTitle: t('advantages.tools'), defaultDesc: t('advantages.toolsDesc') },
  ];

  return (
    <Layout>
      <Seo titleKey="seo.advantages.title" descKey="seo.advantages.desc" path="/atouts" />
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <span className="inline-block px-4 py-2 bg-accent/90 text-accent-foreground text-sm font-semibold rounded-full mb-6">{t('advantages.badge')}</span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              <EditableText contentKey="advantages_title" fallback={t('advantages.title')} label="Titre Atouts" />
            </h1>
            <p className="text-lg text-primary-foreground/90">
              <EditableText contentKey="advantages_description" fallback={t('advantages.description')} label="Description Atouts" multiline as="span" />
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-accent">
        <div className="container-custom">
          <div className="grid grid-cols-3 gap-8 text-center text-accent-foreground">
            <div ref={years.ref}><div className="font-heading text-4xl md:text-5xl font-bold">{years.count}+</div><div className="text-sm mt-1 opacity-80">{t('why.years')}</div></div>
            <div ref={clients.ref}><div className="font-heading text-4xl md:text-5xl font-bold">{clients.count}+</div><div className="text-sm mt-1 opacity-80">{t('why.clients')}</div></div>
            <div ref={satisfaction.ref}><div className="font-heading text-4xl md:text-5xl font-bold">{satisfaction.count}%</div><div className="text-sm mt-1 opacity-80">{t('why.satisfaction')}</div></div>
          </div>
        </div>
      </section>

      {/* Engagements */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">{t('advantages.engagements')}</motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-muted-foreground text-lg">{t('advantages.engagementsDesc')}</motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {engagements.map((item, index) => (
              <motion.div key={item.key} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ y: -5, scale: 1.02 }} className="group p-6 rounded-xl border border-border hover:border-accent/50 hover:shadow-lg bg-card transition-all duration-300">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 group-hover:rotate-6 transition-all duration-300">
                  <item.icon className="h-6 w-6 text-primary group-hover:text-accent transition-colors" />
                </div>
                <h3 className="font-heading text-xl font-bold text-card-foreground mb-2">
                  <EditableText contentKey={`engagement_${item.key}_title`} fallback={item.defaultTitle} label={`Engagement ${item.key} - Titre`} />
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  <EditableText contentKey={`engagement_${item.key}_desc`} fallback={item.defaultDesc} label={`Engagement ${item.key} - Description`} multiline as="span" />
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">{t('advantages.infrastructureTitle')}</motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-muted-foreground text-lg">{t('advantages.infrastructureDesc')}</motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {infrastructure.map((item, index) => (
              <motion.div key={item.key} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ scale: 1.05 }} className="bg-card rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300">
                <div className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-5">
                  <item.icon className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-heading text-lg font-bold text-card-foreground mb-2">
                  <EditableText contentKey={`infra_${item.key}_title`} fallback={item.defaultTitle} label={`Infrastructure ${item.key} - Titre`} />
                </h3>
                <p className="text-muted-foreground text-sm">
                  <EditableText contentKey={`infra_${item.key}_desc`} fallback={item.defaultDesc} label={`Infrastructure ${item.key} - Description`} multiline as="span" />
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary" />
        <div className="container-custom relative z-10 text-center">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            <EditableText contentKey="advantages_trust_cta" fallback={t('advantages.trustCta')} label="Titre CTA Atouts" />
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-primary-foreground/90 text-lg mb-8 max-w-2xl mx-auto">
            <EditableText contentKey="advantages_trust_desc" fallback={t('advantages.trustDesc')} label="Description CTA Atouts" multiline as="span" />
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <Button asChild variant="hero" size="xl">
              <Link to="/contact">{t('advantages.freeQuote')} <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default AdvantagesPage;
