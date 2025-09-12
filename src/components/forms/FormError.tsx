'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';

interface FormErrorProps {
  message?: string | null;
  className?: string;
}

export function FormError({ message, className }: FormErrorProps) {
  if (!message) return null;
  return (
    <Alert variant="destructive" className={className}>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

export default FormError;
