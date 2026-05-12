import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

const RegisterPage = () => {
  const { signUp } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: t('auth.error'), description: t('auth.passwordMin'), variant: 'destructive' });
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password, name);
    setLoading(false);
    if (error) {
      toast({ title: t('auth.error'), description: error.message, variant: 'destructive' });
    } else {
      toast({ title: t('auth.success'), description: t('auth.checkEmail') });
      navigate('/login');
    }
  };

  return (
    <Layout>
      <Seo titleKey="seo.register.title" descKey="seo.register.desc" path="/register" />
      <section className="relative pt-32 pb-20 bg-primary overflow-hidden">
        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-4">{t('auth.register')}</h1>
            <p className="text-lg text-primary-foreground/90">{t('auth.registerDesc')}</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-md mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl shadow-lg p-8 border border-border">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <User className="inline h-4 w-4 mr-1" /> {t('contact.name')}
                </label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('contact.namePlaceholder')} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Mail className="inline h-4 w-4 mr-1" /> Email
                </label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.com" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Lock className="inline h-4 w-4 mr-1" /> {t('auth.password')}
                </label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
              </div>
              <Button type="submit" variant="accent" size="lg" className="w-full" disabled={loading}>
                {loading ? t('auth.registering') : t('auth.register')}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                {t('auth.hasAccount')}{' '}
                <Link to="/login" className="text-accent hover:underline font-medium">{t('auth.login')}</Link>
              </p>
            </form>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default RegisterPage;
