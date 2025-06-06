'use client';

import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';

const ContactInformation = ({ formData, handleChange }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="space-y-4"
    >
      <h2 className="text-lg font-semibold text-gray-800">Contact Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Email
          </label>
          <div className="relative">
            <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="email"
              id="contact_email"
              name="contact_email"
              value={formData.contact_email}
              onChange={handleChange}
              placeholder="e.g., contact@umemployed.com"
              className="pl-10 h-9 text-sm border-gray-300 rounded-md focus:ring-[#1e90ff] focus:border-[#1e90ff]"
            />
          </div>
        </div>
        <div>
          <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Phone
          </label>
          <div className="relative">
            <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="tel"
              id="contact_phone"
              name="contact_phone"
              value={formData.contact_phone}
              onChange={handleChange}
              placeholder="e.g., +1 123-456-7890"
              className="pl-10 h-9 text-sm border-gray-300 rounded-md focus:ring-[#1e90ff] focus:border-[#1e90ff]"
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ContactInformation;