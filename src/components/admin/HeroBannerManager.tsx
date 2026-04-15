import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface HeroSlide {
  id: string;
  image_url: string;
  title?: string;
  sort_order: number;
}

const HeroBannerManager = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchSlides = async () => {
    const { data } = await supabase
      .from('hero_slides')
      .select('*')
      .order('sort_order');
    setSlides(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchSlides(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split('.').pop();
      const path = `hero/${Date.now()}-${i}.${ext}`;

      const { error } = await supabase.storage.from('site-images').upload(path, file);
      if (error) {
        toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
        continue;
      }

      const { data: urlData } = supabase.storage.from('site-images').getPublicUrl(path);
      await supabase.from('hero_slides').insert({
        image_url: urlData.publicUrl,
        title: file.name.replace(/\.[^/.]+$/, ''),
        sort_order: slides.length + i,
      });
    }

    toast({ title: 'Images ajoutées' });
    setUploading(false);
    fetchSlides();
    e.target.value = '';
  };

  const handleDelete = async (id: string) => {
    await supabase.from('hero_slides').delete().eq('id', id);
    toast({ title: 'Image supprimée' });
    fetchSlides();
  };

  const handleUrlAdd = async (url: string) => {
    if (!url.trim()) return;
    await supabase.from('hero_slides').insert({
      image_url: url.trim(),
      sort_order: slides.length,
    });
    toast({ title: 'Image ajoutée' });
    fetchSlides();
  };

  const moveSlide = async (id: string, direction: 'up' | 'down') => {
    const idx = slides.findIndex(s => s.id === id);
    if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === slides.length - 1)) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    await Promise.all([
      supabase.from('hero_slides').update({ sort_order: slides[swapIdx].sort_order }).eq('id', slides[idx].id),
      supabase.from('hero_slides').update({ sort_order: slides[idx].sort_order }).eq('id', slides[swapIdx].id),
    ]);
    fetchSlides();
  };

  const [urlInput, setUrlInput] = useState('');

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="font-heading text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-accent" />
          Images de la bannière Hero
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Gérez les images du carrousel de la page d'accueil. Ajoutez, supprimez ou réorganisez les slides.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <label className="cursor-pointer flex items-center gap-2 text-sm border-2 border-dashed border-accent/30 rounded-lg px-6 py-3 hover:bg-accent/5 transition-colors text-accent font-medium">
            <Upload className="h-5 w-5" />
            {uploading ? 'Upload en cours...' : 'Uploader des images'}
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Ou collez une URL d'image..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1"
          />
          <Button variant="accent" size="sm" onClick={() => { handleUrlAdd(urlInput); setUrlInput(''); }}>
            Ajouter
          </Button>
        </div>
      </div>

      {/* Current slides */}
      <div className="space-y-3">
        <h4 className="font-heading font-bold text-foreground">
          Slides actuels ({slides.length})
        </h4>
        {slides.length === 0 && !loading && (
          <div className="bg-muted/50 rounded-xl p-8 text-center text-muted-foreground">
            <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p>Aucune image. Les images par défaut seront utilisées.</p>
          </div>
        )}
        {slides.map((slide, idx) => (
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl p-3 border border-border flex items-center gap-4"
          >
            <div className="flex flex-col gap-1">
              <button
                onClick={() => moveSlide(slide.id, 'up')}
                disabled={idx === 0}
                className="text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
              >
                ▲
              </button>
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <button
                onClick={() => moveSlide(slide.id, 'down')}
                disabled={idx === slides.length - 1}
                className="text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
              >
                ▼
              </button>
            </div>
            <img
              src={slide.image_url}
              alt={slide.title || `Slide ${idx + 1}`}
              className="h-20 w-32 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{slide.title || `Slide ${idx + 1}`}</p>
              <p className="text-xs text-muted-foreground truncate">{slide.image_url}</p>
            </div>
            <Button variant="destructive" size="sm" onClick={() => handleDelete(slide.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HeroBannerManager;
