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
import toast from 'react-hot-toast';
import { Sideba } from '../dashboard/recruiter/Sideba';

const CompanyUpdatePage = () => {
  const { companyId } = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();
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
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState(`/companies/${companyId}/update`);
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
          router.push(`/login?callbackUrl=/companies/${companyId}/update`);
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
          });
        } catch (err) {
          let errorMessage = 'Failed to load company data. Please try again.';
          if (err.response?.status === 404) {
            errorMessage = 'Company not found. Please check the company ID.';
          } else if (err.response?.status === 401) {
            errorMessage = 'Unauthorized. Please sign in again.';
            router.push(`/login?callbackUrl=/companies/${companyId}/update`);
          }
          toast.error(errorMessage);
        } finally {
          setLoading(false);
        }
      };
      fetchCompanyData();
    } else if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=/companies/${companyId}/update`);
    }
  }, [status, session, companyId, router]);

  if (status === 'loading' || loading) {
    return <Loader />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.country) {
      toast.error('Company name and country are required.');
      return;
    }
    setSubmitting(true);

    const payload = {};
    for (const key in formData) {
      if (formData[key] !== '' && formData[key] !== null && formData[key] !== undefined) {
        payload[key] = key === 'founded' ? parseInt(formData[key]) : formData[key];
      }
    }

    const token = session?.accessToken;
    if (!token) {
      toast.error('No authentication token found. Please sign in again.');
      setSubmitting(false);
      return;
    }

    try {
      const response = await axios.put(
        `${BASE_URL}/api/company/update-company/${companyId}/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      toast.success('Company updated successfully!');
      router.push(`/companies/${companyId}/dashboard`);
    } catch (err) {
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
    <div className="container mx-auto max-w-6xl px-4 flex flex-col lg:flex-row gap-6 mt-16 mb-16">
      <Sideba activeTab={activeTab} setActiveTab={setActiveTab} companyId={companyId} />
      <main className="flex-1 bg-white rounded-lg shadow-md p-4">
        <div className="mb-4">
          <img
            src="/images/company.jpg"
            alt="Company"
            className="w-full h-32 sm:h-48 object-cover rounded-t-lg mb-4"
          />
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800">Update Your Company Profile</h2>
            <p className="text-gray-600 text-sm">Modify your company details below.</p>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <CompanyInformation formData={formData} handleChange={handleInputChange} />
            <ContactInformation formData={formData} handleChange={handleInputChange} />
            <CompanyDescription formData={formData} handleChange={handleInputChange} />
            <SocialLinksAndVideo formData={formData} handleChange={handleInputChange} />
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                size="sm"
                type="button"
                disabled={submitting}
                onClick={() => router.push(`/companies/${companyId}/dashboard`)}
                className="rounded-md"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                type="submit"
                disabled={submitting}
                className="bg-[#1e90ff] text-white hover:bg-[#1c86e6] rounded-md"
              >
                {submitting ? 'Updating...' : 'Update Company'}
              </Button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};

export default CompanyUpdatePage;