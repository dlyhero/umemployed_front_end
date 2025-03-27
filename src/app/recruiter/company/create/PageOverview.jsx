import React from 'react';

const PageOverview = () => {
  return (
    <section className="bg-white sm:bg-transparent p-4 sm:p-0 rounded-lg sm:rounded-none shadow-md sm:shadow-none border border-gray-200 sm:border-0">
      <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-[#1e90ff] pb-2">
        Page Overview
      </h2>
      <div className="bg-gray-50 p-4 sm:p-6 rounded-md mt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Summary:</h3>
        <p className="text-gray-700 text-sm sm:text-base">
          Fill in all the required fields to create a new company profile. Ensure all details are accurate and up-to-date. Once completed, click 'Save' to create the company profile or 'Cancel' to discard the changes.
        </p>
      </div>
    </section>
  );
};

export default PageOverview;