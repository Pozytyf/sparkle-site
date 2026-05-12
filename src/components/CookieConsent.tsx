import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Cookie, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const STORAGE_KEY = 'hp-cookie-consent';

export type ConsentValue = 'accepted' | 'refused';

export const getCookieConsent = (): ConsentValue | null => {
  if (typeof window === 'undefined') return null;
  const v = localStorage.getItem(STORAGE_KEY);
  return v === 'accepted' || v === 'refused' ? v : null;
};

const CookieConsent = () => {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getCookieConsent()) {
      const id = window.setTimeout(() => setVisible(true), 600);
      return () => window.clearTimeout(id);
    }
  }, []);

  const handle = (value: ConsentValue) => {
    localStorage.setItem(STORAGE_KEY, value);
    localStorage.setItem(`${STORAGE_KEY}-date`, new Date().toISOString());
    setVisible(false);
    window.dispatchEvent(new CustomEvent('cookie-consent-change', { detail: value }));
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ type: 'spring', stiffness: 220, damping: 26 }}
          role="dialog"
          aria-live="polite"
          aria-label={t('cookies.title')}
          className="fixed bottom-4 left-4 right-4 md:left-6 md:right-6 z-[60] mx-auto max-w-3xl rounded-2xl border border-border/60 bg-background/95 backdrop-blur-xl shadow-2xl p-4 md:p-5"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="hidden md:flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                <Cookie className="h-5 w-5" />
              </div>
              <div className="text-sm text-muted-foreground">
                <p className="font-semibold text-foreground mb-1">{t('cookies.title')}</p>
                <p>
                  {t('cookies.description')}{' '}
                  <Link to="/confidentialite" className="text-accent hover:underline font-medium">
                    {t('cookies.learnMore')}
                  </Link>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:flex-shrink-0">
              <Button variant="outline" size="sm" onClick={() => handle('refused')}>
                {t('cookies.refuse')}
              </Button>
              <Button variant="accent" size="sm" onClick={() => handle('accepted')}>
                {t('cookies.accept')}
              </Button>
              <button
                onClick={() => handle('refused')}
                aria-label={t('cookies.close')}
                className="ml-1 rounded-md p-1.5 text-muted-foreground hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
