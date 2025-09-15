'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { organizerApplicationSchema, OrganizerApplicationInput } from '@/lib/validators/auth';
import { createOrganizerApplication } from '@/features/organizer-application/lib/actions';
import { registerUser } from '@/features/auth/lib/client';
import {
  usePendingRegistration,
  useHasPendingRegistration,
  useRegistrationActions,
} from '@/stores/registrationStore';
import AuthCard from '@/components/forms/AuthCard';
import FormError from '@/components/forms/FormError';
import SubmitButton from '@/components/forms/SubmitButton';
import { useZodForm } from '@/components/forms/useZodForm';
import { TextAreaField } from '@/components/forms/fields/TextAreaField';
import { Alert } from '@/components/ui/alert';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function OrganizerApplicationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const pendingRegistration = usePendingRegistration();
  const hasPendingRegistration = useHasPendingRegistration();
  const { clearPendingRegistration, resetRegistrationFlow } = useRegistrationActions();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useZodForm<OrganizerApplicationInput>({ schema: organizerApplicationSchema });

  useEffect(() => {
    if (!success && !hasPendingRegistration) {
      router.push('/register');
    }
  }, [hasPendingRegistration, router, success]);

  const handleBackToRegistration = () => {
    clearPendingRegistration();
    router.push('/register');
  };

  const onSubmit = async (data: OrganizerApplicationInput) => {
    if (!pendingRegistration) {
      setError('Registration data not found. Please start over.');
      return;
    }

    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await registerUser(pendingRegistration);
      await createOrganizerApplication(data);
      setSuccess(true);
      setTimeout(() => {
        resetRegistrationFlow();
        router.push('/dashboard');
      }, 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Application submission failed. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <AuthCard title="Application Submitted">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span>Your organizer application has been submitted successfully</span>
          </div>
          Redirecting to dashboard...
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Apply to Become an Organizer"
      description="Tell us why you want to organize tournaments and share your relevant experience."
      headerRight={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleBackToRegistration}
          className="mt-1 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      }
      className="mx-auto w-full max-w-lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormError message={error} className="text-sm" />

        <TextAreaField
          id="application_reason"
          label="Why do you want to be an organizer? *"
          placeholder="Share your motivation, goals, and how you'll add value to the community."
          className="min-h-[140px] resize-y text-base leading-relaxed"
          disabled={isLoading}
          error={errors.application_reason}
          helperText={!errors.application_reason ? '10–500 characters' : undefined}
          registerProps={register('application_reason')}
        />

        <TextAreaField
          id="experience_description"
          label="Relevant Experience (Optional)"
          placeholder="Tell us about events you've organized or any related experience."
          className="min-h-[140px] resize-y text-base leading-relaxed"
          disabled={isLoading}
          error={errors.experience_description}
          helperText={!errors.experience_description ? 'Up to 1000 characters' : undefined}
          registerProps={register('experience_description')}
        />

        <div className="bg-muted/10 rounded-lg border p-5">
          <h4 className="mb-2 text-sm font-medium">What happens next?</h4>
          <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
            <li>Your application will be reviewed by an admin</li>
            <li>If approved, you'll gain organizer privileges</li>
            <li>You can check your application status in your dashboard</li>
          </ul>
        </div>

        <SubmitButton isLoading={isLoading} disabled={!isValid} className="w-full py-6">
          Submit Application
        </SubmitButton>
      </form>
    </AuthCard>
  );
}

export default OrganizerApplicationForm;
