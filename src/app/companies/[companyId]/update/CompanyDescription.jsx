'use client';

import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

const CompanyDescription = ({ formData, handleChange }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="space-y-4"
    >
      <h2 className="text-lg font-semibold text-gray-800">Company Description</h2>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter company description"
            className="w-full pl-10 p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1e90ff] focus:border-[#1e90ff] h-16"
            rows={3}
          />
        </div>
      </div>
      <div>
        <label htmlFor="mission_statement" className="block text-sm font-medium text-gray-700 mb-1">
          Mission Statement
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <textarea
            id="mission_statement"
            name="mission_statement"
            value={formData.mission_statement}
            onChange={handleChange}
            placeholder="Enter mission statement"
            className="w-full pl-10 p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1e90ff] focus:border-[#1e90ff] h-16"
            rows={3}
          />
        </div>
      </div>
    </motion.section>
  );
};

export default CompanyDescription;