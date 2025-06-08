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

  console.log('CompanyCreationPage: Initial session:', { session, status });

  useEffect(() => {
    if (status === 'loading') {
      logDebug('useEffect', { state: 'Session loading' });
      return;
    }
    if (status === 'unauthenticated') {
      logDebug('useEffect', { state: 'User unauthenticated, redirecting to /login' });
      router.push('/login?callbackUrl=/companies/create');
      return;
    }
    if (session?.user?.has_company && session?.user?.company_id) {
      logDebug('useEffect', { state: 'User has company, redirecting to dashboard' });
      router.push(`/companies/${session.user.company_id}/dashboard`);
    }
  }, [session, status, router]);

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
    } else {
      logDebug('Continue Button', { state: 'Already at final step, preventing advance' });
    }
  };

  const handlePrevious = () => {
    logDebug('Previous Button', { step });
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    logDebug('Form Submit', { formData, step });
    if (step !== totalSteps) {
      logError('Form Submit', new Error('Submission attempted on wrong step'), { step });
      toast.error('Please complete all steps before submitting.');
      return;
    }

    try {
      setLoading(true);
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

      logDebug('API Request', {
        url: `${BASE_URL}/api/company/create-company/`,
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
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

      logDebug('API Response', { status: response.status, data: response.data });

      const updatedSession = await update({
        ...session,
        user: {
          ...session?.user,
          has_company: true,
          company_id: response.data.id, // Use company_id consistently
        },
      });
      logDebug('Session Update', { updatedSession });

      toast.success('Company created successfully!');
      const redirectPath = `/companies/${response.data.id}/dashboard`;
      logDebug('Redirect', { path: redirectPath });
      router.push(redirectPath);
      router.refresh();

    } catch (err) {
      const errorDetails = logError('Form Submit', err, {
        status: err.response?.status,
        data: err.response?.data,
        requestPayload: payload,
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
      } else {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
      logDebug('Form Submit', { state: 'Loading complete' });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      logDebug('KeyDown', { key: e.key, step });
      if (step < totalSteps) {
        handleContinue();
      } else {
        handleSubmit(e); // Only submit on Enter at final step
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
    logDebug('Render', { state: 'Loading' });
    return <Loader />;
  }

  if (status === 'unauthenticated') {
    logDebug('Render', { state: 'Unauthenticated, redirecting to /login' });
    router.push('/login?callbackUrl=/companies/create');
    return null;
  }

  if (session?.user?.has_company && session?.user?.company_id) {
    logDebug('Render', { state: 'User has company, redirecting to dashboard' });
    router.push(`/companies/${session.user.company_id}/dashboard`);
    return null;
  }

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