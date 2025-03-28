"use client";

import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

const CompanyDescription = ({ formData, handleChange }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-500 pb-2">
        Company Description
      </h2>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter company description"
            className="w-full pl-10 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
          />
        </div>
      </div>
      <div>
        <label htmlFor="mission_statement" className="block text-sm font-medium text-gray-700 mb-1">
          Mission Statement
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
          <textarea
            id="mission_statement"
            name="mission_statement"
            value={formData.mission_statement}
            onChange={handleChange}
            placeholder="Enter mission statement"
            className="w-full pl-10 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
          />
        </div>
      </div>
      <div>
        <label htmlFor="job_openings" className="block text-sm font-medium text-gray-700 mb-1">
          Job Openings
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
          <textarea
            id="job_openings"
            name="job_openings"
            value={formData.job_openings}
            onChange={handleChange}
            placeholder="List job openings"
            className="w-full pl-10 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
          />
        </div>
      </div>
    </motion.section>
  );
};

export default CompanyDescription;