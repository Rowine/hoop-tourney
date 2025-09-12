import { OrganizerApplicationForm } from '@/components/forms/OrganizerApplicationForm';

export default function OrganizerApplicationPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Organizer Application</h2>
          <p className="mt-2 text-sm text-gray-600">
            Complete your application to become a tournament organizer
          </p>
        </div>
        <OrganizerApplicationForm />
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Complete your organizer application to gain tournament management privileges
          </p>
        </div>
      </div>
    </div>
  );
}
