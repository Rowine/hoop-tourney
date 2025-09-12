import { OrganizerApplicationForm } from '@/components/forms/OrganizerApplicationForm';
import Link from 'next/link';

export default function OrganizerApplicationPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Organizer Application
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Complete your application to become a tournament organizer
          </p>
        </div>
        <OrganizerApplicationForm />
        <div className="text-center">
          <Link
            href="/register"
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            ← Back to registration
          </Link>
        </div>
      </div>
    </div>
  );
}
