import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import PageSkeleton from '@/components/PageSkeleton';

const ProtectedRoute = ({ children, requireAdmin = false }: { children: ReactNode; requireAdmin?: boolean }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return <PageSkeleton />;
  if (!user) return <Navigate to="/login" replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
