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
        <img src="/icons/company.jpg" alt="Company" className="w-24 h-24 mx-auto mb-4" />
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Before we get started...</h2>
          <p className="text-gray-600 mt-1">We need to know a little about your company.</p>
        </div>
      </div>
      <form className="space-y-8">
        <PageIdentityForm />
        <hr className="border-gray-200" />
        <CompanyDetailsForm />
        <hr className="border-gray-200" />
        <ProfileDetailsForm />
        <hr className="border-gray-200" />
        <PageOverview />
        <hr className="border-gray-200" />
        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-[#1e90ff] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#1a78d6] transition-colors"
          >
            Save
          </Button>
        </div>
      </form>
    </main>
  );
};

export default CompanyCreationPage;