import React from 'react';
import { Label } from '@/components/ui/label';

const CompanyDetailsForm = () => {
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Company Details</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="industry" className="block text-gray-700 font-medium mb-2">
            Category
          </Label>
          <select
            id="industry"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:border-[#1e90ff] focus:ring-[#1e90ff]"
          >
            <option value="">Select Industry</option>
            <option value="Technology">Technology</option>
            <option value="Finance">Finance</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
          </select>
        </div>
        <div>
          <Label htmlFor="specialty" className="block text-gray-700 font-medium mb-2">
            Specialty
          </Label>
          <select
            id="specialty"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:border-[#1e90ff] focus:ring-[#1e90ff]"
          >
            <option value="">Select Specialty</option>
            <option value="Technology">Technology</option>
            <option value="Finance">Finance</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
          </select>
        </div>
        <div>
          <Label htmlFor="companySize" className="block text-gray-700 font-medium mb-2">
            Company Size
          </Label>
          <select
            id="companySize"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:border-[#1e90ff] focus:ring-[#1e90ff]"
          >
            <option value="">Select Company Size</option>
            <option value="1-10">1-10 employees</option>
            <option value="11-50">11-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201-500">201-500 employees</option>
            <option value="501-1000">501-1000 employees</option>
            <option value="1001-5000">1001-5000 employees</option>
            <option value="5001-10000">5001-10000 employees</option>
            <option value="10001+">10001+ employees</option>
          </select>
        </div>
      </div>
    </section>
  );
};

export default CompanyDetailsForm;