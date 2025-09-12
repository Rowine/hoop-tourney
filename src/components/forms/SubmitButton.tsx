'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ReactNode } from 'react';

interface SubmitButtonProps {
  isLoading?: boolean;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}

export function SubmitButton({ isLoading, disabled, children, className }: SubmitButtonProps) {
  return (
    <Button type="submit" className={className || 'w-full'} disabled={disabled || !!isLoading}>
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {children}
    </Button>
  );
}

export default SubmitButton;
