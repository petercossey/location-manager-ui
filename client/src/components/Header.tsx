import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm4.24 13.11l-4.24 2.12-4.24-2.12V8.89L12 6.77l4.24 2.12v6.22z"/>
            </svg>
            <h1 className="ml-3 text-xl font-semibold text-gray-800">BigCommerce Locations Manager</h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
