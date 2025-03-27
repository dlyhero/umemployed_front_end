import React from 'react';
import { Button } from '@/components/ui/button';
import PageIdentityForm from './PageIdentityForm';
import CompanyDetailsForm from './CompanyDetailsForm';
import ProfileDetailsForm from './ProfileDetailsForm';
import PageOverview from './PageOverview';

const CompanyCreationPage = () => {
  return (
    <main className="container mx-auto p-6 bg-white rounded-lg shadow-md max-w-2xl">
      <div className="mb-6">
        <img
          src="/images/company.jpg"
          alt="Company"
          className="w-full h-32 sm:h-48 object-cover rounded-t-lg mb-4"
        />
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Before we get started...</h2>
          <p className="text-gray-600 mt-1">We need to know a little about your company.</p>
        </div>
      </div>
      <form className="space-y-8">
        <PageIdentityForm />
        <CompanyDetailsForm />
        <ProfileDetailsForm />
        <PageOverview />
        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
          <Button
            variant="destructive"
            size="default"
            className="rounded-full w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant="brand"
            size="default"
            type="submit"
            className="rounded-full w-full sm:w-auto"
          >
            Save
          </Button>
        </div>
      </form>
    </main>
  );
};

export default CompanyCreationPage;