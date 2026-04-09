import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

const ForgotPasswordPage = () => {
  const { resetPassword } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);
    if (error) {
      toast({ title: t('auth.error'), description: error.message, variant: 'destructive' });
    } else {
      setSent(true);
      toast({ title: t('auth.success'), description: t('auth.resetEmailSent') });
    }
  };

  return (
    <Layout>
      <section className="relative pt-32 pb-20 bg-primary overflow-hidden">
        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-4">{t('auth.forgotPassword')}</h1>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-md mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl shadow-lg p-8 border border-border">
            {sent ? (
              <div className="text-center py-6">
                <Mail className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="font-heading text-xl font-bold text-foreground mb-2">{t('auth.resetEmailSent')}</h3>
                <p className="text-muted-foreground mb-6">{t('auth.checkEmailReset')}</p>
                <Link to="/login" className="text-accent hover:underline font-medium">{t('auth.backToLogin')}</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <p className="text-muted-foreground text-sm">{t('auth.resetDesc')}</p>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.com" required />
                </div>
                <Button type="submit" variant="accent" size="lg" className="w-full" disabled={loading}>
                  {loading ? t('auth.sending') : t('auth.resetPassword')}
                </Button>
                <p className="text-center text-sm">
                  <Link to="/login" className="text-accent hover:underline">{t('auth.backToLogin')}</Link>
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default ForgotPasswordPage;
