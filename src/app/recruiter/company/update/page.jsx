"use client";

// src/app/recruiter/company/update/page.jsx
import React, { useState } from 'react';
import CompanyInformation from './CompanyInformation';
import ContactInformation from './ContactInformation';
import CompanyDescription from './CompanyDescription';
import SocialLinksAndVideo from './SocialLinksAndVideo';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button'; // Import the new Button component

const CompanyInfoPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    size: '',
    location: '',
    founded: '',
    website_url: '',
    country: '',
    contact_email: '',
    contact_phone: '',
    description: '',
    mission_statement: '',
    linkedin: '',
  });
  const [videoFile, setVideoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleQuillChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    if (videoFile) {
      data.append('video_introduction', videoFile);
    }
    try {
      const response = await fetch('/api/submit-company-info', {
        method: 'POST',
        body: data,
      });
      if (response.ok) {
        alert('Company information submitted successfully!');
        setFormData({
          name: '',
          industry: '',
          size: '',
          location: '',
          founded: '',
          website_url: '',
          country: '',
          contact_email: '',
          contact_phone: '',
          description: '',
          mission_statement: '',
          linkedin: '',
        });
        setVideoFile(null);
      } else {
        alert('Failed to submit form. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md py-4">
        <h1 className="text-3xl font-bold text-center text-gray-800">Company Profile</h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-4 md:px-8 py-8">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-8"
          encType="multipart/form-data"
        >
          <CompanyInformation formData={formData} handleChange={handleChange} />
          <ContactInformation formData={formData} handleChange={handleChange} />
          <CompanyDescription formData={formData} handleQuillChange={handleQuillChange} />
          <SocialLinksAndVideo
            formData={formData}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
          />

          {/* Submit Button */}
          <div className="flex justify-end">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                type="submit"
                variant="brand" // Matches your blue button style
                size="default"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Save Changes'}
              </Button>
            </motion.div>
          </div>
        </form>
      </main>


    </div>
  );
};

export default CompanyInfoPage;