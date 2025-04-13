// src/app/companies/[companyId]/detail/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { fetchCompany, fetchJobs } from '../../../api/companies/fetchCompany';
import CompanyHeader from './components/CompanyHeader';
import CompanyOverview from './components/CompanyOverview';
import CompanyInsights from './components/CompanyInsights';
import OpenPositions from './components/OpenPositions';
import CompanyStats from './components/CompanyStats';
import MobileCompanyView from './components/MobileCompanyView';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function CompanyDetailPage() {
  const { data: session, status } = useSession();
  const { companyId } = useParams();
  const [companyData, setCompanyData] = useState(null);
  const [jobsData, setJobsData] = useState([]);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (status === 'loading') return;
      if (status === 'unauthenticated') {
        toast.error('Please log in to view company details');
        setError('Please log in to view company details');
        return;
      }

      const token = session?.accessToken || session?.user?.accessToken;
      if (!token) {
        toast.error('No authentication token found');
        setError('No authentication token found');
        return;
      }

      try {
        const [company, jobs] = await Promise.all([
          fetchCompany(companyId, token),
          fetchJobs(companyId, token),
        ]);
        setCompanyData(company);
        setJobsData(jobs);
      } catch (err) {
        const errorMsg = `Error: ${err.message}`;
        toast.error(errorMsg);
        setError(errorMsg);
      }
    };

    if (companyId) {
      fetchData();
    }
  }, [companyId, session, status]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (status === 'loading' || !companyData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <Card className="p-8 bg-white/80 backdrop-blur-md shadow-xl">
          <CardContent className="flex items-center gap-4">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <p className="text-gray-700 text-lg font-medium">Loading company details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return null; // Toast handles error display
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12"
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        {isMobile ? (
          <MobileCompanyView company={companyData} jobs={jobsData} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <CompanyHeader company={companyData} />
              <CompanyOverview company={companyData} />
              <CompanyInsights company={companyData} />
            </div>
            <div className="lg:col-span-1 space-y-6">
              <OpenPositions jobs={jobsData} companyId={companyId} />
              <CompanyStats company={companyData} />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}