import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuthStore } from '@/lib/authStore';
import type { UserRole } from '@shared/schema';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/login');
      return;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      setLocation('/app/dashboard');
    }
  }, [isAuthenticated, user, allowedRoles, setLocation]);

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}

interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
}

export function RoleGate({ children, allowedRoles, fallback = null }: RoleGateProps) {
  const { user } = useAuthStore();
  
  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
