import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { User, Mail, Phone, Globe } from 'lucide-react';

const ProfileDetailsForm = () => {
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Details</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="contactPerson" className="text-gray-700 font-medium">
            Contact Person
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="contactPerson"
              type="text"
              placeholder="Enter contact person's name"
              className="w-full pl-10"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactEmail" className="text-gray-700 font-medium">
            Contact Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="contactEmail"
              type="email"
              placeholder="Enter contact email"
              className="w-full pl-10"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactPhone" className="text-gray-700 font-medium">
            Contact Phone
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="contactPhone"
              type="tel"
              placeholder="Enter contact phone number"
              className="w-full pl-10"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="country" className="text-gray-700 font-medium">
            Country
          </Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="country"
              type="text"
              placeholder="Enter country"
              className="w-full pl-10"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileDetailsForm;