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
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/lib/useToast';

const CompanyUpdatePage = () => {
  const { companyId } = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();
  const toast = useToast();
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
    logo: '',
    cover_photo: '',
  });
  const [logoFile, setLogoFile] = useState(null);
  const [coverPhotoFile, setCoverPhotoFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const BASE_URL = 'https://umemployed-app-afec951f7ec7.herokuapp.com';

  useEffect(() => {
    if (status === 'authenticated') {
      if (session?.user?.role !== 'recruiter') {
        toast.error('Only recruiters can update company profiles.');
        router.push('/select-role');
        return;
      }
      const fetchCompanyData = async () => {
        if (!session?.accessToken) {
          toast.error('Authentication token missing. Please sign in again.');
          router.push('/login?callbackUrl=/companies/' + companyId + '/update');
          return;
        }
        try {
          const response = await axios.get(
            `${BASE_URL}/api/company/company-details/${companyId}/`,
            {
              headers: {
                Authorization: `Bearer ${session.accessToken}`,
              },
            }
          );
          console.log('GET Response:', response.data); // Debug
          setFormData({
            name: response.data.name || '',
            industry: response.data.industry || '',
            size: response.data.size || '',
            location: response.data.location || '',
            founded: response.data.founded || '',
            website_url: response.data.website_url || '',
            country: response.data.country || '',
            contact_email: response.data.contact_email || '',
            contact_phone: response.data.contact_phone || '',
            description: response.data.description || '',
            mission_statement: response.data.mission_statement || '',
            linkedin: response.data.linkedin || '',
            video_introduction: response.data.video_introduction || '',
            job_openings: response.data.job_openings || '',
            logo: response.data.logo || '',
            cover_photo: response.data.cover_photo || '',
          });
        } catch (err) {
          console.error('Error fetching company:', {
            status: err.response?.status,
            data: err.response?.data,
            message: err.message,
          });
          let errorMessage = 'Failed to load company data. Please try again.';
          if (err.response?.status === 404) {
            errorMessage = 'Company not found. Please check the company ID.';
          } else if (err.response?.status === 401) {
            errorMessage = 'Unauthorized. Please sign in again.';
            router.push('/login?callbackUrl=/companies/' + companyId + '/update');
          }
          toast.error(errorMessage);
        } finally {
          setLoading(false);
        }
      };
      fetchCompanyData();
    } else if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/companies/' + companyId + '/update');
    }
  }, [status, session, companyId, router, toast]);

  if (status === 'loading' || loading) {
    return <Loader />;
  }

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
      console.log(`${name} selected:`, files[0].name, files[0].size, files[0].type); // Debug
      if (name === 'logo') {
        setLogoFile(files[0]);
      } else if (name === 'cover_photo') {
        setCoverPhotoFile(files[0]);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.country) {
      toast.error('Company name and country are required.');
      return;
    }
    setSubmitting(true);

    const data = new FormData();
    for (const key in formData) {
      if (formData[key] && key !== 'logo' && key !== 'cover_photo') {
        data.append(key, formData[key]);
      }
    }
    if (logoFile) {
      data.append('logo', logoFile);
      console.log('Logo appended:', logoFile.name); // Debug
    }
    if (coverPhotoFile) {
      data.append('cover_photo', coverPhotoFile);
      console.log('Cover photo appended:', coverPhotoFile.name); // Debug
    }

    // Debug FormData
    for (let [key, value] of data.entries()) {
      console.log(`FormData: ${key} =`, value);
    }

    const token = session?.accessToken;
    if (!token) {
      toast.error('No authentication token found. Please sign in again.');
      setSubmitting(false);
      return;
    }

    try {
      const response = await axios.put(
        `${BASE_URL}/api/company/update-company/${companyId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Update API response:', response.data); // Debug
      toast.success('Company updated successfully!');
      router.push(`/companies/${companyId}/dashboard`);
    } catch (err) {
      console.error('Error updating company:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      let errorMessage = 'Failed to update company. Please try again.';
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
      setSubmitting(false);
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
          <h2 className="text-3xl font-bold text-gray-800">Update Your Company Profile</h2>
          <p className="text-gray-600 mt-1">Modify your company details below.</p>
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
          />
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
            <Button
              variant="destructive"
              size="default"
              className="rounded-full w-full sm:w-auto"
              disabled={submitting}
              type="button"
              onClick={() => router.push(`/companies/${companyId}/dashboard`)}
            >
              Cancel
            </Button>
            <Button
              variant="brand"
              size="default"
              type="submit"
              className="rounded-full w-full sm:w-auto flex items-center justify-center"
              disabled={submitting}
            >
              {submitting && (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                  ></path>
                </svg>
              )}
              {submitting ? 'Updating...' : 'Update Company'}
            </Button>
          </div>
        </form>
      )}
    </main>
  );
};

export default CompanyUpdatePage;