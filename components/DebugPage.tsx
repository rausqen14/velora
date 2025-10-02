import React from 'react';

const DebugPage: React.FC = () => {
  let brandsLoaded = false;
  let brandsCount = 0;
  let firstBrand = 'N/A';
  let error = null;

  try {
    const { BRANDS, BRAND_MODELS } = require('../constants');
    brandsLoaded = true;
    brandsCount = BRANDS ? BRANDS.length : 0;
    firstBrand = BRANDS && BRANDS[0] ? BRANDS[0] : 'undefined';
  } catch (e: any) {
    error = e.message;
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold mb-4">Debug Page</h1>
          <div className="space-y-2">
            <p><strong>Constants Loaded:</strong> {brandsLoaded ? 'Yes' : 'No'}</p>
            <p><strong>Brands Count:</strong> {brandsCount}</p>
            <p><strong>First Brand:</strong> {firstBrand}</p>
            {error && <p className="text-red-600"><strong>Error:</strong> {error}</p>}
            <p className="text-green-600 mt-4">If you see this page, React is working!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;

