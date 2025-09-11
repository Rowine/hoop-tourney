import { z } from 'zod';
import { USER_ROLES } from '@/types/user';

export const registerUserSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    ),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum([USER_ROLES.ORGANIZER, USER_ROLES.COACH, USER_ROLES.PLAYER, USER_ROLES.GUEST]),
});

export const loginUserSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
