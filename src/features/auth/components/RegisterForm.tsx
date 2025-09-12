'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUserSchema, RegisterUserInput } from '@/lib/validators/auth';
import { registerUser } from '@/features/auth/api/client';
import { USER_ROLES, ROLE_DESCRIPTIONS } from '@/types/user';
import { useRegistrationActions } from '@/stores/registrationStore';
import AuthCard from '@/components/forms/AuthCard';
import FormError from '@/components/forms/FormError';
import SubmitButton from '@/components/forms/SubmitButton';
import { useZodForm } from '@/components/forms/useZodForm';
import { TextInput } from '@/components/forms/fields/TextInput';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { setPendingRegistration } = useRegistrationActions();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useZodForm<RegisterUserInput>({ schema: registerUserSchema });

  const selectedRole = watch('role', USER_ROLES.GUEST);

  const onSubmit = async (data: RegisterUserInput) => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      if (data.role === USER_ROLES.ORGANIZER) {
        setPendingRegistration(data);
        router.push('/organizer-application');
      } else {
        await registerUser(data);
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create Account"
      description="Join the tournament management system and select your role"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormError message={error} />

        <TextInput
          id="name"
          label="Full Name"
          placeholder="Enter your full name"
          disabled={isLoading}
          error={errors.name}
          registerProps={register('name')}
        />

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
          placeholder="Create a password"
          disabled={isLoading}
          error={errors.password}
          registerProps={register('password')}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="role">
            Role
          </label>
          <Select
            value={selectedRole}
            onValueChange={(value) => setValue('role', value as any, { shouldValidate: true })}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full py-6">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(USER_ROLES).map(([key, value]) => (
                <SelectItem key={value} value={value}>
                  <div className="flex flex-col items-start">
                    <span className="font-medium capitalize">{value}</span>
                    <span className="text-muted-foreground text-xs">
                      {ROLE_DESCRIPTIONS[value]}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.role ? <p className="text-sm text-red-500">{errors.role.message}</p> : null}
        </div>

        <SubmitButton isLoading={isLoading} disabled={!isValid}>
          Create Account
        </SubmitButton>
      </form>
    </AuthCard>
  );
}

export default RegisterForm;
