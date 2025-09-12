'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { organizerApplicationSchema, OrganizerApplicationInput } from '@/lib/validators/auth';
import { createOrganizerApplication } from '@/features/organizer-application/server/actions';
import { registerUser } from '@/features/auth/api/client';
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
  // Also check if success is false to prevent redirecting to registration if success is true
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

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // First, create the user account
      await registerUser(pendingRegistration);

      // Then, create the organizer application
      await createOrganizerApplication(data);

      setSuccess(true);

      // Redirect to dashboard and reset registration flow after showing success
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
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-xl">Apply to Become an Organizer</CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              Tell us why you want to organize tournaments and share your relevant experience. We
              review every application carefully.
            </CardDescription>
          </div>
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
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive" className="text-sm">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="application_reason">Why do you want to be an organizer? *</Label>
            <Textarea
              id="application_reason"
              {...register('application_reason')}
              placeholder="Share your motivation, goals, and how you'll add value to the community."
              className="min-h-[140px] resize-y text-base leading-relaxed"
              disabled={isLoading}
            />
            {errors.application_reason ? (
              <p className="text-sm text-red-500">{errors.application_reason.message}</p>
            ) : (
              <p className="text-muted-foreground text-xs">10–500 characters</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience_description">Relevant Experience (Optional)</Label>
            <Textarea
              id="experience_description"
              {...register('experience_description')}
              placeholder="Tell us about events you've organized or any related experience."
              className="min-h-[140px] resize-y text-base leading-relaxed"
              disabled={isLoading}
            />
            {errors.experience_description ? (
              <p className="text-sm text-red-500">{errors.experience_description.message}</p>
            ) : (
              <p className="text-muted-foreground text-xs">Up to 1000 characters</p>
            )}
          </div>

          <div className="bg-muted/10 rounded-lg border p-5">
            <h4 className="mb-2 text-sm font-medium">What happens next?</h4>
            <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
              <li>Your application will be reviewed by an admin</li>
              <li>If approved, you'll gain organizer privileges</li>
              <li>You can check your application status in your dashboard</li>
            </ul>
          </div>

          <Button type="submit" className="w-full py-6" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Application
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
