import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";

export async function registerRoutes(app: Express): Promise<Server> {
  // Proxy endpoint to fetch locations from BigCommerce API
  app.get("/api/locations", async (req, res) => {
    try {
      const store_hash = req.query.store_hash as string;
      const access_token = req.query.access_token as string;

      // Validate required parameters
      if (!store_hash || !access_token) {
        return res.status(400).json({ 
          message: "Missing required parameters: store_hash and access_token are required" 
        });
      }

      // Make request to BigCommerce API
      try {
        const response = await axios.get(
          `https://api.bigcommerce.com/stores/${store_hash}/v3/inventory/locations`,
          {
            headers: {
              "X-Auth-Token": access_token,
              "Accept": "application/json",
              "Content-Type": "application/json"
            }
          }
        );

        // Map API response fields to match our client-side model
        const locations = response.data.data.map((location: any) => {
          // Remove operating_hours and special_hours fields and map the rest
          const { 
            operating_hours, 
            special_hours,
            label,
            enabled,
            type_id,
            storefront_visibility,
            address,
            ...rest
          } = location;
          
          // Map the address fields
          const mappedAddress = {
            address1: address?.address1 || '',
            address2: address?.address2 || '',
            city: address?.city || '',
            state_or_province: address?.state || '',
            postal_code: address?.zip || '',
            country_code: address?.country_code || '',
            phone: address?.phone || '',
            email: address?.email || '',
            geo_coordinates: address?.geo_coordinates
          };
          
          // Return the mapped location
          return {
            ...rest,
            name: label,
            type: type_id,
            is_active: enabled,
            is_default: storefront_visibility,
            address: mappedAddress
          };
        });

        return res.json({ 
          locations,
          meta: response.data.meta
        });
      } catch (error: any) {
        // Handle API errors
        const statusCode = error.response?.status || 500;
        const errorMessage = error.response?.data?.title || 
                             error.response?.data?.message || 
                             error.message || 
                             "Failed to fetch locations";
          
        return res.status(statusCode).json({ 
          message: errorMessage 
        });
      }
    } catch (error) {
      console.error("Server error:", error);
      return res.status(500).json({ 
        message: "An unexpected error occurred on the server" 
      });
    }
  });

  // Endpoint to create a new location
  app.post("/api/locations", async (req, res) => {
    try {
      const store_hash = req.query.store_hash as string;
      const access_token = req.query.access_token as string;

      // Validate required parameters
      if (!store_hash || !access_token) {
        return res.status(400).json({ 
          message: "Missing required parameters: store_hash and access_token are required" 
        });
      }

      const locationData = req.body;
      console.log("Received location data:", JSON.stringify(locationData, null, 2));

      if (!locationData) {
        return res.status(422).json({ 
          message: "JSON data is missing or invalid" 
        });
      }

      // The body is already formatted correctly from the client
      // We need to send exactly what the BigCommerce API expects
      const apiLocationData = [locationData]; // API expects an array of locations

      try {
        console.log("Sending to BigCommerce API:", JSON.stringify(apiLocationData, null, 2));
        
        const response = await axios.post(
          `https://api.bigcommerce.com/stores/${store_hash}/v3/inventory/locations`,
          apiLocationData,
          {
            headers: {
              "X-Auth-Token": access_token,
              "Accept": "application/json",
              "Content-Type": "application/json"
            }
          }
        );

        // API returns transaction_id, not the created location data
        // We should return success without trying to map the data
        return res.status(201).json({ 
          success: true,
          transaction_id: response.data.transaction_id,
          message: "Location created successfully" 
        });
        
        // The BigCommerce Locations API POST endpoint returns a transaction_id,
        // not the created location data (as per the OpenAPI spec)
      } catch (error: any) {
        // Handle API errors
        const statusCode = error.response?.status || 500;
        const errorMessage = error.response?.data?.title || 
                            error.response?.data?.message || 
                            error.message || 
                            "Failed to create location";
          
        return res.status(statusCode).json({ 
          message: errorMessage 
        });
      }
    } catch (error) {
      console.error("Server error:", error);
      return res.status(500).json({ 
        message: "An unexpected error occurred on the server" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
