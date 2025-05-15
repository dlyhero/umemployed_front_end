'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent } from '@/components/ui/card';
import CandidateProfile from './CandidateProfile';
import CandidateActions from './CandidateActions';
import CandidateDetails from './CandidateDetails';
import PaymentModal from '../../../recruiter/PaymentModal/PaymentModal';
import { checkPaymentStatus, initiateStripePayment } from '@/lib/api/endorsements';
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
      toast.error('Please sign in to endorse a candidate');
      router.push('/auth/signin');
      return;
    }

    console.log('Endorse started, candidateId:', id, 'token:', session.accessToken);
    setIsEndorseLoading(true);
    try {
      const { has_paid } = await checkPaymentStatus(id, session.accessToken);
      console.log('Payment status:', has_paid);
      if (has_paid) {
        console.log('Payment verified, redirecting to endorsements');
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

    try {
      console.log('Initiating Stripe payment for candidate:', candidateId);
      const { session_id } = await initiateStripePayment(candidateId, session.accessToken);
      console.log('Received Stripe session_id:', session_id);
      if (session_id.startsWith('cs_live_')) {
        console.error('Error: Live mode session_id with test mode key');
        toast.error('Stripe payment failed: Live mode session ID used with test mode key. Please contact support.');
        return;
      }
      const { loadStripe } = await import('@stripe/stripe-js');
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      if (!stripe) {
        throw new Error('Failed to load Stripe.js');
      }
      console.log('Redirecting to Stripe Checkout with session_id:', session_id);
      const { error } = await stripe.redirectToCheckout({
        sessionId: session_id,
        successUrl: `${window.location.origin}/recruiter/payment-success?candidateId=${candidateId}&companyId=${companyId || 'default'}`,
        cancelUrl: `${window.location.origin}/recruiter/payment-cancel?companyId=${companyId || 'default'}`,
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

  return (
    <>
      <Card className="hover:bg-gray-50 transition-colors border">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col gap-4 md:w-[50%] lg:w-[28%]">
              <CandidateProfile candidate={candidate} />
              <CandidateActions
                candidate={candidate}
                activeTab={activeTab}
                isShortlisted={isShortlisted}
                handleViewDetails={handleViewDetails}
                handleShortlist={handleShortlist}
                handleEndorse={onEndorse}
                handleSchedule={handleSchedule}
                loading={isEndorseLoading}
              />
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