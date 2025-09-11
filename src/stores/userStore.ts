import { create } from 'zustand';
import { User, UserRole } from '@/types/user';

interface UserState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  clearUser: () => void;
  hasRole: (role: UserRole) => boolean;
  isAdmin: () => boolean;
  isOrganizer: () => boolean;
  isCoach: () => boolean;
  isPlayer: () => boolean;
  isGuest: () => boolean;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: false,

  setUser: (user) => set({ user }),

  setLoading: (isLoading) => set({ isLoading }),

  clearUser: () => set({ user: null }),

  hasRole: (role) => {
    const { user } = get();
    return user?.role === role;
  },

  isAdmin: () => get().hasRole('admin'),
  isOrganizer: () => get().hasRole('organizer'),
  isCoach: () => get().hasRole('coach'),
  isPlayer: () => get().hasRole('player'),
  isGuest: () => get().hasRole('guest'),
}));
