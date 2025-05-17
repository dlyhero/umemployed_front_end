'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import CompanyInformation from './CompanyInformation';
import ContactInformation from './ContactInformation';
import CompanyDescription from './CompanyDescription';
import SocialLinksAndVideo from './SocialLinksAndVideo';
import Loader from '@/src/components/common/Loader/Loader';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Sideba } from '../dashboard/recruiter/Sideba';
import { MobileMenu } from '../dashboard/MobileMenu';
import { Menu } from 'lucide-react';

const BASE_URL = 'https://umemployed-f6fdddfffmhjhjcj.canadacentral-01.azurewebsites.net';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(`/companies/${companyId}/update`);

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
          const response = await fetch(
            `${BASE_URL}/api/company/company-details/${companyId}/`,
            {
              headers: {
                Authorization: `Bearer ${session.accessToken}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error(response.status === 404 ? 'Company not found.' : 'Failed to load company data.');
          }
          const data = await response.json();
          setFormData({
            name: data.name || '',
            industry: data.industry || '',
            size: data.size || '',
            location: data.location || '',
            founded: data.founded || '',
            website_url: data.website_url || '',
            country: data.country || '',
            contact_email: data.contact_email || '',
            contact_phone: data.contact_phone || '',
            description: data.description || '',
            mission_statement: data.mission_statement || '',
            linkedin: data.linkedin || '',
            video_introduction: data.video_introduction || '',
          });
        } catch (err) {
          let errorMessage = err.message || 'Failed to load company data. Please try again.';
          if (err.message.includes('404')) {
            errorMessage = 'Company not found. Please check the company ID.';
          } else if (err.message.includes('401')) {
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
      const response = await fetch(
        `${BASE_URL}/api/company/update-company/${companyId}/`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.non_field_errors?.join(', ') || 'Failed to update company.');
      }
      toast.success('Company updated successfully!');
      router.push(`/companies/${companyId}/dashboard`);
    } catch (err) {
      toast.error(err.message || 'Failed to update company. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'loading' || loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 flex flex-col lg:flex-row gap-6 mt-16 mb-16">
      <Sideba activeTab={activeTab} setActiveTab={setActiveTab} companyId={companyId} />
      <div className="flex-1">
        <header className="flex justify-between items-center md:hidden mb-6">
          <h1 className="text-xl font-semibold text-gray-900">Update Company</h1>
          <Button
            variant="ghost"
            className="p-2 text-gray-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </Button>
        </header>
        <MobileMenu
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          companyId={companyId}
        />
        <main className="bg-white rounded-lg shadow-md p-4">
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
        </main>
      </div>
    </div>
  );
};

export default CompanyUpdatePage;