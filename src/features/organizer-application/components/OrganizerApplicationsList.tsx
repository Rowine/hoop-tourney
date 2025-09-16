'use client';

import { useState } from 'react';
import { OrganizerApplicationWithUser } from '@/types/organizer-application';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { updateOrganizerApplicationStatus } from '@/features/organizer-application/lib/actions';
import { formatDistanceToNow } from 'date-fns';

interface OrganizerApplicationsListProps {
  applications: OrganizerApplicationWithUser[];
}

export function OrganizerApplicationsList({ applications }: OrganizerApplicationsListProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleUpdateStatus = async (applicationId: string, status: 'approved' | 'rejected') => {
    if (isLoading) return;
    setIsLoading(applicationId);

    try {
      await updateOrganizerApplicationStatus(applicationId, status);
      // Refresh the page to show updated status
      window.location.reload();
    } catch (error) {
      console.error('Failed to update application status:', error);
      alert('Failed to update application status. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  if (!applications.length) {
    return (
      <Card>
        <CardContent className="text-muted-foreground py-8 text-center">
          No organizer applications found.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <Card key={application.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{application.user.name}</CardTitle>
                <CardDescription>{application.user.email}</CardDescription>
              </div>
              <Badge
                className={
                  application.status === 'pending'
                    ? 'bg-yellow-500'
                    : application.status === 'approved'
                      ? 'bg-green-500'
                      : 'bg-red-500'
                }
              >
                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="mb-2 font-medium">Why they want to be an organizer:</h4>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {application.application_reason}
              </p>
            </div>
            {application.experience_description && (
              <div>
                <h4 className="mb-2 font-medium">Relevant Experience:</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {application.experience_description}
                </p>
              </div>
            )}
            <div className="text-muted-foreground text-sm">
              Applied {formatDistanceToNow(new Date(application.created_at), { addSuffix: true })}
            </div>
          </CardContent>
          {application.status === 'pending' && (
            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => handleUpdateStatus(application.id, 'rejected')}
                disabled={!!isLoading}
              >
                Reject
              </Button>
              <Button
                onClick={() => handleUpdateStatus(application.id, 'approved')}
                disabled={!!isLoading}
              >
                Approve
              </Button>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
}
