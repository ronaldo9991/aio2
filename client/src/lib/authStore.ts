import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser, UserRole } from '@shared/schema';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      hasRole: (roles) => {
        const user = get().user;
        return user ? roles.includes(user.role) : false;
      },
    }),
    {
      name: 'aquaintel-auth',
    }
  )
);
