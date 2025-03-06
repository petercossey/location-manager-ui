import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CredentialsCardProps {
  storeHash: string;
  setStoreHash: (value: string) => void;
  accessToken: string;
  setAccessToken: (value: string) => void;
  onLoadClick: () => void;
}

const CredentialsCard: React.FC<CredentialsCardProps> = ({
  storeHash,
  setStoreHash,
  accessToken,
  setAccessToken,
  onLoadClick
}) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <h2 className="text-lg font-semibold mb-4">API Credentials</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="store-hash" className="mb-1">Store Hash</Label>
            <Input
              id="store-hash"
              type="text"
              placeholder="abc123"
              value={storeHash}
              onChange={(e) => setStoreHash(e.target.value)}
              className="w-full"
            />
            <p className="mt-1 text-xs text-gray-500">The unique identifier for your BigCommerce store</p>
          </div>
          <div>
            <Label htmlFor="access-token" className="mb-1">Access Token</Label>
            <Input
              id="access-token"
              type="password"
              placeholder="••••••••••••••••••••••••••••••"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              className="w-full"
            />
            <p className="mt-1 text-xs text-gray-500">Your BigCommerce API access token</p>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button 
            onClick={onLoadClick}
            disabled={!storeHash || !accessToken}
            className="flex items-center"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
              />
            </svg>
            Load Locations
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CredentialsCard;
