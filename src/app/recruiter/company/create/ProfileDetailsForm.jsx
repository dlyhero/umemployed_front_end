import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const ProfileDetailsForm = () => {
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Details</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="contactPerson" className="text-gray-700 font-medium">
            Contact Person
          </Label>
          <Input
            id="contactPerson"
            type="text"
            placeholder="Enter contact person's name"
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactEmail" className="text-gray-700 font-medium">
            Contact Email
          </Label>
          <Input
            id="contactEmail"
            type="email"
            placeholder="Enter contact email"
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactPhone" className="text-gray-700 font-medium">
            Contact Phone
          </Label>
          <Input
            id="contactPhone"
            type="tel"
            placeholder="Enter contact phone number"
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country" className="text-gray-700 font-medium">
            Country
          </Label>
          <Input
            id="country"
            type="text"
            placeholder="Enter country"
            className="w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default ProfileDetailsForm;