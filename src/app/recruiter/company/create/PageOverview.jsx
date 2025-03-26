import React from 'react';

const PageOverview = () => {
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Page Overview</h2>
      <div className="bg-gray-50 p-6 border border-gray-200 rounded-md shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Summary:</h3>
        <p className="text-gray-700">
          Fill in all the required fields to create a new company profile. Ensure all details are accurate and up-to-date. Once completed, click 'Save' to create the company profile or 'Cancel' to discard the changes.
        </p>
      </div>
    </section>
  );
};

export default PageOverview;