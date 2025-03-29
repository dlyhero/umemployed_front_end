"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import Dashboard from 'src/components/common/dashboard/Dashboard';
const DashboardPage = () => {
  const { data: session, status } = useSession();
  const { companyId } = useParams();
  const [companyData, setCompanyData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (status === 'loading') return;
      if (status === 'unauthenticated') {
        setError('Please log in to view the dashboard');
        return;
      }

      const token = session?.accessToken || session?.user?.accessToken;
      if (!token) {
        setError('No authentication token found');
        return;
      }

      try {
        const response = await fetch(
          `https://umemployed-app-afec951f7ec7.herokuapp.com/api/company/company-details/${companyId}/`,
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
          setError(`Error: ${response.status} - ${response.statusText}`);
        }
      } catch (err) {
        console.error('Error fetching company data:', err);
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
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return <Dashboard companyId={companyId} companyData={companyData} />;
};

export default DashboardPage;