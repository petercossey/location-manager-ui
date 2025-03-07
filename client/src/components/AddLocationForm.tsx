import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

interface AddLocationFormProps {
  onSuccess?: () => void;
  storeHash: string;
  accessToken: string;
}

interface FormData {
  name: string;
  code: string;
  type: string;
  is_active: boolean;
  address1: string;
  address2?: string;
  city: string;
  state_or_province: string;
  postal_code: string;
  country_code: string;
  email: string;
  latitude: number;
  longitude: number;
}

const AddLocationForm: React.FC<AddLocationFormProps> = ({ onSuccess, storeHash, accessToken }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>();
  const { toast } = useToast();

  const [apiError, setApiError] = React.useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    // Clear any previous API errors
    setApiError(null);
    
    try {
      // Create the location object from form data
      // Format to match the BigCommerce API spec exactly
      // Convert checkbox "on" value to boolean
      const isActive = data.is_active === "on" ? true : 
                      data.is_active === undefined ? true : 
                      Boolean(data.is_active);
                      
      const locationData = {
        code: data.code,
        label: data.name,
        type_id: data.type,
        enabled: isActive, // Ensure this is a boolean
        managed_by_external_source: false, // Required field per spec
        time_zone: "Etc/UTC", // Required field per spec
        address: {
          address1: data.address1,
          address2: data.address2 || "",
          city: data.city,
          state: data.state_or_province,
          zip: data.postal_code,
          country_code: data.country_code,
          email: data.email,
          geo_coordinates: {
            latitude: parseFloat(String(data.latitude)),
            longitude: parseFloat(String(data.longitude))
          }
        },
        storefront_visibility: true
      };

      console.log("Sending location data:", JSON.stringify(locationData, null, 2));

      const response = await fetch(`/api/locations?store_hash=${storeHash}&access_token=${accessToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(locationData)
      });

      console.log("Response status:", response.status);

      // Parse response regardless of status for debugging
      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (!response.ok) {
        // Store API error message for field-specific display
        const errorMessage = responseData.message || 'Failed to create location';
        
        // If we have a specific error for the code field
        if (errorMessage.includes("Code") && errorMessage.includes("not unique")) {
          setApiError(errorMessage);
        } else {
          throw new Error(errorMessage);
        }
        return;
      }

      // Log the response and location data
      console.log('Location created:', responseData);

      // Show success message
      toast({
        title: "Success",
        description: "Location has been created successfully",
      });

      setApiError(null); // Clear any errors
      reset(); // Reset form after successful submission
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error creating location:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create location",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>Add New Location</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          {apiError && !apiError.includes("Code") && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
              {apiError}
            </div>
          )}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Location Name*</Label>
                <Input 
                  id="name" 
                  {...register("name", { required: "Name is required" })} 
                  placeholder="Warehouse 1"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email*</Label>
                <Input 
                  id="email" 
                  type="email"
                  {...register("email", { required: "Email is required" })} 
                  placeholder="warehouse@example.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Location Code*</Label>
                <Input 
                  id="code" 
                  {...register("code", { required: "Code is required" })} 
                  placeholder="WH-001"
                  className={errors.code || apiError ? "border-red-500" : ""}
                />
                {errors.code && <p className="text-red-500 text-sm">{errors.code.message}</p>}
                {apiError && apiError.includes("Code") && (
                  <p className="text-red-500 text-sm mt-1">{apiError}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude*</Label>
                <Input 
                  id="latitude" 
                  type="number"
                  step="any"
                  {...register("latitude", { 
                    required: "Latitude is required",
                    valueAsNumber: true,
                    validate: {
                      validRange: (value) => 
                        (value >= -90 && value <= 90) || "Latitude must be between -90 and 90"
                    }
                  })} 
                  placeholder="-33.860582"
                  className={errors.latitude ? "border-red-500" : ""}
                />
                {errors.latitude && <p className="text-red-500 text-sm">{errors.latitude.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude*</Label>
                <Input 
                  id="longitude" 
                  type="number"
                  step="any"
                  {...register("longitude", { 
                    required: "Longitude is required",
                    valueAsNumber: true,
                    validate: {
                      validRange: (value) => 
                        (value >= -180 && value <= 180) || "Longitude must be between -180 and 180"
                    }
                  })} 
                  placeholder="151.2057579"
                  className={errors.longitude ? "border-red-500" : ""}
                />
                {errors.longitude && <p className="text-red-500 text-sm">{errors.longitude.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Location Type*</Label>
                <Select 
                  onValueChange={(value) => register("type").onChange({ target: { name: "type", value } })}
                  defaultValue="PHYSICAL"
                >
                  <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PHYSICAL">Physical</SelectItem>
                    <SelectItem value="VIRTUAL">Virtual</SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" {...register("type", { required: "Type is required" })} defaultValue="PHYSICAL" />
                {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <Checkbox id="is_active" {...register("is_active")} defaultChecked />
                <Label htmlFor="is_active">Active Location</Label>
              </div>
            </div>

            <div className="pt-2">
              <h3 className="text-lg font-medium mb-2">Address Information</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address1">Street Address*</Label>
                  <Input 
                    id="address1" 
                    {...register("address1", { required: "Street address is required" })} 
                    placeholder="123 Main St"
                    className={errors.address1 ? "border-red-500" : ""}
                  />
                  {errors.address1 && <p className="text-red-500 text-sm">{errors.address1.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City*</Label>
                    <Input 
                      id="city" 
                      {...register("city", { required: "City is required" })} 
                      placeholder="San Francisco"
                      className={errors.city ? "border-red-500" : ""}
                    />
                    {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state_or_province">State/Province*</Label>
                    <Input 
                      id="state_or_province" 
                      {...register("state_or_province", { required: "State/Province is required" })} 
                      placeholder="CA"
                      className={errors.state_or_province ? "border-red-500" : ""}
                    />
                    {errors.state_or_province && <p className="text-red-500 text-sm">{errors.state_or_province.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postal_code">Postal Code*</Label>
                    <Input 
                      id="postal_code" 
                      {...register("postal_code", { required: "Postal code is required" })} 
                      placeholder="94105"
                      className={errors.postal_code ? "border-red-500" : ""}
                    />
                    {errors.postal_code && <p className="text-red-500 text-sm">{errors.postal_code.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country_code">Country Code*</Label>
                    <Input 
                      id="country_code" 
                      {...register("country_code", { required: "Country code is required" })} 
                      placeholder="US"
                      className={errors.country_code ? "border-red-500" : ""}
                    />
                    {errors.country_code && <p className="text-red-500 text-sm">{errors.country_code.message}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Location"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddLocationForm;