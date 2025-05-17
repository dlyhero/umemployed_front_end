'use client';

// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { checkPaymentStatus, getEndorsements } from '@/lib/api/endorsements';
import Endorsement from '../components/endorsement/Endorsement';

const EndorsementsPage = () => {
  const router = useRouter();
  const { candidateId } = useParams();
  const { data: session, status } = useSession();
  const [endorsements, setEndorsements] = useState([]);
  const [candidateName, setCandidateName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasPaid, setHasPaid] = useState(false);

  useEffect(() => {
    console.log('EndorsementsPage useEffect', { candidateId, status });

    const fetchData = async () => {
      if (status === 'loading' || !candidateId) {
        console.log('Waiting: status loading or no candidateId');
        return;
      }

      if (status !== 'authenticated' || !session?.accessToken) {
        console.log('Not authenticated or no token, redirecting');
        toast.error('Please sign in to view endorsements');
        router.push('/auth/signin');
        return;
      }

      try {
        setLoading(true);

        // Fetch candidate profile for name
        console.log('Fetching candidate profile for candidateId:', candidateId);
        const profileResponse = await fetch(
          `https://umemployed-f6fdddfffmhjhjcj.canadacentral-01.azurewebsites.net/api/resume/user-profile/${candidateId}/`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );
        if (!profileResponse.ok) {
          throw new Error(`Failed to fetch candidate profile: ${profileResponse.status}`);
        }
        const profile = await profileResponse.json();
        const name = profile.contact_info?.name || 'Candidate';
        setCandidateName(name);
        console.log('Candidate name:', name);

        // Check payment status
        console.log('Checking payment status for candidateId:', candidateId);
        const paymentStatus = await checkPaymentStatus(candidateId, session.accessToken);
        console.log('Payment status:', paymentStatus);
        if (!paymentStatus.has_paid) {
          console.log('Not paid, redirecting');
          toast.error('Payment required to view endorsements');
          router.push(`/companies/rate-candidate/${candidateId}`);
          return;
        }
        setHasPaid(true);

        // Fetch endorsements
        console.log('Fetching endorsements for candidateId:', candidateId);
        const data = await getEndorsements(candidateId, session.accessToken);
        console.log('Endorsements response:', data);
        setEndorsements(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message || 'Failed to load endorsements');
        toast.error(err.message || 'Failed to load endorsements');
      } finally {
        setLoading(false);
        console.log('Loading set to false');
      }
    };

    fetchData();
  }, [candidateId, session, status, router]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-gray-50">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="mr-2"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-blue-600">
          Endorsements for {candidateName || 'Candidate'}
        </h1>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading endorsements...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      ) : endorsements.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <ThumbsUp className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-1">No endorsements yet</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            This candidate has not received any endorsements yet.
          </p>
          {hasPaid && candidateId && (
            <Button
              className="mt-4 bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => router.push(`/companies/rate-candidate/${candidateId}`)}
            >
              Be the First to Endorse
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {Array.isArray(endorsements) &&
              endorsements.map((endorsement) => (
                <motion.div
                  key={endorsement.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Endorsement endorsement={endorsement} />
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default EndorsementsPage;