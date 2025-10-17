import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import { AdminDashboard } from '@/components/AdminDashboard';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export function ProtectedAdminRoute() {
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/admin/login');
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) {
    return <AdminLoginPage />;
  }

  return <AdminDashboard isAdmin={user?.role === 'admin'} />;
}