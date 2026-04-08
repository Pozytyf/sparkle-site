import { motion } from 'framer-motion';
import { Shield, Clock, Users, CheckCircle, Headphones, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCountUp } from '@/hooks/useCountUp';

const WhyChooseUs = () => {
  const { t } = useLanguage();
  const years = useCountUp(10, 2000);
  const clients = useCountUp(500, 2500);
  const satisfaction = useCountUp(98, 2000);

  const features = [
    { icon: Clock, title: t('why.reactivity.title'), description: t('why.reactivity.desc') },
    { icon: Shield, title: t('why.reliability.title'), description: t('why.reliability.desc') },
    { icon: CheckCircle, title: t('why.transparency.title'), description: t('why.transparency.desc') },
    { icon: Users, title: t('why.proximity.title'), description: t('why.proximity.desc') },
    { icon: Headphones, title: t('why.support.title'), description: t('why.support.desc') },
    { icon: Globe, title: t('why.network.title'), description: t('why.network.desc') },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4"
            >
              {t('why.badge')}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6"
            >
              {t('why.title1')} <span className="text-accent">{t('why.title2')}</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg leading-relaxed mb-8"
            >
              {t('why.description')}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-8"
            >
              <div className="text-center" ref={years.ref}>
                <div className="font-heading text-4xl font-bold text-primary">{years.count}+</div>
                <div className="text-sm text-muted-foreground">{t('why.years')}</div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="text-center" ref={clients.ref}>
                <div className="font-heading text-4xl font-bold text-primary">{clients.count}+</div>
                <div className="text-sm text-muted-foreground">{t('why.clients')}</div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="text-center" ref={satisfaction.ref}>
                <div className="font-heading text-4xl font-bold text-primary">{satisfaction.count}%</div>
                <div className="text-sm text-muted-foreground">{t('why.satisfaction')}</div>
              </div>
            </motion.div>
          </div>

          {/* Right Grid with stagger */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                className="group p-5 rounded-xl border border-border hover:border-accent/50 hover:bg-accent/5 transition-all duration-300 hover:shadow-lg"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 group-hover:rotate-6 transition-all duration-300">
                  <feature.icon className="h-5 w-5 text-primary group-hover:text-accent transition-colors" />
                </div>
                <h3 className="font-heading font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
