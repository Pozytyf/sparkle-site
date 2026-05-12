import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import AlbumGrid from '@/components/realisations/AlbumGrid';
import AlbumDetail from '@/components/realisations/AlbumDetail';
import ParallaxHero from '@/components/ParallaxHero';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { EditableText } from '@/components/cms/EditableText';

interface Album {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  cover_image_url: string | null;
  photo_count: number;
}

const RealisationsPage = () => {
  const { t } = useLanguage();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      const { data: albumsData } = await supabase
        .from('albums')
        .select('*')
        .order('created_at', { ascending: false });

      if (albumsData) {
        // Get photo counts
        const albumsWithCounts = await Promise.all(
          albumsData.map(async (album) => {
            const { count } = await supabase
              .from('album_photos')
              .select('id', { count: 'exact', head: true })
              .eq('album_id', album.id);
            return { ...album, photo_count: count || 0 };
          })
        );
        setAlbums(albumsWithCounts as Album[]);
      }
      setLoading(false);
    };
    fetchAlbums();
  }, []);

  return (
    <Layout>
      <Seo titleKey="seo.realisations.title" descKey="seo.realisations.desc" path="/realisations" />
      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-accent/90 text-accent-foreground text-sm font-semibold rounded-full mb-6">
              <Camera className="h-4 w-4" />
              <EditableText contentKey="realisations_badge" fallback={t('realisations.badge')} label="Badge Réalisations" />
            </span>
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
              <EditableText contentKey="realisations_title" fallback={t('realisations.title')} label="Titre Réalisations" />
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl">
              <EditableText
                contentKey="realisations_description"
                fallback={t('realisations.description')}
                label="Description Réalisations" multiline as="span"
              />
            </p>
          </motion.div>
        </div>
      </section>

      {/* Albums Section */}
      <section className="section-padding">
        <div className="container-custom">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden">
                  <Skeleton className="aspect-[4/3]" />
                  <div className="p-5 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : albums.length === 0 ? (
            <div className="text-center py-20">
              <Camera className="h-20 w-20 mx-auto text-muted-foreground/30 mb-6" />
              <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                {t('realisations.comingSoon')}
              </h2>
              <p className="text-muted-foreground">
                {t('realisations.comingSoonDesc')}
              </p>
            </div>
          ) : (
            <AlbumGrid
              albums={albums}
              onAlbumClick={(id) => {
                const album = albums.find((a) => a.id === id);
                if (album) setSelectedAlbum({ id, title: album.title });
              }}
            />
          )}
        </div>
      </section>

      {/* Album Detail */}
      <AnimatePresence>
        {selectedAlbum && (
          <AlbumDetail
            albumId={selectedAlbum.id}
            albumTitle={selectedAlbum.title}
            onClose={() => setSelectedAlbum(null)}
          />
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default RealisationsPage;
