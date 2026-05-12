import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Linkedin, Twitter } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteContent } from '@/hooks/useSiteContent';
import logo from '@/assets/logo.png';

const Footer = () => {
  const { t } = useLanguage();
  const { c } = useSiteContent();

  const quickLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about'), path: '/a-propos' },
    { name: t('nav.services'), path: '/services' },
    { name: t('nav.advantages'), path: '/atouts' },
    { name: t('nav.realisations'), path: '/realisations' },
    { name: t('nav.quote'), path: '/devis' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  const serviceLinks = [
    t('services.road.title'),
    t('services.air.title'),
    t('services.maritime.title'),
    t('services.rail.title'),
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div className="space-y-4">
            <img src={logo} alt="HP Logistics" className="h-10 brightness-0 invert" />
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              {c('footer_description', t('footer.description'))}
            </p>
            <div className="flex gap-4 pt-2">
              {[
                { icon: Facebook, href: c('footer_facebook', 'https://www.facebook.com/hplogistics'), label: 'Facebook' },
                { icon: Linkedin, href: c('footer_linkedin', '#'), label: 'LinkedIn' },
                { icon: Twitter, href: c('footer_instagram', '#'), label: 'Twitter' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:scale-110 transition-all duration-300"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6">{t('footer.quickLinks')}</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-primary-foreground/80 hover:text-accent transition-colors text-sm hover:translate-x-1 inline-block duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6">{t('footer.ourServices')}</h4>
            <ul className="space-y-3">
              {serviceLinks.map((service) => (
                <li key={service}>
                  <Link to="/services" className="text-primary-foreground/80 hover:text-accent transition-colors text-sm hover:translate-x-1 inline-block duration-200">
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6">{t('footer.contact')}</h4>
            <div className="space-y-4">
              <div className="flex gap-3 text-sm">
                <MapPin className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-primary-foreground/80">
                  Abidjan Marcory, Allée Oumé<br />Côte d'Ivoire
                </span>
              </div>
              <div className="flex gap-3 text-sm">
                <Phone className="h-5 w-5 text-accent flex-shrink-0" />
                <div className="text-primary-foreground/80">
                  <a href="tel:+2252721394397" className="hover:text-accent transition-colors block">+225 27 21 39 43 97</a>
                  <a href="tel:+2250787506064" className="hover:text-accent transition-colors block">+225 07 87 50 60 64</a>
                </div>
              </div>
              <div className="flex gap-3 text-sm">
                <Mail className="h-5 w-5 text-accent flex-shrink-0" />
                <a href="mailto:info@hp-logistics.net" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  info@hp-logistics.net
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container-custom py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} HP LOGISTICS. {t('footer.rights')}
          </p>
          <div className="flex gap-6">
            <Link to="/confidentialite" className="text-primary-foreground/60 hover:text-accent text-sm transition-colors">{t('footer.privacy')}</Link>
            <Link to="/mentions-legales" className="text-primary-foreground/60 hover:text-accent text-sm transition-colors">{t('footer.legal')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
