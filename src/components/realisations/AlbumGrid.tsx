import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AlbumCard from './AlbumCard';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface Album {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  cover_image_url: string | null;
  photo_count: number;
}

interface AlbumGridProps {
  albums: Album[];
  onAlbumClick: (id: string) => void;
}

const categories = [
  { key: 'all', tKey: 'album.cat.all' },
  { key: 'chantier', tKey: 'album.cat.chantier' },
  { key: 'transport', tKey: 'album.cat.transport' },
  { key: 'entrepot', tKey: 'album.cat.entrepot' },
  { key: 'installation', tKey: 'album.cat.installation' },
  { key: 'livraison', tKey: 'album.cat.livraison' },
];

const AlbumGrid = ({ albums, onAlbumClick }: AlbumGridProps) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const { t } = useLanguage();

  const filtered = activeCategory === 'all'
    ? albums
    : albums.filter((a) => a.category === activeCategory);

  return (
    <div>
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {categories.map((cat) => (
          <Button
            key={cat.key}
            variant={activeCategory === cat.key ? 'accent' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory(cat.key)}
            className="rounded-full"
          >
            {t(cat.tKey)}
          </Button>
        ))}
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-16 text-muted-foreground">
              {t('album.empty.category')}
            </div>
          ) : (
            filtered.map((album) => (
              <AlbumCard
                key={album.id}
                id={album.id}
                title={album.title}
                description={album.description}
                category={album.category}
                coverImageUrl={album.cover_image_url}
                photoCount={album.photo_count}
                onClick={() => onAlbumClick(album.id)}
              />
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AlbumGrid;
