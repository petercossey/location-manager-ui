import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="ml-3 text-xl font-semibold text-gray-800">BigCommerce API Locations Manager</h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
