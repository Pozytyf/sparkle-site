import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SeoProps {
  titleKey: string;
  descKey: string;
  path?: string;
  image?: string;
}

const SITE = 'https://hp-logistics.net';
const BRAND = 'HP LOGISTICS';

const setMeta = (selector: string, attr: string, value: string) => {
  let el = document.head.querySelector<HTMLMetaElement | HTMLLinkElement>(selector);
  if (!el) {
    if (selector.startsWith('link')) {
      el = document.createElement('link');
      (el as HTMLLinkElement).rel = selector.match(/rel="([^"]+)"/)?.[1] || '';
    } else {
      el = document.createElement('meta');
      const name = selector.match(/name="([^"]+)"/)?.[1];
      const prop = selector.match(/property="([^"]+)"/)?.[1];
      if (name) (el as HTMLMetaElement).name = name;
      if (prop) el.setAttribute('property', prop);
    }
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
};

const Seo = ({ titleKey, descKey, path = '/', image }: SeoProps) => {
  const { t, language } = useLanguage();

  useEffect(() => {
    const title = `${t(titleKey)} — ${BRAND}`;
    const desc = t(descKey);
    const url = `${SITE}${path}`;
    document.title = title;
    document.documentElement.lang = language;
    setMeta('meta[name="description"]', 'content', desc);
    setMeta('link[rel="canonical"]', 'href', url);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', desc);
    setMeta('meta[property="og:url"]', 'content', url);
    setMeta('meta[property="og:type"]', 'content', 'website');
    setMeta('meta[property="og:locale"]', 'content', language === 'fr' ? 'fr_FR' : 'en_US');
    if (image) setMeta('meta[property="og:image"]', 'content', image);
    setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', desc);
  }, [titleKey, descKey, path, image, language, t]);

  return null;
};

export default Seo;
