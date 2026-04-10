import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, ImagePlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface AlbumFormProps {
  onSuccess: () => void;
}

const categoryOptions = [
  { value: 'chantier', label: 'Chantier' },
  { value: 'transport', label: 'Transport' },
  { value: 'entrepot', label: 'Entrepôt' },
  { value: 'installation', label: 'Installation' },
  { value: 'livraison', label: 'Livraison' },
];

const AlbumForm = ({ onSuccess }: AlbumFormProps) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('chantier');
  const [files, setFiles] = useState<File[]>([]);
  const [coverIndex, setCoverIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...newFiles]);
    const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    if (coverIndex === index) setCoverIndex(0);
    else if (coverIndex > index) setCoverIndex((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast({ title: 'Erreur', description: 'Le titre est requis.', variant: 'destructive' });
      return;
    }
    if (files.length === 0) {
      toast({ title: 'Erreur', description: 'Ajoutez au moins une photo.', variant: 'destructive' });
      return;
    }

    setUploading(true);
    try {
      // Upload all images
      const uploadedUrls: string[] = [];
      for (const file of files) {
        const ext = file.name.split('.').pop();
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage.from('album-images').upload(path, file);
        if (error) throw error;
        const { data: urlData } = supabase.storage.from('album-images').getPublicUrl(path);
        uploadedUrls.push(urlData.publicUrl);
      }

      // Create album
      const { data: album, error: albumError } = await supabase
        .from('albums')
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          category,
          cover_image_url: uploadedUrls[coverIndex] || uploadedUrls[0],
        })
        .select('id')
        .single();

      if (albumError) throw albumError;

      // Insert photos
      const photos = uploadedUrls.map((url, i) => ({
        album_id: album.id,
        image_url: url,
        sort_order: i,
      }));
      const { error: photosError } = await supabase.from('album_photos').insert(photos);
      if (photosError) throw photosError;

      toast({ title: 'Album créé !', description: `"${title}" a été ajouté avec ${files.length} photo(s).` });
      setTitle('');
      setDescription('');
      setCategory('chantier');
      setFiles([]);
      previews.forEach(URL.revokeObjectURL);
      setPreviews([]);
      setCoverIndex(0);
      onSuccess();
    } catch (err: any) {
      toast({ title: 'Erreur', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 space-y-5">
      <h3 className="font-heading text-lg font-bold text-foreground">Nouvel album</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input placeholder="Titre de l'album *" value={title} onChange={(e) => setTitle(e.target.value)} />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {categoryOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <Textarea placeholder="Description (optionnel)" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />

      {/* File upload */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFiles}
        />
        <Button
          variant="outline"
          className="w-full border-dashed border-2 h-20 gap-2"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImagePlus className="h-5 w-5" />
          Ajouter des photos
        </Button>
      </div>

      {/* Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {previews.map((src, i) => (
            <div
              key={i}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                coverIndex === i ? 'border-accent ring-2 ring-accent/30' : 'border-border hover:border-accent/50'
              }`}
              onClick={() => setCoverIndex(i)}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
              {coverIndex === i && (
                <span className="absolute top-1 left-1 bg-accent text-accent-foreground text-[10px] font-bold px-1.5 py-0.5 rounded">
                  Couverture
                </span>
              )}
              <button
                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity"
                onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                style={{ opacity: 1 }}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Button variant="accent" className="w-full gap-2" onClick={handleSubmit} disabled={uploading}>
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        {uploading ? 'Création en cours...' : 'Créer l\'album'}
      </Button>
    </div>
  );
};

export default AlbumForm;
