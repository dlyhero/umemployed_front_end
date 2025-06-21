
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Script from 'next/script';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Star } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { toast } from 'react-hot-toast';
import CandidateProfile from './CandidateProfile';
import CandidateActions from './CandidateActions';
import PaymentModal from '../../../recruiter/PaymentModal/PaymentModal';
import { checkPaymentStatus, initiateStripePayment, getEndorsements } from '@/lib/api/endorsements';
import { useRouter } from 'next/navigation';
import baseUrl from '../../../api/baseUrl';

const CandidateCard = ({
  candidate = {},
  handleViewDetails = () => {},
  handleShortlist = () => {},
  handleUnshortlist = () => {},
  handleSchedule = () => {},
  activeTab = '',
  isShortlisted = false,
  isShortlistLoading = false,
  isUnshortlistLoading = false,
  isScheduleLoading = false,
  jobId = '',
  companyId = '',
  accessToken = '',
}) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [candidateId, setCandidateId] = useState(null);
  const [isEndorseLoading, setIsEndorseLoading] = useState(false);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [isGiveEndorsementLoading, setIsGiveEndorsementLoading] = useState(false);
  const [isUnshortlistLocalLoading, setIsUnshortlistLocalLoading] = useState(false);
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log('CandidateCard: Mounted, candidate:', candidate.user_id);
    return () => {
      console.log('CandidateCard: Unmounted, candidate:', candidate.user_id);
    };
  }, [candidate.user_id]);

  if (!candidate || !candidate.profile) {
    console.error('CandidateCard: Invalid candidate data:', candidate);
    toast.error('Candidate data is missing');
    return <div className="text-red-500 text-center py-4">Error: Candidate data is missing</div>;
  }

  const onEndorse = async (id) => {
    if (status !== 'authenticated') {
      toast.error('Please sign in to view endorsements');
      router.push('/auth/signin');
      return;
    }

    setIsEndorseLoading(true);
    try {
      const { has_paid } = await checkPaymentStatus(id, accessToken);
      if (has_paid) {
        const endorsements = await getEndorsements(id, accessToken);
        toast.success('Navigating to endorsements');
        router.push(`/companies/candidate/${id}/endorsements`);
      } else {
        setCandidateId(id);
        setIsPaymentModalOpen(true);
      }
    } catch (error) {
      console.error('onEndorse: Error:', error);
      toast.error(error.message || 'Failed to check payment status');
    } finally {
      setIsEndorseLoading(false);
    }
  };

  const handlePayment = async () => {
    if (status !== 'authenticated') {
      toast.error('Please sign in to proceed with payment');
      router.push('/auth/signin');
      return;
    }

    if (!stripeLoaded) {
      toast.error('Stripe.js is not loaded yet. Please try again');
      return;
    }

    try {
      const { session_id } = await initiateStripePayment(candidateId, accessToken);
      const stripe = window.Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      if (!stripe) {
        throw new Error('Stripe.js not loaded');
      }
      const { error } = await stripe.redirectToCheckout({ sessionId: session_id });
      if (error) {
        throw new Error(error.message);
      }
      toast.success('Redirecting to payment');
      setIsPaymentModalOpen(false);
    } catch (error) {
      console.error('handlePayment: Error:', error);
      toast.error(error.message || 'Failed to initiate payment');
    }
  };

  const handleGiveEndorsement = (id) => {
    if (status !== 'authenticated') {
      toast.error('Please sign in to give an endorsement');
      router.push('/auth/signin');
      return;
    }
    setIsGiveEndorsementLoading(true);
    toast.success('Navigating to endorsement form');
    router.push(`/companies/rate-candidate/${id}`);
    setTimeout(() => setIsGiveEndorsementLoading(false), 1000);
  };

  const handleMessage = async (id) => {
    if (status !== 'authenticated') {
      toast.error('Please sign in to send a message');
      router.push('/auth/signin');
      return;
    }

    setIsMessageLoading(true);
    try {
      const response = await fetch(`${baseUrl}/messages/conversations/start/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ recipient_id: id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to start conversation');
      }

      const { conversation_id } = await response.json();
      toast.success('Conversation started');
      router.push(`/messages/conversations/${conversation_id}`);
    } catch (error) {
      console.error('handleMessage: Error:', error);
      toast.error(error.message || 'Failed to start conversation');
    } finally {
      setIsMessageLoading(false);
    }
  };

  const handleUnshortlistAction = async (userId) => {
    if (!companyId || !jobId || !userId) {
      toast.error('Missing company, job, or user information');
      console.error('handleUnshortlistAction: Missing params', { companyId, jobId, userId });
      return;
    }

    if (!session?.accessToken) {
      toast.error('Please sign in to unshortlist a candidate');
      router.push('/auth/signin');
      return;
    }

    setIsUnshortlistLocalLoading(true);
    try {
      const response = await fetch(`${baseUrl}/company/company/${companyId}/job/${jobId}/unshortlist/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ candidate_id: userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('handleUnshortlistAction: API Error', errorData);
        throw new Error(errorData.message || `Failed to unshortlist candidate (Status: ${response.status})`);
      }

      toast.success('Candidate unshortlisted successfully');
      handleUnshortlist(userId);
    } catch (error) {
      console.error('handleUnshortlistAction: Error:', error);
      toast.error(error.message || 'Failed to unshortlist candidate');
    } finally {
      setIsUnshortlistLocalLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <Script
        src="https://js.stripe.com/v3/"
        strategy="lazyOnload"
        onLoad={() => setStripeLoaded(true)}
      />
      <Card className="hover:shadow-xl transition-shadow border border-gray-200 rounded-xl bg-white">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Profile Section */}
            <div className="md:col-span-3">
              <CandidateProfile candidate={candidate} />
            </div>
            {/* Metrics Section */}
            <div className="md:col-span-5 space-y-4">
              <div className="space-y-2">
                <span className="text-lg font-semibold text-green-600 truncate">
                  {candidate.job.title || 'Unknown'}
                </span>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Match Score:</span>
                  <span className="font-medium">{Math.round(candidate.matchingPercentage)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-brand h-2 rounded-full"
                    style={{ width: `${Math.round(candidate.matchingPercentage)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Assessment Score:</span>
                  <span className="font-medium">{candidate.quizScore}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${candidate.quizScore}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">
                  Status: {candidate.status || 'Unknown'}
                </span>
              </div>
              <div className="space-y-2">
                <div className="text-base font-semibold text-gray-800">Qualifications</div>
                <div className="flex flex-wrap gap-2">
                  {candidate.profile.skills.slice(0, 3).map((skill, index) => (
                    <Badge
                      key={index}
                      className="bg-brand/10 text-brand font-medium px-3 py-1"
                    >
                      {skill}
                    </Badge>
                  ))}
                  {candidate.profile.skills.length > 3 && (
                    <Badge className="bg-gray-100 text-gray-600 font-medium px-3 py-1">
                      +{candidate.profile.skills.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            {/* Actions Section */}
            <div className="md:col-span-4 space-y-2">
              <CandidateActions
                candidate={candidate}
                activeTab={activeTab}
                isShortlisted={isShortlisted}
                handleViewDetails={handleViewDetails}
                handleShortlist={handleShortlist}
                handleEndorse={onEndorse}
                handleSchedule={handleSchedule}
                handleGiveEndorsement={handleGiveEndorsement}
                handleMessage={handleMessage}
                isShortlistLoading={isShortlistLoading}
                isEndorseLoading={isEndorseLoading}
                isScheduleLoading={isScheduleLoading}
                isGiveEndorsementLoading={isGiveEndorsementLoading}
                isMessageLoading={isMessageLoading}
                isAuthenticated={status === 'authenticated'}
                jobId={jobId}
                companyId={companyId}
                accessToken={accessToken}
              />
              {isShortlisted && activeTab === 'shortlist' && (
                <Button 
                variant="destructive" 
                size="sm" 
                className="w-full"
                onClick={() => handleUnshortlist(candidate.user_id)}
                disabled={isShortlistLoading}
              >
                 {isShortlistLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Star className="w-4 h-4 mr-2" />
                )}
                UnShortlist
              </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSelectPayment={handlePayment}
      />
    </>
  );
};

export default CandidateCard;
