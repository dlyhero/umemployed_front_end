"use client";

// src/components/CompanyDescription.jsx
import { motion } from 'framer-motion';
import MDEditor from '@uiw/react-md-editor';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

const CompanyDescription = ({ formData, handleQuillChange }) => {
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <div className="relative">
          <DocumentTextIcon className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
          <MDEditor
            value={formData.description}
            onChange={(value) => handleQuillChange('description', value || '')}
            className="bg-white rounded-lg pl-10"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mission Statement</label>
        <div className="relative">
          <DocumentTextIcon className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
          <MDEditor
            value={formData.mission_statement}
            onChange={(value) => handleQuillChange('mission_statement', value || '')}
            className="bg-white rounded-lg pl-10"
          />
        </div>
      </div>
    </motion.section>
  );
};

export default CompanyDescription;