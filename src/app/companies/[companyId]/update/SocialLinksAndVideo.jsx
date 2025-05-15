'use client';

import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Link as LinkIcon, Video } from 'lucide-react';

const SocialLinksAndVideo = ({ formData, handleChange }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="space-y-4"
    >
      <h2 className="text-lg font-semibold text-gray-800">Social Links & Media</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">
            LinkedIn
          </label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="url"
              id="linkedin"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="e.g., https://linkedin.com/company/umemployed"
              maxLength={200}
              className="pl-10 h-9 text-sm border-gray-300 rounded-md focus:ring-[#1e90ff] focus:border-[#1e90ff]"
            />
          </div>
        </div>
        <div>
          <label htmlFor="video_introduction" className="block text-sm font-medium text-gray-700 mb-1">
            Video Introduction URL
          </label>
          <div className="relative">
            <Video className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="url"
              id="video_introduction"
              name="video_introduction"
              value={formData.video_introduction}
              onChange={handleChange}
              placeholder="e.g., https://youtube.com/video-id"
              maxLength={200}
              className="pl-10 h-9 text-sm border-gray-300 rounded-md focus:ring-[#1e90ff] focus:border-[#1e90ff]"
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default SocialLinksAndVideo;