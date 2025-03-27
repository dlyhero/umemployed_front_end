import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building, Upload } from 'lucide-react';

const PageIdentityForm = () => {
  return (
    <section className="bg-white sm:bg-transparent p-4 sm:p-0 rounded-lg sm:rounded-none shadow-md sm:shadow-none border border-gray-200 sm:border-0">
      <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-[#1e90ff] pb-2">
        Page Identity
      </h2>
      <div className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="companyName" className="text-gray-700 font-medium">
            Company Name
          </Label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="companyName"
              type="text"
              placeholder="Enter company name"
              className="w-full pl-10 text-sm sm:text-base"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyLogo" className="text-gray-700 font-medium">
            Company Logo
          </Label>
          <div className="flex items-center flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Input id="companyLogo" type="file" className="hidden" />
            <Button
              asChild
              variant="brand"
              size="sm"
              className="rounded-full w-full sm:w-auto"
            >
              <label htmlFor="companyLogo" className="cursor-pointer flex items-center justify-center">
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </label>
            </Button>
            <span className="text-gray-600 text-sm">No file chosen</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageIdentityForm;