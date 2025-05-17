'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { MobileMenu } from '../../[companyId]/dashboard/MobileMenu';
import { Sideba } from '../../[companyId]/dashboard/recruiter/Sideba';

const BASE_URL = 'https://umemployed-f6fdddfffmhjhjcj.canadacentral-01.azurewebsites.net/api';

export default function CompanyApplications() {
  const { companyId } = useParams();
  const { data: session, status } = useSession();
  const [applications, setApplications] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getApplications() {
      if (status === 'loading' || !session) {
        return;
      }

      if (!session.accessToken) {
        setError('Unauthorized: No access token available');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `${BASE_URL}/company/company/${companyId}/applications/`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );
        if (!response.ok) throw new Error('Failed to fetch applications');
        const data = await response.json();
        setApplications(data);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setError(error.message || 'Failed to load applications. Please try again.');
        toast.error(error.message || 'Failed to load applications.');
      } finally {
        setIsLoading(false);
      }
    }

    if (companyId && status === 'authenticated') {
      getApplications();
    }
  }, [companyId, session, status]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">Please log in to view applications.</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <header className="flex justify-between items-center md:hidden mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
          <Button
            variant="ghost"
            className="p-2 text-gray-900 hover:bg-gray-100 rounded-full"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </Button>
        </header>
        <MobileMenu
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          companyId={companyId}
        />
        <div className="flex gap-6">
          <div className="hidden md:block w-64 flex-shrink-0">
            <Sideba companyId={companyId} />
          </div>
          <main className="flex-1">
            <h2 className="text-2xl font-bold mb-6 md:block hidden">Candidate Applications</h2>
            {isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
                <p className="text-gray-600 mt-2">Loading applications...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">{error}</div>
            ) : (
              <section className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-4">Application List</h3>
                {/* Replace with your actual Applications component */}
                {applications.length === 0 ? (
                  <p className="text-gray-600">No applications found.</p>
                ) : (
                  <ul>
                    {applications.map((app) => (
                      <li key={app.id} className="py-2">
                        {app.candidate_name || 'Unknown'} - {app.job_title || 'Unknown Job'}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}
          </main>
        </div>
      </div>
    </motion.div>
  );
}