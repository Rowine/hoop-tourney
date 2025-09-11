export type UserRole = 'admin' | 'organizer' | 'coach' | 'player' | 'guest';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  role: UserRole;
  created_at: string;
}

export interface RegisterUserData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface LoginUserData {
  email: string;
  password: string;
}

export const USER_ROLES = {
  ORGANIZER: 'organizer' as const,
  COACH: 'coach' as const,
  PLAYER: 'player' as const,
  GUEST: 'guest' as const,
} as const;

export const ROLE_DESCRIPTIONS = {
  organizer: 'Create and manage tournaments',
  coach: 'Create and manage teams',
  player: 'Join teams and participate in tournaments',
  guest: 'View tournaments and basic information',
} as const;
