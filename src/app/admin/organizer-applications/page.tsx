import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/features/auth/lib/server';
import { getOrganizerApplications } from '@/features/organizer-application/lib/actions';
import { OrganizerApplicationsList } from '@/features/organizer-application/components/OrganizerApplicationsList';

export default async function AdminOrganizerApplicationsPage() {
  const user = await getCurrentUser();

  // Redirect non-admin users
  if (!user || user.role !== 'admin') {
    redirect('/dashboard');
  }

  const applications = await getOrganizerApplications();

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Organizer Applications</h1>
        </div>

        <OrganizerApplicationsList applications={applications} />
      </div>
    </div>
  );
}
