'use client';

import { useForm, UseFormProps, UseFormReturn, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export function useZodForm<TSchema extends FieldValues>({
  schema,
  options,
}: {
  schema: any;
  options?: UseFormProps<TSchema>;
}): UseFormReturn<TSchema> {
  return useForm<TSchema>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    ...options,
  });
}

export default useZodForm;
