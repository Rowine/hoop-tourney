'use client';

import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

interface TextAreaFieldProps {
  id: string;
  label: string;
  error?: FieldError;
  disabled?: boolean;
  placeholder?: string;
  helperText?: string;
  className?: string;
  registerProps: UseFormRegisterReturn;
}

export function TextAreaField({
  id,
  label,
  error,
  disabled,
  placeholder,
  helperText,
  className,
  registerProps,
}: TextAreaFieldProps) {
  const describedBy = error ? `${id}-error` : helperText ? `${id}-help` : undefined;
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        placeholder={placeholder}
        className={className}
        disabled={disabled}
        {...registerProps}
      />
      {error ? (
        <p id={`${id}-error`} className="text-sm text-red-500">
          {error.message}
        </p>
      ) : helperText ? (
        <p id={`${id}-help`} className="text-muted-foreground text-xs">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

export default TextAreaField;
