import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const PrivacyPage = () => {
  const { t } = useLanguage();
  return (
    <Layout>
      <Seo titleKey="seo.privacy.title" descKey="seo.privacy.desc" path="/confidentialite" />
      <section className="section-padding bg-background pt-32">
        <div className="container-custom max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">{t('privacy.badge')}</span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mt-3 mb-8">{t('privacy.title')}</h1>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
              <p className="whitespace-pre-line">{t('privacy.intro')}</p>
              <section>
                <h2 className="font-heading text-2xl text-foreground">{t('privacy.collect.title')}</h2>
                <p className="whitespace-pre-line">{t('privacy.collect.body')}</p>
              </section>
              <section>
                <h2 className="font-heading text-2xl text-foreground">{t('privacy.use.title')}</h2>
                <p className="whitespace-pre-line">{t('privacy.use.body')}</p>
              </section>
              <section>
                <h2 className="font-heading text-2xl text-foreground">{t('privacy.cookies.title')}</h2>
                <p>{t('privacy.cookies.body')}</p>
              </section>
              <section>
                <h2 className="font-heading text-2xl text-foreground">{t('privacy.rights.title')}</h2>
                <p className="whitespace-pre-line">{t('privacy.rights.body')}</p>
              </section>
              <section>
                <h2 className="font-heading text-2xl text-foreground">{t('privacy.contact.title')}</h2>
                <p>{t('privacy.contact.body')}</p>
              </section>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default PrivacyPage;
