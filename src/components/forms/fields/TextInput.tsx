'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FieldError } from 'react-hook-form';

interface TextInputProps {
  id: string;
  label: string;
  error?: FieldError;
  disabled?: boolean;
  type?: string;
  placeholder?: string;
  // spread {...register('field')} from RHF
  registerProps: any;
}

export function TextInput({
  id,
  label,
  error,
  disabled,
  type = 'text',
  placeholder,
  registerProps,
}: TextInputProps) {
  const describedBy = error ? `${id}-error` : undefined;
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        placeholder={placeholder}
        disabled={disabled}
        {...registerProps}
      />
      {error ? (
        <p id={describedBy} className="text-sm text-red-500">
          {error.message}
        </p>
      ) : null}
    </div>
  );
}

export default TextInput;
