import { createClient as createBrowserClient } from '../../../lib/supabase/client';
import { RegisterUserInput, LoginUserInput } from '../../../lib/validators/auth';
import { User, USER_ROLES, UserRole } from '@/types/user';

export async function registerUser(input: RegisterUserInput) {
  const supabase = createBrowserClient();

  // Step 1: Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        name: input.name,
        role: input.role,
      },
    },
  });

  if (authError) {
    throw new Error(`Registration failed: ${authError.message}`);
  }

  if (!authData.user) {
    throw new Error('Registration failed: No user data returned');
  }

  // Step 2: Create user profile

  // For organizer role: start as guest, require application
  // For other roles: assign the selected role directly
  const actualRole = input.role === USER_ROLES.ORGANIZER ? 'guest' : input.role;

  const { error: profileError } = await supabase
    .from('users')
    .update({
      name: input.name,
      role: actualRole,
    })
    .eq('id', authData.user.id);

  if (profileError) {
    throw new Error(`Profile creation failed: ${profileError.message}`);
  }

  return {
    user: authData.user,
    profile: {
      id: authData.user.id,
      email: input.email,
      name: input.name,
      role: actualRole,
    },
  };
}

export async function loginUser(input: LoginUserInput) {
  const supabase = createBrowserClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function logoutUser() {
  const supabase = createBrowserClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(`Logout failed: ${error.message}`);
  }
}

export async function getCurrentUserClient(): Promise<User | null> {
  const supabase = createBrowserClient();

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

export async function getUserRoleClient(): Promise<UserRole | null> {
  const user = await getCurrentUserClient();
  return user?.role || null;
}
