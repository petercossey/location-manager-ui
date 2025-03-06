import React from 'react';
import { Location } from '@/types/location';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LocationsTableProps {
  locations: Location[];
}

const LocationsTable: React.FC<LocationsTableProps> = ({ locations }) => {
  return (
    <Card className="rounded-lg shadow-md">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-semibold text-gray-900">Locations</h3>
        <p className="mt-1 text-sm text-gray-500">A list of all locations in your BigCommerce store.</p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="whitespace-nowrap">ID</TableHead>
              <TableHead className="whitespace-nowrap">Name</TableHead>
              <TableHead className="whitespace-nowrap">Type</TableHead>
              <TableHead className="whitespace-nowrap">Code</TableHead>
              <TableHead className="whitespace-nowrap">Address</TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations.map((location) => (
              <TableRow key={location.id}>
                <TableCell className="whitespace-nowrap">{location.id}</TableCell>
                <TableCell className="whitespace-nowrap font-medium">{location.name}</TableCell>
                <TableCell className="whitespace-nowrap">{location.type}</TableCell>
                <TableCell className="whitespace-nowrap">{location.code}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    {location.address.address1 && (
                      <>
                        {location.address.address1}
                        {location.address.address2 && `, ${location.address.address2}`}
                        <br />
                      </>
                    )}
                    {location.address.city && (
                      <>
                        {location.address.city}
                        {location.address.state_or_province && `, ${location.address.state_or_province}`}
                        {location.address.postal_code && ` ${location.address.postal_code}`}
                        <br />
                      </>
                    )}
                    {location.address.geo_coordinates && (
                      <span className="text-xs text-gray-500">
                        Lat: {location.address.geo_coordinates.latitude.toFixed(6)}, 
                        Lng: {location.address.geo_coordinates.longitude.toFixed(6)}
                      </span>
                    )}
                  </div>
                  {location.address.country_code && (
                    <div>Country: {location.address.country_code}</div>
                  )}
                  {location.address.email && (
                    <div>Email: {location.address.email}</div>
                  )}
                  {location.address.phone && (
                    <div>Phone: {location.address.phone}</div>
                  )}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Badge 
                    variant={location.is_active ? "default" : "secondary"}
                    className={location.is_active 
                      ? "bg-green-100 text-green-800 hover:bg-green-100" 
                      : "bg-gray-100 text-gray-500 hover:bg-gray-100"}
                  >
                    {location.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6">
        <div className="text-sm text-gray-500">
          Showing {locations.length} location{locations.length !== 1 ? 's' : ''}
        </div>
      </div>
    </Card>
  );
};

export default LocationsTable;
