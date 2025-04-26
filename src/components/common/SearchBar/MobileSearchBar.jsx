"use client";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useClickOutside } from "@/src/hooks/useClickOutside";
import { 
  Search,
  Briefcase,
  Building,
  MapPin,
  User,
  Clock,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import mockData  from "./mockData" // Adjust the import path as necessary


function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsOpen(query.length > 0);
  };

  const filteredData = {
    jobs: mockData.jobs.filter(item => 
      item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    companies: mockData.companies.filter(item => 
      item.text.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    locations: mockData.locations.filter(item => 
      item.text.toLowerCase().includes(searchQuery.toLowerCase())
    )
  };

  return (
    <div className="relative w-full  md:hidden">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search for jobs, companies, or locations"
          className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-brand"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => searchQuery.length > 0 && setIsOpen(true)}
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-12 left-0 w-full bg-white shadow-lg rounded-lg border border-gray-200 z-50"
          >
            <div className="p-4 space-y-4">
              {filteredData.jobs.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center text-sm font-medium text-gray-500">
                    <Briefcase className="h-4 w-4 mr-2" />
                    <span>Jobs</span>
                  </div>
                  {filteredData.jobs.map((job, index) => (
                    <div key={`job-${index}`} className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <div className="font-medium">{job.text}</div>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Building className="h-3 w-3 mr-1" />
                        {job.company}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {job.location}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredData.companies.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center text-sm font-medium text-gray-500">
                    <Building className="h-4 w-4 mr-2" />
                    <span>Companies</span>
                  </div>
                  {filteredData.companies.map((company, index) => (
                    <div key={`company-${index}`} className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <div className="font-medium">{company.text}</div>
                      <div className="text-sm text-gray-600 mt-1">{company.info}</div>
                    </div>
                  ))}
                </div>
              )}

              {Object.values(filteredData).every(arr => arr.length === 0) && (
                <div className="text-center py-4 text-gray-500">
                  No results found for "{searchQuery}"
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SearchBar;