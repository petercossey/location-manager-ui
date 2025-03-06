import { useState } from "react";
import Header from "@/components/Header";
import CredentialsCard from "@/components/CredentialsCard";
import StatusMessage from "@/components/StatusMessage";
import LocationsTable from "@/components/LocationsTable";
import Footer from "@/components/Footer";
import { useMutation } from "@tanstack/react-query";
import { fetchLocations } from "@/lib/api";
import { Location } from "@/types/location";

export default function Home() {
  const [storeHash, setStoreHash] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  
  const { 
    mutate: loadLocations, 
    isPending: isLoading, 
    isError, 
    error,
    isSuccess 
  } = useMutation({
    mutationFn: () => fetchLocations(storeHash, accessToken),
    onSuccess: (data) => {
      setLocations(data);
    }
  });

  const handleLoad = () => {
    if (!storeHash || !accessToken) {
      return;
    }
    loadLocations();
  };

  const errorMessage = isError 
    ? (error instanceof Error ? error.message : 'An unknown error occurred') 
    : null;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <CredentialsCard 
          storeHash={storeHash} 
          setStoreHash={setStoreHash} 
          accessToken={accessToken} 
          setAccessToken={setAccessToken} 
          onLoadClick={handleLoad} 
        />
        
        {(isLoading || isError || isSuccess) && (
          <StatusMessage
            isLoading={isLoading}
            isError={isError}
            isSuccess={isSuccess}
            errorMessage={errorMessage}
          />
        )}
        
        {locations.length > 0 ? (
          <LocationsTable locations={locations} />
        ) : (
          <div id="empty-state" className="bg-white rounded-lg shadow-md p-10 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No locations loaded</h3>
            <p className="mt-1 text-sm text-gray-500">Enter your API credentials and click "Load Locations" to view your BigCommerce store locations.</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
