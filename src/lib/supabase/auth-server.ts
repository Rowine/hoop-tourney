import { createClient as createServerClient } from './server';
import { User, UserRole } from '@/types/user';
import { cookies } from 'next/headers';

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = cookies();
  const supabase = await createServerClient(cookieStore);

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    return null;
  }

  const { data: userProfile, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single();

  if (error || !userProfile) {
    return null;
  }

  return userProfile;
}

export async function getUserRole(): Promise<UserRole | null> {
  const user = await getCurrentUser();
  return user?.role || null;
}
