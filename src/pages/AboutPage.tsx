import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, Eye, CheckCircle, Users } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteContent } from '@/hooks/useSiteContent';
import { EditableText } from '@/components/cms/EditableText';
import { EditableImage } from '@/components/cms/EditableImage';
import warehouseImage from '@/assets/warehouse.jpg';

const AboutPage = () => {
  const { t } = useLanguage();
  const { c } = useSiteContent();

  const values = [
    { icon: CheckCircle, title: t('why.reliability.title'), description: t('why.reliability.desc') },
    { icon: Target, title: t('why.reactivity.title'), description: t('why.reactivity.desc') },
    { icon: Eye, title: t('why.transparency.title'), description: t('why.transparency.desc') },
    { icon: Users, title: t('why.proximity.title'), description: t('why.proximity.desc') },
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
            <span className="inline-block px-4 py-2 bg-accent/90 text-accent-foreground text-sm font-semibold rounded-full mb-6">{t('about.badge')}</span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              <EditableText contentKey="about_title" fallback={t('about.title')} label="Titre À Propos" />
            </h1>
            <p className="text-lg text-primary-foreground/90">{t('about.description')}</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
              <EditableImage
                contentKey="about_image"
                fallbackSrc={warehouseImage}
                alt="HP Logistics Warehouse"
                label="Image À Propos"
                className="relative rounded-2xl overflow-hidden shadow-xl group"
                imgClassName="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent pointer-events-none rounded-2xl" />
              <motion.div whileHover={{ scale: 1.05 }} className="absolute -bottom-6 -right-6 bg-accent text-accent-foreground rounded-2xl p-6 shadow-xl">
                <div className="font-heading text-4xl font-bold">10+</div>
                <div className="text-sm font-medium">{t('why.years')}</div>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">{t('about.story')}</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-3 mb-6">
                HP LOGISTICS – <span className="text-accent">{t('about.fullName')}</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed whitespace-pre-line">
                {c('about_content', '') ? (
                  <EditableText contentKey="about_content" fallback="" label="Contenu À Propos" multiline as="p" />
                ) : (
                  <>
                    <p>{t('about.content1')}</p>
                    <p>{t('about.content2')}</p>
                    <p>{t('about.content3')}</p>
                  </>
                )}
              </div>
              <Button asChild variant="default" size="lg" className="mt-8">
                <Link to="/contact">{t('nav.contactUs')} <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.span initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">{t('about.values')}</motion.span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="font-heading text-3xl md:text-4xl font-bold text-foreground">{t('about.valuesPillars')}</motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div key={value.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ y: -5 }} className="bg-card rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-bold text-card-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission/Vision */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ scale: 1.02 }} className="bg-primary rounded-2xl p-8 text-primary-foreground transition-transform">
              <div className="h-14 w-14 rounded-full bg-primary-foreground/20 flex items-center justify-center mb-6"><Target className="h-7 w-7" /></div>
              <h3 className="font-heading text-2xl font-bold mb-4">{t('about.mission')}</h3>
              <p className="text-primary-foreground/90 leading-relaxed">{t('about.missionContent')}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} whileHover={{ scale: 1.02 }} className="bg-accent rounded-2xl p-8 text-accent-foreground transition-transform">
              <div className="h-14 w-14 rounded-full bg-accent-foreground/20 flex items-center justify-center mb-6"><Eye className="h-7 w-7" /></div>
              <h3 className="font-heading text-2xl font-bold mb-4">{t('about.vision')}</h3>
              <p className="text-accent-foreground/90 leading-relaxed">{t('about.visionContent')}</p>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;
