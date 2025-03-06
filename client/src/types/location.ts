export interface Address {
  address1?: string;
  address2?: string;
  city?: string;
  state_or_province?: string;
  postal_code?: string;
  country?: string;
  country_code?: string;
  phone?: string;
  email?: string;
  geo_coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Location {
  id: number;
  name: string;
  code: string;
  type: string;
  address: Address;
  is_active: boolean;
  description?: string;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
}
