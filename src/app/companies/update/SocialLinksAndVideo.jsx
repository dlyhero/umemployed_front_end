"use client";

// src/components/SocialLinksAndVideo.jsx
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { LinkIcon, VideoCameraIcon } from '@heroicons/react/24/outline';

const SocialLinksAndVideo = ({ formData, handleChange, handleFileChange }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-500 pb-2">
        Social Links & Video
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">
            LinkedIn
          </label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="url"
              id="linkedin"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="e.g., https://linkedin.com/company/umemployed"
              className="pl-10"
            />
          </div>
        </div>
        <div>
          <label htmlFor="video_introduction" className="block text-sm font-medium text-gray-700 mb-1">
            Company Video
          </label>
          <div className="relative">
            <VideoCameraIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="file"
              id="video_introduction"
              name="video_introduction"
              onChange={handleFileChange}
              accept="video/*"
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all pl-10"
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default SocialLinksAndVideo;