"use client";

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Link as LinkIcon, Video, Upload } from 'lucide-react';

const SocialLinksAndVideo = ({ formData, handleChange, handleFileChange, logoFile, coverPhotoFile }) => {
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
              maxLength={200}
              className="pl-10"
            />
          </div>
        </div>
        <div>
          <label htmlFor="video_introduction" className="block text-sm font-medium text-gray-700 mb-1">
            Video Introduction URL
          </label>
          <div className="relative">
            <Video className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="url"
              id="video_introduction"
              name="video_introduction"
              value={formData.video_introduction}
              onChange={handleChange}
              placeholder="e.g., https://youtube.com/video-id"
              maxLength={200}
              className="pl-10"
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
            Company Logo
          </label>
          <div className="flex items-center flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mb-4">
            <Input
              id="logo"
              name="logo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              asChild
              variant="brand"
              size="sm"
              className="rounded-full w-full sm:w-auto"
            >
              <label htmlFor="logo" className="cursor-pointer flex items-center justify-center">
                <Upload className="h-4 w-4 mr-2" />
                Upload Logo
              </label>
            </Button>
            <span className="text-gray-600 text-sm">{logoFile ? logoFile.name : 'No file chosen'}</span>
          </div>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="cover_photo" className="block text-sm font-medium text-gray-700 mb-1">
            Cover Photo
          </label>
          <div className="flex items-center flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Input
              id="cover_photo"
              name="cover_photo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              asChild
              variant="brand"
              size="sm"
              className="rounded-full w-full sm:w-auto"
            >
              <label htmlFor="cover_photo" className="cursor-pointer flex items-center justify-center">
                <Upload className="h-4 w-4 mr-2" />
                Upload Cover Photo
              </label>
            </Button>
            <span className="text-gray-600 text-sm">{coverPhotoFile ? coverPhotoFile.name : 'No file chosen'}</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default SocialLinksAndVideo;