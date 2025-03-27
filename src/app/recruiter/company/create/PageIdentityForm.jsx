import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building, Upload } from 'lucide-react';

const PageIdentityForm = () => {
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Page Identity</h2>
      <div className="space-y-4">
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
              className="w-full pl-10"
            />
          </div>
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
              <label htmlFor="companyLogo" className="cursor-pointer flex items-center">
                <Upload className="h-4 w-4 mr-2" />
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