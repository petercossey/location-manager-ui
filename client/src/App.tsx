import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import React, { useState, useEffect } from 'react';
import { Location } from './types/location';
import Header from './components/Header';
import CredentialsCard from './components/CredentialsCard';
import LocationsTable from './components/LocationsTable';
import AddLocationForm from './components/AddLocationForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [storeHash, setStoreHash] = useState<string>('');
  const [accessToken, setAccessToken] = useState<string>('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("locations");

  const fetchLocations = async () => {
    if (!storeHash || !accessToken) {
      setError('Store hash and access token are required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/locations?store_hash=${storeHash}&access_token=${accessToken}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch locations');
      }

      const data = await response.json();
      setLocations(data.locations || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching locations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationAdded = () => {
    fetchLocations();
    setActiveTab("locations");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="gap-6 mb-8">
            <CredentialsCard
              storeHash={storeHash}
              accessToken={accessToken}
              onStoreHashChange={setStoreHash}
              onAccessTokenChange={setAccessToken}
              onSubmit={fetchLocations}
              isLoading={loading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {(storeHash && accessToken) && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
              <TabsList className="mb-4">
                <TabsTrigger value="locations">Locations</TabsTrigger>
                <TabsTrigger value="add-location">Add New Location</TabsTrigger>
              </TabsList>
              <TabsContent value="locations">
                {locations.length > 0 ? (
                  <LocationsTable locations={locations} />
                ) : (
                  <div className="text-center p-8 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-500">No locations found. Click "Add New Location" to create one.</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="add-location">
                <AddLocationForm 
                  storeHash={storeHash}
                  accessToken={accessToken}
                  onSuccess={handleLocationAdded}
                />
              </TabsContent>
            </Tabs>
          )}
        </main>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;