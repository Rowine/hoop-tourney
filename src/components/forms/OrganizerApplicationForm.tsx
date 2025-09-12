'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { organizerApplicationSchema, OrganizerApplicationInput } from '@/lib/validators/auth';
import { createOrganizerApplication } from '@/lib/supabase/organizer-application-actions';
import { registerUser } from '@/lib/supabase/auth-client';
import {
  usePendingRegistration,
  useHasPendingRegistration,
  useRegistrationActions,
} from '@/stores/registrationStore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function OrganizerApplicationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Zustand store
  const pendingRegistration = usePendingRegistration();
  const hasPendingRegistration = useHasPendingRegistration();
  const { clearPendingRegistration, resetRegistrationFlow } = useRegistrationActions();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrganizerApplicationInput>({
    resolver: zodResolver(organizerApplicationSchema),
  });

  // Check if there's pending registration data and redirect back to registration if not
  useEffect(() => {
    if (!hasPendingRegistration) {
      router.push('/register');
    }
  }, [hasPendingRegistration, router]);

  const handleBackToRegistration = () => {
    clearPendingRegistration();
    router.push('/register');
  };

  const onSubmit = async (data: OrganizerApplicationInput) => {
    if (!pendingRegistration) {
      setError('Registration data not found. Please start over.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // First, create the user account
      await registerUser(pendingRegistration);

      // Then, create the organizer application
      await createOrganizerApplication(data);

      // Clear pending registration and reset flow
      resetRegistrationFlow();

      setSuccess(true);
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
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
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Application Submitted
          </CardTitle>
          <CardDescription>
            Your organizer application has been submitted successfully
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <AlertDescription>
                Thank you for your interest in becoming an organizer! Your application is now under
                review. You will be notified once an admin reviews your application.
              </AlertDescription>
            </Alert>
            <p className="text-muted-foreground text-sm">Redirecting to dashboard...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Apply to Become an Organizer</CardTitle>
            <CardDescription>
              Tell us why you want to organize tournaments and share your relevant experience
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleBackToRegistration}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="application_reason">Why do you want to be an organizer? *</Label>
            <Textarea
              id="application_reason"
              {...register('application_reason')}
              placeholder="Please explain why you want to become an organizer and what you hope to achieve..."
              className="min-h-[100px]"
              disabled={isLoading}
            />
            {errors.application_reason && (
              <p className="text-sm text-red-500">{errors.application_reason.message}</p>
            )}
            <p className="text-muted-foreground text-xs">
              Minimum 10 characters, maximum 500 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience_description">Relevant Experience (Optional)</Label>
            <Textarea
              id="experience_description"
              {...register('experience_description')}
              placeholder="Describe any relevant experience you have with organizing events, managing tournaments, or similar activities..."
              className="min-h-[100px]"
              disabled={isLoading}
            />
            {errors.experience_description && (
              <p className="text-sm text-red-500">{errors.experience_description.message}</p>
            )}
            <p className="text-muted-foreground text-xs">
              Minimum 10 characters, maximum 1000 characters
            </p>
          </div>

          <div className="rounded-lg bg-blue-50 p-4">
            <h4 className="mb-2 font-medium text-blue-900">What happens next?</h4>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Your application will be reviewed by an admin</li>
              <li>• You'll be notified of the decision via email</li>
              <li>• If approved, you'll gain organizer privileges</li>
              <li>• You can check your application status in your dashboard</li>
            </ul>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Application
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
