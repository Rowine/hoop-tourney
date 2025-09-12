'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/stores/userStore';
import { getCurrentUserClient } from '@/features/auth/api/client';

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useUserStore();

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        const user = await getCurrentUserClient();
        setUser(user);
      } catch (error) {
        console.error('Failed to load user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [setUser, setLoading]);

  return <>{children}</>;
}
