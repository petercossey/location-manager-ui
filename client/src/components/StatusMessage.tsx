import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface StatusMessageProps {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  errorMessage: string | null;
}

const StatusMessage: React.FC<StatusMessageProps> = ({
  isLoading,
  isError,
  isSuccess,
  errorMessage
}) => {
  if (!isLoading && !isError && !isSuccess) {
    return null;
  }

  return (
    <div className="mb-6">
      {isLoading && (
        <Alert className="bg-gray-100">
          <div className="flex items-center">
            <Loader2 className="h-5 w-5 text-primary animate-spin mr-2" />
            <AlertDescription>Loading locations...</AlertDescription>
          </div>
        </Alert>
      )}

      {isError && (
        <Alert variant="destructive">
          <div className="flex items-center">
            <XCircle className="h-5 w-5 mr-2" />
            <AlertDescription>{errorMessage || 'An error occurred while loading locations.'}</AlertDescription>
          </div>
        </Alert>
      )}

      {isSuccess && !isLoading && !isError && (
        <Alert variant="default" className="bg-green-50 border-green-500 text-green-800">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <AlertDescription>Locations loaded successfully!</AlertDescription>
          </div>
        </Alert>
      )}
    </div>
  );
};

export default StatusMessage;
