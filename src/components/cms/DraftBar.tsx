import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Rocket, Trash2, Loader2, FileEdit } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  useDraftCount,
  publishAllDrafts,
  discardAllDrafts,
  setPreviewDrafts,
  useSiteContent,
} from '@/hooks/useSiteContent';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const DraftBar = () => {
  const { isAdmin } = useAuth();
  const count = useDraftCount();
  const { isPreviewingDrafts } = useSiteContent();
  const { toast } = useToast();
  const [busy, setBusy] = useState<'publish' | 'discard' | null>(null);

  if (!isAdmin) return null;

  const togglePreview = () => {
    setPreviewDrafts(!isPreviewingDrafts);
    toast({
      title: !isPreviewingDrafts ? 'Aperçu brouillon activé' : 'Vue publique active',
      description: !isPreviewingDrafts
        ? 'Vous voyez les modifications non publiées.'
        : 'Vous voyez le site tel que les visiteurs le voient.',
    });
  };

  const onPublish = async () => {
    setBusy('publish');
    try {
      const n = await publishAllDrafts();
      toast({ title: '🚀 Publié', description: `${n} modification(s) sont maintenant en ligne.` });
    } catch (e: any) {
      toast({ title: 'Erreur', description: e.message, variant: 'destructive' });
    } finally { setBusy(null); }
  };

  const onDiscard = async () => {
    setBusy('discard');
    try {
      const n = await discardAllDrafts();
      toast({ title: 'Brouillons supprimés', description: `${n} modification(s) annulée(s).` });
    } catch (e: any) {
      toast({ title: 'Erreur', description: e.message, variant: 'destructive' });
    } finally { setBusy(null); }
  };

  const showBar = count > 0 || isPreviewingDrafts;

  return (
    <AnimatePresence>
      {showBar && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-accent via-accent to-orange-500 text-accent-foreground shadow-lg"
        >
          <div className="container-custom flex items-center justify-between gap-3 py-2 px-4 flex-wrap">
            <div className="flex items-center gap-2 text-sm font-medium">
              <FileEdit className="h-4 w-4" />
              {count > 0 ? (
                <span>
                  <strong>{count}</strong> modification{count > 1 ? 's' : ''} en attente de publication
                  {isPreviewingDrafts && <span className="opacity-80"> · vous êtes en aperçu</span>}
                </span>
              ) : (
                <span>Aperçu brouillon actif (aucune modif en attente)</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={togglePreview}
                className="h-8 bg-white/10 border-white/40 text-white hover:bg-white/20"
              >
                {isPreviewingDrafts ? <EyeOff className="h-3.5 w-3.5 mr-1" /> : <Eye className="h-3.5 w-3.5 mr-1" />}
                {isPreviewingDrafts ? 'Voir public' : 'Aperçu brouillon'}
              </Button>

              {count > 0 && (
                <>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline" disabled={busy !== null}
                        className="h-8 bg-white/10 border-white/40 text-white hover:bg-red-500/30">
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Annuler
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer tous les brouillons ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Les {count} modification(s) en attente seront définitivement perdues.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={onDiscard}>Confirmer</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Button size="sm" onClick={onPublish} disabled={busy !== null}
                    className="h-8 bg-white text-accent hover:bg-white/90 font-semibold">
                    {busy === 'publish'
                      ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                      : <Rocket className="h-3.5 w-3.5 mr-1" />}
                    Publier tout
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DraftBar;
