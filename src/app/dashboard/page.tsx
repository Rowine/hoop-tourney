import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getCurrentUser, logoutUserServer } from '@/features/auth/lib/server';
import { getUserOrganizerApplications } from '@/features/organizer-application/lib/actions';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  let pendingApplication = null;
  if (user.role === 'guest') {
    const applications = await getUserOrganizerApplications();
    pendingApplication = applications?.find((app) => app.status === 'pending');
  }

  return (
    <div className="container mx-auto p-6">
      <div className="rounded-lg border p-8 shadow-sm">
        <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>

        <div className="mb-6">
          <p className="text-lg">
            Welcome! You are logged in as: <span className="font-semibold">{user.role}</span>
          </p>
        </div>

        {user.role === 'guest' && (
          <div className="mt-4">
            <Button asChild>
              <Link href={pendingApplication ? '/pending-application' : '/organizer-application'}>
                {pendingApplication
                  ? 'View Pending Organizer Application'
                  : 'Apply to Become an Organizer'}
              </Link>
            </Button>
          </div>
        )}

        <div className="mt-6">
          <form
            action={async () => {
              'use server';
              await logoutUserServer();
              redirect('/login');
            }}
          >
            <Button type="submit" variant="outline">
              Logout
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
