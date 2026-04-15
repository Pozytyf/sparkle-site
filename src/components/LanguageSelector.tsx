import { useLanguage } from '@/contexts/LanguageContext';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();
  const next = language === 'fr' ? 'en' : 'fr';

  return (
    <button
      onClick={() => setLanguage(next)}
      className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors duration-200 px-1.5 py-0.5 rounded border border-border hover:border-accent"
    >
      {next === 'en' ? 'EN' : 'FR'}
    </button>
  );
};

export default LanguageSelector;
