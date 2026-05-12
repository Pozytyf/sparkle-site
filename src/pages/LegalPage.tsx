import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const LegalPage = () => {
  const { t } = useLanguage();
  return (
    <Layout>
      <Seo titleKey="seo.legal.title" descKey="seo.legal.desc" path="/mentions-legales" />
      <section className="section-padding bg-background pt-32">
        <div className="container-custom max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">{t('legal.badge')}</span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mt-3 mb-8">{t('legal.title')}</h1>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
              <section>
                <h2 className="font-heading text-2xl text-foreground">{t('legal.editor.title')}</h2>
                <p className="whitespace-pre-line">{t('legal.editor.body')}</p>
              </section>
              <section>
                <h2 className="font-heading text-2xl text-foreground">{t('legal.hosting.title')}</h2>
                <p className="whitespace-pre-line">{t('legal.hosting.body')}</p>
              </section>
              <section>
                <h2 className="font-heading text-2xl text-foreground">{t('legal.ip.title')}</h2>
                <p>{t('legal.ip.body')}</p>
              </section>
              <section>
                <h2 className="font-heading text-2xl text-foreground">{t('legal.liability.title')}</h2>
                <p>{t('legal.liability.body')}</p>
              </section>
              <section>
                <h2 className="font-heading text-2xl text-foreground">{t('legal.law.title')}</h2>
                <p>{t('legal.law.body')}</p>
              </section>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default LegalPage;
