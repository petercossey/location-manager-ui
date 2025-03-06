import { Location } from "@/types/location";
import { apiRequest } from "@/lib/queryClient";

export async function fetchLocations(storeHash: string, accessToken: string): Promise<Location[]> {
  if (!storeHash || !accessToken) {
    throw new Error("Store hash and access token are required");
  }

  try {
    const response = await apiRequest(
      "GET",
      `/api/locations?store_hash=${encodeURIComponent(storeHash)}&access_token=${encodeURIComponent(accessToken)}`,
    );
    
    const data = await response.json();
    return data.locations;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Failed to fetch locations");
    }
  }
}
