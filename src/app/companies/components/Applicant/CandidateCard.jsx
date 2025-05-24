'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Script from 'next/script';
import { Card, CardContent } from '@/components/ui/card';
import CandidateProfile from './CandidateProfile';
import CandidateActions from './CandidateActions';
import CandidateDetails from './CandidateDetails';
import PaymentModal from '../../../recruiter/PaymentModal/PaymentModal';
import { checkPaymentStatus, initiateStripePayment, getEndorsements } from '@/lib/api/endorsements';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';

const CandidateCard = ({
  candidate = {},
  type = 'company',
  handleViewDetails = () => {},
  handleShortlist = () => {},
  handleUnshortlist = () => {},
  handleEndorse = () => {},
  handleSchedule = () => {},
  activeTab = '',
  isShortlisted = false,
  isShortlistLoading = false,
  isUnshortlistLoading = false,
  isScheduleLoading = false,
}) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [candidateId, setCandidateId] = useState(null);
  const [isEndorseLoading, setIsEndorseLoading] = useState(false);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [isGiveEndorsementLoading, setIsGiveEndorsementLoading] = useState(false);
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const router = useRouter();
  const { companyId } = useParams();
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log('CandidateCard: Mounted, candidate:', candidate.user_id, 'path:', window.location.pathname);
    return () => {
      console.log('CandidateCard: Unmounted, candidate:', candidate.user_id, 'last path:', window.location.pathname);
    };
  }, [candidate.user_id]);

  if (!candidate || !candidate.profile) {
    console.error('CandidateCard: Invalid candidate data:', candidate);
    return <div>Error: Candidate data is missing</div>;
  }

  const onEndorse = async (id) => {
    if (status !== 'authenticated') {
      console.log('onEndorse: User not authenticated, redirecting to signin for candidateId:', id);
      toast.error('Please sign in to view endorsements');
      router.push('/auth/signin');
      return;
    }

    console.log('onEndorse: Starting for candidateId:', id, 'accessToken:', session.accessToken);
    setIsEndorseLoading(true);
    try {
      console.log('onEndorse: Checking payment status for candidateId:', id);
      const { has_paid } = await checkPaymentStatus(id, session.accessToken);
      console.log('onEndorse: Payment status received:', has_paid, 'for candidateId:', id);
      if (has_paid) {
        console.log('onEndorse: Payment verified, fetching endorsements for candidateId:', id);
        const endorsements = await getEndorsements(id, session.accessToken);
        console.log('onEndorse: Endorsements fetched:', endorsements, 'for candidateId:', id);
        router.push(`/companies/candidate/${id}/endorsements`);
      } else {
        console.log('onEndorse: Payment required, opening payment modal for candidateId:', id);
        setCandidateId(id);
        setIsPaymentModalOpen(true);
      }
    } catch (error) {
      console.error('onEndorse: Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        candidateId: id,
      });
      toast.error(error.message || 'Failed to check payment status. Please try again or contact support.');
    } finally {
      setIsEndorseLoading(false);
      console.log('onEndorse: Completed for candidateId:', id);
    }
  };

  const handlePayment = async () => {
    if (status !== 'authenticated') {
      console.log('handlePayment: User not authenticated, redirecting to signin for candidateId:', candidateId);
      toast.error('Please sign in to proceed with payment');
      router.push('/auth/signin');
      return;
    }

    if (!stripeLoaded) {
      console.log('handlePayment: Stripe.js not loaded for candidateId:', candidateId);
      toast.error('Stripe.js is not loaded yet. Please try again.');
      return;
    }

    console.log('handlePayment: Initiating Stripe payment for candidateId:', candidateId);
    try {
      console.log('handlePayment: Calling initiateStripePayment with accessToken:', session.accessToken);
      const { session_id } = await initiateStripePayment(candidateId, session.accessToken);
      console.log('handlePayment: Received Stripe session_id:', session_id, 'for candidateId:', candidateId);

      const stripe = window.Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      if (!stripe) {
        console.error('handlePayment: Stripe.js not loaded for candidateId:', candidateId);
        throw new Error('Stripe.js not loaded');
      }
      console.log('handlePayment: Redirecting to Stripe Checkout with session_id:', session_id);
      const { error } = await stripe.redirectToCheckout({
        sessionId: session_id,
      });
      if (error) {
        console.error('handlePayment: Stripe redirect error:', error, 'for candidateId:', candidateId);
        throw new Error(error.message);
      }
      console.log('handlePayment: Payment modal closing after redirect for candidateId:', candidateId);
      setIsPaymentModalOpen(false);
    } catch (error) {
      console.error('handlePayment: Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        candidateId,
      });
      toast.error(
        error.response?.data?.error ||
        error.message ||
        'Failed to initiate Stripe payment. Please try again or contact support.'
      );
    }
  };

  const handleGiveEndorsement = (id) => {
    if (status !== 'authenticated') {
      console.log('handleGiveEndorsement: User not authenticated, redirecting to signin for candidateId:', id);
      toast.error('Please sign in to give an endorsement');
      router.push('/auth/signin');
      return;
    }
    console.log('handleGiveEndorsement: Starting navigation to rate-candidate for candidateId:', id);
    setIsGiveEndorsementLoading(true);
    router.push(`/companies/rate-candidate/${id}`);
    setTimeout(() => {
      setIsGiveEndorsementLoading(false);
      console.log('handleGiveEndorsement: Loading state reset for candidateId:', id);
    }, 1000);
  };

  const handleMessage = (id) => {
    console.log('handleMessage: Starting for candidateId:', id);
    setIsMessageLoading(true);
    console.log('handleMessage: Message action not implemented for candidateId:', id);
    setTimeout(() => {
      setIsMessageLoading(false);
      console.log('handleMessage: Loading state reset for candidateId:', id);
    }, 1000);
  };

  return (
    <>
      <Script
        src="https://js.stripe.com/v3/"
        strategy="lazyOnload"
        onLoad={() => {
          console.log('Stripe.js: Loaded successfully');
          setStripeLoaded(true);
        }}
      />
      <Card className="hover:bg-gray-50 transition-colors border">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col gap-4 md:w-[50%] lg:w-[28%]">
              <CandidateProfile candidate={candidate} />
              <div className="flex flex-col gap-2">
                <CandidateActions
                  candidate={candidate}
                  activeTab={activeTab}
                  isShortlisted={isShortlisted}
                  handleViewDetails={handleViewDetails}
                  handleShortlist={handleShortlist}
                  handleUnshortlist={handleUnshortlist}
                  handleEndorse={onEndorse}
                  handleSchedule={handleSchedule}
                  handleGiveEndorsement={handleGiveEndorsement}
                  isShortlistLoading={isShortlistLoading}
                  isUnshortlistLoading={isUnshortlistLoading}
                  isEndorseLoading={isEndorseLoading}
                  isScheduleLoading={isScheduleLoading}
                  isGiveEndorsementLoading={isGiveEndorsementLoading}
                  isMessageLoading={isMessageLoading}
                  isAuthenticated={status === 'authenticated'}
                />
              </div>
            </div>
            <CandidateDetails candidate={candidate} type={type} />
          </div>
        </CardContent>
      </Card>
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          console.log('PaymentModal: Closed for candidateId:', candidateId);
          setIsPaymentModalOpen(false);
        }}
        onSelectPayment={handlePayment}
      />
    </>
  );
};

export default CandidateCard;