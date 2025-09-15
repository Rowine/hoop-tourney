'use client';

import { useForm, UseFormProps, UseFormReturn, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from 'zod';

export function useZodForm<TSchema extends FieldValues>({
  schema,
  options,
}: {
  schema: ZodSchema<TSchema>;
  options?: UseFormProps<TSchema>;
}): UseFormReturn<TSchema> {
  return useForm<TSchema>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    mode: 'onChange',
    ...options,
  });
}

export default useZodForm;
