import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';

interface Photo {
  id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
}

interface AlbumDetailProps {
  albumId: string;
  albumTitle: string;
  onClose: () => void;
}

const AlbumDetail = ({ albumId, albumTitle, onClose }: AlbumDetailProps) => {
  const { t } = useLanguage();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      const { data } = await supabase
        .from('album_photos')
        .select('*')
        .eq('album_id', albumId)
        .order('sort_order');
      setPhotos((data as Photo[]) || []);
      setLoading(false);
    };
    fetchPhotos();
  }, [albumId]);

  const navigate = useCallback((dir: 1 | -1) => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      const next = prev + dir;
      if (next < 0) return photos.length - 1;
      if (next >= photos.length) return 0;
      return next;
    });
  }, [lightboxIndex, photos.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxIndex !== null) setLightboxIndex(null);
        else onClose();
      }
      if (e.key === 'ArrowRight') navigate(1);
      if (e.key === 'ArrowLeft') navigate(-1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, navigate, onClose]);

  return (
    <>
      {/* Album Detail Modal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-y-auto"
      >
        <div className="container-custom py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <button onClick={onClose} className="text-sm text-muted-foreground hover:text-accent transition-colors mb-2 flex items-center gap-1">
                <ChevronLeft className="h-4 w-4" /> {t('common.back')}
              </button>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">{albumTitle}</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors">
              <X className="h-6 w-6 text-foreground" />
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => <Skeleton key={i} className="aspect-square rounded-xl" />)}
            </div>
          ) : photos.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Camera className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p>{t('album.empty')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="group cursor-pointer rounded-xl overflow-hidden aspect-square relative"
                  onClick={() => setLightboxIndex(index)}
                >
                  <img
                    src={photo.image_url}
                    alt={photo.caption || albumTitle}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {photo.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-primary-foreground text-xs">{photo.caption}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && photos[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white z-10"
              onClick={() => setLightboxIndex(null)}
            >
              <X className="h-8 w-8" />
            </button>

            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); navigate(-1); }}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); navigate(1); }}
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={photos[lightboxIndex].image_url}
              alt={photos[lightboxIndex].caption || ''}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
              {photos[lightboxIndex].caption && (
                <p className="text-white/90 text-sm mb-2">{photos[lightboxIndex].caption}</p>
              )}
              <p className="text-white/50 text-xs">{lightboxIndex + 1} / {photos.length}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AlbumDetail;
