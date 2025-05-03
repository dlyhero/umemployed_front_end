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
      className="space-y-6"
    >
      <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-500 pb-2">
        Social Links & Media
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">
            LinkedIn Profile
          </label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              id="linkedin"
              name="linkedin"
              type="url"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/company/example"
              maxLength={200}
              className="pl-10"
            />
          </div>
        </div>
        <div>
          <label htmlFor="video_introduction" className="block text-sm font-medium text-gray-700 mb-1">
            Video Introduction
          </label>
          <div className="relative">
            <Video className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              id="video_introduction"
              name="video_introduction"
              type="url"
              value={formData.video_introduction}
              onChange={handleChange}
              placeholder="https://youtube.com/watch?v=example"
              maxLength={200}
              className="pl-10"
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default SocialLinksAndVideo;