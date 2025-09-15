'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUserSchema, LoginUserInput } from '@/lib/validators/auth';
import { loginUser } from '@/features/auth/lib/client';
import AuthCard from '@/components/forms/AuthCard';
import FormError from '@/components/forms/FormError';
import SubmitButton from '@/components/forms/SubmitButton';
import { useZodForm } from '@/components/forms/useZodForm';
import { TextInput } from '@/components/forms/fields/TextInput';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useZodForm<LoginUserInput>({ schema: loginUserSchema });

  const onSubmit = async (data: LoginUserInput) => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      await loginUser(data);
      router.push('/dashboard');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard title="Sign In" description="Enter your credentials to access your account">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormError message={error} />

        <TextInput
          id="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          disabled={isLoading}
          error={errors.email}
          registerProps={register('email')}
        />

        <TextInput
          id="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          disabled={isLoading}
          error={errors.password}
          registerProps={register('password')}
        />

        <SubmitButton isLoading={isLoading} disabled={!isValid}>
          Sign In
        </SubmitButton>
      </form>
    </AuthCard>
  );
}

export default LoginForm;
