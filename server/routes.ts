import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";

export async function registerRoutes(app: Express): Promise<Server> {
  // Proxy endpoint to fetch locations from BigCommerce API
  app.get("/api/locations", async (req, res) => {
    try {
      const { store_hash, access_token } = req.query;

      // Validate required parameters
      if (!store_hash || !access_token) {
        return res.status(400).json({ 
          message: "Missing required parameters: store_hash and access_token are required" 
        });
      }

      // Make request to BigCommerce API
      try {
        const response = await axios({
          method: "GET",
          url: `https://api.bigcommerce.com/stores/${store_hash}/v3/inventory/locations`,
          headers: {
            "X-Auth-Token": access_token,
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        });

        // Filter out operating_hours and special_hours fields
        const locations = response.data.data.map((location: any) => {
          const { operating_hours, special_hours, ...rest } = location;
          return rest;
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

  const httpServer = createServer(app);
  return httpServer;
}
