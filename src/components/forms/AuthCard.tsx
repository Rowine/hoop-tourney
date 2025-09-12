'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';

interface AuthCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  headerRight?: ReactNode;
  className?: string;
}

export function AuthCard({ title, description, children, headerRight, className }: AuthCardProps) {
  return (
    <Card className={className || 'mx-auto w-full max-w-md'}>
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle>{title}</CardTitle>
            {description ? <CardDescription>{description}</CardDescription> : null}
          </div>
          {headerRight}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export default AuthCard;
