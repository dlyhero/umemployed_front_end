"use client";

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { countries } from 'countries-list';
import { Building2, Globe, Users, MapPin, Calendar, Link as LinkIcon } from 'lucide-react';

const CompanyInformation = ({ formData, handleChange }) => {
  // Map country codes to names, sorted alphabetically by name
  const countryList = Object.entries(countries)
    .map(([code, { name }]) => ({ code, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
  const industries = [
    'Technology', 'Finance', 'Healthcare', 'Education', 'Manufacturing', 'Retail', 'Hospitality', 'Construction', 'Transportation'
  ];
  const sizes = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5001-10000', '10001+'];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-500 pb-2">
        Company Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., UmEmployed"
              maxLength={100}
              className="pl-10"
            />
          </div>
        </div>
        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
            Industry
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Select
              value={formData.industry}
              onValueChange={(value) => handleChange({ target: { name: 'industry', value } })}
            >
              <SelectTrigger className="pl-10">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
            Company Size
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Select
              value={formData.size}
              onValueChange={(value) => handleChange({ target: { name: 'size', value } })}
            >
              <SelectTrigger className="pl-10">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {sizes.map((size) => (
                  <SelectItem key={size} value={size}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., New York, NY"
              maxLength={100}
              className="pl-10"
            />
          </div>
        </div>
        <div>
          <label htmlFor="founded" className="block text-sm font-medium text-gray-700 mb-1">
            Year Founded
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="number"
              id="founded"
              name="founded"
              value={formData.founded}
              onChange={handleChange}
              placeholder="e.g., 2020"
              min={-2147483648}
              max={2147483647}
              className="pl-10"
            />
          </div>
        </div>
        <div>
          <label htmlFor="website_url" className="block text-sm font-medium text-gray-700 mb-1">
            Website URL
          </label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="url"
              id="website_url"
              name="website_url"
              value={formData.website_url}
              onChange={handleChange}
              placeholder="e.g., https://umemployed.com"
              maxLength={200}
              className="pl-10"
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
            Country *
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Select
              value={formData.country}
              onValueChange={(value) => handleChange({ target: { name: 'country', value } })}
              required
            >
              <SelectTrigger className="pl-10">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {countryList.map(({ code, name }) => (
                  <SelectItem key={code} value={code}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default CompanyInformation;