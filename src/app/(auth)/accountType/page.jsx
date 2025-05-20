"use client";

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
// import CompanyInformation from './CompanyInformation';
// import ContactInformation from './ContactInformation';
// import CompanyDescription from './CompanyDescription';
// import SocialLinksAndVideo from './SocialLinksAndVideo';
import Loader from "@/src/components/common/Loader/Loader";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const CompanyCreationPage = () => {
  const { data: session, status } = useSession();
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
    video_introduction: '',
    job_openings: '',
  });
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (status === 'loading') {
    return <Loader />;
  }
  if (status === 'unauthenticated') {
    router.push('/api/auth/signin');
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setLogoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.country) {
      toast.error('Country is required.');
      return;
    }
    setLoading(true);

    const data = new FormData();
    for (const key in formData) {
      if (formData[key]) data.append(key, formData[key]);
    }
    if (logoFile) {
      data.append('logo', logoFile);
      console.log('Logo File:', logoFile.name, logoFile.size, logoFile.type);
    }

    const token = session?.user?.accessToken || session?.accessToken;

    if (!token) {
      toast.error('No authentication token found. Please sign in again.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'https://umemployed-f6fdddfffmhjhjcj.canadacentral-01.azurewebsites.net/api/company/create-company/',
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      toast.success('Company created successfully!');
      router.push('/recruiter/dashboard');
    } catch (err) {
      console.error('Error:', err.response?.data || err.message);
      if (
        err.response?.status === 500 &&
        err.response?.data?.includes('duplicate key value violates unique constraint')
      ) {
        toast.error('A user can only create one company.');
      } else {
        toast.error(err.response?.data?.detail || JSON.stringify(err.response?.data) || 'Failed to create company.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-6 bg-white rounded-lg shadow-md max-w-2xl">
      <div className="mb-6">
        <img
          src="/images/company.jpg"
          alt="Company"
          className="w-full h-32 sm:h-48 object-cover rounded-t-lg mb-4"
        />
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Create Your Company Profile</h2>
          <p className="text-gray-600 mt-1">Provide your company details below.</p>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <CompanyInformation formData={formData} handleChange={handleInputChange} />
          <ContactInformation formData={formData} handleChange={handleInputChange} />
          <CompanyDescription formData={formData} handleChange={handleInputChange} />
          <SocialLinksAndVideo
            formData={formData}
            handleChange={handleInputChange}
            handleFileChange={handleFileChange}
            logoFile={logoFile}
          />
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
            <Button
              variant="destructive"
              size="default"
              className="rounded-full w-full sm:w-auto"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="brand"
              size="default"
              type="submit"
              className="rounded-full w-full sm:w-auto"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      )}
    </main>
  );
};

export default CompanyCreationPage;