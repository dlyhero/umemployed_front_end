'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { checkPaymentSuccess } from '@/lib/api/endorsements';
import { toast } from 'sonner';

export default function PaymentSuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const candidateId = searchParams.get('candidateId');
    const { data: session, status } = useSession();
  
    useEffect(() => {
      if (status === 'loading') return;
  
      if (status !== 'authenticated') {
        toast.error('Please sign in to verify payment');
        router.push('/auth/signin');
        return;
      }
  
      const handleSuccess = async () => {
        try {
          await checkPaymentSuccess(session.accessToken);
          toast.success('Payment successful! You can now view endorsements.');
          if (candidateId) {
            router.push(`/companies/candidate/${candidateId}/endorsements`);
          } else {
            toast.error('Candidate ID missing');
            router.push('/companies');
          }
        } catch (error) {
          toast.error(error.message || 'Failed to verify payment');
          router.push(`/recruiter/payment-cancel?companyId=${searchParams.get('companyId') || 'default'}`);
        }
      };
      handleSuccess();
    }, [router, candidateId, session, status]);
  
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-blue-600">Processing Payment...</h1>
          <p className="text-gray-600">Please wait while we verify your payment.</p>
        </div>
      </div>
    );
}
