'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import CompanyInformation from './CompanyInformation';
import ContactInformation from './ContactInformation';
import CompanyDescription from './CompanyDescription';
import SocialLinksAndVideo from './SocialLinksAndVideo';
import Loader from '@/src/components/common/Loader/Loader';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useToast } from '@/lib/useToast';
import toast from 'react-hot-toast';

const CompanyCreationPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
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
  const [coverPhotoFile, setCoverPhotoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
   const user = useSession();
    console.log(user);
      
  const BASE_URL = 'https://umemployed-app-afec951f7ec7.herokuapp.com';

  useEffect(() => {
    if (status === 'authenticated') {
     if (session?.user?.has_company) {
        router.push(`/companies/${session.user.companyId}/dashboard`);
      }
    } else if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/companies/create');
    }
  }, [status, session, router]);

  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      if (coverPhotoPreview) URL.revokeObjectURL(coverPhotoPreview);
    };
  }, [logoPreview, coverPhotoPreview]);

  if (status === 'loading') {
    return <Loader />;
  }
  if (session?.user?.has_company) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (files[0].size > maxSize) {
        toast.error(`${name === 'logo' ? 'Logo' : 'Cover photo'} must be under 5MB.`);
        return;
      }
      if (!files[0].type.startsWith('image/')) {
        toast.error(`${name === 'logo' ? 'Logo' : 'Cover photo'} must be an image.`);
        return;
      }

      const file = files[0];
      const previewUrl = URL.createObjectURL(file);

      if (name === 'logo') {
        setLogoFile(file);
        setLogoPreview(previewUrl);
      } else if (name === 'cover_photo') {
        setCoverPhotoFile(file);
        setCoverPhotoPreview(previewUrl);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.country) {
      toast.error('Company name and country are required.');
      return;
    }
    setLoading(true);

    const data = new FormData();
    for (const key in formData) {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    }
    if (logoFile) {
      data.append('logo', logoFile, logoFile.name);
    }
    if (coverPhotoFile) {
      data.append('cover_photo', coverPhotoFile, coverPhotoFile.name);
    }

    const token = session?.accessToken;
    if (!token) {
      toast.error('No authentication token found. Please sign in again.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/company/create-company/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      session.user.has_company = true;
      session.user.companyId = response.data.id;

      toast.success('Company created successfully!');
      router.push(`/companies/${response.data.id}/dashboard`);
    } catch (err) {
      console.error('Error creating company:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      let errorMessage = 'Failed to create company. Please try again.';
      if (err.response?.data) {
        if (err.response.data.detail) {
          errorMessage = err.response.data.detail;
        } else if (err.response.data.non_field_errors) {
          errorMessage = err.response.data.non_field_errors.join(', ');
        } else if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else {
          const errors = Object.values(err.response.data).flat();
          errorMessage = errors.join(', ');
        }
      }

      toast.error(errorMessage);
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
            coverPhotoFile={coverPhotoFile}
            logoPreview={logoPreview}
            coverPhotoPreview={coverPhotoPreview}
          />
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
            <Button
              variant="destructive"
              size="default"
              className="rounded-full w-full sm:w-auto"
              disabled={loading}
              type="button"
              onClick={() => router.push('/select-role')}
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
              {loading ? 'Creating...' : 'Create Company'}
            </Button>
          </div>
        </form>
      )}
    </main>
  );
};

export default CompanyCreationPage;