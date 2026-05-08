import { motion } from 'framer-motion';
import { Camera, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AlbumCardProps {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  coverImageUrl: string | null;
  photoCount: number;
  onClick: () => void;
}

const AlbumCard = ({ title, description, category, coverImageUrl, photoCount, onClick }: AlbumCardProps) => {
  const { t } = useLanguage();
  const categoryLabel = category ? t(`album.cat.${category}`) : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group cursor-pointer rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-xl transition-all duration-500"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Camera className="h-12 w-12 text-muted-foreground/40" />
          </div>
        )}
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
          <motion.div
            initial={false}
            className="flex items-center gap-2 bg-accent text-accent-foreground px-5 py-2.5 rounded-full font-semibold text-sm shadow-lg"
          >
            {t('album.view')} <ArrowRight className="h-4 w-4" />
          </motion.div>
        </div>
        {/* Category badge */}
        {category && (
          <span className="absolute top-3 left-3 bg-accent/90 text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
            {categoryLabel || category}
          </span>
        )}
        {/* Photo count */}
        <span className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-sm text-foreground text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5">
          <Camera className="h-3.5 w-3.5" /> {photoCount} {photoCount !== 1 ? t('album.photos') : t('album.photo')}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-heading text-lg font-bold text-card-foreground group-hover:text-accent transition-colors duration-300 line-clamp-1">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{description}</p>
        )}
      </div>
    </motion.div>
  );
};

export default AlbumCard;
