"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import Dashboard from './Dashboard';
import Loader from "@/src/components/common/Loader/Loader"; // Imported Loader
import { useToast } from '@/lib/useToast';

const DashboardPage = () => {
  const { data: session, status } = useSession();
  const { companyId } = useParams();
  const [companyData, setCompanyData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (status === 'loading') return;
      if (status === 'unauthenticated') {
        toast.error('Please log in to view the dashboard');
        setError('Please log in to view the dashboard');
        return;
      }

      const token = session?.accessToken || session?.user?.accessToken;
      if (!token) {
        toast.error('No authentication token found');
        setError('No authentication token found');
        return;
      }

      try {
        const response = await fetch(
          `https://umemployed-app-afec951f7ec7.herokuapp.com/api/company/company/${companyId}/dashboard/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setCompanyData(data);
        } else {
          const errorMsg = `Error: ${response.status} - ${response.statusText}`;
          toast.error(errorMsg);
          setError(errorMsg);
        }
      } catch (err) {
        console.error('Error fetching company data:', err);
        toast.error('Failed to load company data');
        setError('Failed to load company data');
      }
    };

    if (companyId) {
      fetchCompanyData();
    }
  }, [companyId, session, status]);

  if (status === 'loading' || !companyData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return null; // Toast handles error display, no need for inline message
  }

  return <Dashboard companyId={companyId} companyData={companyData} />;
};

export default DashboardPage;