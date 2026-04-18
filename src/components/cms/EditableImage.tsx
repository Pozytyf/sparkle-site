import { useRef, useState } from 'react';
import { Pencil, Loader2, Upload } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { setSiteContent, useSiteContent } from '@/hooks/useSiteContent';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EditableImageProps {
  contentKey: string;
  fallbackSrc: string;
  alt: string;
  label?: string;
  className?: string;
  imgClassName?: string;
}

export const EditableImage = ({ contentKey, fallbackSrc, alt, label, className = '', imgClassName = '' }: EditableImageProps) => {
  const { isAdmin } = useAuth();
  const { c } = useSiteContent();
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const src = c(contentKey, '') || fallbackSrc;

  const onPick = () => inputRef.current?.click();

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `cms/${contentKey}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('site-images').upload(path, file);
      if (error) throw error;
      const { data: urlData } = supabase.storage.from('site-images').getPublicUrl(path);
      await setSiteContent(contentKey, urlData.publicUrl, label);
      toast({ title: 'Image mise à jour' });
    } catch (err: any) {
      toast({ title: 'Erreur', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className={`relative group/edit ${className}`}>
      <img src={src} alt={alt} className={imgClassName} />
      {isAdmin && (
        <>
          <button
            type="button"
            onClick={onPick}
            disabled={uploading}
            className="absolute top-2 right-2 z-10 opacity-0 group-hover/edit:opacity-100 transition-opacity inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-accent text-accent-foreground shadow-lg hover:scale-105 text-xs font-semibold"
          >
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            {uploading ? 'Upload...' : 'Changer image'}
          </button>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onUpload} />
        </>
      )}
    </div>
  );
};

export default EditableImage;
