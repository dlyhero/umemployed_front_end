// src/app/companies/create/CompanyCreationPage.jsx
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
import toast from 'react-hot-toast';
import companySchema from '@/src/app/companies/create/schemas/companySchema';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const CompanyCreationPage = () => {
  const { data: session, status, update } = useSession();
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
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [redirectPath, setRedirectPath] = useState(null);
  const BASE_URL = 'https://umemployed-f6fdddfffmhjhjcj.canadacentral-01.azurewebsites.net/';
  const totalSteps = 3;

  const logError = (context, error, additionalData = {}) => {
    const errorDetails = {
      timestamp: new Date().toISOString(),
      context,
      error: error.message || 'Unknown error',
      stack: error.stack || 'No stack trace',
      ...additionalData,
    };
    console.error(`[ERROR] ${context}:`, JSON.stringify(errorDetails, null, 2));
    return errorDetails;
  };

  const logDebug = (context, data) => {
    console.debug(`[DEBUG] ${context}:`, JSON.stringify({
      timestamp: new Date().toISOString(),
      ...data,
    }, null, 2));
  };

  useEffect(() => {
    console.log('[CompanyCreation] Initial session check:', {
      sessionStatus: status,
      user: session?.user,
      hasCompany: session?.user?.has_company,
      companyId: session?.user?.company_id,
    });
    if (status === 'loading') {
      logDebug('useEffect', { state: 'Session loading' });
      return;
    }
    if (status === 'unauthenticated') {
      logDebug('useEffect', { state: 'User unauthenticated, setting redirect to /login' });
      setRedirectPath('/login?callbackUrl=/companies/create');
      return;
    }
    if (session?.user?.has_company && session?.user?.company_id) {
      const dashboardPath = `/companies/${session.user.company_id}/dashboard`;
      logDebug('useEffect', { state: 'User has company, setting redirect to', dashboardPath });
      setRedirectPath(dashboardPath);
      return;
    }
    logDebug('useEffect', { state: 'No redirect needed, rendering form' });
  }, [session, status]);

  useEffect(() => {
    if (redirectPath) {
      console.log('[CompanyCreation] Redirecting to:', { redirectPath });
      router.push(redirectPath);
      router.refresh();
      console.log('[CompanyCreation] Redirect initiated, router state:', { pathname: router.pathname });
    }
  }, [redirectPath, router]);

  const handleInputChange = (e) => {
    try {
      const { name, value } = e.target;
      logDebug('Input Change', { name, value });
      if (name === 'founded') {
        setFormData((prev) => ({ ...prev, [name]: value === '' ? '' : parseInt(value) || '' }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } catch (error) {
      logError('Input Change', error, { input: e.target });
      toast.error('Error updating form data.');
    }
  };

  const handleContinue = () => {
    logDebug('Continue Button', { step, formData });
    if (step === 1) {
      if (!formData.name || !formData.country) {
        toast.error('Company name and country are required.');
        return;
      }
    }
    if (step < totalSteps) {
      setStep(step + 1);
      logDebug('Step Change', { newStep: step + 1 });
    }
  };

  const handlePrevious = () => {
    logDebug('Previous Button', { step });
    if (step > 1) {
      setStep(step - 1);
      logDebug('Step Change', { newStep: step - 1 });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('[CompanyCreation] Form submission started:', { step, formData });
    if (step !== totalSteps) {
      logError('Form Submit', new Error('Submission attempted on wrong step'), { step });
      toast.error('Please complete all steps before submitting.');
      return;
    }

    try {
      setLoading(true);
      console.log('[CompanyCreation] Validating form data');
      const result = companySchema.safeParse(formData);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        const errorMessage = Object.values(errors).flat().join(', ');
        throw new Error(errorMessage || 'Invalid form data.');
      }

      const payload = {};
      for (const key in formData) {
        if (formData[key] !== '' && formData[key] !== null && formData[key] !== undefined) {
          payload[key] = key === 'founded' ? parseInt(formData[key]) : formData[key];
        }
      }

      const token = session?.accessToken;
      if (!token) {
        throw new Error('No authentication token found. Please sign in again.');
      }

      console.log('[CompanyCreation] Sending API request:', {
        url: `${BASE_URL}/api/company/create-company/`,
        payload,
      });

      const response = await axios.post(
        `${BASE_URL}/api/company/create-company/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('[CompanyCreation] API response:', {
        status: response.status,
        data: response.data,
      });

      console.log('[CompanyCreation] Updating session');
      try {
        const updatedSession = await update({
          ...session,
          user: {
            ...session?.user,
            has_company: true,
            company_id: response.data.id,
          },
        });
        console.log('[CompanyCreation] Session updated:', updatedSession);
      } catch (sessionError) {
        logError('Session Update', sessionError);
        toast.error('Company created, but session update failed. Please log in again.');
      }

      toast.success('Company created successfully!');
      const redirectPath = `/companies/${response.data.id}/dashboard`;
      console.log('[CompanyCreation] Setting redirect path:', redirectPath);
      setRedirectPath(redirectPath);
    } catch (err) {
      const errorDetails = logError('Form Submit', err, {
        status: err.response?.status,
        data: err.response?.data,
        requestPayload: payload,
      });
      console.error('[CompanyCreation] Submission error:', errorDetails);
      toast.error(err.message || 'Failed to create company.');
    } finally {
      setLoading(false);
      console.log('[CompanyCreation] Submission completed, loading:', loading);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      logDebug('KeyDown', { key: e.key, step });
      if (step < totalSteps) {
        handleContinue();
      } else {
        handleSubmit(e);
      }
    }
  };

  const renderStep = () => {
    logDebug('Render Step', { step });
    switch (step) {
      case 1:
        return <CompanyInformation formData={formData} handleChange={handleInputChange} />;
      case 2:
        return (
          <div className="space-y-4">
            <ContactInformation formData={formData} handleChange={handleInputChange} />
            <CompanyDescription formData={formData} handleChange={handleInputChange} />
          </div>
        );
      case 3:
        return <SocialLinksAndVideo formData={formData} handleChange={handleInputChange} />;
      default:
        return null;
    }
  };

  if (status === 'loading') {
    console.log('[CompanyCreation] Rendering loader due to session loading');
    return <Loader />;
  }

  if (redirectPath) {
    console.log('[CompanyCreation] Rendering loader due to pending redirect:', redirectPath);
    return <Loader />;
  }

  console.log('[CompanyCreation] Rendering form, step:', step);
  return (
    <main className="container mx-auto p-4 bg-white rounded-lg shadow-md max-w-3xl mt-16 mb-16">
      <div className="mb-4 text-center">
        <img
          src="/images/company.jpg"
          alt="Company"
          className="w-full h-32 sm:h-48 object-cover rounded-t-lg mb-4"
        />
        <h2 className="text-xl font-bold text-gray-800">Create Your Company Profile</h2>
        <p className="text-gray-600 text-sm">Step {step} of {totalSteps}</p>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" onKeyDown={handleKeyDown}>
          {renderStep()}
          <div className="flex items-center justify-between mt-6">
            {step !== 1 && (
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={handlePrevious}
                disabled={loading}
                className="rounded-md"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
            )}
            <div className="flex-1 flex justify-end">
              {step < totalSteps ? (
                <Button
                  variant="default"
                  size="sm"
                  type="button"
                  onClick={handleContinue}
                  disabled={loading}
                  className="bg-[#1e90ff] text-white hover:bg-[#1c86e6] rounded-md"
                >
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  type="submit"
                  disabled={loading}
                  className="bg-[#1e90ff] text-white hover:bg-[#1c86e6] rounded-md"
                >
                  {loading ? 'Creating...' : 'Create Company'}
                </Button>
              )}
            </div>
          </div>
        </form>
      )}
    </main>
  );
};

export default CompanyCreationPage;