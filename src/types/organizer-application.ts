import { User } from './user';

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export const APPLICATION_STATUS = {
  PENDING: 'pending' as const,
  APPROVED: 'approved' as const,
  REJECTED: 'rejected' as const,
} as const;

export interface OrganizerApplication {
  id: string;
  user_id: string;
  application_reason: string;
  experience_description: string | null;
  status: ApplicationStatus;
  admin_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrganizerApplicationWithUser extends OrganizerApplication {
  user: User;
  reviewer?: User;
}

export interface CreateOrganizerApplicationData {
  application_reason: string;
  experience_description?: string;
}

export interface UpdateOrganizerApplicationData {
  status: ApplicationStatus;
  admin_notes?: string;
}

// Zod schema for validation
export const APPLICATION_STATUS_VALUES = ['pending', 'approved', 'rejected'] as const;
