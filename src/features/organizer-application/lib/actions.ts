'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { OrganizerApplicationInput } from '@/lib/validators/auth';
import { ApplicationStatus } from '@/types/organizer-application';

export async function createOrganizerApplication(input: OrganizerApplicationInput) {
  const supabase = await createClient(cookies());

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('You must be logged in to submit an application');
  }

  // Check if user already has a pending application
  const { data: existingApplication, error: checkError } = await supabase
    .from('organizer_applications')
    .select('id, status')
    .eq('user_id', user.id)
    .eq('status', 'pending')
    .single();

  if (checkError && checkError.code !== 'PGRST116') {
    // PGRST116 = no rows returned
    throw new Error(`Failed to check existing applications: ${checkError.message}`);
  }

  if (existingApplication) {
    throw new Error('You already have a pending organizer application');
  }

  // Create the application
  const { data, error } = await supabase
    .from('organizer_applications')
    .insert({
      user_id: user.id,
      application_reason: input.application_reason,
      experience_description: input.experience_description || null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create application: ${error.message}`);
  }

  return data;
}

export async function getOrganizerApplications() {
  const supabase = await createClient(cookies());

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('You must be logged in to view applications');
  }

  // Check if user is admin
  const { data: userProfile, error: profileError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !userProfile) {
    throw new Error('User profile not found');
  }

  if (userProfile.role !== 'admin') {
    throw new Error('Only admins can view all applications');
  }

  // Get all applications with user details
  const { data, error } = await supabase
    .from('organizer_applications')
    .select(
      `
      *,
      user:users!organizer_applications_user_id_fkey (
        id,
        name,
        email,
        role
      ),
      reviewer:users!organizer_applications_reviewed_by_fkey (
        id,
        name,
        email
      )
    `,
    )
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch applications: ${error.message}`);
  }

  return data;
}

export async function updateOrganizerApplicationStatus(
  applicationId: string,
  status: ApplicationStatus,
  adminNotes?: string,
) {
  const supabase = await createClient(cookies());

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('You must be logged in to update applications');
  }

  // Check if user is admin
  const { data: userProfile, error: profileError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !userProfile) {
    throw new Error('User profile not found');
  }

  if (userProfile.role !== 'admin') {
    throw new Error('Only admins can update application status');
  }

  // Update application status using the database function
  const { error } = await supabase.rpc('update_application_status', {
    application_id: applicationId,
    new_status: status,
    admin_notes: adminNotes || null,
  });

  if (error) {
    throw new Error(`Failed to update application: ${error.message}`);
  }

  return { success: true };
}

export async function getUserOrganizerApplications() {
  const supabase = await createClient(cookies());

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('You must be logged in to view your applications');
  }

  // Get user's applications
  const { data, error } = await supabase
    .from('organizer_applications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch your applications: ${error.message}`);
  }

  return data;
}
