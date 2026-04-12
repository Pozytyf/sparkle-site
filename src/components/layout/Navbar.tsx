import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, LogOut, Shield, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import LanguageSelector from '@/components/LanguageSelector';
import logo from '@/assets/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();
  const { user, isAdmin, signOut } = useAuth();

  const navLinks = [
    { name: t('nav.home.short'), path: '/' },
    { name: t('nav.about.short'), path: '/a-propos' },
    { name: t('nav.services.short'), path: '/services' },
    { name: t('nav.advantages.short'), path: '/atouts' },
    { name: t('nav.realisations.short'), path: '/realisations' },
    { name: t('nav.quote.short'), path: '/devis' },
    { name: t('nav.contact.short'), path: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setIsOpen(false), [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md shadow-md py-2'
          : 'bg-background/80 backdrop-blur-sm py-4'
      }`}
    >
      <div className="container-custom">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <motion.img src={logo} alt="HP Logistics" className="h-10 md:h-12" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-sm font-medium transition-colors duration-300 hover:text-accent ${
                  location.pathname === link.path ? 'text-accent' : 'text-foreground'
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div layoutId="navbar-indicator" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent rounded-full" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSelector />
            <a href="tel:+2250778750064" className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Phone className="h-4 w-4" />
              +225 07 87 50 60 64
            </a>
            {user ? (
              <>
                {isAdmin && (
                  <Button asChild variant="outline" size="sm">
                    <Link to="/admin"><Shield className="h-4 w-4 mr-1" /> Admin</Link>
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={signOut} className="gap-1">
                  <LogOut className="h-4 w-4" /> {t('auth.logout')}
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/login">{t('auth.login')}</Link>
                </Button>
                <Button asChild variant="accent" size="sm">
                  <Link to="/register">{t('auth.register')}</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <LanguageSelector />
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-foreground" aria-label="Toggle menu">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="lg:hidden overflow-hidden bg-background rounded-lg mt-4 shadow-lg">
              <div className="flex flex-col py-4">
                {navLinks.map((link, index) => (
                  <motion.div key={link.path} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                    <Link to={link.path} className={`px-6 py-3 text-base font-medium transition-colors block ${location.pathname === link.path ? 'text-accent bg-accent/10' : 'text-foreground hover:bg-muted'}`}>
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <div className="px-6 pt-4 flex flex-col gap-3">
                  <a href="tel:+2250778750064" className="flex items-center gap-2 text-foreground">
                    <Phone className="h-4 w-4" /> +225 07 87 50 60 64
                  </a>
                  {user ? (
                    <>
                      {isAdmin && (
                        <Button asChild variant="outline" className="w-full">
                          <Link to="/admin"><Shield className="h-4 w-4 mr-1" /> Admin</Link>
                        </Button>
                      )}
                      <Button variant="ghost" className="w-full" onClick={signOut}>
                        <LogOut className="h-4 w-4 mr-1" /> {t('auth.logout')}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild variant="ghost" className="w-full">
                        <Link to="/login">{t('auth.login')}</Link>
                      </Button>
                      <Button asChild variant="accent" className="w-full">
                        <Link to="/register">{t('auth.register')}</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;
