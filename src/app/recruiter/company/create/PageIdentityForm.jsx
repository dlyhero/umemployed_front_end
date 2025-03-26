import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const PageIdentityForm = () => {
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Page Identity</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="companyName" className="text-gray-700 font-medium">
            Company Name
          </Label>
          <Input
            id="companyName"
            type="text"
            placeholder="Enter company name"
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyLogo" className="text-gray-700 font-medium">
            Company Logo
          </Label>
          <div className="flex items-center">
            <Input id="companyLogo" type="file" className="hidden" />
            <Button
              asChild
              className="bg-[#1e90ff] text-white hover:bg-[#1a78d6] rounded-full"
            >
              <label htmlFor="companyLogo" className="cursor-pointer">
                Choose File
              </label>
            </Button>
            <span className="ml-3 text-gray-600 text-sm">No file chosen</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageIdentityForm;