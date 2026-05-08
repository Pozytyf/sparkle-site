import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquareQuote, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Sticky CTA that fades in once the user has scrolled past the hero,
 * on every page except the contact / quote pages and the admin area.
 */
const StickyCTA = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { pathname } = useLocation();
  const { isAdmin } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Hide on routes where the CTA would be redundant or admin-only.
  const hiddenOn = ['/contact', '/devis', '/login', '/register', '/forgot-password', '/reset-password'];
  if (hiddenOn.includes(pathname) || pathname.startsWith('/admin')) return null;
  if (dismissed) return null;
  // Push admin draft bar down — don't double-stack
  const offset = isAdmin ? 'bottom-6' : 'bottom-6';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 220, damping: 22 }}
          className={`fixed ${offset} right-6 z-50 flex items-center gap-2`}
        >
          <Link
            to="/devis"
            className="group flex items-center gap-2 rounded-full bg-accent text-accent-foreground pl-4 pr-5 py-3 shadow-2xl shadow-accent/40 hover:scale-105 transition-transform"
          >
            <MessageSquareQuote className="h-5 w-5 group-hover:rotate-[-8deg] transition-transform" />
            <span className="font-semibold text-sm">{t('sticky.cta')}</span>
          </Link>
          <button
            onClick={() => setDismissed(true)}
            aria-label={t('sticky.close')}
            className="h-8 w-8 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground shadow-md flex items-center justify-center"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyCTA;
