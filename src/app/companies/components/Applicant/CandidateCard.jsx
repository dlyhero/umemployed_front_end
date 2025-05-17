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
  handleEndorse = () => {},
  handleSchedule = () => {},
  activeTab = '',
  isShortlisted = false,
}) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [candidateId, setCandidateId] = useState(null);
  const [isEndorseLoading, setIsEndorseLoading] = useState(false);
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const router = useRouter();
  const { companyId } = useParams();
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log('CandidateCard mounted, path:', window.location.pathname);
    return () => {
      console.log('CandidateCard unmounted, last path:', window.location.pathname);
    };
  }, []);

  if (!candidate || !candidate.profile) {
    return <div>Error: Candidate data is missing</div>;
  }

  const onEndorse = async (id) => {
    if (status !== 'authenticated') {
      toast.error('Please sign in to view endorsements');
      router.push('/auth/signin');
      return;
    }

    console.log('See Endorsements started, candidateId:', id);
    setIsEndorseLoading(true);
    try {
      const { has_paid } = await checkPaymentStatus(id, session.accessToken);
      console.log('Payment status:', has_paid);
      if (has_paid) {
        console.log('Payment verified, fetching endorsements');
        const endorsements = await getEndorsements(id, session.accessToken);
        console.log('Endorsements fetched:', endorsements);
        router.push(`/companies/candidate/${id}/endorsements`);
      } else {
        setCandidateId(id);
        setIsPaymentModalOpen(true);
      }
    } catch (error) {
      console.error('Check payment status error:', error.response?.data || error.message);
      toast.error(error.message || 'Failed to check payment status. Please try again or contact support.');
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
      toast.error('Stripe.js is not loaded yet. Please try again.');
      return;
    }

    try {
      console.log('Initiating Stripe payment for candidate:', candidateId);
      const { session_id } = await initiateStripePayment(candidateId, session.accessToken);
      console.log('Received Stripe session_id:', session_id);

      const stripe = window.Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      if (!stripe) {
        throw new Error('Stripe.js not loaded');
      }
      console.log('Redirecting to Stripe Checkout with session_id:', session_id);
      const { error } = await stripe.redirectToCheckout({
        sessionId: session_id,
      });
      if (error) {
        console.error('Stripe redirect error:', error);
        throw new Error(error.message);
      }
      setIsPaymentModalOpen(false);
    } catch (error) {
      console.error('Stripe payment error:', {
        status: error.response?.status,
        data: error.response?.data,
        rawResponse: error.response?.statusText || error.message,
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
      toast.error('Please sign in to give an endorsement');
      router.push('/auth/signin');
      return;
    }
    router.push(`/companies/rate-candidate/${id}`);
  };

  return (
    <>
      <Script
        src="https://js.stripe.com/v3/"
        strategy="lazyOnload"
        onLoad={() => {
          console.log('Stripe.js loaded');
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
                  handleEndorse={onEndorse}
                  handleSchedule={handleSchedule}
                  handleGiveEndorsement={handleGiveEndorsement}
                  loading={isEndorseLoading}
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
        onClose={() => setIsPaymentModalOpen(false)}
        onSelectPayment={handlePayment}
      />
    </>
  );
};

export default CandidateCard;