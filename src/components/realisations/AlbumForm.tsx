import { useState, useRef, useEffect } from 'react';
import { Upload, X, ImagePlus, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ExistingPhoto {
  id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
}

interface AlbumFormProps {
  onSuccess: () => void;
  editAlbum?: {
    id: string;
    title: string;
    description: string | null;
    category: string | null;
    cover_image_url: string | null;
  } | null;
  onCancelEdit?: () => void;
}

const categoryOptions = [
  { value: 'chantier', label: 'Chantier' },
  { value: 'transport', label: 'Transport' },
  { value: 'entrepot', label: 'Entrepôt' },
  { value: 'installation', label: 'Installation' },
  { value: 'livraison', label: 'Livraison' },
];

const AlbumForm = ({ onSuccess, editAlbum, onCancelEdit }: AlbumFormProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('chantier');
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<ExistingPhoto[]>([]);
  const [photosToRemove, setPhotosToRemove] = useState<string[]>([]);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Load edit data
  useEffect(() => {
    if (editAlbum) {
      setTitle(editAlbum.title);
      setDescription(editAlbum.description || '');
      setCategory(editAlbum.category || 'chantier');
      setCoverUrl(editAlbum.cover_image_url);
      // Load existing photos
      supabase
        .from('album_photos')
        .select('*')
        .eq('album_id', editAlbum.id)
        .order('sort_order')
        .then(({ data }) => setExistingPhotos((data as ExistingPhoto[]) || []));
    } else {
      resetForm();
    }
  }, [editAlbum]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('chantier');
    setNewFiles([]);
    newPreviews.forEach(URL.revokeObjectURL);
    setNewPreviews([]);
    setExistingPhotos([]);
    setPhotosToRemove([]);
    setCoverUrl(null);
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewFiles((prev) => [...prev, ...files]);
    setNewPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeNewFile = (index: number) => {
    URL.revokeObjectURL(newPreviews[index]);
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const markExistingForRemoval = (photoId: string) => {
    setPhotosToRemove((prev) => [...prev, photoId]);
  };

  const undoRemoval = (photoId: string) => {
    setPhotosToRemove((prev) => prev.filter((id) => id !== photoId));
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast({ title: 'Erreur', description: 'Le titre est requis.', variant: 'destructive' });
      return;
    }

    const visibleExisting = existingPhotos.filter((p) => !photosToRemove.includes(p.id));
    if (!editAlbum && newFiles.length === 0) {
      toast({ title: 'Erreur', description: 'Ajoutez au moins une photo.', variant: 'destructive' });
      return;
    }

    setUploading(true);
    try {
      // Upload new images
      const uploadedUrls: string[] = [];
      for (const file of newFiles) {
        const ext = file.name.split('.').pop();
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage.from('album-images').upload(path, file);
        if (error) throw error;
        const { data: urlData } = supabase.storage.from('album-images').getPublicUrl(path);
        uploadedUrls.push(urlData.publicUrl);
      }

      // Determine cover
      const finalCover = coverUrl || visibleExisting[0]?.image_url || uploadedUrls[0] || null;

      if (editAlbum) {
        // Update album
        await supabase.from('albums').update({
          title: title.trim(),
          description: description.trim() || null,
          category,
          cover_image_url: finalCover,
        }).eq('id', editAlbum.id);

        // Remove marked photos
        if (photosToRemove.length > 0) {
          await supabase.from('album_photos').delete().in('id', photosToRemove);
        }

        // Add new photos
        if (uploadedUrls.length > 0) {
          const maxSort = Math.max(0, ...visibleExisting.map((p) => p.sort_order));
          const newPhotos = uploadedUrls.map((url, i) => ({
            album_id: editAlbum.id,
            image_url: url,
            sort_order: maxSort + i + 1,
          }));
          await supabase.from('album_photos').insert(newPhotos);
        }

        toast({ title: 'Album modifié !', description: `"${title}" a été mis à jour.` });
      } else {
        // Create album
        const { data: album, error: albumError } = await supabase
          .from('albums')
          .insert({
            title: title.trim(),
            description: description.trim() || null,
            category,
            cover_image_url: uploadedUrls[0] || null,
          })
          .select('id')
          .single();
        if (albumError) throw albumError;

        const photos = uploadedUrls.map((url, i) => ({
          album_id: album.id,
          image_url: url,
          sort_order: i,
        }));
        await supabase.from('album_photos').insert(photos);
        toast({ title: 'Album créé !', description: `"${title}" a été ajouté avec ${newFiles.length} photo(s).` });
      }

      resetForm();
      onSuccess();
      onCancelEdit?.();
    } catch (err: any) {
      toast({ title: 'Erreur', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const isEditing = !!editAlbum;
  const visibleExisting = existingPhotos.filter((p) => !photosToRemove.includes(p.id));
  const removedExisting = existingPhotos.filter((p) => photosToRemove.includes(p.id));

  return (
    <div className="bg-card rounded-2xl border border-border p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-bold text-foreground">
          {isEditing ? `Modifier : ${editAlbum.title}` : 'Nouvel album'}
        </h3>
        {isEditing && onCancelEdit && (
          <Button variant="ghost" size="sm" onClick={() => { resetForm(); onCancelEdit(); }}>Annuler</Button>
        )}
      </div>

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

      {/* Existing photos (edit mode) */}
      {isEditing && visibleExisting.length > 0 && (
        <div>
          <p className="text-sm font-medium text-foreground mb-2">Photos existantes ({visibleExisting.length})</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {visibleExisting.map((photo) => (
              <div
                key={photo.id}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                  coverUrl === photo.image_url ? 'border-accent ring-2 ring-accent/30' : 'border-border hover:border-accent/50'
                }`}
                onClick={() => setCoverUrl(photo.image_url)}
              >
                <img src={photo.image_url} alt="" className="w-full h-full object-cover" />
                {coverUrl === photo.image_url && (
                  <span className="absolute top-1 left-1 bg-accent text-accent-foreground text-[10px] font-bold px-1.5 py-0.5 rounded">Couverture</span>
                )}
                <button
                  className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
                  onClick={(e) => { e.stopPropagation(); markExistingForRemoval(photo.id); }}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Removed photos (undo) */}
      {removedExisting.length > 0 && (
        <div className="text-sm text-muted-foreground">
          {removedExisting.length} photo(s) à supprimer.{' '}
          <button className="text-accent underline" onClick={() => setPhotosToRemove([])}>Annuler tout</button>
        </div>
      )}

      {/* File upload */}
      <div>
        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
        <Button variant="outline" className="w-full border-dashed border-2 h-16 gap-2" onClick={() => fileInputRef.current?.click()}>
          <ImagePlus className="h-5 w-5" /> Ajouter des photos
        </Button>
      </div>

      {/* New file previews */}
      {newPreviews.length > 0 && (
        <div>
          <p className="text-sm font-medium text-foreground mb-2">Nouvelles photos ({newPreviews.length})</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {newPreviews.map((src, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden border-2 border-border">
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button
                  className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
                  onClick={() => removeNewFile(i)}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button variant="accent" className="w-full gap-2" onClick={handleSubmit} disabled={uploading}>
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : isEditing ? <Save className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
        {uploading ? (isEditing ? 'Modification...' : 'Création...') : isEditing ? 'Enregistrer les modifications' : 'Créer l\'album'}
      </Button>
    </div>
  );
};

export default AlbumForm;
