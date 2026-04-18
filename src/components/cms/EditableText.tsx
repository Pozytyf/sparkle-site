import { useState, ReactNode } from 'react';
import { Pencil, Check, X, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { setSiteContent, useSiteContent } from '@/hooks/useSiteContent';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface EditableTextProps {
  contentKey: string;
  fallback?: string;
  multiline?: boolean;
  label?: string;
  as?: 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'h4';
  className?: string;
  children?: ReactNode; // optional override of rendered content
}

/**
 * Renders editable site content. When the user is admin, a small pencil
 * appears on hover; clicking it opens an inline editor. Updates are saved
 * to site_content and broadcast in realtime to all open tabs.
 */
export const EditableText = ({
  contentKey,
  fallback = '',
  multiline = false,
  label,
  as: Tag = 'span',
  className = '',
  children,
}: EditableTextProps) => {
  const { isAdmin } = useAuth();
  const { c } = useSiteContent();
  const { toast } = useToast();
  const value = c(contentKey, fallback);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);

  const startEdit = () => { setDraft(value); setEditing(true); };
  const cancel = () => setEditing(false);
  const save = async () => {
    setSaving(true);
    try {
      await setSiteContent(contentKey, draft, label);
      toast({ title: 'Modifié', description: label || contentKey });
      setEditing(false);
    } catch (e: any) {
      toast({ title: 'Erreur', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (editing && isAdmin) {
    return (
      <span className="inline-block w-full align-top relative z-50">
        {multiline ? (
          <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={4} className="text-sm" autoFocus />
        ) : (
          <Input value={draft} onChange={(e) => setDraft(e.target.value)} className="text-sm" autoFocus />
        )}
        <span className="flex gap-1 mt-1">
          <Button size="sm" variant="accent" onClick={save} disabled={saving} className="h-7 text-xs">
            {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
          </Button>
          <Button size="sm" variant="outline" onClick={cancel} disabled={saving} className="h-7 text-xs">
            <X className="h-3 w-3" />
          </Button>
        </span>
      </span>
    );
  }

  if (!isAdmin) {
    return <Tag className={className}>{children ?? value}</Tag>;
  }

  return (
    <Tag className={`${className} group/edit relative inline-block`}>
      {children ?? value}
      <button
        type="button"
        onClick={startEdit}
        title={`Modifier: ${label || contentKey}`}
        className="opacity-0 group-hover/edit:opacity-100 transition-opacity ml-2 inline-flex items-center justify-center h-6 w-6 rounded-md bg-accent text-accent-foreground shadow-md hover:scale-110 align-middle"
      >
        <Pencil className="h-3 w-3" />
      </button>
    </Tag>
  );
};

export default EditableText;
