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

// ISO 3166-1 alpha-2 country codes from schema
const COUNTRY_CODES = [
  'AF', 'AX', 'AL', 'DZ', 'AS', 'AD', 'AO', 'AI', 'AQ', 'AG', 'AR', 'AM', 'AW', 'AU', 'AT', 'AZ',
  'BS', 'BH', 'BD', 'BB', 'BY', 'BE', 'BZ', 'BJ', 'BM', 'BT', 'BO', 'BQ', 'BA', 'BW', 'BV', 'BR',
  'IO', 'BN', 'BG', 'BF', 'BI', 'CV', 'KH', 'CM', 'CA', 'KY', 'CF', 'TD', 'CL', 'CN', 'CX', 'CC',
  'CO', 'KM', 'CG', 'CD', 'CK', 'CR', 'CI', 'HR', 'CU', 'CW', 'CY', 'CZ', 'DK', 'DJ', 'DM', 'DO',
  'EC', 'EG', 'SV', 'GQ', 'ER', 'EE', 'SZ', 'ET', 'FK', 'FO', 'FJ', 'FI', 'FR', 'GF', 'PF', 'TF',
  'GA', 'GM', 'GE', 'DE', 'GH', 'GI', 'GR', 'GL', 'GD', 'GP', 'GU', 'GT', 'GG', 'GN', 'GW', 'GY',
  'HT', 'HM', 'VA', 'HN', 'HK', 'HU', 'IS', 'IN', 'ID', 'IR', 'IQ', 'IE', 'IM', 'IL', 'IT', 'JM',
  'JP', 'JE', 'JO', 'KZ', 'KE', 'KI', 'KW', 'KG', 'LA', 'LV', 'LB', 'LS', 'LR', 'LY', 'LI', 'LT',
  'LU', 'MO', 'MG', 'MW', 'MY', 'MV', 'ML', 'MT', 'MH', 'MQ', 'MR', 'MU', 'YT', 'MX', 'FM', 'MD',
  'MC', 'MN', 'ME', 'MS', 'MA', 'MZ', 'MM', 'NA', 'NR', 'NP', 'NL', 'NC', 'NZ', 'NI', 'NE', 'NG',
  'NU', 'NF', 'KP', 'MK', 'MP', 'NO', 'OM', 'PK', 'PW', 'PS', 'PA', 'PG', 'PY', 'PE', 'PH', 'PN',
  'PL', 'PT', 'PR', 'QA', 'RE', 'RO', 'RU', 'RW', 'BL', 'SH', 'KN', 'LC', 'MF', 'PM', 'VC', 'WS',
  'SM', 'ST', 'SA', 'SN', 'RS', 'SC', 'SL', 'SG', 'SX', 'SK', 'SI', 'SB', 'SO', 'ZA', 'GS', 'KR',
  'SS', 'ES', 'LK', 'SD', 'SR', 'SJ', 'SE', 'CH', 'SY', 'TW', 'TJ', 'TZ', 'TH', 'TL', 'TG', 'TK',
  'TO', 'TT', 'TN', 'TR', 'TM', 'TC', 'TV', 'UG', 'UA', 'AE', 'GB', 'UM', 'US', 'UY', 'UZ', 'VU',
  'VE', 'VN', 'VG', 'VI', 'WF', 'EH', 'YE', 'ZM', 'ZW'
];

const CompanyCreationPage = () => {
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
  const [loading, setLoading] = useState(false);
  const BASE_URL = 'https://umemployed-app-afec951f7ec7.herokuapp.com';

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
      ...data
    }, null, 2));
  };

  useEffect(() => {
    try {
      logDebug('Session Check', { status, user: session?.user });
      if (status === 'authenticated') {
        if (!session?.user) {
          throw new Error('Session user data missing');
        }
        if (session.user.role !== 'recruiter') {
          logError('Session Check', new Error('Invalid role'), { role: session.user.role });
          router.push('/select-role');
        } else if (session.user.has_company) {
          logDebug('Session Check', { has_company: true, companyId: session.user.companyId });
          router.push(`/companies/${session.user.companyId}/dashboard`);
        }
      } else if (status === 'unauthenticated') {
        logDebug('Session Check', { redirect: 'login' });
        router.push('/login?callbackUrl=/companies/create');
      }
    } catch (error) {
      logError('Session Check', error, { status });
      toast.error('Error validating session. Please try again.');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    logDebug('Render', { state: 'Loading' });
    return <Loader />;
  }
  if (session?.user?.has_company) {
    logDebug('Render', { state: 'User has company, skipping render' });
    return null;
  }

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    let payload = {};
    try {
      logDebug('Form Submit', { formData });
      if (!formData.name || !formData.country) {
        throw new Error('Company name and country are required.');
      }
      if (!COUNTRY_CODES.includes(formData.country)) {
        throw new Error('Invalid country code. Please select a valid country.');
      }
      if (formData.industry && !['Technology', 'Finance', 'Healthcare', 'Education', 'Manufacturing', 'Retail', 'Hospitality', 'Construction', 'Transportation'].includes(formData.industry)) {
        throw new Error('Invalid industry. Please select a valid industry.');
      }
      if (formData.size && !['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5001-10000', '10001+'].includes(formData.size)) {
        throw new Error('Invalid company size. Please select a valid size.');
      }
      if (formData.website_url && !isValidUrl(formData.website_url)) {
        throw new Error('Invalid website URL.');
      }
      if (formData.linkedin && !isValidUrl(formData.linkedin)) {
        throw new Error('Invalid LinkedIn URL.');
      }
      if (formData.video_introduction && !isValidUrl(formData.video_introduction)) {
        throw new Error('Invalid video introduction URL.');
      }
      if (formData.contact_email && !isValidEmail(formData.contact_email)) {
        throw new Error('Invalid contact email.');
      }
      if (formData.founded && (formData.founded < -2147483648 || formData.founded > 2147483647)) {
        throw new Error('Founded year must be between -2147483648 and 2147483647.');
      }

      setLoading(true);

      // Prepare JSON payload
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
        headers: { Authorization: `Bearer ${token}` },
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

      session.user.has_company = true;
      session.user.companyId = response.data.id;

      toast.success('Company created successfully!');
      router.push(`/companies/${response.data.id}/dashboard`);
    } catch (err) {
      const errorDetails = logError('Form Submit', err, {
        status: err.response?.status,
        data: err.response?.data,
        requestPayload: payload,
        requestHeaders: { Authorization: `Bearer ${session?.accessToken}` },
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
          <SocialLinksAndVideo formData={formData} handleChange={handleInputChange} />
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